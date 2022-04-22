import { TProp } from '@/store/modules/erc721';
import { NetworkProvider } from '@/store/modules/pools';

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
    properties: TProp[];
};

export interface IERC721s {
    [id: string]: TERC721[];
}
