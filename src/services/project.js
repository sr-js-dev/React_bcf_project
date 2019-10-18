import Axios from 'axios';

const PROJ_API_PATH = process.env.REACT_APP_PROJECT_API + 'projects/';
const LEVEL_API_PATH = process.env.REACT_APP_PROJECT_API + 'levels/';
const ROOM_API_PATH = process.env.REACT_APP_PROJECT_API + 'rooms/';
const SELECTION_API_PATH = process.env.REACT_APP_PROJECT_API + 'selections/';

export default {
	addFiles: (id, files) => {
		const formData = new FormData();
		files.forEach(file => {
			formData.append('file', file);
		});

		return Axios.post(PROJ_API_PATH + id + '/files/upload/multiple', formData, {
			headers: {
				'Content-Type': 'multipart/form-data'
			},
		}).then(response => response.data);
	},
	deleteFile: (id, name) => Axios.delete(PROJ_API_PATH + id + '/files/' + name).then(res => res.data),
	getFiles: (id) => Axios.get(PROJ_API_PATH + id + '/files/').then(res => res.data),

	delete: id => Axios.delete(PROJ_API_PATH + id).then(res => res.data),
	getInfo: id => Axios.get(PROJ_API_PATH + id).then(res => res.data),
	archive: id => Axios.put(PROJ_API_PATH + id + '/archive').then(res => res.data),
	update: (id, proj) => Axios.put(PROJ_API_PATH + id, proj).then(res => res.data),
	getAll: (page, size) => Axios.get(PROJ_API_PATH, {
		params: {
			page: page,
			size: size
		},
	}).then(res => res.data),

	invite: (id, contid) => Axios.post(PROJ_API_PATH + id + '/invite/' + contid).then(res => res.data),
	getInvites: (id, page, size) => Axios.get(PROJ_API_PATH + id + '/invites', {
		params: {
			page: page,
			size: size
		},
	}).then(res => res.data),
	getProposals: (id, page, size) => Axios.get(PROJ_API_PATH + id + '/proposals', {
		params: {
			page: page,
			size: size
		},
	}).then(res => res.data),

	addTemplate: (projId, tempId) => Axios.post(PROJ_API_PATH + projId + '/templates/' + tempId).then(
		res => res.data
	),
	deleteTemplate: (projId, tempId) => Axios.delete(PROJ_API_PATH + projId + '/templates/' + tempId).then(
		res => res.data
	),

	createLevel: (id, level) => Axios.post(PROJ_API_PATH + id + '/levels', {
		number: level.number,
		name: level.name,
		description: level.description
	}).then(res => res.data),
	updateLevel: (lvlId, data) => Axios.put(LEVEL_API_PATH + lvlId, data).then(res => res.data),
	deleteLevel: id => Axios.delete(LEVEL_API_PATH + id).then(res => res.data),
	getLevel: id => Axios.get(LEVEL_API_PATH + id).then(res => res.data),
	createRoom: (lvlId, room) => Axios.post(LEVEL_API_PATH + lvlId + '/rooms', {
		number: room.number,
		type: room.type,
		name: room.name,
		description: room.description,
		w: room.w,
		h: room.h,
		l: room.l
	}).then(res => res.data),
	updateRoom: (roomId, room) => Axios.put(ROOM_API_PATH + roomId, {
		name: room.name,
		description: room.description,
		w: room.w,
		h: room.h,
		l: room.l
	}).then(res => res.data),
	deleteRoom: id => Axios.delete(ROOM_API_PATH + id).then(res => res.data),
	getRoom: id => Axios.get(ROOM_API_PATH + id).then(res => res.data),
	getLevels: projId => Axios.get(PROJ_API_PATH + projId + '/levels').then(res => res.data),

	createSelection: (roomId, catId, selId, option, path) => Axios.post(
		ROOM_API_PATH + roomId + `/categories/${catId}/selections/${selId}`, {
			option,
			breadcrumb: path
		}
	).then(res => res.data),
	deleteSelection: id => Axios.delete(SELECTION_API_PATH + id).then(res => res.data),
	updateSelection: (id, option) => Axios.put(SELECTION_API_PATH + id, {
		option
	}).then(res => res.data),
	getSelection: id => Axios.get(SELECTION_API_PATH + id).then(res => res.data),
};