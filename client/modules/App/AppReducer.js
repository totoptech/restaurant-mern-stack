// Import Actions
import {
  LOADING_START,
  LOADING_END,
  SET_BRANCH,
  CLEAR_BRANCH
} from "./AppActions";

const initialState = {
  branch: {},
  loading: false
};

const AppReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOADING_START:
      return { ...state, loading: true };
    case LOADING_END:
      return { ...state, loading: false };
    case SET_BRANCH:
      return { ...state, branch: action.data };
    case CLEAR_BRANCH:
      return { ...state, branch: {} };
    default:
      return state;
  }
};

// Export Reducer
export default AppReducer;
