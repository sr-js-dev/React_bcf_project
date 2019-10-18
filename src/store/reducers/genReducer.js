import {
	ALL_PROJECT_LOADED,
	CLEAR_ALL_PROJECTS,
	CLEAR_MESSAGES,
	CLEAR_PROJECTS,
	CLEAR_TEMPLATES,
	PROJECT_LOADED,
	TEMPLATES_LOADED,
	PROJECT_INVITED_LOADED,
	LEVELS_LOADED
} from '../constants/gen-action-types';
import { handleActions } from 'redux-actions';

const initialState = {
	messages: [],
	projects: null,
	allprojects: null,
	templates: null,
	invited: null,
	levels: null
};

const genReducer = handleActions(
	{
		[ALL_PROJECT_LOADED]: (state, action) => ({
			...state,
			allprojects: action.payload,
		}),
		[CLEAR_ALL_PROJECTS]: (state, action) => ({
			...state,
			allprojects: action.payload,
		}),
		[PROJECT_LOADED]: (state, action) => ({
			...state,
			projects: action.payload,
		}),
		[TEMPLATES_LOADED]: (state, action) => ({
			...state,
			templates: action.payload,
		}),
		[CLEAR_PROJECTS]: (state, action) => ({
			...state,
			projects: action.payload,
		}),
		[CLEAR_TEMPLATES]: (state, action) => ({
			...state,
			templates: action.payload,
		}),
		[CLEAR_MESSAGES]: (state, action) => ({ ...state, messages: [] }),
		[PROJECT_INVITED_LOADED]: (state, action) => ({
			...state,
			invited: action.payload,
		}),
		[LEVELS_LOADED]: (state, action) => ({
			...state,
			levels: action.payload
		})
	},
	initialState
);
export default genReducer;
