import { TProp } from '@/store/modules/erc721';
import { ChainId } from '@/types/enums/ChainId';

export enum ERC721Type {
    Uknown = -1,
    Default = 0,
    NonTransferable = 0,
}

export interface TERC721Metadata {
    _id: string;
    beneficiary: string;
    title: string;
    description: string;
    metadata: { key: string; value: string }[];
    tokenId: number;
    createdAt: Date;
    attributes: [{ key: string; value: string }];
}

export type TERC721 = {
    _id: string;
    type: ERC721Type;
    chainId: ChainId;
    poolAddress: string;
    address: string;
    name: string;
    symbol: string;
    totalSupply: number;
    logoURI: string;
    properties: TProp[];
    metadata: TERC721Metadata[];
};

export interface IERC721s {
    [id: string]: TERC721;
}
