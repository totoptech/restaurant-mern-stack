import React, { Component } from "react";
import PropTypes from "prop-types";
import Helmet from "react-helmet";
import { connect } from "react-redux";
import { withRouter } from "react-router";

// Import Components
import BranchList from "../../components/BranchList/BranchList";

// Import Actions
import {
  fetch_business,
  fetch_branches,
  fetch_products
} from "../../HomeActions";
import { setBranch } from "../../../App/AppActions";

// Import Style
import styles from "./BranchesListPage.css";

class BranchesListPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMounted: false
    };
  }

  handleNext = branch => {
    this.props.dispatch(setBranch(branch));
    this.props.router.push("/products");
  };

  componentDidMount() {
    if (this.props.branches.length === 0) {
      this.props.router.push("/products");
    }
    // this.props.dispatch();
    this.setState({ isMounted: true });
  }

  render() {
    const { business, branches } = this.props;
    const { isMounted } = this.state;

    return (
      <div>
        {isMounted && (
          <div>
            <Helmet title={`Branches`} />
            <div className={styles.containerHead} />
            <div className={styles.containerBody}>
              <div className={styles.subheader}>
                <div
                  className={styles.logo}
                  style={{
                    backgroundImage: "url(" + business.logoUrl + ")"
                  }}
                />
                <h3 className={styles.logoHeader}>Choose your Bakery</h3>
              </div>
              <div className={styles.subbody}>
                <BranchList handleNext={this.handleNext} branches={branches} />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

BranchesListPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  business: PropTypes.shape({
    id: PropTypes.string.isRequired,
    created: PropTypes.string.isRequired,
    modified: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    currency: PropTypes.shape({
      code: PropTypes.string.isRequired,
      symbol: PropTypes.string.isRequired
    }).isRequired,
    // legalId: PropTypes.object,
    countryCode: PropTypes.string.isRequired,
    logoUrl: PropTypes.string.isRequired
  }).isRequired,
  branches: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      address: PropTypes.string.isRequired,
      longitude: PropTypes.number.isRequired,
      latitude: PropTypes.number.isRequired,
      openingHours: PropTypes.array.isRequired,
      phone: PropTypes.string,
      photoUrl: PropTypes.string.isRequired,
      orderProviderId: PropTypes.object,
      canAcceptOrders: PropTypes.bool
    })
  ).isRequired
};

BranchesListPage.contextTypes = {
  router: PropTypes.object
};

// Retrieve data from store as props
function mapStateToProps(state) {
  return {
    business: state.home.business,
    branches: state.home.branches,
  };
}

export default withRouter(connect(mapStateToProps)(BranchesListPage));
