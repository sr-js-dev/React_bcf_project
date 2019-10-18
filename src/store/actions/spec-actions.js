import SpecApi from 'services/spec';
import { createActions } from 'redux-actions';

import {
	SPEC_CREATED,
	SPEC_DELETED,
	SPEC_LOADED,
	SPEC_SELECTED,
	SPEC_SET_PAGEINFO,
	SPEC_UPDATED,
	SPECS_LOADED,
} from '../constants/spec-action-types';

export const {
	specCreated,
	specDeleted,
	specUpdated,
	specsLoaded,
	specLoaded,
	specSetPageinfo,
	specSelected,
} = createActions({
	[SPEC_CREATED]: () => true,
	[SPEC_DELETED]: () => true,
	[SPEC_UPDATED]: () => true,
	[SPECS_LOADED]: specialties => (specialties),
	[SPEC_LOADED]: (specialty) => (specialty),
	[SPEC_SET_PAGEINFO]: (currentPage, pageSize, totalPages, totalItems) => ({
		totalItems,
		totalPages,
		currentPage,
		pageSize,
	}),
	[SPEC_SELECTED]: currentSpecId => currentSpecId,
});

export const createSpec = spec => dispatch => {
	return SpecApi.create(spec).then(res => {
		dispatch(specCreated(spec));
		// return res.data;
	});
};

export const updateSpec = spec => dispatch => {
	return SpecApi.update(spec).then(res => {
		dispatch(specUpdated(spec));
		// return res;
	});
};

export const deleteSpec = specid => dispatch => {
	return SpecApi.delete(specid).then(res => {
		dispatch(specDeleted());
		// return res;
	});
};

export const loadSpecs = (pageNo, pageSize) => dispatch => {
	return SpecApi.loadPage(pageNo, pageSize).then(data => {
		// dispatch(specSetPageinfo(data.number, data.size, data.totalPages, data.totalElements));
		dispatch(specsLoaded(data));
		// return data.content;
	});
};

export const loadSpec = specid => dispatch => {
	return SpecApi.load(specid).then(data => {
		dispatch(specLoaded(data));
		// return data;
	});
};
