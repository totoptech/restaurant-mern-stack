import React, {useState} from "react";
import { withRouter } from "react-router";
import clsx from "clsx";
import PropTypes from "prop-types";
import { DropdownItem } from "reactstrap";
import { makeStyles } from "@material-ui/core/styles";
import {connect} from 'react-redux';

const useStyles = makeStyles(theme => ({
  menuItem: {
    border: "0",
    background: "transparent",
    padding: "10px 20px",
    "&:hover": {
      backgroundColor: "#ebfaf9 !important",
      color: "#00A697 !important"
    },
    "&:active": {
      backgroundColor: "#c7fbf7 !important"
    },
  },
  rounded: {
    borderRadius: "120px"
  }
}));

function DropdownMenuItem(props) {
  const classes = useStyles();
  const { rounded, children, to, action, router, mybranch, branch, order_bag, handleOpen, ...others } = props;


  return (
    <DropdownItem
      className={clsx(classes.menuItem, (rounded === true ? classes.rounded : ""))}
      onClick={() => {
          if(mybranch !== undefined && (mybranch.name !== branch.name && (order_bag.length >= 1)))
            handleOpen(mybranch);
        else{
          if (action !== undefined)
            action();
          router.push(to);
          console.log("DROPDOWNITEM");
        }
      }}
      {...others}
    >
      {children}
      
    </DropdownItem>
  );
}

DropdownMenuItem.propTypes = {
  rounded: PropTypes.bool,
  to: PropTypes.string.isRequired
};

function mapStateToProps(state) {
  return {
    branch: state.app.branch,
    business: state.home.business,
    order_bag: state.order_bag,
  };
}

export default withRouter(connect(mapStateToProps)(DropdownMenuItem));