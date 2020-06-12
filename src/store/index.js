// src/js/store/index.js
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import repos from '../reducers';
import projectsReducer from '../reducers/projects';
import userGitHubRepos from '../reducers/user-repos';

const storeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = combineReducers({
  projects: projectsReducer,
  userGitHubRepos: userGitHubRepos,
  repos,
});
const store = createStore(rootReducer, storeEnhancers(applyMiddleware(thunk)));
export default store;
