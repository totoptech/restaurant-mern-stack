import { callApi } from "../../util/apiCaller";
import { loading_start, loading_end } from "../App/AppActions";

// Export Constants
export const FETCH_BRANCHES = "FETCH_BRANCHES";
export const FETCH_PRODUCTS = "FETCH_PRODUCTS";
export const FETCH_PRODUCT = "FETCH_PRODUCT";
export const FETCH_BUSINESS = "FETCH_BUSINESS";
export const ADD_ORDER = "ADD_ORDER";
export const DELETE_ORDER = "DELETE_ORDER";
export const ORDER_BAG_CLEAR = "ORDER_BAG_CLEAR";
export const CHANGE_DELIVERY_TIME = "CHANGE_DELIVERY_TIME";
export const CHANGE_DELIVERY_TYPE = "CHANGE_DELIVERY_TYPE";

export const DELIVERY = true;
export const PICKUP = false;

export const fetch_business = () => dispatch => {
  dispatch(loading_start());
  return callApi("post/backoffice", "post", { params: `business` }).then(
    res => {
      if (typeof res.id !== "undefined")
        dispatch({
          type: FETCH_BUSINESS,
          data: res
        });
        dispatch(loading_end());
    }
  );
};

export const fetch_branches = () => dispatch => {
  dispatch(loading_start());
  return callApi("post/backoffice", "post", { params: `branches` }).then(
    res => {
      if (Array.isArray(res))
        dispatch({
          type: FETCH_BRANCHES,
          data: res
        });
      dispatch(loading_end());
    }
  );
};

export const fetch_products = (branchId = null) => dispatch => {
  dispatch(loading_start());
  var str = "products?archived=0&_limit=99999";
  if (branchId != null)
    str += `&branchId=${branchId}&_sort=category.sequence&includeInventory=true&useExternalIds=true`;
  return callApi("post/backoffice", "post", { params: str }).then(res => {
    if (Array.isArray(res)) {
      let products = res.filter(
        p =>
          p.type === "variant-host" ||
          (p.type === "product" &&
            p.related.length === 0 &&
            p.categories.length > 0)
      );
      let addons = res.filter(p => p.type === "product");
      dispatch({
        type: FETCH_PRODUCTS,
        data: {
          products,
          addons
        }
      });
    }
    dispatch(loading_end());
  });
};

export const fetch_product = id => dispatch => {
  dispatch(loading_start());
  return callApi("post/backoffice", "post", {
    params: `products?id=${id}`
  }).then(res => {
    if (Array.isArray(res))
      dispatch({
        type: FETCH_PRODUCT,
        data: res
      });
    dispatch(loading_end());
  });
};

export const add_order = order => {
  return {
    type: ADD_ORDER,
    data: order
  };
};

export const delete_order = id => {
  return {
    type: DELETE_ORDER,
    data: id
  };
};

export const bag_clear = () => dispatch => {
  dispatch({type: ORDER_BAG_CLEAR});
};

export const change_delivery_type = type => {
  return {
    type: CHANGE_DELIVERY_TYPE,
    data: type
  };
};

export const change_delivery_time = data => {
  return {
    type: CHANGE_DELIVERY_TIME,
    data: data
  };
};
