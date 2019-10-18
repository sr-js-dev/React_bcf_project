import {
    Pageable,
    TemplateInfo,
    SpecialtyInfo,
    SortInfo,
    FileInfo,
    CmnObject,
    NodeInfo
} from './global';
import { ContractorInfo } from './contractor';

export interface ProjectPostInfo {
    title: string;
    description: string;
    budget: number;
    updatedBy?: string;
    due?: Date;
}

export interface ProjectBaseInfo {
    id: string;
    title: string;
    description: string;
    budget: number;
    due?: string;
}

export interface ProjectInfo extends ProjectBaseInfo {
    createdAt: string;
    updatedAt: string;
    updatedBy: string;
    status: string;
    genContractor: ContractorInfo;
    projectFiles: Array<FileInfo>;
    projectTemplates: Array<TemplateInfo>;
    projectSpecialties: Array<SpecialtyInfo>;
    projectInvites?: Array<object>;
    relationships: Array<object>;
}

export interface RoomOption {
    id: string;
    category: NodeInfo;
    selection: NodeInfo;
    breadcrumb?: string[];   // id list
    option: CmnObject;
};

export interface ProjectLevelCategory {
    id: string;
    number: number;
    name: string;
    type: string;
    description: string;
    w: number;
    h: number;
    l: number;
    selectionList?: RoomOption[];
}

export interface ProjectLevel {
    id: string;
    number: number;
    name: string;
    description: string;
    rooms: ProjectLevelCategory[];
}

export interface Projects extends Pageable {
    content: Array<ProjectInfo>;
    allprojects: Array<object> | null;
    templates: Array<object> | null;
}
