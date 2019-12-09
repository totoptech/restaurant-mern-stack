import { callApi } from "../../util/apiCaller";
import { loading_start, loading_end } from "../App/AppActions";
import { browserHistory } from "react-router";

export const GET_ORDERED = "GET_ORDERED";
export const CLEAR_ORDERED = "CLEAR_ORDERED";

export const ordered_product = data => (dispatch, getState) => {
  dispatch(loading_start());
  return callApi("user/test-order", "post", data).then(res => {
    if (res.status === "success") {
      dispatch({
        type: GET_ORDERED,
        data: generateOrdered(
          res.data.lines[0].items,
          getState().home.products,
          data.delivery_address.street.location,
          getState().app.branch
        )
      });
      // dispatch(add_ordered(res.data, data.phoneNumber, data.delivery_address.street.location));
      browserHistory.push("/orderstatus");
    } else {
      console.log(res);
      dispatch({ type: CLEAR_ORDERED });
    }
    dispatch(loading_end());
  });
};

// order ID: 7c2aed23-785f-4576-92d1-7ca18e66c326
export const get_ordered = (id, phone, latlng, branchId) => (
  dispatch,
  getState
) => {
  dispatch(loading_start());
  return callApi(`user/get-ordered`, "post", {
    id: id,
    phoneNumber: phone
  }).then(res => {
    if (res.status === "success") {
      dispatch({
        type: GET_ORDERED,
        data: generateOrdered(
          res.data.lines[0].items,
          getState().home.products,
          latlng,
          getState().home.branches.filter(b => b.id === branchId)[0]
        )
      });
      browserHistory.push("/orderstatus");
    } else {
      console.log(res);
      dispatch({ type: CLEAR_ORDERED });
    }
    dispatch(loading_end());
  });
};

const generateOrdered = (ordered, products, latlng, branch) => {
  var order_bag = [];
  var price = 0;
  var addon = new Array();

  ordered.forEach(element => {
    const product = products.addons.filter(
      pr => pr.id === element.productId
    )[0];
    console.log(element);
    if (product.related.length > 0) {
      const hostId = product.related.filter(
        prd => prd.rel === "variant-host"
      )[0].id;
      const host = products.products.filter(r => r.id === hostId)[0];
      const rel = host.related.filter(r => r.id === element.productId)[0];
      var vName = "";
      Object.values(rel.optionValues).forEach(v_name => {
        vName += v_name + ", ";
      });
      vName = vName.substr(0, vName.length - 2);
      price += element.unitPrice * element.quantity;
      order_bag.push({
        baseId: hostId,
        baseName: host.name,
        variantId: element.productId,
        variantName: vName,
        count: element.quantity,
        price: price,
        addons: addon
      });

      price = 0;
      addon = new Array();
    } else {
      price += element.unitPrice * element.quantity;
      addon.push({
        id: element.productId,
        name: element.label,
        price: element.unitPrice
      });
    }
  });

  return {
    order_bag: order_bag,
    location: latlng,
    branchLoc: {
      lat: branch.latitude,
      lng: branch.longitude
    }
  };
};
