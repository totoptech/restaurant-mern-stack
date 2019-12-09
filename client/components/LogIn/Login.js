import React, { useState } from "react";
import clsx from "clsx";

import styles from "./Login.css";
import { TextField, Button, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { Link } from "react-router";
import DefaultButton from "../../components/DefaultButton";
import { close_dlg } from "../../components/icons/icons";
import Axios from "axios";
import { SignIn } from "../../modules/Profile/ProfileActions";

import ReactPhoneInput from "react-phone-input-2";
import "react-phone-input-2/dist/style.css";

const useStyles = makeStyles(theme => ({
  textField: {
    maxWidth: 400,
    margin: "auto",
    marginTop: "15px",
    display: "block"
  },
  form: {
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#00cabe!important"
    },
    "& .MuiFormLabel-root.Mui-focused": {
      color: "#00cabe!important"
    }
  }
}));

const Login = props => {
  const [phonenumber, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [err_msg, setErrMsg] = useState(false);

  const passwordChange = event => {
    setPassword(event.target.value);
  };
  // function phoneChange(event) {
  //     setPhone(event.target.value);
  // }
  const onSubmit = event => {
    console.log(phonenumber, password);
    event.preventDefault();
    Axios({
      method: "POST",
      url: "/api/user/login",
      headers: {
        "Content-Type": "application/json"
      },
      data: {
        phoneNumber: phonenumber,
        password: password
      }
    }).then(res => {
      console.log("LOGIN RESPONSE:", res.data);
      if (res.data.token === undefined || res.data.token === "")
        setErrMsg(true);
      else {
        props.dispatch(
          SignIn({
            token: res.data.token,
            firstname: res.data.firstname,
            phonenumber: phonenumber,
            password,
          })
        );
        props.handleClose();
      }
    });
  };
  const classes = useStyles();
  return (
    <div className={styles["body-container"]}>
      <div onClick={props.handleClose} className={styles["btn-close"]}>
        {close_dlg()}
      </div>
      <form onSubmit={onSubmit} className={classes.form}>
        <div className={styles["sub-forms"]}>
          <p>Login with Phone</p>
          <ReactPhoneInput
            defaultCountry="us"
            value={phonenumber}
            onChange={value => setPhone(value)}
            containerClass={clsx(styles["react-tel"], "react-tel-input")}
            inputExtraProps={{
              name: "phoneNumber2",
              required: true
            }}
            inputClass={styles["phone-class"]}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            // autoComplete="current-password"
            className={classes.textField}
            onChange={passwordChange}
          />
          {err_msg === true && (
            <p className={styles["err-msg"]}>Invalid Credential</p>
          )}
          <div className={styles["div-sign"]}>
            <DefaultButton className={styles["btn-sign"]} type="submit">
              <span>Sign In</span>
            </DefaultButton>
          </div>

          <p className={styles["go-signup"]} onClick={props.handleSwitch}>
            Forgot Pasword?
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
