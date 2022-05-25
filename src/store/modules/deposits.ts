import axios from 'axios';
import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators';
import { IDeposits } from '@/types/IDeposits';
import { Vue } from 'vue-property-decorator';
import PoolModule, { IDepositsByPage } from './pools';

export enum DepositState {
    Pending = 0,
    Completed = 1,
}

export type TDeposit = {
    id: string;
    sub: string;
    amount: number;
    sender: string;
    receiver: string;
    state: DepositState;
    transactions: string[];
    item?: string;
    failReason?: string;
    createdAt: Date;
    updatedAt?: Date;
};

@Module({ namespaced: true })
class DepositModule extends VuexModule {
    _all: IDepositsByPage = {};

    get all() {
        return this._all;
    }

    // @Mutation
    // set(deposit: TDeposit) {
    //     if (!this._all[deposit.receiver]) {
    //         Vue.set(this._all, deposit.receiver, deposit);
    //     }
    //     Vue.set(this._all[deposit.receiver], deposit.id, deposit);
    // }

    @Mutation
    setDepositPerPage(depositPerPage: IDepositsByPage) {
        Vue.set(this._all, 'depositPerPage', depositPerPage);
    }

    @Action({ rawError: true })
    async read({ poolAddress, id }: { poolAddress: string; id: string }) {
        try {
            const r = await axios({
                method: 'GET',
                url: '/deposits/' + id,
                headers: { AssetPool: poolAddress },
            });

            if (r.status !== 200) {
                throw new Error('GET deposit failed');
            }

            this.context.commit('set', { ...r.data, ...{ poolAddress } });
        } catch (error) {
            return { error };
        }
    }

    @Action({ rawError: true })
    async create({ amount, poolAddress }: { amount: number; poolAddress: string }) {
        const r = await axios({
            method: 'POST',
            url: '/deposits/admin',
            headers: {
                AssetPool: poolAddress,
            },
            data: { amount },
        });

        if (r.status !== 200) {
            throw new Error('Could not create deposit');
        }
        const deposit = { ...r.data, ...{ poolAddress } };

        //this.context.commit('set', deposit);

        const params = new URLSearchParams();
            params.set('page', String(1));
            params.set('limit', String(10));

        try {
            const r = await axios({
                method: 'GET',
                url: '/asset_pools/' + poolAddress + '/deposits?' + params.toString(),
                headers: { AssetPool: poolAddress },
            });

            if (r.status !== 200) {
                throw new Error('Could not list deposits.');
            } 

            if(r.data.results.length) {
                debugger;
                this.context.commit('setDepositPerPage', r.data);
            }

        } catch (error) {
            console.log('ERROR ON GET DEPOSITS', error)
        }

        return { deposit };
    }
}

export default DepositModule;
