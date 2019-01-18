import { REPOS_FETCHED } from "../constants/action-types";

const initialState = {
  repos: []
};
function rootReducer(state = initialState, { type, payload }) {
  switch (type) {
    case REPOS_FETCHED:
      return { ...state, repos: payload };
    default:
      return { ...state };
  }
}
export default rootReducer;
