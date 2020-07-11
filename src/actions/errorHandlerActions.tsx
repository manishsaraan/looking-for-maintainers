import * as actionTypes from '../constants/action-types';

const execute404Handler = () => {
  return {
    type: actionTypes.HTTP_404_ERROR,
  };
};

const execute500Handler = () => {
  return {
    type: actionTypes.HTTP_500_ERROR,
  };
};

const execute401Handler = (dispatch: any, props: any) => {
  dispatch({
    type: actionTypes.HTTP_401_ERROR,
  });

  // logout user from ui
  localStorage.removeItem('user');

  dispatch({
    type: actionTypes.USER_LOGOUT_SUCCESS,
  });

  props.push('/explore');
};

export const handleHTTPError = (
  error: any,
  dispatch: any,
  props: any,
  next: any
) => {
  if (error.status === 401) {
    return execute401Handler(dispatch, props);
  } else if (error.status === 404) {
    return execute404Handler();
  } else if (error.status === 500) {
    return execute500Handler();
  } else {
    dispatch(next);
  }
};
