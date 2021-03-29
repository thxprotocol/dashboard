import { Vue } from 'vue-property-decorator';
import axios from 'axios';
import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators';
import { UserProfile } from './account';

interface TokenBalance {
    name: string;
    address: string;
    symbol: string;
    balance: { type: string; hex: string };
}

export class AssetPool {
    address: string;
    title: string;
    poolAddress: string;
    poolToken: TokenBalance;
    isMember: string;
    isManager: string;

    constructor(data: any) {
        this.address = data.address;
        this.title = data.title;
        this.poolAddress = data.poolAddress;
        this.poolToken = data.poolToken;
        this.isMember = data.isMember;
        this.isManager = data.isManager;
    }
}

export interface IAssetPools {
    [poolAddress: string]: AssetPool;
}

@Module({ namespaced: true })
class AssetPoolModule extends VuexModule {
    _all: IAssetPools = {};

    get all() {
        return this._all;
    }

    @Mutation
    set(pool: AssetPool) {
        Vue.set(this._all, pool.poolAddress, pool);
    }

    @Action
    async read({ profile, poolAddress }: { profile: UserProfile; poolAddress: string }) {
        let title = '',
            poolToken = null,
            isMember = false,
            isManager = false;
        try {
            const r = await axios({
                method: 'get',
                url: '/asset_pools/' + poolAddress,
                headers: { AssetPool: poolAddress },
            });

            title = r.data.title;
            poolAddress = r.data.address;
            poolToken = r.data.token;

            const x = await axios({
                method: 'get',
                url: '/members/' + profile.address,
                headers: { AssetPool: poolAddress },
            });

            isMember = x.data.isMember;
            isManager = x.data.isManager;
        } catch (e) {
            // if (e.response.status !== 404) {
            //     return;
            // }
        } finally {
            this.context.commit(
                'set',
                new AssetPool({
                    address: profile.address,
                    title,
                    poolAddress,
                    poolToken,
                    isMember,
                    isManager,
                }),
            );
        }
    }

    @Action
    async create(data: {
        title: string;
        token: { address: string; name: string; symbol: string; totalSupply: number };
    }) {
        try {
            const r = await axios({
                method: 'POST',
                url: '/asset_pools',
                data,
            });
            console.log(r.data);
            debugger;
        } catch (e) {
            debugger;
        }
    }
}

export default AssetPoolModule;
