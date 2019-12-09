import React from "react";
import clsx from "clsx";
import PropTypes from "prop-types";

//import Styles
import styles from "./AddressForm.css";

class AddressForm extends React.Component {
  render() {
    return (
      <div className={styles["O-container"]}>
        <div style={{ display: "flex" }}>
          <div className={styles["order-name1"]}>{this.props.type}</div>
        </div>
        <p className={styles["order-name2"]}>{this.props.addr}</p>
        <div className={styles["order-action"]}>
          <p className={styles["order-recepit"]} onClick={this.props.onEdit}>Edit</p>
          <span className={styles["order-split"]}>|</span>
          <p className={styles["order-reorder"]} onClick={this.props.onDelete}>Delete</p>
        </div>
      </div>
    );
  }
}

AddressForm.propTypes = {
  type: PropTypes.string.isRequired,
  addr: PropTypes.string.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default AddressForm;
