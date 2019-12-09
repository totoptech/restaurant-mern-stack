import React, { Component } from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import { Link, withRouter } from "react-router";
import Helmet from "react-helmet";
import { connect } from "react-redux";
import { Card, MenuItem, Select } from "@material-ui/core";

// Import Actions
import { GetUserInfo, SignOut } from "../ProfileActions";

// Import Component
import {
  account,
  order,
  payment,
  settings,
  logout
} from "../../../components/icons/icons";

// Import Style
import styles from "./ProfilePage.css";
import cookieRead from '../../../util/cookieRead';

class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      dropId: 1,
    };
  }

  componentDidMount() {
    const token = cookieRead('token');
    this.props.dispatch(GetUserInfo(token));
  }

  activeRoute = routeName => {
    const { pathname } = this.props.location;
    if (pathname === undefined) return "";
    if (pathname === routeName) {
      var dropId = 1;
      if (routeName === "/profile/order") dropId = 2;
      if (routeName === "/profile/payment") dropId = 3;
      if (routeName === "/profile/setting") dropId = 4;
      if (routeName === "/profile/address") dropId = 5;
      if (this.state.dropId != dropId) this.setState({ dropId: dropId });
    }
    return pathname === routeName ? styles["activeLink"] : "";
  };

  handleDropDown = () => {
    if (this.state.show === false) this.setState({ show: true });
    if (this.state.show === true) this.setState({ show: false });
  };

  handleSignout = () => {
    this.props.dispatch(SignOut());
  };

  clickDown = () => {
    this.setState({ show: false });
  };
  renderDrop = () => {
    if (this.state.dropId === 1)
      return (
        <div className={styles["render-drop"]}>
          <div className={styles["icon"]}>{account()}</div> Profile
        </div>
      );
    if (this.state.dropId === 2)
      return (
        <div className={styles["render-drop"]}>
          <div className={styles["icon"]}>{order()}</div> Order History
        </div>
      );
    if (this.state.dropId === 3)
      return (
        <div className={styles["render-drop"]}>
          <div className={styles["icon"]}>{payment()}</div>Payment Methods
        </div>
      );
    if (this.state.dropId === 4)
      return (
        <div className={styles["render-drop"]}>
          <div className={styles["icon"]}>{settings()}</div>Settings
        </div>
      );
    if (this.state.dropId === 5)
      return (
        <div className={styles["render-drop"]}>
          <div className={styles["icon"]}>{account()}</div>Address
        </div>
      );
  };
  render() {

    if(!(this.props.accounts || this.props.accounts.token)) {
      this.props.router.push('/');
      return;
    }

    return (
      <div className={styles["profile-container"]}>
        <div className={styles["container"]}>
          <Helmet title={"Profile"} />
          <div className={styles["mobile-menu"]}>
            <div className={styles["drop-click"]} onClick={this.handleDropDown}>
              {this.renderDrop()}
              <svg
                className={styles["down-icon"]}
                width="18"
                height="11"
                viewBox="0 0 18 11"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.36951 1.63049L8.83862 9.63049L16.6305 1.63049"
                  stroke="#3A3A3A"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {this.state.show && (
              <ul className={styles["drop-border"]}>
                <li>
                  <Link to={"/profile"} onClick={this.clickDown}>
                    <div
                      className={clsx(
                        styles["RLink"],
                        this.activeRoute("/profile")
                      )}
                    >
                      <div className={styles["icon"]}>{account()}</div>
                      Profile
                    </div>
                  </Link>
                </li>
                <li>
                  <Link to={"/profile/order"} onClick={this.clickDown}>
                    <div
                      className={clsx(
                        styles["RLink"],
                        this.activeRoute("/profile/order")
                      )}
                    >
                      <div className={styles["icon"]}>{order()}</div>
                      Order History
                    </div>
                  </Link>
                </li>
                <li>
                  <Link to={"/profile/payment"} onClick={this.clickDown}>
                    <div
                      className={clsx(
                        styles["RLink"],
                        this.activeRoute("/profile/payment")
                      )}
                    >
                      <div className={styles["icon"]}>{payment()}</div>
                      Payment Methods
                    </div>
                  </Link>
                </li>
                <li>
                  <Link to={"/profile/setting"} onClick={this.clickDown}>
                    <div
                      className={clsx(
                        styles["RLink"],
                        this.activeRoute("/profile/setting")
                      )}
                    >
                      <div className={styles["icon"]}>{settings()}</div>
                      Settings
                    </div>
                  </Link>
                </li>
                <li>
                  <Link to={"/"} className={clsx(styles["RLink"])} onClick={() => this.handleSignout()}>
                    <div className={styles["icon"]}>{logout()}</div>
                    Log Out
                  </Link>
                </li>
              </ul>
            )}
          </div>

          <div className={styles["menu"]}>
            <ul>
              <li>
                <Link to={"/profile"}>
                  <div
                    className={clsx(
                      styles["RLink"],
                      this.activeRoute("/profile")
                    )}
                  >
                    <div className={styles["icon"]}>{account()}</div>
                    Profile
                  </div>
                </Link>
              </li>
              <li>
                <Link to={"/profile/order"}>
                  <div
                    className={clsx(
                      styles["RLink"],
                      this.activeRoute("/profile/order")
                    )}
                  >
                    <div className={styles["icon"]}>{order()}</div>
                    Order History
                  </div>
                </Link>
              </li>
              <li>
                <Link to={"/profile/payment"}>
                  <div
                    className={clsx(
                      styles["RLink"],
                      this.activeRoute("/profile/payment")
                    )}
                  >
                    <div className={styles["icon"]}>{payment()}</div>
                    Payment Methods
                  </div>
                </Link>
              </li>
              <li>
                <Link to={"/profile/setting"}>
                  <div
                    className={clsx(
                      styles["RLink"],
                      this.activeRoute("/profile/setting")
                    )}
                  >
                    <div className={styles["icon"]}>{settings()}</div>
                    Settings
                  </div>
                </Link>
              </li>
              <li>
                <Link to={"/profile/address"}>
                  <div
                    className={clsx(
                      styles["RLink"],
                      this.activeRoute("/profile/address")
                    )}
                  >
                    <div className={styles["icon"]}>{account()}</div>
                    Address
                  </div>
                </Link>
              </li>
              <li>
                <Link to={"/"} onClick={() => this.handleSignout()}>
                  <div className={clsx(styles["RLink"])}>
                    <div className={styles["icon"]}>{logout()}</div>
                    Log Out
                  </div>
                </Link>
              </li>
            </ul>
          </div>
          <Card className={clsx(styles.card)}>{this.props.children}</Card>
        </div>
      </div>
    );
  }
}


// Actions required to provide data for this component to render in server side.
// ProfilePage.need = [
//   () => {
//     return fetch_branches();
//   },
//   () => {
//     return fetch_business();
//   },
//   () => {
//     return fetch_products();
//   },
// ];

// Retrieve data from store as props
function mapStateToProps(state, props) {
	// console.log(state);
  return {
    branch: state.app.branch,
    business: state.home.business,
    accounts: state.accounts,
  };
}

ProfilePage.propTypes = {
  branch: PropTypes.object.isRequired,
  business: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  accounts: PropTypes.object.isRequired,
};

export default withRouter(connect(mapStateToProps)(ProfilePage));
