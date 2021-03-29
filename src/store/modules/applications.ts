import { Vue } from 'vue-property-decorator';
import axios from 'axios';
import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators';

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

    // @Mutation
    // set(app: Application) {
    //     Vue.set(this._all, app.id, app);
    // }

    @Action
    async create(data: {
        title: string;
        token: { address: string; name: string; symbol: string; totalSupply: number };
    }) {
        try {
            const r = await axios({
                method: 'POST',
                url: process.env.VUE_APP_API_ROOT + '/reg',
                data: {
                    application_type: 'web',
                    client_name: data.title,
                    grant_types: ['client_credentials'],
                    redirect_uris: [],
                    post_logout_redirect_uris: [],
                    response_types: [],
                    scope: 'openid admin',
                },
            });
            debugger;
            console.log(r.data);
        } catch (e) {
            debugger;
        }
    }
}

export default ApplicationModule;
