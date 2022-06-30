import axios from 'axios';
import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators';
import { IDeposits } from '@/types/IDeposits';
import { IPool } from './pools';
import { Vue } from 'vue-property-decorator';

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
    _all: IDeposits = {};

    get all() {
        return this._all;
    }

    @Mutation
    set(deposit: TDeposit) {
        if (!this._all[deposit.receiver]) {
            Vue.set(this._all, deposit.receiver, {});
        }
        Vue.set(this._all[deposit.receiver], deposit.id, deposit);
    }

    @Action({ rawError: true })
    async list({ pool }: { pool: IPool }) {
        try {
            const r = await axios({
                method: 'GET',
                url: '/deposits',
                headers: { 'X-PoolId': pool._id },
            });

            if (r.status !== 200) {
                throw new Error('Could not list deposits.');
            }

            for (const data of r.data.results) {
                this.context.commit('set', { ...data, ...{ pool } });
            }
        } catch (error) {
            return { error };
        }
    }

    @Action({ rawError: true })
    async read({ pool, id }: { pool: IPool; id: string }) {
        try {
            const r = await axios({
                method: 'GET',
                url: '/deposits/' + id,
                headers: { 'X-PoolId': pool },
            });

            if (r.status !== 200) {
                throw new Error('GET deposit failed');
            }

            this.context.commit('set', { ...r.data, ...{ pool } });
        } catch (error) {
            return { error };
        }
    }

    @Action({ rawError: true })
    async create({ amount, id, pool }: { amount: number; pool: IPool; id: string }) {
        const r = await axios({
            method: 'POST',
            url: '/pools/' + id + '/topup',
            headers: { 'X-PoolId': pool._id },
            data: { amount },
        });

        if (r.status !== 200) {
            throw new Error('Could not create deposit');
        }
        const deposit = { ...r.data, ...{ pool } };

        this.context.commit('set', deposit);

        return { deposit };
    }
}

export default DepositModule;
