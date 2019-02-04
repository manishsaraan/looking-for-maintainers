import {
  REPOS_FETCHED,
  USER_REPOS_FETCHED,
  USER_GITHUB_REPOS_FETCHED,
  USER_GITHUB_REPOS_PUBLISHED
} from "../constants/action-types";

const initialState = {
  repos: [],
  userPublishedRepos: [],
  userGithubRepos: [],
  successMessage: {}
};
function rootReducer(state = initialState, { type, payload }) {
  switch (type) {
    case REPOS_FETCHED:
      return { ...state, repos: payload, successMessage: {} };
    case USER_REPOS_FETCHED:
      return {
        ...state,
        userPublishedRepos: payload.map(repo => ({
          ...repo,
          id: repo._id,
          isChecked: true
        })),
        successMessage: {}
      };
    case USER_GITHUB_REPOS_FETCHED:
      return { ...state, userGithubRepos: payload, successMessage: {} };
    case SUCCESS_MESSAGE:
      return { ...state, successMessage: { ...payload } };
    default:
      return { ...state };
  }
}
export default rootReducer;
