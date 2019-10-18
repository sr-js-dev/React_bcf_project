import {
  CLEAR_PROPOSALS,
  INVITED_PROJECT_LOADED,
  PROPOSALS_LOADED,
} from '../constants/sub-action-types';
import { handleActions } from 'redux-actions';

const initialState = {
  proposals: null,
  projects: null,
};

const subReducer = handleActions(
  {
    [CLEAR_PROPOSALS]: (state, action) => ({
      ...state,
      proposals: action.payload,
    }),
    [INVITED_PROJECT_LOADED]: (state, action) => ({
      ...state,
      projects: action.payload,
    }),
    [PROPOSALS_LOADED]: (state, action) => ({
      ...state,
      proposals: action.payload,
    }),
  },
  initialState
);

export default subReducer;
