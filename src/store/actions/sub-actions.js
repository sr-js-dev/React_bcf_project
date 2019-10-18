import { createActions } from 'redux-actions';
import { proposalsLoaded } from './global-actions';
import { CLEAR_PROPOSALS, INVITED_PROJECT_LOADED, } from '../constants/sub-action-types';
import ContApi from 'services/contractor';
import PropApi from 'services/proposal';

export const { clearProposals, invitedProjectLoaded } = createActions({
	[CLEAR_PROPOSALS]: () => null,
	[INVITED_PROJECT_LOADED]: (payload) => payload,
});

export const getInvitedProjects = (id, page, size) => dispatch => ContApi.getInvitedProjects(id, page, size).then(data => {
	dispatch(invitedProjectLoaded(data));
});


export const submitProposal = (cont_id, pro_id, proposal) => dispatch => PropApi.submit(cont_id, pro_id, proposal);
export const updateProposal = (prop_id, proposal) => dispatch => PropApi.update(prop_id, proposal);
export const deleteProposal = prop_id => dispatch => PropApi.delete(prop_id);

export const getProposals = (cont_id, page, size, status) => dispatch => {
	return ContApi.getProposals(cont_id, page, size, status).then(data => {
		dispatch(proposalsLoaded(data));
	});
};

