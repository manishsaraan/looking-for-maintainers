import {
  REPOS_FETCHED,
  USER_REPOS_FETCHED,
  USER_GITHUB_REPOS_FETCHED
} from "../constants/action-types";

const initialState = {
  repos: [],
  userPublishedRepos: [],
  userGithubRepos: []
};
function rootReducer(state = initialState, { type, payload }) {
  switch (type) {
    case REPOS_FETCHED:
      return { ...state, repos: payload };
    case USER_REPOS_FETCHED:
      return { ...state, userPublishedRepos: payload };
    case USER_GITHUB_REPOS_FETCHED:
      return { ...state, userGithubRepos: payload };
    default:
      return { ...state };
  }
}
export default rootReducer;
