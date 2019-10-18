import { AddrInfo } from 'types/global';

export type Profile = {
    firstname?: string;
    lastname?: string;
    email?: string;
    picture?: string;
    address?: AddrInfo;
    status?: string;
}