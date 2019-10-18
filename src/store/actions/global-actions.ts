import { createActions } from 'redux-actions';

import {
	CLEAR_PROPOSAL_MESSAGES,
	CLEAR_SELECTED_PROJECT,
	CLEAR_SELECTED_PROPOSAL,
	PROJECT_DETAIL_LOADED,
	PROPOSALS_LOADED,
	SET_CURRENT_PROJECT,
	SET_DETAIL_PROPOSAL,
	SET_PROPOSALS_COMPARE,
	SET_SELECTED_PROPOSAL,
	SET_USER_PROFILE,
	SET_HISTORY_ITEM
} from '../constants/global-action-types';

import PropApi from 'services/proposal';
import ProjApi from 'services/project';
import { clearProposals } from './sub-actions';

export const {
	clearProposalMessages,
	clearSelectedProject,
	clearSelectedProposal,
	projectDetailLoaded,
	proposalsLoaded,
	setCurrentProject,
	setDetailProposal,
	setProposalsCompare,
	setSelectedProposal,
	setUserProfile,
	setHistoryItem
} = createActions({
	[CLEAR_PROPOSAL_MESSAGES]: () => null,
	[CLEAR_SELECTED_PROJECT]: () => null,
	[CLEAR_SELECTED_PROPOSAL]: () => null,
	[PROJECT_DETAIL_LOADED]: project => project,
	[PROPOSALS_LOADED]: proposals => proposals,
	[SET_CURRENT_PROJECT]: currentProjectId => currentProjectId,
	[SET_DETAIL_PROPOSAL]: proposalDetail => proposalDetail,
	[SET_PROPOSALS_COMPARE]: compareProps => compareProps,
	[SET_SELECTED_PROPOSAL]: proposal => proposal,
	[SET_USER_PROFILE]: userProfile => userProfile,
	[SET_HISTORY_ITEM]: history => history
});

export const getProjectData = id => dispatch => ProjApi.getInfo(id).then(data => {
	dispatch(projectDetailLoaded(data));
});

export const getProposalDetails = id => dispatch => PropApi.getDetail(id).then(data => {
	dispatch(setDetailProposal(data));
	return data;
});

export const addFilesToProposal = (id, files) => dispatch => PropApi.addFiles(id, files);
export const deleteProposalFile = (id, name) => dispatch => PropApi.deleteFile(id, name);

export const addOption = (propid, catid, option) => dispatch => PropApi.addOption(propid, catid, option);
export const deleteOption = id => dispatch => PropApi.deleteOption(id);
export const updateOption = (id, option) => dispatch => PropApi.updateOption(id, option);

export const getProposalsByProjectId = (id, page, size) => dispatch => {
	dispatch(clearProposals());
	return ProjApi.getProposals(id, page, size).then(data => {
		dispatch(proposalsLoaded(data));
	});
}

export const getProposalMessages = (prop_id, page, size) => dispatch => {
	dispatch(clearProposalMessages());
	return PropApi.getMessages(prop_id, page, size);
}

export const addMessageToProposal = (prop_id, message, cont_type) => dispatch => {
	return PropApi.addMessage(prop_id, message, cont_type);
}

export const addFileToPropMessage = (msg_id, files, cb) => dispatch => {
	return PropApi.addFileToMessage(msg_id, files);
}

