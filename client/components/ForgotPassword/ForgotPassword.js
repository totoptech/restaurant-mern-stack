import React, { useState } from "react";
import clsx from "clsx";

import styles from './ForgotPassword.css';
import { TextField, Button, Grid, Modal } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import DefaultButton from "../DefaultButton";
import {
  close_dlg,
  prev,
  verify_phone,
  verified
} from "../icons/icons";
import ClipLoader from "react-spinners/ClipLoader";
import Axios from "axios";
import { SignIn } from "../../modules/Profile/ProfileActions";

import "react-phone-input-2/dist/style.css";

import cookieWrite from "../../util/cookieWrite";
import { withRouter } from "react-router";

const useStyles = makeStyles(theme => ({
  form: {
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#00cabe!important"
    },
    "& .MuiFormLabel-root.Mui-focused": {
      color: "#00cabe!important"
    }
  },
  textField: {
    margin: "auto",
    maxWidth: 400,
    marginTop: "15px",
    display: "block",
    "& fieldset:focus": {
      borderColor: "#f00!important"
    }
  },
  textField1: {
    color: "#636F88",
    margin: "auto",
    maxWidth: 150,
    marginTop: "15px",
    display: "block"
  },
  textField2: {
    color: "#636F88",
    margin: "auto",
    maxWidth: 150,
    marginTop: "15px",
    display: "block",
    "& fieldset": {
      borderColor: "#f00!important"
    }
  },
  grid: {
    maxWidth: 400,
    margin: "auto"
  },

  grid1: {
    maxWidth: 400,
    margin: "auto",
    marginBottom: "20px"
  }
}));

const err_msg = [
  "This Email doesn't exist", 
  ""
];

const ForgotPassword = props => {
  const [email, setEmail] = useState("");

  const [step, setStep] = useState(1);
  const [err_ind, setErrInd] = useState(false);
  const [err_send, setErrSend] = useState(false);

  const classes = useStyles();


  const onSend = (e) => {
    e.preventDefault();
    console.log("I am ONSEND");

    Axios({
      method: "POST",
      url: "/api/user/forgotPassword",
      headers: {
        "Content-Type": "application/json"
      },
      data: {
        email: email
      }
    }).then(res => {
      console.log(res);
      if(res.data === 'invalid email')
      {
        setErrInd(true);
      }
      else if(res.data.status === 'sent')
      {
        setErrInd(false)
        setErrSend(false)
        setStep(2);
      }
      else
      {
        setErrInd(false)
        setErrSend(true)
        setStep(2);
      }
    });
  };
  const handlePrev = () => {
    setStep(step - 1);
  };
  

  return (
    <div className={styles["body-container"]}>
      <div className={clsx(styles["form-container"], classes.form)}>
        <div className={styles["sub-forms"]}>
          {step === 2 && (
            <div onClick={handlePrev} className={styles["btn-prev"]}>
              {prev()}
            </div>
          )}
          <div onClick={props.handleClose} className={styles["btn-close"]}>
            {close_dlg()}
          </div>
          {step === 2 && (
            <div className={styles['final-message']}>
              {err_send === false && <p>A password reset message was sent to your email address.<br></br> Please click the link in that message to reset your password.<br></br>If you didn't receive mail please click below button to resend.</p>}
              {err_send === true && <p>Some errors occured with sending email</p>}
              <DefaultButton
                className={styles["btn-send"]}
                onClick={onSend}
              >
                <span>Resend</span>
              </DefaultButton>
            </div>

          )}
          {step === 1 && (
            <form className={styles["step1-title"]} onSubmit={onSend}>
              <p>Forgot Password?</p>
              <p className={styles['step1-subtitle']}>
                Don't worry. Resetting your password is easy, just tell us the email you registered with Shine's Bakery.
                <br />
              </p>
              <Grid container className={classes.grid1}>
                <Grid item xs={12} sm={12}>
                  <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  type="email"
                  autoComplete="false"
                  //   autoComplete="email"
                  className={classes.textField}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  />
                  {err_ind === true && <p className={styles['err_msg']}>{err_msg[0]}</p>}
                </Grid>
                <Grid item xs={12} sm={12}>
                  <DefaultButton
                    className={styles["btn-send"]}
                    type='submit'
                  >
                    <span>Send</span>
                  </DefaultButton>
                </Grid>
              </Grid>
              <p className={styles["go-signup"]} onClick={props.handleSwitch}>
                Already have an account? Sign In
              </p>
            </form>
          )}
            
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
