import TempApi from 'services/template';
import {
	ALL_TEMPLATES_LOADED,
	SET_SELECTED_CATEGORY,
	SET_SELECTED_OPTION,
	SET_SELECTED_TEMPLATE,
	CLEAR_SELECTED_TEMPLATE,
	TEMPL_ROOTS_LOADED,
	TEMPL_SELECT_NODE,
	TEMPL_CLEAR_ROOTS,
	TEMPL_TREE_APPEND,
	TEMPL_TREE_SELECT,
	TEMPL_TREE_CLEAR
} from '../constants/tem-action-types';
import { clearSelectedOption } from './cont-actions';
import { createActions } from "redux-actions";
import { CLEAR_SELECTED_CATEGORY } from "../constants/cont-action-types";

const {
	allTemplatesLoaded,
	setSelectedCategory,
	setSelectedOption,
	setSelectedTemplate,
	clearSelectedTemplate,
} = createActions({
	[ALL_TEMPLATES_LOADED]: (templates) => templates,
	[SET_SELECTED_CATEGORY]: (data) => data,
	[SET_SELECTED_OPTION]: (selectedOption) => selectedOption,
	[SET_SELECTED_TEMPLATE]: (selectedTemplate) => selectedTemplate,
	[CLEAR_SELECTED_TEMPLATE]: () => null,
});

export const createTemplate = template => dispatch => TempApi.create(template);

export const selectTemplate = id => dispatch => {
	dispatch(clearSelectedTemplate());
	return TempApi.getById(id).then(data => {
		dispatch(setSelectedTemplate(data));
	});
}

export const selectCategory = id => dispatch => {
	dispatch({ type: CLEAR_SELECTED_CATEGORY });
	return TempApi.getCatById(id).then(data => {
		dispatch(setSelectedCategory(data));
	})
}

export const selectOption = id => dispatch => {
	dispatch(clearSelectedOption());
	return TempApi.getOptById(id).then(data => {
		dispatch(setSelectedOption(data));
	})
}

export const getTemplates = (page, size) => dispatch => TempApi.get(page, size).then(data => {
	dispatch(allTemplatesLoaded(data));
});

export const deleteTemplate = id => dispatch => TempApi.delete(id);
export const deleteCategory = id => dispatch => TempApi.deleteCategory(id);
export const deleteOption = id => dispatch => TempApi.deleteOption(id);

export const addCategory = (id, data) => dispatch => TempApi.addCat(id, data);
export const addOption = (id, data) => dispatch => TempApi.addOpt(id, data);

export const editTemplate = (id, data) => dispatch => TempApi.editTemplate(id, data);
export const editCategory = (id, data) => dispatch => TempApi.editCategory(id, data);
export const editOption = (id, data) => dispatch => TempApi.editOption(id, data);

// New Actions
export const rootsLoaded = data => ({
	type: TEMPL_ROOTS_LOADED,
	payload: data
});

export const nodeSelected = node => ({
	type: TEMPL_SELECT_NODE,
	payload: node
});

export const clearRoots = () => ({
	type: TEMPL_CLEAR_ROOTS
});

export const appendTree = (name, id) => ({
	type: TEMPL_TREE_APPEND,
	payload: { name, id }
});

export const selectTree = id => ({
	type: TEMPL_TREE_SELECT,
	payload: id
});

export const clearTree = () => ({
	type: TEMPL_TREE_CLEAR
});

export const loadRoots = () => dispatch => {
	dispatch(clearRoots);
	return TempApi.getRoots().then(data => {
		dispatch(rootsLoaded(data));
		dispatch(clearTree());
	});
}

export const selectNode = id => dispatch => TempApi.getNode(id).then(data => {
	dispatch(nodeSelected(data));
	// dispatch(appendTree(data.name, id));
	return data;
});

export const addRoot = (name, type, value, desc) => dispatch => TempApi.createRoot(name, type, value, desc);
export const deleteNode = id => dispatch => TempApi.deleteNode(id);
export const updateNode = (id, name, type, value, desc) => dispatch => TempApi.updateNode(id, name, type, value, desc);
export const addNode = (id, name, type, value, desc) => dispatch => TempApi.createNode(id, name, type, value, desc);