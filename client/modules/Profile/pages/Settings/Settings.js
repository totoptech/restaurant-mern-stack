import React, { Fragment } from "react";

//import Component
import SettingsForm from "../../components/SettingsForm/SettingsForm";

//import Styles
import styles from "./Settings.css";

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: {
        emailNotify: false,
        pushNotify: false,
        storeNotify: false,
        autoIdentify: false
      }
    };
  }

  handlSwitch = (name, check) => {
    const { checked } = this.state;
    switch (name) {
      case "E_N":
        this.setState({ checked: {...checked, emailNotify: check} });
        break;
      case "P_N":
        this.setState({ checked: {...checked, pushNotify: check} });
        break;
      case "S_N":
        this.setState({ checked: {...checked, storeNotify: check} });
        break;
      case "A_I":
        this.setState({ checked: {...checked, autoIdentify: check} });
        break;
      default:
        break;
    }
  }

  render() {
    const { checked } = this.state;

    return (
      <Fragment>
        <p className={styles["stitle"]}>Settings</p>
        <div>
          <SettingsForm
            name="Email Notificationis"
            id="E_N"
            desc="Receive Emails about your Order, Promotions etc."
            onSwitch={this.handlSwitch}
            check={checked.emailNotify}
          />
        </div>
      </Fragment>
    );
  }
}

export default Settings;
