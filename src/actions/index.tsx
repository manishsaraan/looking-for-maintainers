import * as actionTypes from "../constants/action-types";
import { apiEndPoint } from "../config";
import { RepoRef } from "../interface";

type HeaderRef = {
  Accept: string;
  "Content-Type": string;
  "x-access-token": string;
};

function createHeaders(): HeaderRef {
  const user: any = localStorage.getItem("user");

  const { jwtToken }: { jwtToken: string } = JSON.parse(user);
  return {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json",
    "x-access-token": jwtToken,
  };
}

export function getRepos(): any {
  return function(dispatch: any) {
    dispatch({ type: actionTypes.REPOS_FETCHED_INIT });
    return fetch(`${apiEndPoint}/api/explore?page=1`)
      .then((response) => response.json())
      .then((json) => {
        dispatch({ type: actionTypes.REPOS_FETCHED_SUCCESS, payload: json });
      })
      .catch((error) => {
        dispatch({ type: actionTypes.REPOS_FETCHED_ERROR, payload: error });
      });
  };
}

export function fetchUserRepos(userId: number): any {
  return function(dispatch: any) {
    return fetch(`${apiEndPoint}/api/repos/${userId}`, {
      method: "GET",
      headers: createHeaders(),
    })
      .then((response) => response.json())
      .then((jsonResp) => {
        console.log("---123456789", jsonResp);
        dispatch({ type: actionTypes.USER_REPOS_FETCHED, payload: jsonResp });
      });
  };
}

export function fetchUserGithubRepos(userName: string, repoName: string): any {
  return function(dispatch: any) {
    return fetch(`${apiEndPoint}/api/user-repo/${userName}/${repoName}`, {
      method: "GET",
      headers: createHeaders(),
    })
      .then((response) => response.json())
      .then((jsonResp) => {
        dispatch({
          type: actionTypes.USER_GITHUB_REPOS_FETCHED,
          payload: jsonResp,
        });
      });
  };
}

export function publishRepo(repo: RepoRef): any {
  if (repo._id) {
    delete repo.id;
    delete repo._id;
  }

  return function(dispatch: any, getState: any) {
    return fetch(`${apiEndPoint}/api/publish`, {
      method: "POST",
      headers: createHeaders(),
      body: JSON.stringify(repo),
    })
      .then((response) => response.json())
      .then((jsonResp) => {
        const { userGithubRepos, userPublishedRepos } = getState();
        const dataIndex = userGithubRepos.findIndex(
          (repo: RepoRef) => repo.github_id === jsonResp.github_id
        );

        const publishedRepoIndex = userPublishedRepos.findIndex(
          (repo: RepoRef) => repo.github_id === jsonResp.github_id
        );

        if (dataIndex !== -1) {
          userGithubRepos[dataIndex] = {
            ...userGithubRepos[dataIndex],
            ...jsonResp,
          };
        }

        if (publishedRepoIndex !== -1) {
          userPublishedRepos[publishedRepoIndex] = {
            ...userPublishedRepos[publishedRepoIndex],
            ...jsonResp,
          };
        }

        dispatch({
          type: actionTypes.USER_GITHUB_REPOS_PUBLISHED,
          payload: {
            userGithubRepos,
            userPublishedRepos,
            success: {
              repo: repo.name,
              msg: `${repo.name} successfully published`,
            },
          },
        });
      });
  };
}

export function unpublishRepo(repoName: string, repoId: number): any {
  return function(dispatch: any) {
    return fetch(`${apiEndPoint}/api/delete/${repoId}`, {
      method: "DELETE",
      headers: createHeaders(),
    })
      .then((response) => response.json())
      .then((jsonResp) => {
        dispatch({
          type: actionTypes.USER_GITHUB_REPOS_REMOVED,
          payload: {
            repo: repoName,
            msg: `${repoName} successfully un-published`,
          },
        });
      });
  };
}

export function subscribe(email: string, cb?: any): any {
  return async function(dispatch: any) {
    dispatch({ type: actionTypes.SUBSCRIBE_EMAIL_INIT });

    const fetchedResp = await fetch(`${apiEndPoint}/api/subscribe`, {
      method: "POST",
      headers: createHeaders(),
      body: JSON.stringify({ email }),
    });

    const Resp = await fetchedResp.json();

    cb();
    dispatch({
      type: actionTypes.SUBSCRIBE_EMAIL_SUCCESS,
      payload: Resp,
    });
  };
}
