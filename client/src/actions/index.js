import { REPOS_FETCHED, USER_REPOS_FETCHED } from "../constants/action-types";
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

export function fetchUserGithubRepos(userId, repoName) {
  return function(dispatch) {
    console.log(repoName);
    return fetch(`${apiEndPoint}/user-repo/${repoName}`)
      .then(response => response.json())
      .then(json => console.log(json));
  };
}
