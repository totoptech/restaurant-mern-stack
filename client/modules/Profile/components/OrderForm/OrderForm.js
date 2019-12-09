import React from "react";
import clsx from "clsx";
import PropTypes from "prop-types";

import { Link } from "react-router";
//import Styles
import styles from "./OrderForm.css";

class OrderForm extends React.Component {
  render() {
    return (
      <div className={styles["O-container"]}>
        <div className={styles["flex-view"]}>
          <div className={styles["title"]}>
            <div className={styles["header"]}>{this.props.title}</div>
            <div className={styles["subheader"]}>
              {this.props.subTitle.length > 20
                ? this.props.subTitle.substr(0, 67) + "..."
                : this.props.subTitle}
            </div>
          </div>
          <div className={styles["status"]}>
            <div className={styles["timestamp"]}>
              <div>{this.props.date}</div>
              <div>{this.props.time}</div>
            </div>
            <div className={clsx(styles["state"], styles[this.props.status])}>
              {this.props.status}
            </div>
          </div>
        </div>
        <div className={clsx(styles["flex-view"], styles["footer"])}>
          <div className={styles["total"]}>{this.props.total}</div>
          <div className={clsx(styles["flex-view"], styles["actions"])}>
            <button className={styles["action"]} onClick={this.props.action}>
              {this.props.actionName}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

OrderForm.propTypes = {
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.string.isRequired,
  total: PropTypes.string.isRequired,
  action: PropTypes.func.isRequired,
  date: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  actionName: PropTypes.string.isRequired
};

export default OrderForm;
