import { createActions } from 'redux-actions';
import {
	ALL_PROJECT_LOADED,
	CLEAR_ALL_PROJECTS,
	CLEAR_PROJECTS,
	CLEAR_TEMPLATES,
	PROJECT_LOADED,
	PROJECT_INVITED_LOADED,
	LEVELS_LOADED
} from '../constants/gen-action-types';
import ProjApi from 'services/project';
import ContApi from 'services/contractor';
import PropApi from 'services/proposal';

export const {
	clearProjects,
	clearTemplates,
} = createActions({
	[CLEAR_PROJECTS]: () => null,
	[CLEAR_TEMPLATES]: () => null,
});

const {
	allProjectLoaded,
	clearAllProjects,
	projectLoaded,
	levelsLoaded,
} = createActions({
	[ALL_PROJECT_LOADED]: projects => projects,
	[CLEAR_ALL_PROJECTS]: () => null,
	[PROJECT_LOADED]: projects => projects,
	[LEVELS_LOADED]: levels => levels
})

const invitedLoaded = invited => ({
	type: PROJECT_INVITED_LOADED,
	payload: invited
});

export const addProject = (cont_id, project) => dispatch => ContApi.addProject(cont_id, project);
export const updateProject = (id, project) => dispatch => ProjApi.update(id, project);
export const addFilesToProject = (id, files) => dispatch => ProjApi.addFiles(id, files);
export const deleteProject = id => dispatch => ProjApi.delete(id);
export const archiveProject = id => dispatch => ProjApi.archive(id);

export const deleteFileFromProject = (id, name) => dispatch => ProjApi.deleteFile(id, name);

export const getAllProjects = (page, size) => dispatch => {
	dispatch(clearAllProjects());
	return ProjApi.getAll(page, size).then(data => {
		dispatch(allProjectLoaded(data));
	});
};
export const getProjectsByGenId = (id, page, size) => dispatch => ContApi.getProjects(id, page, size).then(data => {
	dispatch(projectLoaded(data));
});
export const getArchivedProjectsByGenId = (id, page, size) => dispatch => ContApi.getProjects(id, page, size, 'ARCHIVED').then(data => {
	dispatch(projectLoaded(data));
});

export const inviteContractor = (id, contid) => ProjApi.invite(id, contid);
export const getInvitedBidders = (id, page, size) => dispatch => {
	return ProjApi.getInvites(id, page, size).then(data => {
		dispatch(invitedLoaded(data));
	});
}

export const addTemplate = (projectId, templateId) => dispatch => ProjApi.addTemplate(projectId, templateId);
export const deleteTemplate = (projectId, templateId) => dispatch => ProjApi.deleteTemplate(projectId, templateId);

export const awardProject = id => dispatch => PropApi.award(id);

export const createLevel = (id, level) => dispatch => ProjApi.createLevel(id, level);
export const updateLevel = (id, data) => dispatch => ProjApi.updateLevel(id, data);
export const deleteLevel = id => dispatch => ProjApi.deleteLevel(id);
export const getLevel = lvlId => dispatch => ProjApi.getLevel(lvlId);
export const createRoom = (lvlId, room) => dispatch => ProjApi.createRoom(lvlId, room);
export const updateRoom = (id, cat) => dispatch => ProjApi.updateRoom(id, cat);
export const deleteRoom = id => dispatch => ProjApi.deleteRoom(id);
export const getRoom = roomId => dispatch => ProjApi.getRoom(roomId);
export const getLevels = id => dispatch => ProjApi.getLevels(id).then(data => {
	dispatch(levelsLoaded(data));
});
export const clearLevels = () => dispatch => dispatch(levelsLoaded(undefined));