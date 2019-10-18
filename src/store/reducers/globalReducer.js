import { handleActions } from 'redux-actions';
import {
	CLEAR_PROPOSAL_MESSAGES,
	CLEAR_SELECTED_PROJECT,
	CLEAR_SELECTED_PROPOSAL,
	PROJECT_DETAIL_LOADED,
	PROPOSAL_MESSAGES_LOADED,
	PROPOSALS_LOADED,
	SET_CURRENT_PROJECT,
	SET_DETAIL_PROPOSAL,
	SET_PROPOSALS_COMPARE,
	SET_SELECTED_PROPOSAL,
	SET_USER_PROFILE,
	SET_HISTORY_ITEM
} from '../constants/global-action-types';

const initialState = {
	userProfile: null,
	proposals: null,
	proposalMessages: null,
	proposal: null,
	project: null,
	proposalDetail: null,
	compareProps: null,
	currentProjectId: null,
	history: null
};

const globalReducer = handleActions(
	{
		[SET_USER_PROFILE]: (state, action) => ({
			...state,
			userProfile: action.payload,
		}),
		[SET_DETAIL_PROPOSAL]: (state, action) => ({
			...state,
			proposalDetail: action.payload,
		}),
		[SET_SELECTED_PROPOSAL]: (state, action) => ({
			...state,
			proposal: action.payload,
		}),
		[PROPOSALS_LOADED]: (state, action) => ({
			...state,
			proposals: action.payload,
		}),
		[PROJECT_DETAIL_LOADED]: (state, action) => ({
			...state,
			project: action.payload,
		}),
		[SET_CURRENT_PROJECT]: (state, action) => ({
			...state,
			currentProjectId: action.payload,
		}),
		[PROPOSAL_MESSAGES_LOADED]: (state, action) => ({
			...state,
			proposalMessages: action.payload,
		}),
		[CLEAR_SELECTED_PROJECT]: (state, action) => ({
			...state,
			project: action.payload,
		}),
		[CLEAR_SELECTED_PROPOSAL]: (state, action) => ({
			...state,
			proposal: action.payload,
		}),
		[CLEAR_PROPOSAL_MESSAGES]: (state, action) => ({
			...state,
			proposalMessages: action.payload,
		}),
		[SET_PROPOSALS_COMPARE]: (state, action) => ({
			...state,
			compareProps: [...action.payload],
		}),
		[SET_HISTORY_ITEM]: (state, action) => ({
			...state,
			history: action.payload
		})
	},
	initialState
);
export default globalReducer;
