import React, { Component } from "react";
import { withRouter } from "react-router";
import clsx from "clsx";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Helmet from "react-helmet";

import { Modal } from "@material-ui/core";
// Import Actions
import { add_order, delete_order } from "../../HomeActions";
import CookieRead from "../../../../util/cookieRead";
// Import Components
import OrderCard from "../../components/OrderCard/OrderCard";
import ProductList from "../../components/ProductList/ProductList";
import AddOrder from "../../components/AddOrder/AddOrder";
import CategoryMenu from "../../components/CategoryMenu/CategoryMenu";
import { info } from "../../../../components/icons/icons";

// Import Style
import styles from "./ProductListPage.css";
import { close_dlg } from "../../../../components/icons/icons";

const categories = ["Popular Meals", "Breads", "Drink"];

class ProductListPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      opened_product: {},
      category: 0,
      show: false,
      err_show: false
    };
    this.Ref = [];
  }
  //OrderCard component handler
  handleShow = () => {
    this.setState({ show: true });
  };

  handleHide = () => {
    this.setState({ show: false });
  };

  handleNext = () => {
    console.log("next");
    const token = CookieRead("token");
    if (token === "" || token === undefined) {
      this.setState({ err_show: true });
    } else this.props.router.push("/checkout");
  };
  handleErrDlgClose = () => {
    this.setState({ err_show: false });
  };
  handleDelete = order_id => {
    console.log("delete " + order_id);
    this.props.dispatch(delete_order(order_id));
  };

  //AddOrder component handler
  handleAddOrder = order => {
    console.log("add", order);
    this.props.dispatch(add_order(order));
  };

  handleOpen = product => {
    this.setState({ open: true, opened_product: product });
  };

  handleClose = () => {
    this.setState({ open: false, opened_product: {} });
  };

  //CategoryMenu component handler
  handleCategory = c_i => {
    // this.setState({ category: cata });
    // console.log(this.Ref[cata], cata);
    window.scrollTo({left: 0, top: this.Ref[categories[c_i]].offsetTop - 180, behavior: 'smooth'});
  };

  getRef = (ref, index) => {
    this.Ref[index] = ref;
  };

  render() {
    const { open, show, category, opened_product } = this.state;
    const {
      business,
      branch,
      products,
      order_bag,
      sub_total,
      addons
    } = this.props;

    return (
      <React.Fragment>
        <Helmet title={"Products"} />
        <div className={styles["container-head"]} />
        <div className={styles["container-body"]}>
          <div className={clsx(styles["header"], styles["wrapper"])}>
            <div
              className={styles["logo"]}
              style={{
                backgroundImage: "url(" + business.logoUrl + ")"
              }}
            />
            <div className={styles["info"]}>
              <div className={styles["title"]}>
                {branch.name || business.name}
                <button className={styles["moreinfo"]}>{info()}</button>
              </div>
              <div className={styles["state"]}>
                {/* opening hours , away time */}
                <div>
                  <strong>Open</strong>
                </div>
                <div> ∙ {branch.address || business.name}, </div>
                <div>450min away</div>
              </div>
            </div>
          </div>
          <div className={styles["category-menu"]}>
            <CategoryMenu
              categories={categories}
              onCategoryChange={this.handleCategory}
            />
          </div>
          <div className={clsx(styles["content"], styles["wrapper"])}>
            <div className={styles["products"]}>
              {categories.map((cat, index) => {
                return (
                  <ProductList
                    products={products.filter(product => {
                      // if (cat === 'Popular Meals') return false;
                      let a = false;
                      // let b = false;
                      product.categories.forEach((pcat, index) => {
                        if (pcat === cat) a = true;
                        // if (pcat === categories[category] || categories[category] === 'All Products') b = true;
                      });
                      // if (a && b) return true;
                      if (a) return true;
                      return false;
                    })}
                    getRef={this.getRef}
                    index={cat}
                    business={business}
                    groupname={cat}
                    handleOpen={this.handleOpen}
                    key={index}
                  />
                );
              })}
            </div>
            <OrderCard
              className={styles["order"]}
              ordered={order_bag}
              business={business}
              sub_total={sub_total}
              onDelete={this.handleDelete}
              onNext={this.handleNext}
              onClose={this.handleHide}
              onOpen={this.handleShow}
              show={show}
            />
          </div>
        </div>
        <AddOrder
          open={open}
          opened_product={opened_product}
          business={business}
          addons={addons}
          onAdd={this.handleAddOrder}
          onClose={this.handleClose}
        />
        <Modal
          open={this.state.err_show}
          onClose={this.handleErrDlgClose}
          aria-labelledby="modal-errcheckout">
            <div className={styles['modal-container']}>
              
              <div onClick={this.handleErrDlgClose} className={styles["btn-close"]}>
                {close_dlg()}
              </div>
              <p>
                Warning
              </p>
              <p>
                You should log in to check out First!
              </p>
          </div>
        </Modal>
      </React.Fragment>
    );
  }
}

// Retrieve data from store as props
function mapStateToProps(state, props) {
  let sub_total = 0;
  state.order_bag.forEach(order => {
    sub_total += order.price;
  });

  return {
    branch: state.app.branch,
    products: state.home.products.products,
    addons: state.home.products.addons,
    order_bag: state.order_bag,
    sub_total: sub_total,
    business: state.home.business
  };
}

ProductListPage.propTypes = {
  branch: PropTypes.object.isRequired,
  business: PropTypes.object.isRequired,
  products: PropTypes.array.isRequired,
  order_bag: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired
};

export default withRouter(connect(mapStateToProps)(ProductListPage));
