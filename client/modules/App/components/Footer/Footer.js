// import { FormattedMessage } from 'react-intl';
import React from "react";
import clsx from "clsx";
import {
  Button,
  IconButton,
  withStyles,
  InputAdornment
} from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";

// import Components
import FormInput from "../../../../components/FormControl/FormInput";

// Import Style
import styles from "./Footer.css";
import { instagram, facebook } from "../../../../components/icons/icons";

const SocialIconButton = withStyles(theme => ({
  root: {
    backgroundColor: "transparent",
    "&:hover": {
      backgroundColor: grey[700]
    }
  }
}))(IconButton);

const useStyles = makeStyles(theme => ({
  innerButton: {
    marginBottom: "15px",
    background: "#646464",
    opacity: "0.5",
    fontSize: "12px",
    borderRadius: "4px",
    padding: "5px 15px",
    textTransform: "capitalize",
    color: "#ffffff",
    "&:hover": {
      backgroundColor: "#848484 !important"
    }
  }
}));

export function Footer() {
  const classes = useStyles();

  return (
    <div className={styles["footer-container"]}>
      <div className={styles["footer"]}>
        <div className={styles["footer-menu"]}>
          <a href="http://instagram.com" target="_blank">
            <SocialIconButton aria-label="Instagram">
              {instagram()}
            </SocialIconButton>
          </a>
          <a href="http://facebook.com" target="_blank">
            <SocialIconButton aria-label="Facebook">
              {facebook()}
            </SocialIconButton>
          </a>
          <a href="/#" className={styles.link}>
            Terms and Conditions
          </a>
          <a href="/#" className={styles.link}>
            About Us
          </a>
          <a href="/#" className={styles.link}>
            Contact
          </a>
        </div>
        <div className={styles["footer-subcribe"]}>
          <span>Newsletter</span>
          <FormInput
            id="subcribe_email"
            label="Enter Email..."
            type="email"
            endAdornment={
              <InputAdornment position="end">
                <Button className={clsx(classes.innerButton)}>Subcribe</Button>
              </InputAdornment>
            }
          />
        </div>
      </div>
    </div>
  );
}

export default Footer;
