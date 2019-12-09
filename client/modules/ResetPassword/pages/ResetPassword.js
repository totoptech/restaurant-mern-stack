import React, {useState, useEffect} from 'react'
import styles from './ResetPassword.css'
import Axios from 'axios';
import DefaultButton from "../../../components/DefaultButton";
import { TextField} from "@material-ui/core";
import clsx from "clsx";
import { connect } from "react-redux";
import { SignIn } from '../../Profile/ProfileActions';
import { withRouter, Link } from "react-router";

import { withStyles, createStyles } from "@material-ui/core";

const useStyles = theme => createStyles({
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
      maxWidth: 500,
      marginTop: "15px",
      display: "block",
      "& fieldset:focus": {
        borderColor: "#f00!important"
      }
    },

  });

class ResetPassword extends React.Component
{

    constructor(props){
      super(props);
      console.log("I am token", props);
      this.state = {
        password:'',
        cpassword:'',
        err:false,
        bodyerr:false,
        phoneNumber:''
      }
      
    }
    componentDidMount(){
      Axios({
        method: 'POST',
        url: '/api/user/resetPassword',
        headers: {
            'Content-Type': 'application/json'
        },
        data:{
            resetPasswordToken: this.props.params.token
        }
      })
      .then(res => {
          console.log(res);
          if(res.data.phoneNumber)
              this.setState({phoneNumber:res.data.phoneNumber});
          else
              this.setState({bodyerr:true});
      })
    }
    
    onUpdate = (event) => {
      event.preventDefault();
      const {password, cpassword, phoneNumber} = this.state;
      if(password !== cpassword)
          this.setState({err:true});
      else
      {
          Axios({
              method: 'POST',
              url: '/api/user/updatePassword',
              headers: {
                  'Content-Type': 'application/json'
              },
              data:{
                  phoneNumber:phoneNumber,
                  password:password
              }
          })
          .then(res => {
              if(res.data='success')
            {
              Axios({
                  method: "POST",
                  url: "/api/user/login",
                  headers: {
                    "Content-Type": "application/json"
                  },
                  data: {
                    phoneNumber: phoneNumber,
                    password: password
                  }
                }).then(res => {
                  if (res.data.token === undefined || res.data.token === "")
                    setErrMsg(true);
                  else {
                    this.props.router.push('/');
                    console.log(res.data.token, res.data.firstname, phoneNumber, password);
                    this.props.dispatch(SignIn({
                        token: res.data.token,
                        firstname: res.data.firstname,
                        phonenumber: phoneNumber,
                        password,
                      })
                    )}
                });
              }
          })
      }
    }
    onChangePassword = (e) =>{
      this.setState({password:e.target.value})
    }
    onChangeCPassword = (e) =>{
      this.setState({cpassword:e.target.value})
    }

    render(){
      const {err, bodyerr, password, cpassword} = this.state;
      const {classes} = this.props;
      return(
            <form onSubmit={this.onUpdate} className={clsx(styles['body-container'], classes.form)}>
              {bodyerr === true && 
                  <div className={styles['ops-container']}>
                      <p>OPS!</p>
                      <p>Password reset link is invalid or has expired</p>
                  </div>
              }
              {bodyerr === false && 
              <div>
                  <p className={styles['title']}>Reset Password</p>
                  <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type="password"
                      id="password"
                      className={classes.textField}
                      value={password}
                      onChange={this.onChangePassword}
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
                      className={classes.textField}
                      value={cpassword}
                      onChange={this.onChangeCPassword}
                  />
                  {err === true && <p className={styles['err-msg']}>Confirm Password doesn't match</p>}
                  <DefaultButton className={styles["btn-send"]} type='submit'>
                      <span>Send</span>
                  </DefaultButton>
              </div>
              }
          </form>
      )
    }
}

export default withRouter(withStyles(useStyles)(connect(null,null)(ResetPassword)));