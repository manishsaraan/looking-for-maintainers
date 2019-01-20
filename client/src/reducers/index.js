import { REPOS_FETCHED, USER_REPOS_FETCHED } from "../constants/action-types";

const initialState = {
  repos: [],
  userRepos: []
};
function rootReducer(state = initialState, { type, payload }) {
  switch (type) {
    case REPOS_FETCHED:
      return { ...state, repos: payload };
    case USER_REPOS_FETCHED:
      return { ...state, userRepos: payload };
    default:
      return { ...state };
  }
}
export default rootReducer;
