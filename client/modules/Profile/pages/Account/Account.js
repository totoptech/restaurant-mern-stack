import React, { Fragment } from "react";

//import Component
import { account_xl, close_dlg } from "../../../../components/icons/icons";
import FormInput from "../../../../components/FormControl/FormInput";

//import Styles
import styles from "./Account.css";
import { connect } from "react-redux";
import { withStyles, Button, Modal, TextField } from "@material-ui/core";
import { callApi } from "../../../../util/apiCaller";
import cookieRead from "../../../../util/cookieRead";
import cookieWrite from "../../../../util/cookieWrite";
import { GetUserInfo } from "../../ProfileActions";
import { withRouter } from "react-router";
const StyledButton = withStyles(theme => ({
  root: {
    fontSize: "17px",
    backgroundColor: "#00cabed4  !important",
    color: "white",
    borderRadius: "26px",
    marginLeft: "20px",
    textTransform: "none !important",
    marginTop: "20px",
    padding: "14px 19px",
    transition: "all 0.3s ease 0s"
  }
}))(Button);

const GreyButton = withStyles(theme => ({
  root: {
    fontSize: "17px",
    backgroundColor: "#4e4e4e !important",
    color: "white",
    borderRadius: "26px",
    marginLeft: "20px",
    textTransform: "none !important",
    marginTop: "20px",
    padding: "14px 29px",
    transition: "all 0.3s ease 0s"
  }
}))(Button);
const err_pswMsg = [
  "Old Password doesn't match",
  "New confirm Password doesn't match"
];
class Account extends React.Component {
  constructor(props) {
    super(props);
    const token = cookieRead("token");

    this.state = {
      channel: false,
      showModal: false,
      name: "",
      birthday: "",
      email: "",
      phonenumber: "",
      oname: "",
      obirthday: "",
      oemail: "",
      ophonenumber: "",
      opassword: "",
      npassword: "",
      copassword: "",
      err_psw1: false,
      err_psw2: false,
      token: token
    };

    this.mount = false;
  }
  componentDidMount() {
    const userinfo = this.props.userinfo;
    const rpassword = cookieRead("password");
    var date;

    console.log("COMPONENT DID MOUNT",userinfo.birthday);
    if(userinfo.birthday === undefined || userinfo.birthday === null)
      date = '';
    else
      date = new Date(userinfo.birthday).toISOString().substr(0,10);


    this.setState({
      name: userinfo.firstname + " " + userinfo.lastname,
      email: userinfo.email,
      phonenumber: userinfo.phonenumber,
      rpassword: rpassword,
      birthday: date,
    });
    this.mount = true;
  }
  componentWillReceiveProps(newProps) {
    if(this.mount == true) {
      const userinfo = newProps.userinfo;
      var date;
      if(userinfo.birthday === undefined || userinfo.birthday === null)
        date = '';
      else
        date = new Date(userinfo.birthday).toISOString().substr(0,10);
  
      console.log("COMPONENT WILL RECEIVE PROPS",date);
  
      this.setState({
        name: userinfo.firstname + " " + userinfo.lastname,
        email: userinfo.email,
        phonenumber: userinfo.phonenumber,
        birthday: date,
      });
    }
  }
  // splitName(useName){

  // }
  onEditProfile = () => {
    const { name, birthday, email, phonenumber } = this.state;
    this.setState({
      channel: true,
      oname: name,
      obirthday: birthday,
      oemail: email,
      ophonenumber: phonenumber
    });
  };
  onChangePSW = () => {
    this.setState({
      showModal: true,
      opassword: "",
      npassword: "",
      copassword: ""
    });
  };
  onHideModal = () => {
    this.setState({ showModal: false });
  };
  onSave = event => {
    event.preventDefault();

    const { rpassword, name, email, token, birthday } = this.state;
    const firstname = name.split(" ")[0];
    const lastname = name.split(" ")[1];
    console.log(
      "UPDATE PASSWORD",
      token,
      firstname,
      lastname,
      email,
      rpassword,
      birthday
    );
    callApi("user/update-user-profile", "post", {
      token: token,
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: rpassword,
      birthday:birthday
    }).then(res => {
      cookieWrite("firstname", firstname);
      this.props.dispatch(GetUserInfo(token));
      this.setState({ channel: false });
    });
  };
  onDiscard = () => {
    const { oname, obirthday, oemail, ophonenumber } = this.state;
    this.setState({
      channel: false,
      name: oname,
      birthday: obirthday,
      email: oemail,
      phonenumber: ophonenumber
    });
  };
  changePassword = event => {
    event.preventDefault();

    const {
      opassword,
      npassword,
      copassword,
      rpassword,
      name,
      email,
      token
    } = this.state;
    let error = false;
    console.log(rpassword);
    if (rpassword !== opassword) {
      this.setState({ err_psw1: true });
      error = true;
    } else this.setState({ err_psw1: false });
    if (npassword !== copassword) {
      this.setState({ err_psw2: true });
      error = true;
    } else this.setState({ err_psw2: false });

    if (!error) {
      const firstname = name.split(" ")[0];
      const lastname = name.split(" ")[1];
      console.log(
        "UPDATE PASSWORD",
        token,
        firstname,
        lastname,
        email,
        npassword
      );
      callApi("user/update-user-profile", "post", {
        token: token,
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: npassword
      }).then(res => {
        this.setState({ rpassword: npassword });
        cookieWrite("password", npassword);
        this.onHideModal();
        // this.props.dispatch({type:GET_USERINFO, data:res});
      });
    }
  };

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };
  _onFocus = e => {
      e.currentTarget.type = "date";
  }
  _onBlur = e => {
      e.currentTarget.type = "text";
      e.currentTarget.placeholder = "Enter a Date";
  }
  render() {
    const {
      channel,
      name,
      birthday,
      email,
      phonenumber,
      showModal,
      copassword,
      opassword,
      npassword,
      err_psw1,
      err_psw2
    } = this.state;
    console.log("DATE!!!!!!!!!!",birthday);
    return (
      <Fragment>
        <div className="d-flex">
          <div className={styles["avatar"]}>
            {account_xl()}
            <p className={styles["changeimage"]}>
              Change
              <br />
              Image
            </p>
          </div>
          <div className={styles["nameinput"]}>
            <FormInput
              id="profile_name"
              label="Name"
              value={name}
              disabled={channel ? false : true}
              inverted={true}
              onChange={this.handleChange}
              name="name"
            />
          </div>
        </div>
        <FormInput
          fullWidth
          className="mb-4"
          id="profile_birthday"
          label="Birthday"
          disabled={channel ? false : true}
          value={birthday}
          inverted={true}
          onChange={this.handleChange}
          name="birthday"
          type="text" onFocus = {this._onFocus} onBlur={this._onBlur}
        />
        <FormInput
          className="mb-4"
          fullWidth
          id="profile_email"
          label="Email"
          value={email}
          type="email"
          disabled={channel ? false : true}
          inverted={true}
          onChange={this.handleChange}
          name="email"
        />
        <FormInput
          className="mb-4"
          fullWidth
          id="profile_phoneNumber"
          label="Phone Number"
          value={phonenumber}
          type="text"
          disabled={true}
          inverted={true}
          onChange={this.handleChange}
          name="phonenumber"
        />
        <div className={styles["button-group"]}>
          {channel === false ? (
            <div>
              <StyledButton onClick={this.onEditProfile}>
                Edit Profile
              </StyledButton>
              <StyledButton onClick={this.onChangePSW}>
                Change Password
              </StyledButton>
            </div>
          ) : (
            <div>
              <StyledButton onClick={this.onSave}>Save</StyledButton>
              <StyledButton onClick={this.onDiscard}>Discard</StyledButton>
            </div>
          )}
        </div>
        <Modal
          open={showModal}
          onClose={this.onHideModal}
          aria-labelledby="modal-password"
        >
          <form
            className={styles["body-container"]}
            onSubmit={this.changePassword}
          >
            <div onClick={this.onHideModal} className={styles["btn-close"]}>
              {close_dlg()}
            </div>
            <p className={styles["mTitle"]}>Change Password</p>
            <div className={styles["form-container"]}>
              <FormInput
                className="mb-3"
                id="password1"
                label="Old Password"
                value={opassword}
                inverted={true}
                type="password"
                name="opassword"
                required
                onChange={this.handleChange}
              />
              {err_psw1 === true && (
                <p className={styles["err-pswMsg"]}>{err_pswMsg[0]}</p>
              )}
              <FormInput
                className="mb-3"
                id="password2"
                label="New Password"
                value={npassword}
                inverted={true}
                type="password"
                name="npassword"
                required
                onChange={this.handleChange}
              />
              <FormInput
                className="mb-3"
                id="password3"
                label="Confirm Password"
                value={copassword}
                inverted={true}
                type="password"
                name="copassword"
                required
                onChange={this.handleChange}
              />
              {err_psw2 === true && (
                <p className={styles["err-pswMsg"]}>{err_pswMsg[1]}</p>
              )}
              <div className={styles["button-group"]}>
                <GreyButton type="submit">Save</GreyButton>
                <GreyButton onClick={this.onHideModal}>Cancel</GreyButton>
              </div>
            </div>
          </form>
        </Modal>
      </Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    userinfo: state.accounts
  };
}

export default withRouter(connect(mapStateToProps)(Account));
