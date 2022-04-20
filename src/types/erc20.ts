import { NetworkProvider } from '@/store/modules/pools';

export enum ERC20Type {
    Uknown = -1,
    Limited = 0,
    Unlimited = 1,
}

export type TERC20 = {
    _id: string;
    type: ERC20Type;
    network: NetworkProvider;
    address: string;
    name: string;
    symbol: string;
    adminBalance: number;
    totalSupply: number;
    logoURI: string;
};

export interface IERC20s {
    [id: string]: TERC20[];
}
