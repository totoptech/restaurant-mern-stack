import React from "react";
import PropTypes from "prop-types";

class CategoryMenuItem extends React.Component {
    componentDidMount() {
        this.props.getRef(this.block, this.props.i);
    }

    render() {
        const {i, getRef, ...others} = this.props;

        return (
          <li ref={n => this.block = n} {...others}>
              {this.props.children}
          </li>
        );
    } 
}

CategoryMenuItem.protoTypes = {
    getRef: PropTypes.func.isRequired,
    i: PropTypes.number.isRequired,
}

export default CategoryMenuItem;
