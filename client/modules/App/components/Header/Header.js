import React from "react";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router";
import clsx from "clsx";
import PropTypes from "prop-types";
import { ExpandMore } from "@material-ui/icons";

import { Modal } from "@material-ui/core";
import { SignOut, SignIn } from "../../../Profile/ProfileActions";
import {bag_clear} from '../../../Home/HomeActions';
import {
  Navbar,
  Nav,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";

//import Components
import { account_lg, fork,close_dlg } from "../../../../components/icons/icons";

import DefaultButton from "../../../../components/DefaultButton";
import DropdownMenuItem from "../../../../components/Menu/MenuItem/DropdownMenuItem";

//import Actions
import { setBranch } from "../../AppActions";

//import Styles
import styles from "./Header.css";
import SignUp from "../../../../components/SignUp/SignUp";
import Login from "../../../../components/LogIn/Login";
import ForgotPassword from "../../../../components/ForgotPassword/ForgotPassword";
import cookieRead from "../../../../util/cookieRead";
import Axios from "axios";
class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      headerEffect: false,
      openLog: false,
      openSign: false,
      openForgot: false,
      openTrash: false,
      willbeBranch: '',
    };
  }

  componentDidMount() {
    if (this.props.token === undefined || this.props.token === "") {
      const token = cookieRead("token");
      const firstname = cookieRead("firstname");
      const password = cookieRead("password");
      const phonenumber = cookieRead("phonenumber");
      this.props.dispatch(SignIn({ token, firstname, password, phonenumber }));
    }
    this.handleScroll();
    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleBranch = branch => {
    this.props.dispatch(setBranch(branch));
  };

  handleScroll = () => {
    const { headerEffect } = this.state;
    const lastScrollY = window.scrollY;
    if (lastScrollY > 80) {
      if (headerEffect === false) this.setState({ headerEffect: true });
    } else {
      if (headerEffect === true) this.setState({ headerEffect: false });
    }
  };

  openLogIn = () => {
    this.setState({ openLog: true, openSign: false });
  };
  openForgotPassword = () => {
    this.setState({ openForgot: true, openLog: false});
  }
  openSignUp = () => {
    this.setState({ openSign: true, openLog: false });
  };
  onSignOut = () => {
    this.props.dispatch(SignOut());
    this.props.router.push("/");
  };
  onOpenTrash = (branch) => {
    console.log("OPENTRASH",branch);
    this.setState({ openTrash: true, willbeBranch:branch});
  }

  handleMoveBranch = () => {
    this.props.dispatch(setBranch(this.state.willbeBranch));
    this.props.dispatch(bag_clear());
    this.setState({ openTrash: false});
  }

  handleClose = () => {
    this.setState({ openLog: false, openSign: false, openForgot: false, openTrash: false });
  };
  render() {
    const { headerEffect } = this.state;
    const { branch, branches, business, router, token, firstname } = this.props;
    const viewMenu = !this.context.router.isActive("/", true) && branch !== {};
    const hideNav =
      this.context.router.isActive("/login") ||
      this.context.router.isActive("/signup");
    const effect =
      headerEffect ||
      !(
        this.context.router.isActive("/", true) ||
        this.context.router.isActive("/products", true)
      );

    if (hideNav) {
      return <div />;
    }

    return (
      <div
        className={clsx(
          styles["header-container"],
          effect === true ? styles["effect"] : ""
        )}
        style={{ zIndex: "10" }}
      >
        <Navbar expand="md" className={styles["header"]}>
          {viewMenu && (
            <Nav className={styles["menu"]}>
              <div onClick={() => router.push("/")}>
                {effect ? (
                  <div
                    className={styles["logo"]}
                    style={{
                      backgroundImage: "url(" + business.logoUrl + ")"
                    }}
                  />
                ) : (
                  fork()
                )}
              </div>
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav className="p-0">
                  <span className={styles["menutitle"]}>
                    <span>{branch.name || business.name}</span>
                    <ExpandMore />
                  </span>
                </DropdownToggle>
                <DropdownMenu>
                  {branches.map((b, index) => (
                    <DropdownMenuItem
                      to={`/products`}
                      action={() => this.handleBranch(b)}
                      key={index}
                      mybranch = {b}
                      handleOpen = {this.onOpenTrash}
                    >
                      {b.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
          )}
          <Nav className={styles["right-menu"]}>
            {token === "" || token === undefined ? (
              <div>
                <div className={styles["menu-item"]} onClick={this.openLogIn}>
                  {" "}
                  Log In{" "}
                </div>
                <div className={styles["menu-item"]} onClick={this.openSignUp}>
                  {" "}
                  Sign Up{" "}
                </div>
              </div>
            ) : (
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav className={styles.account}>
                  <p className={styles["username"]}>{firstname}</p>
                  {account_lg()}
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownMenuItem to="/profile"> Profile </DropdownMenuItem>
                  <DropdownItem divider />
                  <DropdownMenuItem to="/products" onClick={this.onSignOut}>
                    {" "}
                    Sign out{" "}
                  </DropdownMenuItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            )}
          </Nav>
        </Navbar>

        <Modal open={this.state.openTrash} onClose={this.handleClose}>
          <div className={styles['modal-container']}>
            <div onClick={this.handleClose} className={styles["btn-close"]}>
              {close_dlg()}
            </div>
            <p>
              Warning
            </p>
            <p>You have some products in your current branch. Do you wanna put them off?</p>
            <div className={styles['btn-group']}>
              <DefaultButton className={styles['btn-yes']} onClick={this.handleMoveBranch}>Yes</DefaultButton>
              <DefaultButton className={styles['btn-no']} onClick={this.handleClose}>No</DefaultButton>
            </div>
          </div>
        </Modal>

        <Modal open={this.state.openLog} onClose={this.handleClose}>
          <Login
            handleClose={this.handleClose}
            handleSwitch={this.openForgotPassword}
            dispatch={this.props.dispatch}
          />
        </Modal>

        <Modal open={this.state.openForgot} onClose={this.handleClose}>
          <ForgotPassword
            handleClose={this.handleClose}
            handleSwitch={this.openLogIn}
            dispatch={this.props.dispatch}
          />
        </Modal>

        <Modal open={this.state.openSign} onClose={this.handleClose}>
          <SignUp
            handleClose={this.handleClose}
            handleSwitch={this.openLogIn}
            dispatch={this.props.dispatch}
          />
        </Modal>
      </div>
    );
  }
}

Header.contextTypes = {
  router: PropTypes.object
};

Header.propTypes = {
  branches: PropTypes.array.isRequired,
  branch: PropTypes.object,
  business: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
};

// Retrieve data from store as props
function mapStateToProps(state) {
  return {
    intl: state.intl,
    branch: state.app.branch,
    branches: state.home.branches,
    business: state.home.business,
    token: state.accounts.token,
    firstname: state.accounts.firstname
  };
}

export default withRouter(connect(mapStateToProps)(Header));
