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

function query(apiUrl: string, method: string, headers = true, payload?: any) {
  return new Promise(async (resolve, reject) => {
    try {
      let queryPayload: any = {
        method: method,
        headers: headers ? createHeaders() : {},
      };

      if (payload) {
        queryPayload['body'] = JSON.stringify(payload);
      }

      const fetchResponse = await fetch(apiUrl, queryPayload);

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

    try {
      const jsonResp = await query(exploreEndPoint, 'GET', false);

      const dispatchType = initial
        ? actionTypes.REPOS_FETCHED_SUCCESS
        : actionTypes.REPOS_PAGINATION_FETCHED_SUCCESS;

      dispatch({
        type: dispatchType,
        payload: jsonResp,
      });
    } catch (e) {
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
      const jsonResp = await query(`${apiEndPoint}/api/repos/${userId}`, 'GET');

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
  return async function(dispatch: any) {
    dispatch({
      type: actionTypes.USER_GITHUB_REPOS_FETCH_INIT,
    });

    try {
      const jsonResp = await query(
        `${apiEndPoint}/api/user-repo/${userName}/${repoName}`,
        'GET'
      );

      dispatch({
        type: actionTypes.USER_GITHUB_REPOS_FETCH_SUCCESS,
        payload: jsonResp,
      });
    } catch (e) {
      handleHTTPError(
        e,
        dispatch,
        {},
        {
          type: actionTypes.USER_REPOS_FETCHED_ERROR,
        }
      );
    }
  };
}

export function publishRepo(repo: RepoRef): any {
  return async function(dispatch: any) {
    try {
      const jsonResp = await query(
        `${apiEndPoint}/api/publish/${repo.name}`,
        'POST'
      );

      dispatch({
        type: actionTypes.USER_GITHUB_REPOS_PUBLISHED,
        payload: jsonResp,
      });
    } catch (e) {
      //Todo: handle errors
    }
  };
}

export function unpublishRepo(repoName: string, repoId: number): any {
  return async function(dispatch: any) {
    try {
      await query(`${apiEndPoint}/api/delete/${repoId}`, 'DELETE');

      dispatch({
        type: actionTypes.USER_GITHUB_REPOS_REMOVED,
        payload: {
          repo: repoName,
          msg: `${repoName} successfully un-published`,
        },
      });
    } catch (e) {
      //Todo: handle errors
    }
  };
}

export function subscribe(email: string, cb?: any): any {
  return async function(dispatch: any) {
    dispatch({ type: actionTypes.SUBSCRIBE_EMAIL_INIT });

    try {
      const jsonResp = await query(
        `${apiEndPoint}/api/subscribe`,
        'POST',
        false,
        {
          email,
        }
      );

      dispatch({
        type: actionTypes.SUBSCRIBE_EMAIL_SUCCESS,
        payload: jsonResp,
      });
    } catch (e) {
      //Todo: handle errors
    }
  };
}

export function loginUser(code: string): any {
  return async function(dispatch: any) {
    dispatch({
      type: actionTypes.USER_LOGIN_INIT,
    });

    try {
      const jsonResp = await query(
        `${apiEndPoint}/api/login/github/${code}`,
        'GET',
        false
      );

      localStorage.setItem('user', JSON.stringify(jsonResp));

      dispatch({
        type: actionTypes.USER_LOGIN_SUCCESS,
        payload: jsonResp,
      });
    } catch (e) {
      handleHTTPError(
        e,
        dispatch,
        {},
        {
          type: actionTypes.USER_REPOS_FETCHED_ERROR,
        }
      );
    }
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
