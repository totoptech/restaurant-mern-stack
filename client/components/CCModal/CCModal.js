import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { Modal, InputAdornment } from "@material-ui/core";
import PaymentIcon from "react-payment-icons";
import "react-credit-cards/es/styles-compiled.css";
import Card from "react-credit-cards";

import {
  formatCreditCardNumber,
  formatCVC,
  formatExpirationDate,
  formatFormData
} from "../CCards/utils";

//import Component
import { close_dlg } from "../icons/icons";
import FormInput from "../FormControl/FormInput";

//import Styles
import styles from "./CCModal.css";
import DefaultButton from "../DefaultButton";

const err_msg = [
  'Unknown Credit Card',
  'Creadit Card Number is Invalid'
]
var valid = require('card-validator');
class CCModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initial_state();
  }

  initial_state = () => {
    return {
      number: "",
      name: "",
      expiry: "",
      cvv: "",
      issuer: "",
      focused: "",
      formData: null,
      err_card: -1,
      err_expiry: false,
      err_cvv: false,
      isvalid_card:'',
    };
  };

  componentWillReceiveProps(nextProps) {
    if(nextProps.editdata != null) {
      this.setState({
        ...this.initial_state(),
        ...nextProps.editdata,
      });
    } else {
      this.setState(this.initial_state());
    }
  }

  handleCallback = ( {issuer} , isValid) => {
    this.setState({issuer, isvalid_card:isValid});
    
  };

  handleInputFocus = ({ target }) => {
    this.setState({
      focused: target.name
    });
  };

  handleInputChange = ({ target }) => {
    if (target.name === "number") {
      target.value = formatCreditCardNumber(target.value);
    } else if (target.name === "expiry") {
      target.value = formatExpirationDate(target.value);
    } else if (target.name === "cvv") {
      target.value = formatCVC(target.value, number);
    }

    this.setState({ [target.name]: target.value });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { issuer,isvalid_card, expiry, cvv } = this.state;
    var err_card, err_expiry, err_cvv;

    if(issuer === 'unknown')
      err_card = 0;
    else if (isvalid_card === false)
      err_card = 1;
    else
      err_card = -1;
    if(!valid.expirationDate(expiry).isValid)
      err_expiry = true;
    if(!valid.cvv(cvv).isValid)
      err_cvv = true;
    this.setState({err_card, err_expiry, err_cvv})
      /**
      Visa Card number:   4305996444435906
      Name:               Michael Brown
      Adress:             Laurel Drive 25
      Country:            Tokelau
      CVV:                169
      Limit:              2027$
      Exp:                07/20
      */
    if(err_card === -1 && !err_expiry && !err_cvv){
      const formData = [...e.target.elements]
        .filter(d => d.name)
        .reduce((acc, d) => {
          acc[d.name] = d.value;
          return acc;
        }, {});
      this.props.onSubmit(formData);
      this.form.reset();
    }
  };

  render() {
    const { open, editdata, onClose } = this.props;
    const { name, number, expiry, cvv, focused, issuer,err_card, err_expiry, err_cvv } = this.state;

    return (
      <Modal open={open} onClose={onClose} aria-labelledby="modal-title">
        <div className={styles["PayModal"]}>
          <div className={styles["captain"]} id="modal-title">
            <div className="mx-auto">Credit Card Details</div>
            <div onClick={onClose} style={{ cursor: "pointer" }}>
              {close_dlg()}
            </div>
          </div>
          <div
            className="d-flex align-items-stretch flex-column"
          >
            <div className="App-payment">
              <Card
                number={number}
                name={name}
                expiry={expiry}
                cvc={cvv}
                focused={focused}
                callback={this.handleCallback}
              />
              <form ref={c => (this.form = c)} onSubmit={this.handleSubmit} className="mt-3">
                <div className="form-group">
                  <FormInput
                    fullWidth
                    type="tel"
                    id="number"
                    name="number"
                    className="mb-3"
                    pattern="[\d| ]{16,22}"
                    required
                    readOnly = { (editdata ? true : false) }
                    value={number}
                    onChange={this.handleInputChange}
                    onFocus={this.handleInputFocus}
                    inverted
                    label="Credit Card Number"
                    endAdornment={
                      <InputAdornment position="end">
                        <PaymentIcon
                          id={issuer}
                          style={{ margin: 10, width: 24 }}
                        />
                      </InputAdornment>
                    }
                  />
                  {err_card >= 0 && <p className={styles['err_card']}>{err_msg[err_card]}</p>}
                </div>
                <div className="form-group">
                  <FormInput
                    fullWidth
                    inverted
                    type="text"
                    name="name"
                    id="name"
                    value={name}
                    className="mb-3"
                    required
                    onChange={this.handleInputChange}
                    onFocus={this.handleInputFocus}
                    label="Holder Name"
                  />
                </div>
                <div className="row">
                  <div className="col-6">
                    <FormInput
                      fullWidth
                      inverted
                      type="text"
                      id="expiry"
                      name="expiry"
                      className="mb-3"
                      pattern="\d\d/\d\d"
                      required
                      value={expiry}
                      onChange={this.handleInputChange}
                      onFocus={this.handleInputFocus}
                      label="Valid Date"
                    />
                    {err_expiry && <p className={styles['err_card']}>Invalid Date</p>}

                  </div>
                  <div className="col-6">
                    <FormInput
                      fullWidth
                      inverted
                      type="text"
                      id="cvv"
                      name="cvv"
                      readOnly = { (editdata ? true : false) }
                      className="mb-3"
                      pattern="\d{3,4}"
                      required
                      value={cvv}
                      onChange={this.handleInputChange}
                      onFocus={this.handleInputFocus}
                      label="CVV Code"
                    />
                    {err_cvv && <p className={styles['err_card']}>Invalid CVV Code</p>}

                  </div>
                </div>
                <input type="hidden" name="issuer" value={issuer} />
                
                <div className="mt-auto">
                  <DefaultButton type='submit'>
                    Add Card
                  </DefaultButton>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

CCModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default CCModal;
