import axios from 'axios';
import { Module, VuexModule, Action } from 'vuex-module-decorators';
import { IDeposits } from '@/types/IDeposits';

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

    // @Mutation
    // set(deposit: TDeposit) {
    //     if (!this._all[deposit.poolAddress]) {
    //         Vue.set(this._all, deposit.poolAddress, {});
    //     }
    //     Vue.set(this._all[deposit.poolAddress], deposit.id, deposit);
    // }

    @Action({ rawError: true })
    async list({ poolAddress }: { poolAddress: string }) {
        try {
            const r = await axios({
                method: 'GET',
                url: '/deposits',
                headers: { AssetPool: poolAddress },
            });

            if (r.status !== 200) {
                throw new Error('Could not list deposits.');
            }

            for (const data of r.data.results) {
                this.context.commit('set', { ...data, ...{ poolAddress } });
            }
        } catch (error) {
            return { error };
        }
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
                throw new Error('GET all rewards failed');
            }

            this.context.commit('set', { ...r.data, ...{ poolAddress } });
        } catch (error) {
            return { error };
        }
    }

    @Action({ rawError: true })
    async create({ amount, poolAddress }: { amount: number; poolAddress: string }) {
        try {
            const r = await axios({
                method: 'POST',
                url: '/deposits/' + poolAddress,
                headers: {
                    AssetPool: poolAddress,
                },
                data: { amount },
            });

            if (r.status !== 201) {
                throw new Error('Could not create deposit');
            }
            const deposit = { ...r.data, ...{ poolAddress } };

            this.context.commit('set', deposit);

            return { deposit };
        } catch (error) {
            return { error };
        }
    }
}

export default DepositModule;