import React, { Fragment } from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import { withRouter, Link } from "react-router";
import { connect } from "react-redux";

//import Component
import OrderForm from "../../components/OrderForm/OrderForm";

//import Styles
import styles from "./OrderHistory.css";
import { order_history } from "../../ProfileActions";
import { get_ordered } from "../../../OrderStatus/OrderStatusAction";

class OrderHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: ""
    };
  }

  componentDidMount() {
    const { accounts, dispatch } = this.props;
    if (accounts.phonenumber != null && accounts.phonenumber != undefined && accounts.phonenumber != "") {
      dispatch(order_history(accounts.phonenumber));
      this.setState({ phone: accounts.phonenumber });
    }
  }

  componentDidUpdate() {
    const { phone } = this.state;
    const { accounts, dispatch } = this.props;
    if (phone !== accounts.phonenumber) {
      dispatch(order_history(accounts.phonenumber));
      this.setState({ phone: accounts.phonenumber });
    }
  }

  viewOrderStatus = (id, latlng, b_id) => {
    this.props.dispatch(get_ordered(id, this.state.phone, latlng, b_id));
  }

  render() {
    const { order_history, business } = this.props;
    return (
      <Fragment>
        <p className={styles["stitle"]}> Order History</p>
        <div style={{overflow: 'auto'}}>
        {order_history && order_history.map((order, index) => {
          if(!(order.status == "accept" || order.status == "completed"))
            return;
          let subtitle = "";
          order.items.forEach(item => {
            subtitle += item.label + ", ";
          });
          subtitle = subtitle.substr(0, subtitle.length - 2);

          const date = new Date(Date.parse(order.date));
          const year = date.getFullYear();
          const month = ("0" + (date.getUTCMonth()+1)).slice(-2);
          const day = ("0" + date.getUTCDate()).slice(-2);
          const hour1 = date.getUTCHours() % 12;
          const hour = ("0" + (hour1 ? hour1 : 12)).slice(-2);
          const minute = ("0" + date.getUTCMinutes()).slice(-2);
          const ampm = (date.getUTCHours() >= 12) ? 'PM' : 'AM';

          return (
            <OrderForm
              key={index}
              title={order.branch.b_Name}
              subTitle={subtitle}
              status={order.status == "accept" ? "Active" : "Completed"}
              total={"Total  " + business.currency.symbol + " " + (order.totalPaid / 100).toFixed(2)}
              date={`${month}.${day}.${year}`}
              time={`${hour}/${minute} ${ampm}`}
              actionName={"Order Status"}
              action={() => this.viewOrderStatus(order.orderID, order.location, order.branch.b_ID)}
            />
          );
        })}
        </div>
      </Fragment>
    );
  }
}

OrderHistory.propTypes = {
  accounts: PropTypes.object.isRequired,
  order_history: PropTypes.array,
  dispatch: PropTypes.func.isRequired
};

// Retrieve data from store as props
function mapStateToProps(state, props) {

  return {
    accounts: state.accounts,
    order_history: state.order_history,
    business: state.home.business,
  };
}

export default withRouter(connect(mapStateToProps)(OrderHistory));
