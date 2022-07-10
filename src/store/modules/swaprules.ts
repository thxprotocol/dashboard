import { Vue } from 'vue-property-decorator';
import axios from 'axios';
import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators';
import { IPool } from '@/store/modules/pools';
import { GetERC20SwapRulesProps, IERC20SwapRules, TERC20SwapRule } from '@/types/IERC20SwapRules';

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
    async list({ pool, page, limit }: GetERC20SwapRulesProps) {
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
            headers: { 'X-PoolId': pool._id },
        });

        return r.data;
    }

    @Action({ rawError: true })
    async create(payload: { pool: IPool; tokenInAddress: string; tokenMultiplier: number }) {
        const r = await axios({
            method: 'POST',
            url: '/swaprules',
            headers: { 'X-PoolId': payload.pool._id },
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
