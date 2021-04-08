import { Vue } from 'vue-property-decorator';
import axios from 'axios';
import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators';

interface TokenBalance {
    name: string;
    address: string;
    symbol: string;
    balance: { type: string; hex: string };
}

export enum RPC {
    Test = 0,
    Main = 1,
}

export class AssetPool {
    address: string;
    title: string;
    aud: string;
    poolToken: TokenBalance;
    bypassPolls: boolean;
    network: RPC;

    constructor(data: any) {
        this.address = data.address;
        this.title = data.title;
        this.aud = data.aud;
        this.poolToken = data.token;
        this.bypassPolls = data.bypassPolls;
        this.network = data.network;
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
    async read(address: string) {
        try {
            const r = await axios({
                method: 'get',
                url: '/asset_pools/' + address,
                headers: { AssetPool: address },
            });
            this.context.commit('set', new AssetPool(r.data));
        } catch (e) {
            // Only logs the non 404, since the 404s are probably caused due to a network change.
            if (e.response && e.response.status !== 404) {
                console.error(e);
            }
        }
    }

    @Action
    async create(data: {
        title: string;
        aud: string;
        network: number;
        token: { address: string; name: string; symbol: string; totalSupply: number };
    }) {
        try {
            const r = await axios({
                method: 'POST',
                url: '/asset_pools',
                data,
            });
            return r.data.address;
        } catch (e) {
            debugger;
        }
    }

    @Action
    async update(data: { title: string; address: string; aud: string; bypassPolls: boolean }) {
        try {
            await axios({
                method: 'PATCH',
                url: '/asset_pools/' + data.address,
                data,
                headers: {
                    AssetPool: data.address,
                },
            });
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
