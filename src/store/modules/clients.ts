import { Vue } from 'vue-property-decorator';
import axios from 'axios';
import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators';

export class Client {
    clientName: string;
    clientId: string;
    clientSecret: string;
    registrationAccessToken: string;
    assetPools: string[];

    constructor(data: any) {
        this.clientName = data.name;
        this.clientId = data.clientId;
        this.clientSecret = data.clientSecret;
        this.registrationAccessToken = data.registrationAccessToken;
        this.assetPools = data.assetPools;
    }
}

export interface IClients {
    [rat: string]: Client;
}

@Module({ namespaced: true })
class ClientModule extends VuexModule {
    _all: IClients = {};

    get all() {
        return this._all;
    }

    @Mutation
    set(client: Client) {
        Vue.set(this._all, client.registrationAccessToken, client);
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
            const client = new Client(r.data);

            this.context.commit('set', client);

            return client;
        } catch (e) {
            console.error(e);
        }
    }
}

export default ClientModule;
