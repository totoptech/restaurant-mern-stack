import React from "react";
import clsx from "clsx";
import PaymentIcon from "react-payment-icons";

//import Styles
import styles from "./PayForm.css";

class PayForm extends React.Component {
  render() {
    const { issuer, last4digit, onEdit, onDelete, onSelect, selected } = this.props;

    return (
      <div className={clsx(styles["flex-view"], styles["payform"])}>
        <div className={clsx(styles["flex-view"], styles["infos"])}>
          <PaymentIcon className={styles["issuer"]} id={issuer} style={{ width: 24 }} />
          <div className={styles["digit"]}>***{last4digit}</div>
        </div>
        <div className={clsx(styles["flex-view"], styles["actions"])}>
          {onEdit && <div className={styles["action"]} onClick={onEdit}>Edit</div>}
          {onDelete && <div className={styles["action"]} onClick={onDelete}>Delete</div>}
          {onSelect && !selected && <div className={styles["action"]} onClick={onSelect}>Select</div>}
          {selected && <div className={styles["selected"]} >Selected</div>}
        </div>
      </div>
    );
  }
}

export default PayForm;
