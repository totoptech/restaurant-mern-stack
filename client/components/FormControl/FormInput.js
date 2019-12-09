import React from "react";
import PropTypes from "prop-types";
import { Input, InputLabel, FormControl } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  formcontrol: {
    width: "100%",
  },
  underline: {
    "&:before": {
      borderBottom: "1px solid #8F9091",
      opacity: 0.2
    },
    "&:after": {
      borderBottom: "1px solid #8F9091"
    },
    "&:hover:not(.Mui-disabled):before": {
      borderBottom: "1px solid #8F9091",
      opacity: 0.5
    }
  },
  formlabel: {
    color: "white !important",
    opacity: 0.3,
    fontSize: '14px',
  },
  color: {
    color: "white",
    opacity: 0.5
  },
  underline_inverted: {
    "&:before": {
      borderBottom: "1px solid #8F9091",
      opacity: 0.2
    },
    "&:after": {
      borderBottom: "1px solid #8F9091"
    },
    "&:hover:not(.Mui-disabled):before": {
      borderBottom: "1px solid #8F9091",
      opacity: 0.5
    }
  },
  formlabel_inverted: {
    color: "black !important",
    opacity: 0.3
  },
  color_inverted: {
    color: "black",
    opacity: 1
  }
}));

function FormInput(props) {
  const classes = useStyles();

  const { id, label, inverted, shrink, ...others } = props;

  return (
    <FormControl className={classes.formcontrol}>
      <InputLabel
        htmlFor={props.id}
        classes={{
          root: !inverted ? classes.formlabel : classes.formlabel_inverted,
        }}
        shrink
      >
        {props.label}
      </InputLabel>
      <Input
        classes={{
          underline: !inverted ? classes.underline : classes.underline_inverted,
          input: !inverted ? classes.color : classes.color_inverted
        }}
        id={props.id}
        {...others}
      />
    </FormControl>
  );
}

FormInput.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  inverted: PropTypes.bool
};

export default FormInput;
