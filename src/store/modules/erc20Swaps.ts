import { Vue } from 'vue-property-decorator';
import axios from 'axios';
import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators';
import { IPool } from '@/store/modules/pools';
import { ChainId } from '../enums/chainId';
import { IERC20SwapRules } from '@/types/IERC20SwapRules';

export type TERC20SwapRule = {
    _id: string;
    chainId: ChainId;
    poolAddress: string;
    tokenInAddress: string;
    tokenMultiplier: number;
};

export interface GetERC20SwapRulesProps {
    pool: IPool;
    page?: number;
    limit?: number;
}

const TRANSACTIONS_RESPONSE: GetERC20SwapRulesResponse = {
    results: [],
    total: 0,
};

export interface GetERC20SwapRulesResponse {
    results: TERC20SwapRule[];
    next?: { page: number };
    previous?: { page: number };
    limit?: number;
    total: number;
}

export type IERC20SwapRuleByPage = { [page: number]: IERC20SwapRules[] };

@Module({ namespaced: true })
class ERC20SwapRuleModule extends VuexModule {
    _all: IERC20SwapRules = {};

    get all() {
        return this._all;
    }

    @Mutation
    set({ pool, swapRule }: { pool: IPool; swapRule: TERC20SwapRule }) {
        if (!this._all[pool._id]) {
            Vue.set(this._all, pool._id, {});
        }
        Vue.set(this._all[pool._id], swapRule._id, swapRule);
    }

    @Action({ rawError: true })
    async list({ pool, page, limit }: GetERC20SwapRulesProps): Promise<GetERC20SwapRulesResponse | undefined> {
        try {
            const params = new URLSearchParams();
            if (page) {
                params.set('page', String(page));
            }
            if (limit) {
                params.set('limit', String(limit));
            }

            const r = await axios({
                method: 'GET',
                url: '/swaprules?' + params.toString(),
                headers: { 'X-PoolAddress': pool.address },
            });

            return r.data.results.length ? r.data : TRANSACTIONS_RESPONSE;
        } catch (e) {
            console.log(e);
        }

        return undefined;
    }

    @Action({ rawError: true })
    async create(payload: { pool: IPool; tokenInAddress: string; tokenMultiplier: number }) {
        const r = await axios({
            method: 'POST',
            url: '/swaprules',
            headers: { 'X-PoolAddress': payload.pool.address },
            data: {
                tokenInAddress: payload.tokenInAddress,
                tokenMultiplier: Number(payload.tokenMultiplier),
                pool: payload.pool,
            },
        });

        this.context.commit('set', { pool: payload.pool, swapRule: r.data });
    }
}
export default ERC20SwapRuleModule;
