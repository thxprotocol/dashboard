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
}

export default DepositModule;
