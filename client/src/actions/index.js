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

export function fetchUserRepos(userName) {
  return function(dispatch) {
    console.log("--------------", userName);
    return fetch(`${apiEndPoint}/repos/${userName}`)
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
  if(repo._id){
    delete repo.id;
    delete repo._id;
  }
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

export function unpublishRepo(repoId) {
  console.log(repoId);
  return function(dispatch) {
    return fetch(`${apiEndPoint}/delete/${repoId}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(jsonResp => console.log(jsonResp));
  };
}
