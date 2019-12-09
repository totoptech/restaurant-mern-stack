import { fetch_products } from "../Home/HomeActions";

// Export Constants
export const SET_BRANCH = "SET_BRANCH";
export const LOADING_START = "LOADING_START";
export const LOADING_END = "LOADING_END";
export const CLEAR_BRANCH = "CLEAR_BRANCH";

// Export Actions
export const setBranch = branch => dispatch => {
  dispatch(fetch_products(branch.id));
  dispatch({
    type: SET_BRANCH,
    data: branch
  });
};

// Export Actions
export const clearBranch = () => dispatch => {
  dispatch({
    type: CLEAR_BRANCH
  });
};

export const loading_start = () => dispatch => {
  dispatch({ type: LOADING_START });
};

export const loading_end = () => dispatch => {
  dispatch({ type: LOADING_END });
};
