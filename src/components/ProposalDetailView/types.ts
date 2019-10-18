import { OptionInfo, CmnObject } from 'types/global';

export interface CateInfo {
    id?: string;
    name: string;
    type: string;
    value: string;
    description: string;
    options: Array<OptionInfo>;
}

export interface TemplProposal extends CmnObject<CateInfo> {
    id: string;
    name: string;
    budget: number;
    duration: number;
}

