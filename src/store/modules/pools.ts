import { Vue } from 'vue-property-decorator';
import axios from 'axios';
import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators';
import { IMember } from '@/types/account';
import { TERC20 } from '@/types/erc20';
import { TERC721 } from '@/types/erc721';
import { IDeposits } from '@/types/IDeposits';

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

export enum NetworkProvider {
    Test = 0,
    Main = 1,
}

export interface AssetPool {
    address: string;
    clientId: string;
    clientSecret: string;
    token: TERC20 | TERC721;
    bypassPolls: boolean;
    network: NetworkProvider;
    rewardPollDuration: number;
    proposeWithdrawPollDuration: number;
    metrics: { members: number; withdrawals: number };
    isNFTPool: boolean;
    isDefaultPool: boolean;
    version: string;
}

export interface GetMembersProps {
    address: string;
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

export interface GetDepositsProps {
    address: string;
    page: number;
    limit: number;
}

export interface GetDepositsResponse {
    results: IDeposits[];
    next?: { page: number };
    previous?: { page: number };
    limit: number;
    total: number;
}

const DEPOSITS_RESPONSE_ARR: IDeposits[] = [];
const DEPOSITS_RESPONSE: GetDepositsResponse = {
    results: DEPOSITS_RESPONSE_ARR,
    limit: 10,
    total: 1,
};

export type IDepositsByPage = { [page: number]: IDeposits[] };

function Pool(data: any) {
    data.isDefaultPool = data.variant === 'defaultPool';
    data.isNFTPool = data.variant === 'nftPool';
    return data;
}

export interface IAssetPools {
    [address: string]: AssetPool;
}

@Module({ namespaced: true })
class PoolModule extends VuexModule {
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

    @Action({ rawError: true })
    async list() {
        const r = await axios({
            method: 'GET',
            url: '/asset_pools',
        });

        r.data.forEach((address: string) => {
            this.context.commit('set', { address });
        });
    }

    @Action({ rawError: true })
    async read(address: string) {
        const r = await axios({
            method: 'get',
            url: '/asset_pools/' + address,
            headers: { AssetPool: address },
        });

        this.context.commit('set', Pool(r.data));
    }

    @Action({ rawError: true })
    async create(payload: { network: number; token: string; variant: string }) {
        const { data } = await axios({
            method: 'POST',
            url: '/asset_pools',
            data: payload,
        });
        const r = await axios({
            method: 'GET',
            url: '/asset_pools/' + data.address,
            headers: { AssetPool: data.address },
        });

        this.context.commit('set', Pool(r.data));
    }

    @Action({ rawError: true })
    async update(payload: {
        address: string;
        data: {
            bypassPolls: boolean;
            rewardPollDuration: number;
            withdrawPollDuration: number;
        };
    }) {
        try {
            const r = await axios({
                method: 'PATCH',
                url: '/asset_pools/' + payload.address,
                data: payload.data,
                headers: {
                    AssetPool: payload.address,
                },
            });

            if (r.status !== 200) {
                throw new Error('PATCH /asset_pools failed');
            }

            return Pool(r.data);
        } catch (e) {
            console.log(e);
        }
    }

    @Action({ rawError: true })
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
        }
    }

    @Action({ rawError: true })
    async getMembers({ address, page, limit }: GetMembersProps): Promise<GetMembersResponse | undefined> {
        try {
            const params = new URLSearchParams();
            params.set('page', String(page));
            params.set('limit', String(limit));

            const r = await axios({
                method: 'GET',
                url: '/asset_pools/' + address + '/members?' + params.toString(),
                headers: {
                    AssetPool: address,
                },
            });

            return r.data.results.length ? r.data : MEMBERS_RESPONSE;
        } catch (e) {
            console.log(e);
            debugger;
        }

        return undefined;
    }

    @Action({ rawError: true })
    async getDeposits({ address, page, limit }: GetDepositsProps): Promise<GetDepositsResponse | undefined> {
        const params = new URLSearchParams();
            params.set('page', String(page));
            params.set('limit', String(limit));

        try {
            const r = await axios({
                method: 'GET',
                url: '/asset_pools/' + address + '/deposits?' + params.toString(),
                headers: { AssetPool: address },
            });

            if (r.status !== 200) {
                throw new Error('Could not list deposits.');
            }

            return r.data.results.length ? r.data : DEPOSITS_RESPONSE;
        } catch (error) {
            console.log('ERROR ON GET DEPOSITS', error)
        }
        return undefined;
    }
}

export default PoolModule;
