import { Vue } from 'vue-property-decorator';
import axios from 'axios';
import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators';
import { IPool } from '@/store/modules/pools';
import { ChainId } from '../enums/chainId';
import { IERC20SwapRules } from '@/types/IERC20SwapRules';
import { TERC20 } from '@/types/erc20';

export type TERC20SwapRule = {
    _id: string;
    chainId: ChainId;
    poolAddress: string;
    tokenInAddress: string;
    tokenMultiplier: number;
    tokenInId: string;
};

export class ERC20SwapRuleExtended {
    _id: string;
    chainId: ChainId;
    poolAddress: string;
    tokenInId: string;
    tokenInAddress: string;
    tokenMultiplier: number;
    erc20: TERC20;

    constructor(data: TERC20SwapRule, erc20: TERC20) {
        this._id = data._id;
        this.chainId = data.chainId;
        this.poolAddress = data.poolAddress;
        this.tokenInId = data.tokenInId;
        this.tokenInAddress = data.tokenInAddress;
        this.tokenMultiplier = data.tokenMultiplier;
        this.erc20 = erc20;
    }
}

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
    results: ERC20SwapRuleExtended[];
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
    set({ pool, swapRule }: { pool: IPool; swapRule: ERC20SwapRuleExtended }) {
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
            if (!r.data.results.length) {
                return TRANSACTIONS_RESPONSE;
            }
            const promises = [];

            for (const swaprule of r.data.results) {
                const promise = new Promise((resolve, reject) => {
                    try {
                        axios({
                            method: 'GET',
                            url: '/erc20/token/' + swaprule.tokenInId,
                        }).then((res) => {
                            axios({
                                method: 'GET',
                                url: '/erc20/' + res.data.erc20Id,
                            }).then(({ data }) => {
                                const erc20 = {
                                    ...res.data,
                                    balance: 0,
                                    blockExplorerURL: `https://${
                                        data.chainId === 80001 ? 'mumbai.' : ''
                                    }polygonscan.com/address/${data.address}`,
                                    logoURI: `https://avatars.dicebear.com/api/identicon/${data._id}.svg`,
                                };
                                const swaprulePaginated = new ERC20SwapRuleExtended(swaprule, erc20);
                                resolve(swaprulePaginated);
                            });
                        });
                    } catch (err) {
                        reject(err);
                    }
                });
                promises.push(promise);
            }

            return {
                results: (await Promise.all(promises)) as ERC20SwapRuleExtended[],
                total: r.data.results.length,
            };
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
