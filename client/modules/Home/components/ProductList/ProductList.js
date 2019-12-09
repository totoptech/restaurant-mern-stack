import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";

// Import Components
import ProductListItem from "./ProductListItem/ProductListItem";

const useStyles = makeStyles(theme => ({
  heading: {
    fontSize: "20px",
    lineHeight: "24px",
    marginTop: "40px"
  }
}));

function ProductList(props) {
  const classes = useStyles();

  if (props.products === null || props.products.length === 0) return "";

  return (
    <div ref={r => props.getRef(r, props.index)}>
      <h3 className={classes.heading}>{props.groupname}</h3>
      {props.products.map((product, index) => (
        <ProductListItem
          product={product}
          business={props.business}
          key={index}
          onPlus={() => props.handleOpen(product)}
        />
      ))}
    </div>
  );
}

ProductList.propTypes = {
  products: PropTypes.array,
  business: PropTypes.object,
  handleOpen: PropTypes.func.isRequired,
  getRef: PropTypes.func.isRequired,
  index: PropTypes.string.isRequired,
};

export default ProductList;
