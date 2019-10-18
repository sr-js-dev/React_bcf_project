import {
	ALL_TEMPLATES_LOADED,
	CLEAR_ALL_TEMPLATES,
	CLEAR_SELECTED_TEMPLATE,
	SET_SELECTED_CATEGORY,
	SET_SELECTED_OPTION,
	SET_SELECTED_TEMPLATE,
	TEMPL_ROOTS_LOADED,
	TEMPL_SELECT_NODE,
	TEMPL_CLEAR_ROOTS,
	TEMPL_TREE_APPEND,
	TEMPL_TREE_SELECT,
	TEMPL_TREE_CLEAR,
} from '../constants/tem-action-types';
import { CLEAR_SELECTED_CATEGORY, CLEAR_SELECTED_OPTION } from "../constants/cont-action-types";

const initialState = {
	templates: undefined,
	selectedTemplate: undefined,
	categories: undefined,
	selectedCategory: undefined,
	selectedOption: undefined,
	roots: undefined,
	currentNode: undefined,
	nodeTree: undefined
};

function temReducer(state = initialState, action) {
	switch (action.type) {
		case ALL_TEMPLATES_LOADED:
			return Object.assign({}, state, {
				templates: action.payload,
			});
		case SET_SELECTED_TEMPLATE:
			return Object.assign({}, state, {
				selectedTemplate: action.payload,
			});
		case SET_SELECTED_CATEGORY:
			return Object.assign({}, state, {
				selectedCategory: Object.assign({}, action.payload, {
					tem_name: state.selectedTemplate,
				}),
			});
		case SET_SELECTED_OPTION:
			return Object.assign({}, state, {
				selectedOption: Object.assign({}, action.payload, {
					tem_name: state.selectedCategory.tem_name,
					cat_name: state.selectedCategory,
				}),
			});
		case CLEAR_ALL_TEMPLATES:
			return Object.assign({}, state, {
				templates: null,
			});
		case CLEAR_SELECTED_CATEGORY:
			return Object.assign({}, state, {
				selectedCategory: {
					isLoading: true,
				},
			});
		case CLEAR_SELECTED_OPTION:
			return Object.assign({}, state, {
				selectedOption: {
					isLoading: true,
				},
			});
		case CLEAR_SELECTED_TEMPLATE:
			return Object.assign({}, state, {
				selectedTemplate: {
					isLoading: true,
				},
			});
		case TEMPL_ROOTS_LOADED:
			return {
				...state,
				roots: action.payload
			};
		case TEMPL_SELECT_NODE:
			return {
				...state,
				currentNode: action.payload
			};
		case TEMPL_CLEAR_ROOTS:
			return {
				...state,
				roots: undefined
			}
		case TEMPL_TREE_APPEND:
			return {
				...state,
				nodeTree: state.nodeTree ? [...state.nodeTree, action.payload] : [action.payload]
			}
		case TEMPL_TREE_SELECT:
			if (!state.nodeTree) return state;
			for (let i = state.nodeTree.length - 1; i >= 0; i--) {
				if (state.nodeTree[i].id === action.payload) {
					break;
				}
				state.nodeTree.splice(i, 1);
			}
			return {
				...state,
				nodeTree: [...state.nodeTree]
			}
		case TEMPL_TREE_CLEAR:
			return {
				...state,
				nodeTree: undefined
			}
		default:
			return state;
	}
}

export default temReducer;