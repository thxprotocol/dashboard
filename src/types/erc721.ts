import { ChainId } from '@/types/enums/ChainId';

export enum ERC721Variant {
    Uknown = -1,
    Default = 0,
    OpenSea = 1,
}

export type TERC721DefaultProp = {
    name: string;
    description: string;
    propType: string;
    value?: string;
    disabled?: boolean;
};

export interface TERC721Metadata {
    _id: string;
    beneficiary: string;
    title: string;
    description: string;
    metadata: { key: string; value: string }[];
    tokenId: number;
    createdAt: Date;
    attributes: [{ key: string; value: string }];
    tokens: any[];
}

export type TERC721 = {
    _id: string;
    type: ERC721Variant;
    chainId: ChainId;
    poolAddress: string;
    address: string;
    name: string;
    symbol: string;
    totalSupply: number;
    logoURI: string;
    properties: TERC721DefaultProp[];
    metadata: TERC721Metadata[];
    archived: boolean;
};

export interface IERC721s {
    [id: string]: TERC721;
}
