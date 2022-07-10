import { ChainId } from '@/types/enums/ChainId';
import { IPool } from '@/store/modules/pools';

export type TERC20SwapRule = {
    _id: string;
    chainId: ChainId;
    poolAddress: string;
    tokenInAddress: string;
    tokenMultiplier: number;
    tokenInId: string;
};

export interface GetERC20SwapRulesProps {
    pool: IPool;
    page?: number;
    limit?: number;
}

export interface GetERC20SwapRulesResponse {
    results: TERC20SwapRule[];
    next?: { page: number };
    previous?: { page: number };
    limit?: number;
    total: number;
}

export type IERC20SwapRuleByPage = { [page: number]: IERC20SwapRules[] };

export interface IERC20SwapRules {
    [poolAddress: string]: { [id: string]: TERC20SwapRule };
}
