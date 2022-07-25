import axios, { AxiosResponse } from 'axios';
import { Action, Module, VuexModule } from 'vuex-module-decorators';
import { IPool } from './pools';

export type TClient = {
    _id: string;
    sub: string;
    poolId: string;
    clientId: string;
    registrationAccessToken: string;
};

export type ClientByPage = {
    [page: number]: TClient[];
};

export type PaginationParams = Partial<{
    page: number;
    limit: number;
}>;

export type ClientListProps = PaginationParams & {
    poolId: string;
};

export type ClientInfoProps = {
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
    poolId: string;
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

    get all() {
        return this._all;
    }

    @Action({ rawError: true })
    async list({ page = 1, limit, poolId }: ClientListProps) {
        try {
            /** Return if there cached */
            const params = new URLSearchParams();
            if (page) params.set('page', String(page));
            if (limit) params.set('limit', String(limit));

            // /* Fetch if not yet */
            const { data }: TClientResponse = await axios({
                method: 'GET',
                url: '/clients?' + String(params),
                headers: { 'X-PoolId': poolId },
            });

            // TODO Use this store for storing the data instead of returning it.
            return {
                clients: data.results,
                total: data.total,
                limit: data.limit,
                previous: data.previous,
                next: data.next,
            };
        } catch (e) {
            console.error(e);
        }
    }

    @Action({ rawError: true })
    async create({ name, poolId, grantType, redirectUri, requestUri }: TClientCreate) {
        const response = await axios({
            method: 'POST',
            url: '/clients',
            headers: { 'X-PoolId': poolId },
            data: { name, grantType, redirectUri, requestUri },
        });
        // TODO insert data into store instead of returning
        return response.data;
    }

    @Action({ rawError: true })
    async get({ client, pool }: ClientInfoProps) {
        const { data } = await axios({
            method: 'GET',
            url: '/clients/' + client._id,
            headers: { 'X-PoolId': pool._id },
            data: { clientId: client.clientId, registrationAccessToken: client.registrationAccessToken },
        });

        // TODO Update store value for this client (missing clientSecret)
    }
}

export default ClientModule;
