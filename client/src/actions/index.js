import {
  REPOS_FETCHED,
  USER_REPOS_FETCHED,
  USER_GITHUB_REPOS_FETCHED
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

export function fetchUserRepos(userId) {
  return function(dispatch) {
    console.log("--------------", userId);
    return fetch(`${apiEndPoint}/repos/${userId}`)
      .then(response => response.json())
      .then(jsonResp => {
        dispatch({ type: USER_REPOS_FETCHED, payload: jsonResp });
      });
  };
}

export function fetchUserGithubRepos(userName, repoName) {
  return function(dispatch) {
    console.log(repoName);
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

export function publishRepo(user, repo) {
  console.log(repo);
  return function(dispatch) {
    return fetch(`${apiEndPoint}/publish`, {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(repo)
    })
      .then(response => response.json())
      .then(jsonResp => console.log(jsonResp));
  };
}
