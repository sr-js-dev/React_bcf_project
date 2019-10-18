import { handleActions } from 'redux-actions';
import {
  SPEC_CREATED,
  SPEC_DELETED,
  SPEC_LOADED,
  SPEC_SELECTED,
  SPEC_SET_PAGEINFO,
  SPEC_UPDATED,
  SPECS_LOADED,
} from '../constants/spec-action-types';

const initialState = {
  specialties: undefined,
  specialty: undefined,
  currentSpecId: '',
  dirty: true,
};

const specReducer = handleActions(
  {
    [SPEC_CREATED]: (state, action) => ({ ...state, dirty: action.payload }),
    [SPEC_DELETED]: (state, action) => ({ ...state, dirty: action.payload }),
    [SPEC_LOADED]: (state, action) => ({ ...state, specialty: action.payload }),
    [SPECS_LOADED]: (state, action) => ({ ...state, specialties: action.payload, dirty: false }),
    [SPEC_SELECTED]: (state, action) => ({ ...state, specialty: action.payload }),
    [SPEC_SET_PAGEINFO]: (state, action) => ({ ...state, ...action.payload }),
    [SPEC_UPDATED]: (state, action) => ({ ...state, dirty: action.payload }),
  },
  initialState
);

export default specReducer;
