import React from "react";
import GMap from "../components/GMap/GMap";
import styles from "./OrderStatusPage.css";
import { withRouter } from "react-router";
import { gauge, messaging } from "../../../components/icons/icons";
import clsx from "clsx";
import { connect } from "react-redux";
import OrderSummary from "../../Home/components/OrderSummary/OrderSummary";

class OrderStatusPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false
    };
  }

  handleHide = () => {
    this.setState({ show: false });
  };

  handleShow = () => {
    this.setState({ show: true });
  };

  render() {
    const { show } = this.state;
    const { business, order_state, sub_total } = this.props;

    if (order_state.order_bag.length <= 0) this.props.router.push("/");

    console.log(order_state.branchLoc, order_state.location );

    return (
      <div>
        <GMap
          banchLoc={order_state.branchLoc}
          guestLoc={order_state.location}
        />
        <OrderSummary
          className={styles["order"]}
          ordered={order_state.order_bag}
          business={business}
          sub_total={sub_total}
          onClose={this.handleHide}
          payment={3456}
          show={show}
          header="Order Summary"
        />

        <div className={styles["opacity-container"]}>
          <div className={clsx("row", styles["order-container"])}>
            <div className={clsx("col-md-7", styles["way-layout"])}>
              {gauge()}
              <div className={styles["order-layout"]}>
                <p>Your Order is on the way!</p>
                <p>Your Order is on the way and will arrive in 30mins.</p>
              </div>
            </div>
            <div className={styles["btn-detail"]} onClick={this.handleShow}>
              See Order Details
            </div>
            <div
              className={clsx("col-md-5", "d-flex", styles["message-layout"])}
            >
              {messaging()}
              <p>
                Problems with your order?
                <br />
                Message Us.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
function mapStateToProps(state) {
  let sub_total = 0;
  state.order_state.order_bag.forEach(order => {
    sub_total += order.price;
  });

  return {
    business: state.home.business,
    order_state: state.order_state,
    sub_total: sub_total
  };
}
export default withRouter(connect(mapStateToProps)(OrderStatusPage));
