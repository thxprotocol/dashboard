import { Vue } from 'vue-property-decorator';
import axios from 'axios';
import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators';

export interface PoolToken {
    name: string;
    address: string;
    symbol: string;
    decimals: number;
    chainId: number;
    logoURI: string;
    poolBalance: number;
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
    token: PoolToken;
    bypassPolls: boolean;
    network: NetworkProvider;
    rewardPollDuration: number;
    proposeWithdrawPollDuration: number;
    metrics: { members: number; withdrawals: number };

    constructor(data: any) {
        this.address = data.address;
        this.clientId = data.clientId;
        this.clientSecret = data.clientSecret;
        this.token = data.token;
        this.bypassPolls = true;
        this.network = data.network;
        this.rewardPollDuration = Number(data.rewardPollDuration);
        this.proposeWithdrawPollDuration = Number(data.proposeWithdrawPollDuration);
        this.metrics = data.metrics;
    }
}

export interface IAssetPools {
    [address: string]: AssetPool;
}

@Module({ namespaced: true })
class PoolModule extends VuexModule {
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

    @Action({ rawError: true })
    async list() {
        const r = await axios({
            method: 'GET',
            url: '/asset_pools',
        });

        r.data.forEach((address: string) => {
            this.context.commit('set', { address });
        });
    }

    @Action({ rawError: true })
    async read(address: string) {
        const r = await axios({
            method: 'get',
            url: '/asset_pools/' + address,
            headers: { AssetPool: address },
        });

        this.context.commit('set', new AssetPool(r.data));
    }

    @Action({ rawError: true })
    async create(payload: { network: number; token: string; variant: string }) {
        const { data } = await axios({
            method: 'POST',
            url: '/asset_pools',
            data: payload,
        });
        const r = await axios({
            method: 'GET',
            url: '/asset_pools/' + data.address,
            headers: { AssetPool: data.address },
        });

        this.context.commit('set', new AssetPool(r.data));
    }

    @Action({ rawError: true })
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

    @Action({ rawError: true })
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

export default PoolModule;
