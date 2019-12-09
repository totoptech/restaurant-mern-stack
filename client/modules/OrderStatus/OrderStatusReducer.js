import { GET_ORDERED, CLEAR_ORDERED } from "./OrderStatusAction";

const initialState = { order_bag: [], location: { lat: 0.0, lng: 0.0 } };

export const StatusReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ORDERED:
      return action.data;
    case CLEAR_ORDERED:
      return initialState;
    default:
      return state;
  }
};
