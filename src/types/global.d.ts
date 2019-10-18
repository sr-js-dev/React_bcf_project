import { ClassNameMap } from '@material-ui/styles/withStyles';

export interface CmnObject<T = string> {
	[key in string]: T;
}

export interface Validator {
	value: string;
	errMsg?: string;
}

export interface UserMetaData {
	roles: string;
	contractor_id: string;
	firstname: string;
	lastname: string;
	email: string;
}

export interface UserProfile {
	email: string;
	name: string;
	user_metadata: UserMetaData;
	picture: string;
}

export interface MaterialThemeHOC {
	classes: ClassNameMap<string>;
	theme: any;
}

export type AddrInfo = {
	name?: string;
	company?: string;
	street?: string;
	city?: string;
	phone?: string;
	website?: string;
	founded?: string;
	employees?: string;
}

export type CommonInfo = {
	id: string;
	createdAt: string;
	updatedAt: string;
	updatedBy?: string;
}

export interface FileInfo extends CommonInfo {
	name: string;
	note?: string;
}

export interface ProjectOptionPostInfo {
	name: string;
	type: string;
	value: string;
	description: string;
}

export type ProjectOptionInfo = CommonInfo & ProjectOptionPostInfo;

export interface OptionPostInfo {
	name: string;
	value: string;
	description: string;
	budget: number;
	duration: number;
}

export type OptionInfo = CommonInfo & OptionPostInfo;

export type CategoryPostInfo = {
	name: string;
	type: string;
	value: string;
	description: string;
	updatedBy: string;
}

export interface CategoryInfo extends CommonInfo {
	name: string;
	type: string;
	value: string;
	description: string;
	optionList?: Array<ProjectOptionInfo>;
	proposalOptions?: object;
}

interface TemplateDetailInfo extends CommonInfo {
	name: string;
	value: string;
	description: string;
	categoryList: Array<CategoryInfo>;
}

export interface TemplateInfo extends CommonInfo {
	name: string;
	template: TemplateDetailInfo;
	projectTemplates?: Array<object>;
}

export type SortInfo = {
	sorted: boolean;
	unsorted: boolean;
	empty: boolean;
}

export type PageableInfo = {
	sort: SortInfo;
	pageSize: number;
	pageNumber: number;
	offset: number;
	unpaged: boolean;
	paged: boolean;
}

export interface Pageable {
	pageable: PageableInfo;
	totalElements: number;
	totalPages: number;
	last: boolean;
	first: boolean;
	sort: SortInfo;
	numberOfElements: number;
	size: number;
	empty: boolean;
}

export interface SpecialtyPostInfo {
	name: string;
	description: string;
	value: string;
}

export interface Specialty extends CommonInfo, SpecialtyPostInfo {
	contractorSpecialties: object;
	projectSpecialties: object;
}

export interface SpecialtyInfo extends CommonInfo {
	specialty: Specialty;
}

export interface Specialties extends Pageable {
	content: Array<Specialty>;
}

export interface Templates extends Pageable {
	content: Array<TemplateDetailInfo>;
}

export interface TemplatePostInfo {
	name: string;
	description: string;
	updatedBy: string;
}

export interface PastWorkInfo extends CommonInfo {
	title: string;
	rate: number;
	start: string;
	end: string;
	review: string;
}

export interface HistoryInfo extends CommonInfo {
	title: string;
	description: string;
	from: string;
	to: string;
	images: Array<string>;
}

export type PortfolioItem = string;

export type NodePostInfo = {
	name: string;
	type: string;
	value: string;
	description: string;
}

export interface NodeInfo extends CommonInfo {
	name: string;
	type?: string;
	value?: string;
	description?: string;
	children: NodeInfo[];
}

export type BreadcrumbInfo = {
	id: string;
	name: string;
}

export type ProfileReview = {
	oneStarRating: number;
	twoStarRating: number;
	threeStarRating: number;
	fourStarRating: number;
	fiveStarRating: number;
	reviews: number;
}