import { TERC20SwapRule } from '@/store/modules/erc20Swaps';

export interface IERC20SwapRules {
    [poolAddress: string]: { [id: string]: TERC20SwapRule };
}
