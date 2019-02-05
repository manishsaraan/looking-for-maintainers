import {
  REPOS_FETCHED,
  USER_REPOS_FETCHED,
  USER_GITHUB_REPOS_FETCHED,
  USER_GITHUB_REPOS_PUBLISHED,
  USER_GITHUB_REPOS_REMOVED
} from "../constants/action-types";
import { apiEndPoint } from "../config";

export function getRepos() {
  return function(dispatch) {
    return fetch(`${apiEndPoint}/explore`)
      .then(response => response.json())
      .then(json => {
        console.log(json);
        dispatch({ type: REPOS_FETCHED, payload: json });
      });
  };
}

export function fetchUserRepos(userName) {
  return function(dispatch) {
    return fetch(`${apiEndPoint}/repos/${userName}`)
      .then(response => response.json())
      .then(jsonResp => {
        dispatch({ type: USER_REPOS_FETCHED, payload: jsonResp });
      });
  };
}

export function fetchUserGithubRepos(userName, repoName) {
  return function(dispatch) {
    return fetch(`${apiEndPoint}/user-repo/${userName}/${repoName}`, {
      method: "GET",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authentication: `Bearer test`
      }
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

  return function(dispatch, getState) {
    return fetch(`${apiEndPoint}/publish`, {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json"
      },
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
  return function(dispatch) {
    return fetch(`${apiEndPoint}/delete/${repoId}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json"
      }
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
