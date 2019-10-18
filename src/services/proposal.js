import Axios from 'axios';

const PROP_API_PATH = process.env.REACT_APP_PROJECT_API + 'proposals/';
const MSG_API_PATH = process.env.REACT_APP_PROJECT_API + 'messages/';

export default {
	award: id => Axios.put(PROP_API_PATH + id, {
		status: 'AWARDED',
	}).then(res => res.data),

	submit: (contId, projId, desc) => Axios.post(
		process.env.REACT_APP_PROJECT_API + 'contractors/' + contId + '/projects/' + projId + '/proposals',
		desc
	).then(res => res.data),
	delete: id => Axios.delete(PROP_API_PATH + id).then(res => res.data),
	update: (id, proposal) => Axios.put(PROP_API_PATH + id, proposal, {
		headers: { 'Content-Type': 'application/json' },
	}).then(res => res.data),

	getDetail: id => Axios.get(PROP_API_PATH + id + '/temCatOptionDetail').then(res => res.data),
	getInfo: id => Axios.get(PROP_API_PATH + id).then(res => res.data),

	addFiles: (id, files) => {
		const formData = new FormData();
		files.forEach(async file => {
			formData.append('file', file);
		});

		return Axios.post(PROP_API_PATH + id + '/files/upload/multiple', formData, {
			headers: { 'Content-Type': 'multipart/form-data' },
		}).then(response => response.data);
	},
	deleteFile: (id, name) => Axios.delete(PROP_API_PATH + id + '/files/' + name).then(res => res.data),

	addOption: (id, catid, option) => Axios.post(
		PROP_API_PATH + id + '/categories/' + catid + '/options',
		option
	).then(res => res.data),
	updateOption: (id, option) => Axios.put(PROP_API_PATH + 'options/' + id, option).then(res => res.data),
	deleteOption: id => Axios.delete(PROP_API_PATH + 'options/' + id).then(res => res.data),
	getOption: id => Axios.get(PROP_API_PATH + 'options/' + id).then(res => res.data),

	getMessages: (id, page, size) => Axios.get(MSG_API_PATH + '/proposals/' + id, {
		params: { page, size }
	}).then(res => res.data),
	addMessage: (id, message, type) => Axios.post(
		MSG_API_PATH + '/proposals/' + id + (type === 's_cont') ? '/togencon' : 'tosubcon',
		message
	).then(res => res.data),
	addFileToMessage: (msgId, files) => {
		const formData = new FormData();
		files.forEach(async file => {
			await formData.append('file', file);
		});

		return Axios.post(
			MSG_API_PATH + msgId + '/files/upload/multiple',
			formData,
			{
				headers: { 'Content-Type': 'multipart/form-data' }
			}
		).then(res => res.data);
	}
};
