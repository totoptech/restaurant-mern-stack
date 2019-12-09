import React from "react";
import { connect } from "react-redux";
import clsx from "clsx";
import PropTypes from "prop-types";
import { Card, CardContent, IconButton } from "@material-ui/core";

import { DELIVERY, PICKUP } from "../../HomeActions";

//import Components
import {
  visa,
  close_dlg,
} from "../../../../components/icons/icons";

//import Styles
import styles from "./OrderSummary.css";

class OrderSummary extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      className,
      show,
      ordered,
      business,
      sub_total,
      delivery_data,
      header,
      payment,
      onClose,
      dispatch,
      onOpen,
      ...other,
    } = this.props;

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
              <div className={styles["title"]}>{header}</div>
              <IconButton
                classes={{ root: styles["close"] }}
                aria-label="Close"
                onClick={onClose}
              >
                {close_dlg()}
              </IconButton>
            </div>
            <div className={styles["products"]}>
              {ordered && ordered.map((order, index) => (
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
                {delivery_data.type === DELIVERY ? (delivery_data.fee.toFixed(2)) : "0.00"}
              </span>
            </div>
            <div className={clsx(styles["flexview"], styles["total"])}>
              <span>Total</span>
              <span>
                {business.currency.symbol}
                {((delivery_data.type === DELIVERY ? delivery_data.fee : 0) + sub_total).toFixed(2)}
              </span>
            </div>
            <div className={clsx(styles["flexview"], styles["payment"])} style={{display: payment === undefined ? "none" : "flex"}}>
              <span>Payment</span>
              <span>
                <span>***{payment}</span>
                {<span className={clsx(styles["payment-icon"])}>{visa()}</span>}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
}

OrderSummary.propTypes = {
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
          id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          price: PropTypes.number.isRequired,
        })
      ),
    })
  ),
  sub_total: PropTypes.number.isRequired,
  header: PropTypes.string.isRequired,
  payment: PropTypes.number,
  delivery_data: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

// Retrieve data from store as props
function mapStateToProps(state, props) {
  return {
    delivery_data: state.delivery,
  };
}

export default connect(mapStateToProps)(OrderSummary);
