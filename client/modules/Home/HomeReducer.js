import {
  FETCH_BRANCHES,
  FETCH_PRODUCTS,
  FETCH_BUSINESS,
  ADD_ORDER,
  DELETE_ORDER,
  CHANGE_DELIVERY_TIME,
  CHANGE_DELIVERY_TYPE,
  PICKUP,
  ORDER_BAG_CLEAR
} from "./HomeActions";

const initialState = {
  branches: [],
  products: {},
  business: {}
};

export const HomeReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_BRANCHES:
      return { ...state, branches: action.data };
    case FETCH_PRODUCTS:
      return { ...state, products: action.data };
    case FETCH_BUSINESS:
      return { ...state, business: action.data };
    default:
      return state;
  }
};

export const OrderReducer = (state = [], action) => {
  switch (action.type) {
    case ADD_ORDER:
      return [...state, action.data];
    case DELETE_ORDER:
      let array = [...state];
      array.splice(action.data, 1);
      return array;
    case ORDER_BAG_CLEAR:
      return [];
    default:
      return state;
  }
};

export const DeliveryReducer = (state = { type_time: 'ASAP', time:'12:00', date:'', type: PICKUP, fee:0 }, action) => {
  switch (action.type) {
    case CHANGE_DELIVERY_TYPE:
      return { ...state, type: action.data };
    case CHANGE_DELIVERY_TIME:
      return { ...state,     
                type_time: action.data.type_time,
                time: action.data.time,
                date: action.data.date };
    default:
      return state;
  }
};