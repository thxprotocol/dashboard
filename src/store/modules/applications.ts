import { Vue } from 'vue-property-decorator';
import axios from 'axios';
import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators';
import { UserProfile } from './account';

export class Application {
    address: string;
    title: string;

    constructor(data: any) {
        this.address = data.address;
        this.title = data.title;
    }
}

@Module({ namespaced: true })
class ApplicationModule extends VuexModule {
    _all: any[] = [];

    get all() {
        return this._all;
    }

    @Mutation
    set(app: Application) {
        Vue.set(this._all, app.id, app);
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
                url: process.env.VUE_APP_API_ROOT + '/reg',
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
