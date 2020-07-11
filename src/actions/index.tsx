import * as actionTypes from '../constants/action-types';
import { handleHTTPError } from './errorHandlerActions';
import { apiEndPoint } from '../config';
import { RepoRef } from '../interface';

type HeaderRef = {
  Accept: string;
  'Content-Type': string;
  'x-access-token': string;
};

function createHeaders(): HeaderRef {
  const user: any = localStorage.getItem('user');

  const { jwtToken }: { jwtToken: string } = JSON.parse(user);
  return {
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    'x-access-token': jwtToken,
  };
}

function getApi(apiUrl: string, headers = true) {
  return new Promise(async (resolve, reject) => {
    try {
      const fetchResponse = await fetch(apiUrl, {
        method: 'GET',
        headers: headers ? createHeaders() : {},
      });

      if (!fetchResponse.ok) {
        throw fetchResponse;
      }

      const data = await fetchResponse.json();

      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
}

export function getRepos(
  lang?: string,
  page = 1,
  initial = true,
  props?: any
): any {
  return async function(dispatch: any) {
    dispatch({ type: actionTypes.REPOS_FETCHED_INIT });

    let exploreEndPoint: string = `${apiEndPoint}/api/explore?page=${page}`;

    if (lang) {
      exploreEndPoint += `&lang=${lang}`;

      // dispatch only if language is selected
      dispatch({
        type: actionTypes.SELECTED_LANGUAGE,
        payload: lang,
      });
    }

    console.log('-oprps', props);
    try {
      const jsonResp = await getApi(exploreEndPoint, false);

      const dispatchType = initial
        ? actionTypes.REPOS_FETCHED_SUCCESS
        : actionTypes.REPOS_PAGINATION_FETCHED_SUCCESS;

      dispatch({
        type: dispatchType,
        payload: jsonResp,
      });
    } catch (e) {
      console.log(e);
      handleHTTPError(e, dispatch, props, {
        type: actionTypes.REPOS_FETCHED_ERROR,
      });
    }
  };
}

export function fetchUserRepos(userId: number, props: any): any {
  return async function(dispatch: any) {
    dispatch({ type: actionTypes.USER_REPOS_FETCHED_INIT });

    try {
      const jsonResp = await getApi(`${apiEndPoint}/api/repos/${userId}`);

      dispatch({
        type: actionTypes.USER_REPOS_FETCHED_SUCCESS,
        payload: jsonResp,
      });
    } catch (e) {
      handleHTTPError(e, dispatch, props, {
        type: actionTypes.USER_REPOS_FETCHED_ERROR,
      });
    }
  };
}

export function fetchUserGithubRepos(userName: string, repoName: string): any {
  return function(dispatch: any) {
    dispatch({
      type: actionTypes.USER_GITHUB_REPOS_FETCH_INIT,
    });
    return fetch(`${apiEndPoint}/api/user-repo/${userName}/${repoName}`, {
      method: 'GET',
      headers: createHeaders(),
    })
      .then((response) => response.json())
      .then((jsonResp) => {
        dispatch({
          type: actionTypes.USER_GITHUB_REPOS_FETCH_SUCCESS,
          payload: jsonResp,
        });
      });
  };
}

export function publishRepo(repo: RepoRef): any {
  return function(dispatch: any, getState: any) {
    return fetch(`${apiEndPoint}/api/publish/${repo.name}`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify({}),
    })
      .then((response) => response.json())
      .then((jsonResp) => {
        dispatch({
          type: actionTypes.USER_GITHUB_REPOS_PUBLISHED,
          payload: jsonResp,
        });
      });
  };
}

export function unpublishRepo(repoName: string, repoId: number): any {
  return function(dispatch: any) {
    return fetch(`${apiEndPoint}/api/delete/${repoId}`, {
      method: 'DELETE',
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
      method: 'POST',
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

export function loginUser(code: string): any {
  return function(dispatch: any) {
    dispatch({
      type: actionTypes.USER_LOGIN_INIT,
    });
    return fetch(`${apiEndPoint}/api/login/github/${code}`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((jsonResp) => {
        localStorage.setItem('user', JSON.stringify(jsonResp));
        dispatch({
          type: actionTypes.USER_LOGIN_SUCCESS,
          payload: jsonResp,
        });
      });
  };
}

export function logout(): any {
  return function(dispatch: any) {
    localStorage.removeItem('user');

    dispatch({
      type: actionTypes.USER_LOGOUT_SUCCESS,
    });
  };
}

export function loadUser(): any {
  return function(dispatch: any) {
    const userData: any = localStorage.getItem('user');

    const user: any = JSON.parse(userData);

    dispatch({
      type: actionTypes.USER_LOGIN_SUCCESS,
      payload: user,
    });
  };
}
