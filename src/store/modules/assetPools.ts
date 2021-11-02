import { Vue } from 'vue-property-decorator';
import axios from 'axios';
import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators';

interface TokenBalance {
    name: string;
    address: string;
    symbol: string;
    balance: { type: string; hex: string };
}

export interface PoolToken {
    name: string;
    address: string;
    symbol: string;
    decimals: number;
    chainId: number;
    logoURI: string;
}

export enum PoolTokenType {
    Existing = 0,
    New = 1,
}

export enum NetworkProvider {
    Test = 0,
    Main = 1,
}

export class AssetPool {
    address: string;
    clientId: string;
    clientSecret: string;
    poolToken: TokenBalance;
    bypassPolls: boolean;
    network: NetworkProvider;
    rewardPollDuration: number;
    proposeWithdrawPollDuration: number;

    constructor(data: any) {
        this.address = data.address;
        this.clientId = data.clientId;
        this.clientSecret = data.clientSecret;
        this.poolToken = data.token;
        this.bypassPolls = data.bypassPolls;
        this.network = data.network;
        this.rewardPollDuration = Number(data.rewardPollDuration);
        this.proposeWithdrawPollDuration = Number(data.proposeWithdrawPollDuration);
    }
}

export interface IAssetPools {
    [address: string]: AssetPool;
}

@Module({ namespaced: true })
class AssetPoolModule extends VuexModule {
    _all: IAssetPools = {};

    get all() {
        return this._all;
    }

    @Mutation
    set(pool: AssetPool) {
        Vue.set(this._all, pool.address, pool);
    }

    @Mutation
    unset(address: string) {
        Vue.delete(this._all, address);
    }

    @Action
    async list() {
        try {
            const r = await axios({
                method: 'GET',
                url: '/asset_pools',
            });

            for (const address of r.data) {
                axios({
                    method: 'GET',
                    url: '/asset_pools/' + address,
                    headers: {
                        AssetPool: address,
                    },
                }).then((r) => {
                    this.context.commit('set', new AssetPool(r.data));
                });
            }
        } catch (e) {
            console.error(e);
        }
    }

    @Action
    async read(address: string) {
        try {
            const r = await axios({
                method: 'get',
                url: '/asset_pools/' + address,
                headers: { AssetPool: address },
            });

            this.context.commit('set', new AssetPool(r.data));
        } catch (e) {
            console.error(e);
        }
    }

    @Action
    async create(data: {
        network: number;
        token: { address: string; name: string; symbol: string; totalSupply: number };
    }) {
        try {
            const res = await axios({
                method: 'POST',
                url: '/asset_pools',
                data,
            });

            try {
                const r = await axios({
                    method: 'GET',
                    url: '/asset_pools/' + res.data.address,
                    headers: { AssetPool: res.data.address },
                });

                if (r.status != 200) {
                    throw Error('GET /asset_pools/:address failed.');
                }

                const assetPool: AssetPool = new AssetPool(r.data);

                this.context.commit('set', assetPool);

                return { assetPool };
            } catch (e) {
                return { error: e };
            }
        } catch (e) {
            return { error: e };
        }
    }

    @Action
    async update(payload: {
        address: string;
        data: {
            bypassPolls: boolean;
            rewardPollDuration: number;
            withdrawPollDuration: number;
        };
    }) {
        try {
            const r = await axios({
                method: 'PATCH',
                url: '/asset_pools/' + payload.address,
                data: payload.data,
                headers: {
                    AssetPool: payload.address,
                },
            });

            if (r.status !== 200) {
                throw new Error('PATCH /asset_pools failed');
            }

            return r.data;
        } catch (e) {
            console.log(e);
            debugger;
        }
    }

    @Action
    async remove(address: string) {
        try {
            await axios({
                method: 'DELETE',
                url: '/asset_pools/' + address,
                headers: {
                    AssetPool: address,
                },
            });

            this.context.commit('unset', address);
        } catch (e) {
            console.log(e);
            debugger;
        }
    }
}

export default AssetPoolModule;
