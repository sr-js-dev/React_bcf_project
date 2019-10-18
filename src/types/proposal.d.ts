import { FileInfo, CommonInfo, Pageable } from './global';
import { ContractorInfo } from './contractor';
import { ProjectInfo } from './project';


export interface ProposalPostInfo {
    budget?: number;
    duration?: number;
    description?: string;
}

export interface ProposalInfo extends CommonInfo {
    description: string;
    budget: number;
    status: string;
    duration: number;
    proposalOptions?: Array<object>;
    proposalFiles: Array<FileInfo>;
    project: ProjectInfo;
    subContractor: ContractorInfo;
}

export interface TemplCatOptionInfo {

}

export interface ProposalDetailInfo {
    proposal: ProposalInfo;
    temCatOptionDetail: TemplCatOptionInfo;
}

export interface Proposals extends Pageable {
    content: Array<ProposalInfo>;
}