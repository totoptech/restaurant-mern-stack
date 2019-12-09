import React, { useState } from "react";
import clsx from "clsx";

import styles from "./SignUp.css";
import { TextField, Button, Grid, Modal } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { withStyles } from "@material-ui/core/styles";
import DefaultButton from "../../components/DefaultButton";
import {
  close_dlg,
  prev,
  verify_phone,
  verified
} from "../../components/icons/icons";
import ClipLoader from "react-spinners/ClipLoader";
import Axios from "axios";
import { SignIn } from "../../modules/Profile/ProfileActions";

import ReactPhoneInput from "react-phone-input-2";
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
    marginBottom: "80px"
  }
}));
const err_msg = [
  "Verification Code is Required", //err_ind = 1
  "Verification Failed", //err_ind = 2
  "Confirm Password doesnt match" //err_ind = 3
];
const SignUp = props => {
  const [phonenumber, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCPassword] = useState("");
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [vrcode, setVRCode] = useState("");

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [verifying, setVerifying] = useState(0);
  const [token, setToken] = useState("");
  const [err_ind, setErrInd] = useState(0);
  const classes = useStyles();

  const onSubmit = event => {
    event.preventDefault();
    setErrInd(0);
    if (cpassword != password) {
      setErrInd(3);
    } else setStep(1);
  };
  const onResend = () => {
    Axios({
      method: "POST",
      // url: endpoint + '/api/user/verification',
      url: "/api/user/verification",
      headers: {
        "Content-Type": "application/json"
      },
      data: {
        phoneNumber: phonenumber
      }
    }).then(res => {
      console.log("PHONE VERIFICATION RESPONSE:", res);
    });
  };
  const onSend = () => {
    setErrInd(0);
    setStep(2);
    Axios({
      method: "POST",
      // url: endpoint + '/api/user/verification',
      url: "/api/user/verification",
      headers: {
        "Content-Type": "application/json"
      },
      data: {
        phoneNumber: phonenumber
      }
    }).then(res => {
      console.log("PHONE VERIFICATION RESPONSE:", res);
    });
  };
  const handlePrev = () => {
    setStep(step - 1);
    setVerifying(0);
  };
  const onConfirm = () => {
    setErrInd(0);
    if (vrcode === "") setErrInd(1);
    else {
      setVerifying(1);
      Axios({
        method: "POST",
        // url: endpoint + '/api/user/confirm',
        url: "/api/user/confirm",
        headers: {
          "Content-Type": "application/json"
        },
        data: {
          firstname: firstname,
          lastname: lastname,
          email: email,
          phoneNumber: phonenumber,
          password: password,
          code: vrcode
        }
      }).then(res => {
        console.log("CONFIRM RESPONSE", res.data);
        if (
          res.data === "failed with Practi" ||
          res.data === "failed" ||
          res.data === "user already exists"
        ) {
          setVerifying(0);
          setErrInd(2);
        } else {
          setVerifying(2);
          setErrInd(0);
          props.dispatch(
            SignIn({
              token: res.data,
              firstname,
              password,
              phonenumber
            })
          );
          props.handleClose();
        }
      });
      console.log("I am CONFIRM");
    }
  };

  return (
    <div className={styles["body-container"]}>
      <div className={clsx(styles["form-container"], classes.form)}>
        <div className={styles["sub-forms"]}>
          {step > 0 && (
            <div onClick={handlePrev} className={styles["btn-prev"]}>
              {prev()}
            </div>
          )}
          <div onClick={props.handleClose} className={styles["btn-close"]}>
            {close_dlg()}
          </div>
          {verifying === 1 && (
            <div className={styles["verifying"]}>
              <ClipLoader
                sizeUnit={"px"}
                size={100}
                color={"#fff"}
                loading={verifying === 1 ? true : false}
              />
              <p>Verifying</p>
            </div>
          )}

          {verifying === 2 && (
            <div className={styles["verifying"]}>
              {verified()}
              <p>Verified</p>
            </div>
          )}
          <div className={verifying > 0 ? styles["noneFoucs"] : ""}>
            {step === 2 && (
              <div className={styles["verify-container"]}>
                <div className={styles["phone-icon"]}>{verify_phone()}</div>
                <p className={styles["verification-code"]}>
                  Enter Verification Code
                </p>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  color="secondary"
                  type="password"
                  inputProps={{
                    maxLength: 4
                  }}
                  onChange={e => {
                    setVRCode(e.target.value);
                    setErrInd(0);
                  }}
                  className={err_ind ? classes.textField2 : classes.textField1}
                />

                <p className={styles["err_msg"]} style={{}}>
                  {err_ind !== 0 && err_msg[err_ind - 1]}
                </p>
                <div className={styles["verify-layout"]}>
                  <p onClick={onConfirm}>Confirm</p>
                  <p onClick={onResend}>Resend SMS?</p>
                </div>
              </div>
            )}
            {step === 1 && (
              <div className={styles["step1-title"]}>
                <p>Verify Phone Number</p>
                <p>
                  We will send you a text with a code.
                  <br />
                  The text is free, you're not charged for it.
                </p>
                <Grid container className={classes.grid1}>
                  <Grid item xs={12} sm={9}>
                    <ReactPhoneInput
                      defaultCountry="us"
                      value={phonenumber}
                      containerClass={clsx(
                        styles["react-tel"],
                        "react-tel-input"
                      )}
                      disabled={true}
                      inputExtraProps={{
                        name: "phoneNumber1",
                        required: true
                      }}
                      inputClass={styles["phone-class"]}
                    />
                    {/* <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      id="phone"
                      label="Phone number"
                      name="phone"
                    //   autoComplete="phone"
                      value={phonenumber}
                    /> */}
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <DefaultButton
                      className={styles["btn-send"]}
                      onClick={onSend}
                    >
                      <span>Send</span>
                    </DefaultButton>
                  </Grid>
                </Grid>
              </div>
            )}
            {step === 0 && (
              <form onSubmit={onSubmit}>
                <p className={styles["sub-title"]}>Sign Up</p>
                <Grid container className={classes.grid}>
                  <Grid item xs={12} sm={6}>
                    <div className={styles["space-field1"]}>
                      <TextField
                        //   autoComplete="fname"
                        name="firstName"
                        variant="outlined"
                        required
                        fullWidth
                        id="firstName"
                        label="First Name"
                        className={classes.textField}
                        value={firstname}
                        onChange={e => setFirstName(e.target.value)}
                      />
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <div className={styles["space-field2"]}>
                      <TextField
                        variant="outlined"
                        required
                        fullWidth
                        id="lastName"
                        label="Last Name"
                        name="lastName"
                        //   autoComplete="lname"
                        className={classes.textField}
                        value={lastname}
                        onChange={e => setLastName(e.target.value)}
                      />
                    </div>
                  </Grid>
                </Grid>

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
                <ReactPhoneInput
                  defaultCountry="us"
                  value={phonenumber}
                  onChange={value => setPhone(value)}
                  containerClass={clsx(styles["react-tel"], "react-tel-input")}
                  inputExtraProps={{
                    name: "phoneNumber",
                    required: true
                  }}
                  inputClass={styles["phone-class"]}
                />
                {/* <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="phone"
                  label="Phone number"
                  name="phone"
                //   autoComplete="phone"
                  className={classes.textField}
                  value={phonenumber}
                  onChange={e => setPhone(e.target.value)}
                /> */}
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  //   autoComplete="current-password"
                  className={classes.textField}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="cpassword"
                  label="Confirm Password"
                  type="password"
                  id="cpassword"
                  //   autoComplete="confirm-password"
                  className={classes.textField}
                  value={cpassword}
                  onChange={e => setCPassword(e.target.value)}
                />
                <p className={clsx(styles["err_msg"], styles["err_psw"])}>
                  {err_ind === 3 && err_msg[2]}
                </p>
                <div className={styles["div-sign"]}>
                  <DefaultButton className={styles["btn-sign"]} type="submit">
                    <span>Sign Up</span>
                  </DefaultButton>
                </div>
                <p className={styles["go-signup"]} onClick={props.handleSwitch}>
                  Already have an account? Sign In
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
