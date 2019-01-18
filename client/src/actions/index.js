import { REPOS_FETCHED } from "../constants/action-types";

export function getRepos() {
  return function(dispatch) {
    return fetch("/explore")
      .then(response => response.json())
      .then(json => {
        console.log(json);
        dispatch({ type: REPOS_FETCHED, payload: json });
      });
  };
}
