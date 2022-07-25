import axios, { AxiosResponse } from 'axios';
import { Vue } from 'vue-property-decorator';
import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import { IPool } from './pools';

export type TClient = {
    _id: string;
    page: number;
    sub: string;
    poolId: string;
    clientId: string;
    clientSecret: string;
};

export type ClientByPage = {
    [page: number]: TClient[];
};

export type PaginationParams = Partial<{
    page: number;
    limit: number;
}>;

export type ClientListProps = PaginationParams & {
    pool: IPool;
};

export type GetClientProps = {
    client: TClient;
    pool: IPool;
};

export type TClientResponse = AxiosResponse<
    TClientMeta & {
        results: TClient[];
    }
>;

export type TClientMeta = {
    limit: number;
    total: number;
    next?: { page: number };
    previous?: { page: number };
};

export type TClientCreate = {
    name: string;
    page: number;
    pool: IPool;
    grantType: string;
    redirectUri: string;
    requestUri: string;
};

export type TClientState = {
    [poolId: string]: TClientMeta & {
        byPage: ClientByPage;
    };
};

@Module({ namespaced: true })
class ClientModule extends VuexModule {
    _all: TClientState = {};
    total = 0;

    get all() {
        return this._all;
    }

    @Mutation
    set(client: TClient) {
        Vue.set(this._all, client._id, client);
    }

    @Mutation
    setTotal(total: number) {
        Vue.set(this, 'total', total);
    }

    @Action({ rawError: true })
    async list({ page = 1, limit, pool }: ClientListProps) {
        const params = new URLSearchParams();
        params.set('page', String(page));
        params.set('limit', String(limit));

        const { data }: TClientResponse = await axios({
            method: 'GET',
            url: '/clients?' + String(params),
            headers: { 'X-PoolId': pool._id },
        });

        this.context.commit('setTotal', data.total);
        // Prepare an array for all available items
        data.results.forEach((value: unknown, index: number) => {
            // Set the page the item is on
            data.results[index].page = page;
            // Array should have one dimension for easy updating
            this.context.commit('set', data.results[index]);
        });
    }

    @Action({ rawError: true })
    async create({ name, page, pool, grantType, redirectUri, requestUri }: TClientCreate) {
        const { data } = await axios({
            method: 'POST',
            url: '/clients',
            headers: { 'X-PoolId': pool._id },
            data: { name, grantType, redirectUri, requestUri },
        });
        data.page = page;
        this.context.commit('set', data);
    }

    @Action({ rawError: true })
    async get({ client, pool }: GetClientProps) {
        const { data } = await axios({
            method: 'GET',
            url: '/clients/' + client._id,
            headers: { 'X-PoolId': pool._id },
            data: { clientId: client.clientId },
        });

        const existingClient = this.context.rootGetters['clients/all'][client._id];
        // Override existing props but keep props (like page) undefined in the new data.
        this.context.commit('set', { ...existingClient, ...data });
    }
}

export default ClientModule;
