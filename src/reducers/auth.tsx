import * as actionTypes from '../constants/action-types';

const initialState = {
  user: {},
  loading: false,
  error: false,
};

function authReducer(
  state = initialState,
  { type, payload }: { type: any; payload: any }
) {
  switch (type) {
    case actionTypes.USER_LOGIN_INIT:
      return {
        ...state,
        user: {},
        loading: true,
        error: false,
      };
    case actionTypes.USER_LOGIN_SUCCESS:
      return {
        ...state,
        user: { ...payload },
        loading: false,
        error: false,
      };
    case actionTypes.USER_LOGOUT_SUCCESS:
      return {
        ...state,
        loading: false,
        user: {},
      };
    default:
      return { ...state };
  }
}
export default authReducer;
