import {
  REPOS_FETCHED,
  USER_REPOS_FETCHED,
  USER_GITHUB_REPOS_FETCHED,
  USER_GITHUB_REPOS_PUBLISHED,
  USER_GITHUB_REPOS_REMOVED
} from "../constants/action-types";

const initialState = {
  repos: [],
  userPublishedRepos: [],
  userGithubRepos: [],
  successMessage: {}
};

const processGithubSearchResponse = repo => {
  const {
    name,
    stargazers_count,
    watchers_count,
    open_issues_count,
    created_at,
    forks_count,
    description,
    html_url,
    languages,
    owner,
    id
  } = repo;
  const { html_url: userProfileUrl, avatar_url, login } = owner;

  return {
    name,
    github_id: id,
    stargazers_count,
    watchers_count,
    open_issues_count,
    forks_count,
    description,
    html_url,
    languages,
    created_at,
    owner: {
      userProfileUrl,
      avatar_url,
      username: login
    }
  };
};

function rootReducer(state = initialState, { type, payload }) {
  console.log("---------", payload);
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
      return {
        ...state,
        userGithubRepos: payload.items.map(processGithubSearchResponse),
        successMessage: {}
      };
    case USER_GITHUB_REPOS_PUBLISHED:
      return {
        ...state,
        userGithubRepos: [...payload.userGithubRepos],
        userPublishedRepos: [...payload.userPublishedRepos],
        successMessage: { ...payload.success }
      };
    case USER_GITHUB_REPOS_REMOVED:
      return {
        ...state,
        successMessage: { ...payload }
      };
    default:
      return { ...state };
  }
}
export default rootReducer;
