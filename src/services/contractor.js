import Axios from 'axios';

const CONT_API_PATH = process.env.REACT_APP_PROJECT_API + 'contractors/';

export default {
	// create, select, delete contractor
	createContractor: contractor => Axios.post(CONT_API_PATH, contractor),
	selectContractor: id => Axios.get(CONT_API_PATH + id).then(res => res.data),
	deleteContractor: id => Axios.delete(CONT_API_PATH + id),

	// approve/reject contractor
	approve: (id, data) => Axios.post(CONT_API_PATH + id, data),


	// get contractor information
	getContractors: (page, size) => Axios.get(CONT_API_PATH, {
		params: {
			page,
			size
		}
	}).then(res => res.data),
	search: (name, city, specialties) => Axios.post(CONT_API_PATH + 'search', {
		name,
		city,
		specialties
	}).then(res => res.data),
	getContractorById: id => Axios.get(CONT_API_PATH + id).then(res => res.data),

	// update user
	update: (id, email, editor, address) => Axios.post(CONT_API_PATH + id, {
		email,
		updatedBy: editor,
		address
	}).then(res => res.data),
	getReviews: id => Axios.get(CONT_API_PATH + id + '/get_reviews').then(res => res.data),
	requestReview: (id, emails) => Axios.post(CONT_API_PATH + id + '/request_reviews', emails).then(res => res.data),
	uploadLicense: (id, file, city, type, number) => {
		const formData = new FormData();
		formData.append('file', file);
		formData.append('note', `${city}__${type}__${number}`);
		return Axios.post(CONT_API_PATH + id + '/files/upload/document', formData, {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		}).then(res => res.data);
	},
	getLicenses: id => Axios.get(CONT_API_PATH + id + '/files/document').then(res => res.data),
	uploadPastProject: (id, title, desc, price, year, duration, specId) => Axios.post(
		CONT_API_PATH + id + '/projects/past', {
			project: {
				title,
				description: desc,
				budget: price,
				year,
				duration
			},
			specialtyId: specId
		}, {
			headers: {
				'Content-Type': 'application/json'
			}
		}).then(res => res.data),
	getPastProjects: id => Axios.get(CONT_API_PATH + id + '/projects/past').then(res => res.data),
	uploadAvatar: (id, file) => {
		const formData = new FormData();
		formData.append('file', file);
		return Axios.post(CONT_API_PATH + id + '/files/upload/avatar', formData, {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		}).then(res => res.data);
	},
	getAvatar: id => CONT_API_PATH + id + '/avatar',
	uploadPhoto: (id, file) => {
		const formData = new FormData();
		formData.append('file', file);
		return Axios.post(CONT_API_PATH + id + '/files/upload/photo', formData, {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		}).then(res => res.data);
	},
	updateTitle: (fileId, title) => Axios.post(CONT_API_PATH + 'files/' + fileId + '/note', {
		note: title
	}).then(res => res.data),
	getPhotos: id => Axios.get(CONT_API_PATH + id + '/photos').then(res => res.data),
	addLink: (id, link, type) => Axios.post(CONT_API_PATH + id + '/link', {}, {
		params: {
			url: link,
			type
		}
	}).then(res => res.data),
	getLinks: id => Axios.get(CONT_API_PATH + id + '/link').then(res => res.data),

	// upload/delete file
	uploadFiles: (id, files) => {
		const formData = new FormData();
		files.forEach(async file => {
			formData.append('file', file);
		});
		return Axios.post(CONT_API_PATH + id + '/files/upload/multiple', formData, {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		}).then(res => res.data);
	},
	deleteFile: (id, name) => Axios.delete(CONT_API_PATH + id + '/files/' + name),

	// specialty
	addSpecialty: (id, specid) => Axios.post(CONT_API_PATH + id + '/specialties/' + specid),
	deleteSpecialty: (id, specid) => Axios.delete(CONT_API_PATH + id + '/specialties/' + specid),

	// general contractor
	addProject: (id, project) => Axios.post(CONT_API_PATH + id + '/projects', project).then(res => res.data),
	getProjects: (id, page, size, status) => Axios.get(CONT_API_PATH + id + '/projects', {
		params: {
			page,
			size,
			status
		},
	}).then(res => res.data),

	// sub contractor
	getProposals: (id, page, size, status) => Axios.get(CONT_API_PATH + id + '/proposals', {
		params: {
			page,
			size,
			status
		}
	}).then(res => res.data),
	getInvitedProjects: (id, page, size) => Axios.get(process.env.REACT_APP_PROJECT_API + 'projects/invites/' + id, {
		params: {
			page,
			size
		}
	}).then(res => res.data),
};