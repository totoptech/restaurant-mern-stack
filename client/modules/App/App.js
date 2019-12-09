import React, { Component } from "react";
import Helmet from "react-helmet";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import clsx from "clsx";
import { ThemeProvider } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core";
import { css } from "@emotion/core";
import SyncLoader from "react-spinners/SyncLoader";
import { Elements } from "react-stripe-elements";

// Import Components
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

// Import Actions
import {
  fetch_branches,
  fetch_business,
  fetch_products
} from "../Home/HomeActions";

// Import Style
import styles from "./App.css";
import { clearBranch } from "./AppActions";

const override = css`
  display: block;
  position: fixed;
  top: 45vh;
  left: calc(50vw - 50px);
  right: 0;
  z-index: 3001;
`;

let DevTools;
if (process.env.NODE_ENV === "development") {
  // eslint-disable-next-line global-require
  DevTools = require("./components/DevTools").default;
}

let theme = createMuiTheme({
  breakpoints: {
    values: {
      xs: 386,
      sm: 576,
      md: 768,
      lg: 992,
      xl: 1440
    }
  }
});

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMounted: false
    };
  }

  componentDidMount() {
    if (this.state.isMounted === false) {
      this.props.dispatch(fetch_branches());
      this.props.dispatch(fetch_business());
      this.props.dispatch(fetch_products());
      this.props.dispatch(clearBranch());
    }
    this.setState({ isMounted: true });
  }

  render() {
    const { isMounted } = this.state;
    const { business, loading } = this.props;

    return (
      <ThemeProvider theme={theme}>
        {isMounted &&
          !window.devToolsExtension &&
          process.env.NODE_ENV === "development" && <DevTools />}
        {isMounted && (
          <React.Fragment>
            <Helmet
              title="Welcome"
              titleTemplate={`${business.name} - %s`}
              meta={[
                { charset: "utf-8" },
                {
                  "http-equiv": "X-UA-Compatible",
                  content: "IE=edge"
                },
                {
                  name: "viewport",
                  content: "width=device-width, initial-scale=1"
                }
              ]}
              link={[
                {
                  rel: "shortcut icon",
                  type: "image/png",
                  href: business.logoUrl
                }
              ]}
            />
            <div
              className={clsx(
                styles["container"],
                loading ? styles["loading"] : ""
              )}
            >
              <SyncLoader
                css={override}
                size={25}
                color={"#23c6c8"}
                margin={"10px"}
                loading={loading}
              />
              <Header />
              <div className={styles["container-body"]}>
                <Elements>
                  {this.props.children}
                </Elements>
              </div>
              <Footer />
            </div>
          </React.Fragment>
        )}
      </ThemeProvider>
    );
  }
}

// Actions required to provide data for this component to render in server side.
App.need = [
  () => {
    return fetch_branches();
  },
  () => {
    return fetch_business();
  },
  () => {
    return fetch_products();
  }
];

App.propTypes = {
  children: PropTypes.element.isRequired,
  intl: PropTypes.object.isRequired,
  business: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
};

// Retrieve data from store as props
function mapStateToProps(store) {
  return {
    intl: store.intl,
    business: store.home.business,
    loading: store.app.loading
  };
}

export default connect(mapStateToProps)(App);
