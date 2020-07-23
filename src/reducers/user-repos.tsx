import * as actionTypes from '../constants/action-types';
import { RepoRef, OwnerRef } from '../interface';

const initialState = {
  repos: [],
  successMessage: {},
  loading: false,
  error: false,
};

type processGithubSearchResponseType = (repo: RepoRef) => any;

const processGithubSearchResponse: processGithubSearchResponseType = (repo) => {
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
    id,
  } = repo;

  const { html_url: userProfileUrl, avatar_url, login }: OwnerRef = owner;

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
      username: login,
    },
  };
};

const updateUserGitHubRepos = (state: any, payload: any) => {
  const updatedUserRepos = state.repos.map((repo: any) =>
    repo.github_id === payload.github_id ? { ...payload } : { ...repo }
  );

  return updatedUserRepos;
};

function userGitHubRepos(
  state = initialState,
  { type, payload }: { type: any; payload: any }
) {
  switch (type) {
    case actionTypes.USER_GITHUB_REPOS_FETCH_INIT:
      return {
        ...state,
        repos: [],
        successMessage: {},
        loading: true,
        error: false,
      };
    case actionTypes.USER_GITHUB_REPOS_FETCH_SUCCESS:
      return {
        ...state,
        repos: payload.items.map(processGithubSearchResponse),
        successMessage: {},
        loading: false,
        error: false,
      };
    case actionTypes.USER_GITHUB_REPOS_PUBLISHED:
      return {
        ...state,
        repos: updateUserGitHubRepos(state, payload.data),
        successMessage: { ...payload.success },
      };
    case actionTypes.USER_GITHUB_REPOS_REMOVED:
      return {
        ...state,
        successMessage: { ...payload },
      };
    case actionTypes.RESET_NOTIFICATIONS:
      return {
        ...state,
        successMessage: {},
      };
    default:
      return { ...state };
  }
}
export default userGitHubRepos;
