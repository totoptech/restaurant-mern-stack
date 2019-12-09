import React from "react";
import { withStyles, Button } from "@material-ui/core";

const StyledButton = withStyles(theme => ({
  root: {
    padding: "18px 24px",
    fontSize: "20px",
    width: "100%",
    backgroundColor: "#00cabe !important",
    color: "white",
    borderRadius: "8px",
    textTransform: "none !important",
  }
}))(Button);

function DefaultButton(props) {
  const { children, ...other } = props;

  return <StyledButton {...other}>{children}</StyledButton>;
}

export default DefaultButton;
