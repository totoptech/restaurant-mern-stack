import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";
import { FormattedMessage } from "react-intl";
import { Card, CardContent } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import { plus } from "../../../../../components/icons/icons";

const useStyles = makeStyles(theme => ({
  card: {
    padding: "22px",
    borderRadius: "12px",
    cursor: "pointer",
    margin: "24px 0px",
    [theme.breakpoints.down("sm")]: {
      padding: "16px",
      margin: "12px 0px"
    }
  },
  cardContent: {
    display: "flex",
    alignItems: "stretch",
    justifyContent: "space-between",
    position: "relative"
  },
  image: {
    width: "100px",
    height: "100px",
    minWidth: "100px",
    minHeight: "100px",
    minWidth: "100px",
    minHeight: "100px",
    borderRadius: "4px",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center center",
    backgroundSize: "cover",
    boxShadow: "1px 1px 2px 1px rgba(0, 0, 0, 0.2)",
    justifyContent: "flex-end",
    [theme.breakpoints.down("sm")]: {
      width: "80px",
      height: "80px",
      minWidth: "80px",
      minHeight: "80px",
      minWidth: "80px",
      minHeight: "80px"
    }
  },
  plus: {
    marginTop: "-6px",
    marginLeft: "-6px",
    position: "absolute",
    top: "0px",
    left: "0px",
    opacity: "0.6",
    "&:hover": {
      opacity: "0.5"
    },
    "&:active": {
      opacity: "0.3"
    }
  },
  info: {
    flexGrow: 1,
    marginLeft: "40px",
    marginRight: "24px",
    fontSize: "16px",
    lineHeight: "19px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between"
  },
  title: {
    color: "#202124"
  },
  command: {
    color: "black",
    margin: "8px 0px",
    fontSize: "14px",
    lineHeight: "20px",
    maxWidth: "330px",
    opacity: 0.6
  },
  price: {
    color: "#00A697",
    justifyContent: "flex-end"
  }
}));

function ProductListItem(props) {
  const classes = useStyles();
  return (
    <Card className={classes.card} onClick={props.onPlus}>
      <div className={classes.cardContent}>
        <div className={classes.plus}>{plus()}</div>
        <div className={classes.info}>
          <div>
            <div className={classes.title}>{props.product.name}</div>
            <div className={classes.command}>
              {props.product.description && (props.product.description.length > 67
                ? props.product.description.substr(0, 67) + "..."
                : props.product.description)}
            </div>
          </div>
          <div className={classes.price}>
            {props.product.price}
            {props.business.currency.symbol}
          </div>
        </div>
        <div
          className={classes.image}
          style={{ backgroundImage: "url(" + props.product.imageUrl + ")" }}
        />
      </div>
    </Card>
  );
}

ProductListItem.propTypes = {
  product: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string
  }).isRequired,
  business: PropTypes.shape({
    currency: PropTypes.shape({
      symbol: PropTypes.string.isRequired,
      code: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  onPlus: PropTypes.func.isRequired
};

export default ProductListItem;
