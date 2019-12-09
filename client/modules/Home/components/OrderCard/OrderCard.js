import React from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Card, CardContent, IconButton } from "@material-ui/core";

//import Components
import {
  delivery,
  trush,
  pickup,
  next3,
  shopping_bag,
  close_dlg
} from "../../../../components/icons/icons";
import DefaultButton from "../../../../components/DefaultButton";
import TimeModal from '../../../../components/TimeModal/TimeModal';

//import Actions
import { change_delivery_time, change_delivery_type, DELIVERY, PICKUP } from "../../HomeActions";

//import Styles
import styles from "./OrderCard.css";

class OrderCard extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      openTime: false,
      delivery_type:DELIVERY
    }
  }
  componentDidMount(){
  }
  handleClose = () => {
    this.setState({openTime: false});
  }
  handleDelivery = () => {
    this.setState({openTime: true});
  }
  handleSaveTime = (type, date, time) => {
    this.setState({openTime: false});
    this.props.dispatch(change_delivery_time({type_time : type, date: date, time: time}));
  }

  handleBuyType = (type) => {
    this.props.dispatch(change_delivery_type(type));
  }

  render() {
    const {
      classes,
      className,
      show,
      ordered,
      business,
      sub_total,
      delivery_data,
      onClose,
      onOpen,
      onNext,
      onDelete,
      dispatch,
      ...other,
    } = this.props;
    const {openTime } = this.state;
    var desc_time;
    const delivery_type = delivery_data.type;

    if(delivery_data.type_time === 'ASAP')
      desc_time= 'ASAP(30-40m)'
    else
      desc_time= 'LATER'

    return (
      <div className={clsx(styles["order"], (className ? className : ""), (show === false ? styles["hidden-wrapper"] : ""))}>
        {show === true && (<div aria-hidden="true" className={styles["overlay"]} />)}
        <Card className={clsx(styles["card"], (show === false ? styles["hidden"] : ""))} {...other}>
          <CardContent
            className={clsx(
              styles["content"]
            )}
          >
            <div className={styles["header"]}>
              <div className={styles["title"]}>Your Order</div>
              <div className={delivery_type === PICKUP ? styles['hideTime']: ''}>
                <div className={styles["time"]}>
                  <button className={styles["time-show"]} onClick={() => this.handleDelivery()}>{desc_time}</button>
                </div>
                <div className={styles["time-tablet"]}>
                  <span className={styles["time-show"]}>{desc_time}</span>
                  <button className={styles["time-btn"]} onClick={() => this.handleDelivery()}>Change Time</button>
                </div>
              </div>
              <IconButton
                classes={{ root: styles["close"] }}
                aria-label="Close"
                onClick={onClose}
              >
                {close_dlg()}
              </IconButton>
            </div>
            <div className={styles["delivery-switch"]}>
              <button
                onClick={() => this.handleBuyType(DELIVERY)}
                className={clsx(styles["switch-item"], (delivery_data.type === DELIVERY && styles["active"]))}
              >
                <span className={styles["icon"]}>{delivery()}</span>
                Delivery
              </button>
              <button
                onClick={() => this.handleBuyType(PICKUP)}
                className={clsx(styles["switch-item"], (delivery_data.type === PICKUP && styles["active"]))}
              >
                <span className={styles["icon"]}>{pickup()}</span>
                Pickup
              </button>
            </div>
            <div className={styles["products"]}>
              {ordered.map((order, index) => (
                <div className={styles["product"]} key={index}>
                  <div>
                    <div>
                      {order.count} x {order.baseName}
                    </div>
                    <div className={styles["variant"]}>
                      {order.variantName}
                    </div>
                  </div>
                  <div>
                    {business.currency.symbol}
                    {order.price.toFixed(2)}
                    <button
                      className={styles["iconbtn"]}
                      onClick={() => onDelete(index)}
                    >
                      {trush()}
                    </button>
                  </div>
                </div>
                ))}
            </div>
            <div className={styles["flexview"]}>
              <span>Subtotal</span>
              <span>
                {business.currency.symbol}
                {sub_total.toFixed(2)}
              </span>
            </div>
            <div className={styles["flexview"]}>
              <span>Delivery Fee</span>
              <span>
                {business.currency.symbol}
                {delivery_data.type === DELIVERY ? delivery_data.fee.toFixed(2) : "0.00"}
              </span>
            </div>
            <div className={clsx(styles["flexview"], styles["total"])}>
              <span>Total</span>
              <span>
                {business.currency.symbol}
                {((delivery_data.type === DELIVERY ? delivery_data.fee : 0) + sub_total).toFixed(2)}
              </span>
            </div>
          </CardContent>
          <div className={styles["footer"]}>
            <DefaultButton
              className={clsx(
                styles["footer-btn"]
              )}
              onClick={() => onNext()}
            >
              <span>
                Checkout
            </span>
              <span>
                <span className="mr-3">
                  {business.currency.symbol}
                  {((delivery_data.type === DELIVERY ? delivery_data.fee : 0) + sub_total).toFixed(2)}
                </span>
                {next3()}
              </span>
            </DefaultButton>
          </div>
        </Card>
        <DefaultButton className={clsx(styles["bag-btn"], (show === true ? styles["hidden"] : ""))} onClick={onOpen}>
          <span>
            <span className="mr-3">{shopping_bag()}</span>
            <span>Shopping Bag</span>
          </span>
          <span>
            {business.currency.symbol}
            {((delivery_data.type === DELIVERY ? delivery_data.fee : 0) + sub_total).toFixed(2)}
          </span>
        </DefaultButton>
        
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

OrderCard.propTypes = {
  business: PropTypes.shape({
    currency: PropTypes.shape({
      code: PropTypes.string.isRequired,
      symbol: PropTypes.string.isRequired,
    }).isRequired
  }).isRequired,
  ordered: PropTypes.arrayOf(
    PropTypes.shape({
      baseId: PropTypes.string.isRequired,
      baseName: PropTypes.string.isRequired,
      variantId: PropTypes.string.isRequired,
      variantName: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired,
      price: PropTypes.number.isRequired,// price of total
      addons: PropTypes.arrayOf(PropTypes.shape({
          id: PropTypes.string,
          name: PropTypes.string,
          price: PropTypes.number,
        })
      ),
    })
  ),
  sub_total: PropTypes.number.isRequired,
  delivery_data: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
  onNext: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onOpen: PropTypes.func.isRequired,
};

// Retrieve data from store as props
function mapStateToProps(state, props) {
  return {
    delivery_data: state.delivery,
  };
}

export default connect(mapStateToProps)(OrderCard);
