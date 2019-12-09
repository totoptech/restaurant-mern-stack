import { ORDER_LIST, ADD_ORDERED, SIGN_IN, SIGN_OUT, GET_USERINFO, ADD_ADDRESS_SUCCESS } from "./ProfileActions";

import cookieWrite from "../../util/cookieWrite";
import cookieRemoveAll from "../../util/cookieRemoveAll";

export const OrderListReducer = (state = [], action) => {
  switch (action.type) {
    case ORDER_LIST:
      return action.data;
    case ADD_ORDERED:
      return [...state, action.data];
    default:
      return state;
  }
};

const initialAccountState = {
  token: "",
  firstname: "",
  lastname: "",
  email: "",
  birthday: "",
  phonenumber: "",
  address: [],
  cards: [],
}

export const AccountReducer = (
  state = initialAccountState,
  action
) => {
  switch (action.type) {
    case SIGN_IN:
      console.log(action.data);
      cookieWrite("token", action.data.token);
      cookieWrite("firstname", action.data.firstname);
      cookieWrite("phonenumber", action.data.phonenumber);
      cookieWrite("password", action.data.password);
      return {
        ...state,
        token: action.data.token,
        firstname: action.data.firstname,
        password: action.data.password,
        phonenumber: action.data.phonenumber,
        birthday: action.data.birthday
      };
    case SIGN_OUT:
      cookieRemoveAll();
      return initialAccountState;
    case GET_USERINFO:
      return action.data;
    // case ADD_ADDRESS_SUCCESS:
    //   return {...state, address: [...state.address, action.data]};
    // case ADD_ADDRESS_SUCCESS:
    //   return {...state, address: [...state.address, action.data]};
    default:
      return state;
  }
};
