import * as actionTypes from '../constants/action-types';

const initialState = {
  loading: false,
  error: false,
  success: '',
};

function subscribeReducer(
  state = initialState,
  { type, payload }: { type: any; payload: any }
) {
  switch (type) {
    case actionTypes.SUBSCRIBE_EMAIL_INIT:
      return {
        ...state,
        loading: true,
        error: false,
        success: '',
      };
    case actionTypes.SUBSCRIBE_EMAIL_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        success: 'You are successfully subscribed.',
      };
    case actionTypes.SUBSCRIBE_EMAIL_ERROR:
      return {
        ...state,
        loading: false,
        error: payload[0],
        success: '',
      };
    default:
      return { ...state };
  }
}
export default subscribeReducer;
