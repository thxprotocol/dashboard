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
    rat: string;
    poolToken: TokenBalance;
    bypassPolls: boolean;
    network: NetworkProvider;

    constructor(data: any) {
        this.address = data.address;
        this.rat = data.rat;
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
            console.error(e);
        }
    }

    @Action
    async create(data: {
        title: string;
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
                    method: 'get',
                    url: '/asset_pools/' + res.data.address,
                    headers: { AssetPool: res.data.address },
                });

                if (r.status != 200) {
                    throw Error('GET /asset_pools/:address failed.');
                }

                const assetPool: AssetPool = new AssetPool(r.data);

                this.context.commit('set', assetPool);

                return assetPool;
            } catch (e) {
                console.log(e);
                debugger;
            }
        } catch (e) {
            console.log(e);
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
