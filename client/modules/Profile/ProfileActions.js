import { callApi } from "../../util/apiCaller";
import { loading_start, loading_end } from "../App/AppActions";

export const ADD_ORDERED = "ADD_ORDERED";
export const ORDER_LIST = "ORDER_LIST";

// export const LOGIN_FAILED = "LOGIN_FAILED";
// export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
// export const SIGNUP_FAILED = "SIGNUP_FAILED";
// export const SIGNUP_SUCCESS = "SIGNUP_SUCCESS";
// export const SIGN_OUT = "SIGN_OUT";
// export const GET_USERINFO = "GET_USERINFO";

export const SIGN_IN = "SIGN_IN";
export const SIGN_OUT = "SIGN_OUT";
export const GET_USERINFO = "GET_USERINFO";

export const ADD_ADDRESS_FAILED = "ADD_ADDRESS_FAILED";
export const ADD_ADDRESS_SUCCESS = "ADD_ADDRESS_SUCCESS";
export const UPDATE_ADDRESS_FAILED = "UPDATE_ADDRESS_FAILED";
export const UPDATE_ADDRESS_SUCCESS = "UPDATE_ADDRESS_SUCCESS";

export const order_history = phone => dispatch => {
  dispatch(loading_start());
  return callApi("user/get-orderlist", "post", { phoneNumber: phone }).then(
    res => {
      if (res.status === "success") {
        dispatch({
          type: ORDER_LIST,
          data: res.data
        });
      } else {
        console.log(res.msg);
        dispatch({
          type: ORDER_LIST,
          data:[]
        });
      }
      dispatch(loading_end());
    }
  );
};

export const add_card = (ccdata, phone, token) => dispatch => {
  dispatch(loading_start());
  return callApi("user/add-card", "post", {card: ccdata, phoneNumber: phone}).then(res => {
    if (res.status === "success") {
      dispatch(GetUserInfo(token));
    } else {
      console.log(res.msg);
    }
    dispatch(loading_end());
  });
};

export const edit_card = (ccdata, phone, id, token) => dispatch => {
  dispatch(loading_start());
  return callApi("user/edit-card", "post", {card: ccdata, phoneNumber: phone, id: id}).then(res => {
    if (res.status === "success") {
      dispatch(GetUserInfo(token));
    } else {
      console.log(res.msg);
    }
    dispatch(loading_end());
  });
};

export const delete_card = (phone, id, token) => dispatch => {
  dispatch(loading_start());
  return callApi("user/delete-card", "post", {id: id, phoneNumber: phone}).then(res => {
    if (res.status === "success") {
      dispatch(GetUserInfo(token));
    } else {
      console.log(res.msg);
    }
    dispatch(loading_end());
  });
};

export const add_address = data => dispatch => {
  dispatch(loading_start());
  return callApi("user/add-user-address", "post", data).then(res => {
    console.log(res, "add");
    if (res.status === "success") {
      dispatch(GetUserInfo(data.token));
      // }
      // dispatch({type: ADD_ADDRESS_SUCCESS, data});
      // else {
      // console.log(data);
      // dispatch({type: ADD_ADDRESS_FAILED});
    }
    dispatch(loading_end());
  });
};

export const update_address = data => dispatch => {
  dispatch(loading_start());
  return callApi("user/edit-user-address", "post", data).then(res => {
    console.log(res, "add");
    if (res.status === "success") {
      dispatch(GetUserInfo(data.token));
      // dispatch({type: UPDATE_ADDRESS_SUCCESS, data});
      // else {
      // dispatch({type: UPDATE_ADDRESS_FAILED});
    }
    dispatch(loading_end());
  });
};

export const delete_address = data => dispatch => {
  dispatch(loading_start());
  return callApi("user/delete-user-address", "post", data).then(res => {
    if (res.status === "success") {
      dispatch(GetUserInfo(data.token));
      // dispatch({type: UPDATE_ADDRESS_SUCCESS, data});
      // else {
      // dispatch({type: UPDATE_ADDRESS_FAILED});
    }
    dispatch(loading_end());
  });
};

export const SignIn = data => dispatch => {
  console.log("I am SIGN IN ACTION");
  dispatch(GetUserInfo(data.token));
  return dispatch({
    type: SIGN_IN,
    data: data
  });
};

export const SignOut = () => {
  console.log("sign_out");
  return {
    type: SIGN_OUT
  };
};

export const GetUserInfo = token => dispatch => {
  return callApi("user/get-user-profile", "post", { token: token }).then(
    res => {
      if(res.status === 'success') {
        dispatch({ type: GET_USERINFO, data: res.data });
      } else {
        console.log(res.msg);
      }
    }
  );
};

// export const SignIn = data => dispatch => {
//   console.log("I am SIGN IN ACTION");
//   callApi('user/login', "post", data).then((res) => {
//     if (res.data.token === undefined || res.data.token === "")
//       dispatch({type: LOGIN_FAILED});
//     else {
//       cookieWrite("token", res.token);
//       cookieWrite("firstname", res.firstname);
//       cookieWrite("phonenumber", res.phonenumber);
//       cookieWrite("password", res.password);
//       dispatch({type: LOGIN_SUCCESS, data: res});
//     }
//   });
// };

// export const SignUp = data => dispatch => {
//   console.log("I am SIGN UP ACTION");
//   callApi('user/login', "post", data).then((res) => {
//     if (res.data.token === undefined || res.data.token === "")
//       dispatch({type: LOGIN_FAILED});
//     else {
//       cookieWrite("token", res.token);
//       cookieWrite("firstname", res.firstname);
//       cookieWrite("phonenumber", res.phonenumber);
//       cookieWrite("password", res.password);
//       dispatch({type: LOGIN_SUCCESS, data: res});
//     }
//   });
// };

// export const SignOut = () => {
//   return {
//     type: SIGN_OUT
//   };
// };

// export const GetUserInfo = token => dispatch => {
//   return callApi("user/get-user-profile", "post", { token: token }).then(
//     res => {
//       dispatch({ type: GET_USERINFO, data: res });
//     }
//   );
// };
