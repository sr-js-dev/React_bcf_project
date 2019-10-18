import Axios from 'axios';

const TEMPL_API_PATH = process.env.REACT_APP_PROJECT_API + 'templates/';
const CATEGORY_API_PATH = process.env.REACT_APP_PROJECT_API + 'categories/';
const OPTION_API_PATH = process.env.REACT_APP_PROJECT_API + 'options/';
export default {
	get: (page, size) => Axios.get(TEMPL_API_PATH, {
		params: { page: page, size: size },
	}).then(res => res.data),
	getById: (id) => Axios.get(TEMPL_API_PATH + id).then(res => res.data),
	getCatById: (id) => Axios.get(CATEGORY_API_PATH + id).then(res => res.data),
	getOptById: (id) => Axios.get(OPTION_API_PATH + id).then(res => res.data),

	create: (data) => Axios.post(TEMPL_API_PATH, data).then(res => res.data),

	addCat: (id, data) => Axios.post(TEMPL_API_PATH + id + '/categories', data).then(res => res),
	addOpt: (id, data) => Axios.post(CATEGORY_API_PATH + id + '/options', data).then(res => res),

	editTemplate: (id, data) => Axios.put(TEMPL_API_PATH + id, data).then(res => res.data),
	editCategory: (id, data) => Axios.put(CATEGORY_API_PATH + id, data).then(res => res.data),
	editOption: (id, data) => Axios.put(OPTION_API_PATH + id, data).then(res => res.data),

	delete: (id) => Axios.delete(TEMPL_API_PATH + id).then(res => res.data),
	deleteCategory: id => Axios.delete(CATEGORY_API_PATH + id).then(res => res.data),
	deleteOption: id => Axios.delete(OPTION_API_PATH + id).then(res => res.data),

	// new apis
	createRoot: (name, type, value, desc) => Axios.post(TEMPL_API_PATH + 'nodes', {
		name, type, value, description: desc
	}).then(res => res.data),
	createNode: (parent, name, type, value, desc) => Axios.post(TEMPL_API_PATH + 'nodes/' + parent, {
		name, type, value, description: desc
	}).then(res => res.data),
	getNode: id => Axios.get(TEMPL_API_PATH + 'nodes/' + id).then(res => res.data),
	updateNode: (id, name, type, value, desc) => Axios.put(TEMPL_API_PATH + 'nodes/' + id, {
		name, type, value, description: desc
	}),
	deleteNode: id => Axios.delete(TEMPL_API_PATH + 'nodes/' + id),
	getRoots: () => Axios.get(TEMPL_API_PATH + 'nodes').then(res => res.data)
};
