import {
  REPOS_FETCHED,
  USER_REPOS_FETCHED,
  USER_GITHUB_REPOS_FETCHED,
  USER_GITHUB_REPOS_PUBLISHED,
  USER_GITHUB_REPOS_REMOVED
} from "../constants/action-types";
import { apiEndPoint } from "../config";

function createHeaders() {
  const { jwtToken } = JSON.parse(localStorage.getItem("user"));
  return {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json",
    "x-access-token": jwtToken
  };
}

export function getRepos() {
  return function (dispatch) {
    return fetch(`${apiEndPoint}/api/explore`)
      .then(response => response.json())
      .then(json => {
        dispatch({ type: REPOS_FETCHED, payload: json });
      });
  };
}

export function fetchUserRepos(userId) {
  return function (dispatch) {
    return fetch(`${apiEndPoint}/api/repos/${userId}`, {
      method: "GET",
      headers: createHeaders()
    })
      .then(response => response.json())
      .then(jsonResp => {
        dispatch({ type: USER_REPOS_FETCHED, payload: jsonResp });
      });
  };
}

export function fetchUserGithubRepos(userName, repoName) {
  return function (dispatch) {
    return fetch(`${apiEndPoint}/api/user-repo/${userName}/${repoName}`, {
      method: "GET",
      headers: createHeaders()
    })
      .then(response => response.json())
      .then(jsonResp => {
        dispatch({
          type: USER_GITHUB_REPOS_FETCHED,
          payload: jsonResp
        });
      });
  };
}

export function publishRepo(repo) {
  if (repo._id) {
    delete repo.id;
    delete repo._id;
  }

  return function (dispatch, getState) {
    return fetch(`${apiEndPoint}/api/publish`, {
      method: "POST",
      headers: createHeaders(),
      body: JSON.stringify(repo)
    })
      .then(response => response.json())
      .then(jsonResp => {
        const { userGithubRepos, userPublishedRepos } = getState();
        const dataIndex = userGithubRepos.findIndex(
          repo => repo.github_id === jsonResp.github_id
        );

        const publishedRepoIndex = userPublishedRepos.findIndex(
          repo => repo.github_id === jsonResp.github_id
        );

        if (dataIndex !== -1) {
          userGithubRepos[dataIndex] = {
            ...userGithubRepos[dataIndex],
            ...jsonResp
          };
        }

        if (publishedRepoIndex !== -1) {
          userPublishedRepos[publishedRepoIndex] = {
            ...userPublishedRepos[publishedRepoIndex],
            ...jsonResp
          };
        }

        dispatch({
          type: USER_GITHUB_REPOS_PUBLISHED,
          payload: {
            userGithubRepos,
            userPublishedRepos,
            success: {
              repo: repo.name,
              msg: `${repo.name} successfully published`
            }
          }
        });
      });
  };
}

export function unpublishRepo(repoName, repoId) {
  return function (dispatch) {
    return fetch(`${apiEndPoint}/delete/${repoId}`, {
      method: "DELETE",
      headers: createHeaders()
    })
      .then(response => response.json())
      .then(jsonResp => {
        dispatch({
          type: USER_GITHUB_REPOS_REMOVED,
          payload: {
            repo: repoName,
            msg: `${repoName} successfully un-published`
          }
        });
      });
  };
}
