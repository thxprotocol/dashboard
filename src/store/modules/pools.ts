import { Vue } from 'vue-property-decorator';
import axios from 'axios';
import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators';
import { IMember } from '@/types/account';
import { TERC20 } from '@/types/erc20';
import { TERC721 } from '@/types/erc721';
import { ChainId } from '@/types/enums/ChainId';

export interface PoolToken {
    _id: string;
    name: string;
    address: string;
    symbol: string;
    decimals: number;
    chainId: number;
    logoURI: string;
    poolBalance: number;
}

export enum PoolTokenType {
    Existing = 0,
    New = 1,
}

export interface IPool {
    _id: string;
    address: string;
    clientId: string;
    clientSecret: string;
    token: (TERC20 | TERC721) & PoolToken;
    bypassPolls: boolean;
    chainId: ChainId;
    rewardPollDuration: number;
    proposeWithdrawPollDuration: number;
    metrics: { members: number; withdrawals: number };
    isNFTPool: boolean;
    isDefaultPool: boolean;
    version: string;
}

export interface GetMembersProps {
    pool: IPool;
    page: number;
    limit: number;
}

const MEMBERS_RESPONSE_ARR: IMember[] = [{ poolAddress: '0x000', memberId: 1, address: '0x11' }];
const MEMBERS_RESPONSE: GetMembersResponse = {
    results: MEMBERS_RESPONSE_ARR,
    limit: 10,
    total: 1,
};

export interface GetMembersResponse {
    results: IMember[];
    next?: { page: number };
    previous?: { page: number };
    limit: number;
    total: number;
}

function Pool(data: any) {
    data.isDefaultPool = data.variant === 'defaultPool';
    data.isNFTPool = data.variant === 'nftPool';
    return data;
}

export interface IPools {
    [id: string]: IPool;
}

@Module({ namespaced: true })
class PoolModule extends VuexModule {
    _all: IPools = {};

    get all() {
        return this._all;
    }

    @Mutation
    set(pool: IPool) {
        Vue.set(this._all, pool._id, pool);
    }

    @Mutation
    unset(id: string) {
        Vue.delete(this._all, id);
    }

    @Action({ rawError: true })
    async list() {
        const r = await axios({
            method: 'GET',
            url: '/pools',
        });

        r.data.forEach((_id: string) => {
            this.context.commit('set', { _id });
        });
    }

    @Action({ rawError: true })
    async read(_id: string) {
        const r = await axios({
            method: 'get',
            url: '/pools/' + _id,
        });
        const pool = Pool(r.data);
        this.context.commit('set', pool);
        return pool;
    }

    @Action({ rawError: true })
    async create(payload: { network: number; token: string; tokens: string[]; variant: string }) {
        const { data } = await axios({
            method: 'POST',
            url: '/pools',
            data: payload,
        });
        const r = await axios({
            method: 'GET',
            url: '/pools/' + data._id,
            headers: { 'X-PoolAddress': data.address },
        });

        this.context.commit('set', Pool(r.data));
    }

    @Action({ rawError: true })
    async update(payload: {
        pool: IPool;
        data: {
            bypassPolls: boolean;
            rewardPollDuration: number;
            withdrawPollDuration: number;
        };
    }) {
        const r = await axios({
            method: 'PATCH',
            url: '/asset_pools/' + payload.pool._id,
            data: payload.data,
            headers: { 'X-PoolAddress': payload.pool.address },
        });

        return Pool(r.data);
    }

    @Action({ rawError: true })
    async remove(pool: IPool) {
        await axios({
            method: 'DELETE',
            url: '/pools/' + pool._id,
            headers: { 'X-PoolAddress': pool.address },
        });

        this.context.commit('unset', pool._id);
    }

    @Action({ rawError: true })
    async getMembers({ pool, page, limit }: GetMembersProps): Promise<GetMembersResponse | undefined> {
        const params = new URLSearchParams();
        params.set('page', String(page));
        params.set('limit', String(limit));

        const r = await axios({
            method: 'GET',
            url: '/pools/' + pool._id + '/members?' + params.toString(),
            headers: {
                AssetPool: pool.address,
            },
        });

        return r.data.results.length ? r.data : MEMBERS_RESPONSE;
    }
}

export default PoolModule;
