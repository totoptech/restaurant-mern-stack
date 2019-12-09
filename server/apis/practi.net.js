const axios = require("axios");

var paractiBaseURI = "https://api-stage.practi.net/v1/auth/sms/";

export function paractiBaseApi(body, callback) {
  axios.defaults.baseURL = paractiBaseURI;
  axios.defaults.headers.post["Content-Type"] = "application/json";
  axios.defaults.headers.post["Authorization"] =
    "Bearer f9ab81ef-98a0-41dd-aaa8-f4afe9b21cee";
  // axios.defaults.headers.post['X-BusinessId'] = '4604'

  let request = {
    url: body.uri,
    method: "POST",
    data: body.data,
    headers: {
      "X-BusinessId": "4604"
    }
  };

  axios(request).then(
    res => {
      callback(res);
    },
    err => {
      callback(err);
    }
  );
}

export function practiAuth(req, callback) {
  var body = {
    uri: "request",
    data: req
  };

  console.log("verificatin body", body);
  paractiBaseApi(body, res => callback(res));
}

export function practiConfirm(req, callback) {
  var body = {
    uri: "confirm",
    data: req
  };

  paractiBaseApi(body, res => {
    callback(res);
  });
}

export function saveInfo(req, callback) {
  //save data to paracti.net db
  var body = {
    uri: "customer",
    data: req
  };

  paractiBaseApi(body, res => callback(res));
}

export function makeOrder(params, { token }, callback) {
  axios.post(
      "https://api-stage.practi.net/v1/orders?useExternalIds=true",
      params,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
          "X-BusinessId": "4604"
        }
      }
    )
    .then(res => {
      callback(null, res);
    })
    .catch(err => {
      callback(err, null);
    });
}

export function getFromBackoffice(body, callback) {
  let request = {
    url: "https://api-stage.practi.net/v1/" + body.params,
    method: body.method || "GET",
    headers: {
      "Content-Type": "application/json",
      "X-BusinessId": "4604",
      "Authorization": "Bearer" + (body.token || "f9ab81ef-98a0-41dd-aaa8-f4afe9b21cee")
    },
    body: body.data
  };
  // let req_uri = "https://api-stage.practi.net/v1/orders/" + params.order_id;
  axios(request)
    .then(res => {
      callback(null, res);
    })
    .catch(err => {
      callback(err, null);
    });
}

//Get currency
export async function getCurrency() {
  let request = {
    url: "https://api-stage.practi.net/v1/business",
    method: "GET",
    headers: {
      "X-BusinessId": "4604",
      "Authorization": "Bearer f9ab81ef-98a0-41dd-aaa8-f4afe9b21cee",
      "Content-Type" : "application/json"
    }
  };
  try {
    const { data } = await axios(request);
    return data;
  } catch (error) {
  }
}

//Get All products from practi.net
export async function getProducts() {
  let request = {
    url: "https://api-stage.practi.net/v1/products?archived=0&_limit=99999",
    method: "GET",
    headers: {
      "X-BusinessId": "4604",
      "Authorization": "Bearer f9ab81ef-98a0-41dd-aaa8-f4afe9b21cee",
      "Content-Type" : "application/json"
    }
  };
  try {
    const { data } = await axios(request);
    return data;
  } catch (error) {
  }
}

export async function addAddress(body, { token }) {
  let request = {
    url: "https://api-stage.practi.net/v1/customer/addresses",
    method: "POST",
    headers: {
      "X-BusinessId": "4604",
      Authorization: "Bearer " + token,
      "Content-Type": "application/json"
    },
    data: { ...body }
  };
  try {
    const { data } = await axios(request);
    return data;
  } catch (error) {
  }
}

export function getOrder(id, { token }, callback) {
  let request = {
    url:
      "https://api-stage.practi.net/v1/orders/" + id + "?useExternalIds=true",
    method: "GET",
    headers: {
      "X-BusinessId": "4604",
      Authorization: "Bearer " + token,
      "Content-Type": "application/json"
    }
  };
  axios(request)
    .then(res => {
      callback(null, res.data);
    })
    .catch(err => {
      callback(err, null);
    });
}
