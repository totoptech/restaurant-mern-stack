/**
 * Root Component
 */
import React from "react";
import PropTypes from "prop-types";
import { Provider } from "react-redux";
import { Router, browserHistory } from "react-router";
import IntlWrapper from "./modules/Intl/IntlWrapper";
import { StripeProvider } from "react-stripe-elements";

// Import Routes
import routes from "./routes";

// Base stylesheet
require("./main.css");

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {stripe: null};
  }
  componentDidMount() {
    // Create Stripe instance in componentDidMount
    // (componentDidMount only fires in browser/DOM environment)
    this.setState({stripe: window.Stripe(process.env.NODE_ENV === "development" ? 'pk_test_R9qcFPJ4H724V3dxDsbUShn700UyiGOU3B' :'pk_test_Tx747uO3rsyhHXYmKkbkOn6h')});
  }
  render() {
    return (
      <Provider store={this.props.store}>
        <IntlWrapper>
          <StripeProvider stripe={this.state.stripe}>
            <Router key={module.hot && new Date()} history={browserHistory}>
              {routes}
            </Router>
          </StripeProvider>
        </IntlWrapper>
      </Provider>
    );
  }
}

App.propTypes = {
  store: PropTypes.object.isRequired
};
