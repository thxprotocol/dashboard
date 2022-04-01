import { NetworkProvider } from '@/store/modules/assetPools';

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
    totalSupply: number;
    transactionHash: string;
    createdAt: Date;
};

export interface IERC20s {
    [id: string]: TERC20[];
}
