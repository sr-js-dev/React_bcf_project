import {
	createActions
} from 'redux-actions';
import {
	ALL_CONTRACTORS_LOADED,
	CLEAR_ALL_CONTRACTORS,
	CLEAR_SELECTED_CONTRACTOR,
	CLEAR_SELECTED_OPTION,
	CLEAR_SPECIALTIES,
	CONTRACTOR_DETAIL_LOADED,
	SET_SELECTED_CONTRACTOR,
	SPECIALTIES_LOADED,
	PAST_PROJECTS_LOADED,
	PROFILE_LINKS_LOADED,
	PROFILE_PHOTOS_LOADED,
	PROFILE_REVIEW_LOADED,
	PROFILE_LICENSE_LOADED
} from '../constants/cont-action-types';

import ContApi from 'services/contractor';
import SpecApi from 'services/spec';

export const {
	allContractorsLoaded,
	clearAllContractors,
	clearSelectedContractor,
	clearSelectedOption,
	clearSpecialties,
	contractorDetailLoaded,
	setSelectedContractor,
	specialtiesLoaded,
	pastProjectsLoaded,
} = createActions({
	[ALL_CONTRACTORS_LOADED]: contractors => contractors,
	[CLEAR_ALL_CONTRACTORS]: () => null,
	[CLEAR_SELECTED_CONTRACTOR]: () => null,
	[CLEAR_SELECTED_OPTION]: () => null,
	[CLEAR_SPECIALTIES]: () => null,
	[CONTRACTOR_DETAIL_LOADED]: (response) => response,
	[SET_SELECTED_CONTRACTOR]: contractor => contractor,
	[SPECIALTIES_LOADED]: specialties => specialties,
	[PAST_PROJECTS_LOADED]: data => data,
});

export const photosLoaded = data => ({
	type: PROFILE_PHOTOS_LOADED,
	payload: data
});
export const linksLoaded = data => ({
	type: PROFILE_LINKS_LOADED,
	payload: data
});
export const reviewLoaded = data => ({
	type: PROFILE_REVIEW_LOADED,
	payload: data
});
export const licenseLoaded = data => ({
	type: PROFILE_LICENSE_LOADED,
	payload: data
})

export const createContractor = contractor => dispatch => ContApi.createContractor(contractor);
export const deleteContractor = id => dispatch => ContApi.deleteContractor(id);
export const selectContractor = id => dispatch => ContApi.selectContractor(id).then(data => {
	dispatch(setSelectedContractor(data));
	return data;
});
export const updateContractor = id => dispatch => ContApi.selectContractor(id).then(data => {
	dispatch(setSelectedContractor(data));
});
export const getPastProjects = id => dispatch => ContApi.getPastProjects(id).then(data => {
	dispatch(pastProjectsLoaded(data));
});

export const getContractors = (page, size) => dispatch => {
	dispatch(clearAllContractors());
	return ContApi.getContractors(page, size).then(data => {
		dispatch(allContractorsLoaded(data));
	});
}
export const getContractorDetailById = id => dispatch => {
	return ContApi.getContractorById(id).then(data => {
		dispatch(contractorDetailLoaded(data));
	});
};

export const getProfileReview = id => dispatch => ContApi.getReviews(id).then(data => {
	dispatch(reviewLoaded(data));
});
export const getProfilePhotos = id => dispatch => ContApi.getPhotos(id).then(data => {
	dispatch(photosLoaded(data));
});
export const getProfileLinks = id => dispatch => ContApi.getLinks(id).then(data => {
	dispatch(linksLoaded(data));
});
export const getProfileLicenses = id => dispatch => ContApi.getLicenses(id).then(data => {
	dispatch(licenseLoaded(data));
})

export const uploadFiles = (id, files) => dispatch => ContApi.uploadFiles(id, files);
export const removeFile = (id, name) => dispatch => ContApi.deleteFile(id, name);

export const approveContractor = (id, data) => dispatch => ContApi.approve(id, data);
export const rejectContractor = (id, data) => dispatch => ContApi.approve(id, data);

export const addSpecialty = (contid, specid) => dispatch => ContApi.addSpecialty(contid, specid);
export const deleteSpecialty = (contid, specid) => dispatch => ContApi.deleteSpecialty(contid, specid);
export const getSpecialties = (page, size) => dispatch => SpecApi.loadPage(page, size).then(data => {
	dispatch(specialtiesLoaded(data));
});

export const searchContractors = (name, city, specialties) => dispatch => {
	return ContApi.search(name, city, specialties).then(data => {
		dispatch(allContractorsLoaded(data));
	});
}