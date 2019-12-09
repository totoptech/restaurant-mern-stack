import React, { Component } from "react";
import { withRouter, Link } from "react-router";
import clsx from "clsx";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import { injectStripe } from "react-stripe-elements";

//Import Utils
import { callApi } from "../../../../util/apiCaller";

// Import Actions
import {
  change_delivery_time,
  change_delivery_type,
  DELIVERY,
  PICKUP
} from "../../HomeActions";
import { ordered_product } from "../../../OrderStatus/OrderStatusAction";
import { loading_start, loading_end } from "../../../App/AppActions";
import { GetUserInfo, add_card } from "../../../Profile/ProfileActions";

// Import Components
import DefaultButton from "../../../../components/DefaultButton";
import TimeModal from "../../../../components/TimeModal/TimeModal";
import {
  shopping_bag,
  delivery,
  pickup,
  fa_back,
  fa_address,
  plus,
  next3
} from "../../../../components/icons/icons";
import OrderSummary from "../../components/OrderSummary/OrderSummary";
import LocationSearchInput from "../../../../components/FormControl/LocationSearchInput/LocationSearchInput";
import PayForm from "../../../Profile/components/PayForm/PayForm";
import CCModal from "../../../../components/CCModal/CCModal";

// Import Style
import styles from "./CheckoutPage.css";

class CheckoutPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      open: false,
      add_open: false,
      delivery_address: {
        street: {
          location: {
            lat: 0.0,
            lng: 0.0
          },
          address: "",
          seperate_address: [],
          postalCode: ""
        },
        flatNo: "",
        buildingNo: ""
      },
      special_instructions: "",
      openTime: false,
      selected_card: null,
    };
  }

  handleChange = event => {
    const { delivery_address } = this.state;
    if (event.target.name === "postalCode") {
      this.setState({
        delivery_address: {
          flatNo: delivery_address.flatNo,
          buildingNo: delivery_address.buildingNo,
          street: {
            ...delivery_address.street,
            postalCode: event.target.value
          }
        }
      });
      return;
    }
    if (event.target.name === "special_instructions") {
      this.setState({ special_instructions: event.target.value });
      return;
    }
    this.setState({
      delivery_address: {
        ...delivery_address,
        [event.target.name]: event.target.value
      }
    });
  };

  selectAddrTemplate = id => {
    const { address } = this.props.accounts;
    if (id === "") {
      this.setState({
        delivery_address: {
          street: {
            seperate_address: [],
            location: {
              lat: 0.0,
              lng: 0.0
            },
            address: "",
            postalCode: ""
          },
          flatNo: "",
          buildingNo: ""
        }
      });
    } else {
      const addr = address.filter(a => a.id === id);
      if (addr.length !== 1) {
        return;
      }
      this.setState({
        delivery_address: {
          street: addr[0].street,
          flatNo: addr[0].flatNo,
          buildingNo: addr[0].buildingNo
        }
      });
    }
  };

  handleChangeAddress = address => {
    const { delivery_address } = this.state;
    this.setState({
      delivery_address: { ...delivery_address, street: { address } }
    });
  };

  handleSelectAddress = obj => {
    const { delivery_address } = this.state;
    console.log(obj);
    this.setState({ delivery_address: { ...delivery_address, street: obj } });
  };

  //OrderCard component handler
  handleShow = () => {
    this.setState({ show: true });
  };

  handleHide = () => {
    this.setState({ show: false });
  };

  //confirm modal handler
  handleOpen = event => {
    const { delivery_address } = this.state;
    const { delivery_data } = this.props;
    event.preventDefault();
    
    if (this.props.branch.id === undefined) {
      console.log("select the branch");
      return;
    }
    if (delivery_data.type === DELIVERY) {
      if (
        delivery_address.street.location.lat == 0.0 &&
        delivery_address.street.location.lng == 0.0 &&
        delivery_address.street.postalCode == ""
      ) {
        console.log("invalid delivery address!!! input location again.");
        return;
      }
    }
    if (this.state.selected_card) {
      this.handleSubmit({ token: this.state.selected_card.token });
    } else {
      this.setState({ open: true });
    }
  };

  handleClose = () => {
    this.setState({ open: false, openTime: false });
  };

  handleSubmit = data => {
    this.props.dispatch(loading_start());
    console.log(data, "submit");
    if (data.token) {
      this.confirmPay(data.token);
    } else {
      callApi("payment/confirm_payment", "post", {
        ...data,
        create_method: true
      }).then(result => {
        if (result.success) {
          this.confirmPay(result.token);
        }
      });
    }
  };

  confirmPay = (paymentMethodId) => {
    callApi("payment/confirm_payment", "post", {
      ...this.getItems(),
      phoneNumber: this.props.accounts.phonenumber,
      payment_method_id: paymentMethodId
    }).then(result => this.handleServerResponse(result));
  };

  handleServerResponse = response => {
    if (response.error) {
      console.log(response.error, "in server response");
      this.setState({ open: false });
      this.props.dispatch(loading_end());
    } else if (response.requires_action) {
      // Use Stripe.js to handle required card action
      console.log(response, "server reqires action");
      this.props.stripe
        .handleCardAction(response.payment_intent_client_secret)
        .then(function(result) {
          if (result.error) {
            // Show error in payment form
          } else {
            // The card action has been handled
            // The PaymentIntent can be confirmed again on the server
            callApi("payment/confirm_payment", "post", {
              payment_intent_id: result.paymentIntent.id,
              order_id: response.order_id
            }).then(handleServerResponse);
          }
        });
    } else if (response.success) {
      // Show success message
      const { delivery_data, accounts } = this.props;
      const { delivery_address, special_instructions } = this.state;

      var time, order_delivery_data;
      
      if (delivery_data.type_time === "ASAP") {
        var date = new Date();
        var timeInMillis = date.getTime();
        time = new Date(40*60*1000 + timeInMillis).toISOString();
      }
      else time = new Date( delivery_data.date + "T" + delivery_data.time ).toISOString();

      if (delivery_data.type === DELIVERY) {
        order_delivery_data = {
          type: "delivery",
          time: time
        };
      } else {
        order_delivery_data = {
          type: "take-away",
          time: null
        };
      }

      console.log("Delivery Time", time);
      this.props.dispatch(
        ordered_product({
          order_id: response.order_id,
          delivery_data: order_delivery_data,
          delivery_address: delivery_address,
          note: special_instructions,
          phoneNumber: accounts.phonenumber
        })
      );
      this.setState({ open: false });
      this.props.dispatch(loading_end());
    } else {
      console.log(response, "in server response");
      this.setState({ open: false });
      this.props.dispatch(loading_end());
    }
  };

  getItems = () => {
    const { order_bag, accounts, branch } = this.props;
    var items = [];
    order_bag.forEach(item => {
      item.addons.forEach(addon => {
        items.push({
          quantity: item.count,
          productId: addon.id
        });
      });
      items.push({
        quantity: item.count,
        productId: item.variantId
      });
    });
    return {
      products: items,
      phoneNumber: accounts.phonenumber,
      branch: { b_ID: branch.id, b_Name: branch.name }
    };
  };

  //add credit card
  handleOpenCC = () => {
    this.setState({ add_open: true });
  };

  handleCloseCC = () => {
    this.setState({ add_open: false });
  };

  handleSubmitCC = ccdata => {
    console.log(ccdata);
    callApi("user/add-card", "post", {
      card: ccdata,
      phoneNumber: this.props.accounts.phonenumber
    }).then(res => {
      if (res.status === "success") {
        this.props.dispatch(GetUserInfo(this.props.accounts.token));
        this.setState({
          add_open: false,
          selected_card: { token: res.data.token, id: res.data.id }
        });
      }
    });
  };

  handleSelectCCData = id => {
    callApi("user/get-card", "post", {
      id: id,
      phoneNumber: this.props.accounts.phonenumber
    }).then(res => {
      if (res.status == "success") {
        this.setState({
          selected_card: {
            id: id,
            token: res.data.token
          }
        });
      }
    });
  };

  handleOpenTime = () => {
    console.log(" I am delivery time");
    this.setState({ openTime: true });
  };

  handleSaveTime = (type_time, date, time) => {
    console.log("This is Checkout Page", type_time, date, time);

    this.props.dispatch(
      change_delivery_time({ type_time: type_time, date: date, time: time })
    );
    this.setState({ openTime: false });
  };

  handleBuyType = type => {
    this.props.dispatch(change_delivery_type(type));
  };

  render() {
    const {
      show,
      delivery_address,
      open,
      add_open,
      openTime,
      selected_card
    } = this.state;
    const {
      business,
      branch,
      accounts,
      order_bag,
      sub_total,
      delivery_data
    } = this.props;
    var desc_time;
    const delivery_type = delivery_data.type;
    if (order_bag.length === 0) this.props.router.push("/products");
    if (delivery_data.type_time === "ASAP") desc_time = "ASAP(30-40m)";
    else desc_time = "LATER";

    return (
      <div className={styles["container"]}>
        <Helmet title={"Checkout"} />
        <div className={styles["container-wrapper"]}>
          <div className={styles["container-header"]}>
            <Link to="/products" className={styles["back"]}>
              <span className="mx-2">{fa_back()}</span>
              <span>Back</span>
            </Link>
            <h3 className={styles["header"]}>Checkout</h3>
          </div>
          <form className={styles["container-body"]} onSubmit={this.handleOpen}>
            <div className={clsx(styles["content"])}>
              <div className={styles["form"]}>
                <h4
                  className={clsx(
                    styles["form-header"],
                    styles["hidden-tablet"]
                  )}
                >
                  Order Details
                </h4>
                <div
                  className={clsx(
                    delivery_type === PICKUP ? styles["hideTime"] : "",
                    styles["time"]
                  )}
                >
                  <span className={styles["time-show"]}>{desc_time}</span>
                  <button
                    type="button"
                    className={styles["time-btn"]}
                    onClick={() => this.handleOpenTime()}
                  >
                    Change Time
                  </button>
                </div>
                <div className={styles["delivery-switch"]}>
                  <button
                    type="button"
                    onClick={() => this.handleBuyType(DELIVERY)}
                    className={clsx(
                      styles["switch-item"],
                      delivery_data.type === DELIVERY && styles["active"]
                    )}
                  >
                    <span className={styles["icon"]}>{delivery()}</span>
                    Delivery
                  </button>
                  <button
                    type="button"
                    onClick={() => this.handleBuyType(PICKUP)}
                    className={clsx(
                      styles["switch-item"],
                      delivery_data.type === PICKUP && styles["active"]
                    )}
                  >
                    <span className={styles["icon"]}>{pickup()}</span>
                    Pickup
                  </button>
                </div>
              </div>
              <div
                className={clsx(
                  styles["form"],
                  delivery_data.type === false ? styles["hidden-form"] : ""
                )}
              >
                <h4 className={styles["form-header"]}>Delivery Address</h4>
                {accounts.address && (
                  <div className={styles["form-group"]}>
                    <label className={styles["label"]}>
                      Select from profile
                    </label>
                    <select
                      className={styles["form-control"]}
                      onChange={e => this.selectAddrTemplate(e.target.value)}
                    >
                      <option value="" />
                      {accounts.address.map((addr, id) => (
                        <option key={id} value={`${addr.id}`}>
                          {addr.type}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <div className={styles["form-group"]}>
                  <label className={styles["label"]}>Location</label>
                  <div className={styles["input-group"]}>
                    <LocationSearchInput
                      className={clsx(styles["form-control"], styles["street"])}
                      onChange={this.handleChangeAddress}
                      onSelect={this.handleSelectAddress}
                      value={this.state.delivery_address.street.address}
                    />
                    <div className={styles["icon"]}>{fa_address()}</div>
                  </div>
                </div>
                <div className={clsx(styles["form-group"])}>
                  <label className={styles["label"]}>Post Code</label>
                  <input
                    className={styles["form-control"]}
                    placeholder="E16JE"
                    value={delivery_address.street.postalCode}
                    onChange={this.handleChange}
                    style={{ textTransform: "uppercase" }}
                    name="postalCode"
                  />
                </div>
                <div className={styles["form-group"]}>
                  <label className={styles["label"]}>
                    Flat or House Number
                  </label>
                  <input
                    className={styles["form-control"]}
                    placeholder="Flat 4"
                    value={delivery_address.flatNo}
                    onChange={this.handleChange}
                    name="flatNo"
                  />
                </div>
                <div className={styles["form-group"]}>
                  <label className={styles["label"]}>
                    Business or Building Name
                  </label>
                  <input
                    className={styles["form-control"]}
                    placeholder="Building"
                    value={delivery_address.buildingNo}
                    onChange={this.handleChange}
                    name="buildingNo"
                  />
                </div>
              </div>
              <div className={styles["form"]}>
                <h4 className={styles["form-header"]}>Special Instructions</h4>
                <textarea
                  className={styles["form-control"]}
                  rows={4}
                  value={delivery_address.special_instructions}
                  onChange={this.handleChange}
                  name="special_instructions"
                />
                {/* {Math.round(this.state.storyHeight)} */}
              </div>
              <div className={styles["form"]}>
                <h4 className={styles["form-header"]}>Payment Method</h4>
                {accounts.cards.map((card, index) => (
                  <PayForm
                    key={index}
                    issuer={card.issuer}
                    last4digit={card.last4digit}
                    selected={
                      selected_card && card.id === selected_card.id
                        ? true
                        : false
                    }
                    onSelect={e => this.handleSelectCCData(card.id)}
                  />
                ))}
                <button
                  type="button"
                  className={styles["addmore"]}
                  onClick={e => this.handleOpenCC()}
                >
                  <div className={styles["icon"]}>{plus()}</div>
                  Add Credit Card
                </button>
              </div>
              <DefaultButton className={styles["confirm-btn"]} type="submit">
                <span>Confirm and Pay</span>
                <span>
                  {business.currency.symbol}
                  {(
                    (delivery_data.type === DELIVERY ? delivery_data.fee : 0) +
                    sub_total
                  ).toFixed(2)}
                  <span className="ml-3">{next3()}</span>
                </span>
              </DefaultButton>
            </div>
            <div className={styles["order"]}>
              <OrderSummary
                ordered={order_bag}
                business={business}
                sub_total={sub_total}
                onClose={this.handleHide}
                show={show}
                header="Your Order Total"
              />
              <DefaultButton
                type="button"
                className={styles["bag-btn"]}
                onClick={this.handleShow}
              >
                <span>
                  <span className="mr-3">{shopping_bag()}</span>
                  <span>Shopping Bag</span>
                </span>
                <span>
                  {business.currency.symbol}
                  {(
                    (delivery_data.type === DELIVERY ? delivery_data.fee : 0) +
                    sub_total
                  ).toFixed(2)}
                </span>
              </DefaultButton>
            </div>
          </form>
        </div>
        <CCModal
          open={add_open}
          onClose={this.handleCloseCC}
          onSubmit={this.handleSubmitCC}
        />
        <CCModal
          open={open}
          onClose={this.handleClose}
          onSubmit={this.handleSubmit}
        />
        <TimeModal
          openTime={openTime}
          handleClose={this.handleClose}
          handleSubmit={this.handleSaveTime}
          type={delivery_data.type_time}
          time={delivery_data.time}
          date={delivery_data.date}
        />
      </div>
    );
  }
}

CheckoutPage.propTypes = {
  branch: PropTypes.object.isRequired,
  business: PropTypes.object.isRequired,
  order_bag: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired,
  delivery_data: PropTypes.object.isRequired
};

// Retrieve data from store as props
function mapStateToProps(state, props) {
  let sub_total = 0;
  state.order_bag.forEach(order => {
    sub_total += order.price;
  });

  return {
    branch: state.app.branch,
    order_bag: state.order_bag,
    sub_total: sub_total,
    delivery_data: state.delivery,
    business: state.home.business,
    accounts: state.accounts
  };
}

export default injectStripe(withRouter(connect(mapStateToProps)(CheckoutPage)));
