import * as actionTypes from '../constants/action-types';
import { projectsInitialStateType, projectsReducderType } from '../interface';

const initialState: projectsInitialStateType = {
  loading: false,
  error: null,
  projects: [],
  next: true
};

const projectsReducder: projectsReducderType = (
  state = initialState,
  { type, payload }
) => {
  switch (type) {
    case actionTypes.REPOS_FETCHED_INIT:
      return { ...state, error: null, loading: true };
    case actionTypes.REPOS_FETCHED_SUCCESS:
      return {
        ...state,
        projects: [...state.projects, ...payload],
        error: null,
        loading: false,
        next: payload.length > 0
      };
    case actionTypes.REPOS_FETCHED_ERROR:
      return { ...state, projects: [], error: payload, loading: false };
    default:
      return { ...state };
  }
};

export default projectsReducder;
