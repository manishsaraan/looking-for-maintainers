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
  userGithubRepoPublished: false
};
function rootReducer(state = initialState, { type, payload }) {
  switch (type) {
    case REPOS_FETCHED:
      return { ...state, repos: payload };
    case USER_REPOS_FETCHED:
      return {
        ...state,
        userPublishedRepos: payload.map(repo => ({
          ...repo,
          id: repo._id,
          isChecked: true
        }))
      };
    case USER_GITHUB_REPOS_FETCHED:
      return { ...state, userGithubRepos: payload };
    case USER_GITHUB_REPOS_PUBLISHED:
      return { ...state, userGithubRepoPublished: true };
    default:
      return { ...state };
  }
}
export default rootReducer;
