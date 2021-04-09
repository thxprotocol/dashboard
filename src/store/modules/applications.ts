import { Vue } from 'vue-property-decorator';
import axios from 'axios';
import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators';

export class Application {
    clientName: string;
    clientId: string;
    clientSecret: string;
    requestUris: string;
    registrationAccessToken: string;
    assetPools: string[];

    constructor(data: any) {
        this.clientName = data.name;
        this.clientId = data.clientId;
        this.clientSecret = data.clientSecret;
        this.requestUris = data.requestUris;
        this.registrationAccessToken = data.registrationAccessToken;
        this.assetPools = data.assetPools;
    }
}

export interface IApplications {
    [rat: string]: Application;
}

@Module({ namespaced: true })
class ApplicationModule extends VuexModule {
    _all: IApplications = {};

    get all() {
        return this._all;
    }

    @Mutation
    set(app: Application) {
        Vue.set(this._all, app.registrationAccessToken, app);
    }

    @Mutation
    unset(rat: string) {
        Vue.delete(this._all, rat);
    }

    @Action
    async read(rat: string) {
        try {
            const r = await axios({
                method: 'get',
                url: '/clients/' + rat,
            });

            if (!r.data) {
                throw new Error('No data found.');
            }
            this.context.commit('set', new Application(r.data));
        } catch (e) {
            console.error(e);
        }
    }

    @Action
    async create(data: { title: string; requestUri: string }) {
        try {
            const r = await axios({
                method: 'POST',
                url: '/clients',
                data,
            });

            return r.data.rat;
        } catch (e) {
            console.error(e);
        }
    }

    @Action
    async remove(rat: string) {
        try {
            await axios({
                method: 'DELETE',
                url: '/clients/' + rat,
            });

            this.context.commit('unset', rat);
        } catch (e) {
            console.log(e);
            return e;
        }
    }
}

export default ApplicationModule;
