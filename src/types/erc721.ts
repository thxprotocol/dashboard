import { NetworkProvider } from '@/store/modules/assetPools';

export enum ERC721Type {
    Uknown = -1,
    Default = 0,
}

export type TERC721 = {
    _id: string;
    type: ERC721Type;
    network: NetworkProvider;
    address: string;
    name: string;
    symbol: string;
    totalSupply: number;
    logoURI: string;
};

export interface IERC721s {
    [id: string]: TERC721[];
}
