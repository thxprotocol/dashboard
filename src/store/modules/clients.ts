import axios, { AxiosResponse } from 'axios';
import { Action, Module, VuexModule } from 'vuex-module-decorators';

export type TClient = {
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
    clientId: string;
    poolId: string;
    registrationAccessToken: string;
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
            const response: TClientResponse = await axios({
                method: 'GET',
                url: '/clients?' + params.toString(),
                headers: { 'X-PoolId': poolId },
            });

            return {
                clients: response.data.results,
                total: response.data.total,
                limit: response.data.limit,
                previous: response.data.previous,
                next: response.data.next,
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
        return response.data;
    }

    @Action({ rawError: true })
    async info({ clientId, poolId, registrationAccessToken }: ClientInfoProps) {
        const response = await axios({
            method: 'POST',
            url: '/clients/info',
            headers: { 'X-PoolId': poolId },
            data: { clientId, registrationAccessToken },
        });

        return response.data;
    }
}

export default ClientModule;
