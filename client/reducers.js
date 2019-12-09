/**
 * Root Reducer
 */
import { combineReducers } from 'redux';

// Import Reducers
import {HomeReducer, OrderReducer, DeliveryReducer} from './modules/Home/HomeReducer';
import app from './modules/App/AppReducer';
import intl from './modules/Intl/IntlReducer';
import { StatusReducer } from './modules/OrderStatus/OrderStatusReducer';
import { OrderListReducer, AccountReducer } from './modules/Profile/ProfileReducer';

// Combine all reducers into one root reducer
export default combineReducers({
  intl,
  app,
  home: HomeReducer,
  order_bag: OrderReducer,
  delivery: DeliveryReducer,
  accounts: AccountReducer,
  order_history: OrderListReducer,
  order_state: StatusReducer
});
