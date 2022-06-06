import { Vue } from 'vue-property-decorator';
import axios from 'axios';
import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators';
import { IPool, NetworkProvider } from '@/store/modules/pools';
import { ITransactions } from '@/types/ITransactions';

export enum TransactionType {
    Default = 0,
    ITX = 1,
}

export enum TransactionState {
    Scheduled = 0,
    Mined = 1,
    Failed = 2,
    Sent = 3,
}

export type TTransaction = {
    type: TransactionType;
    state: TransactionState;
    from: string;
    to: string;
    nonce: number;
    gas: string;
    network: NetworkProvider;
    transactionHash: string;
    relayTransactionHash?: string;
    call?: { fn: string; args: string };
    baseFee?: string;
    maxFeeForGas?: string;
    maxPriorityFeeForGas?: string;
};

@Module({ namespaced: true })
class TransactionModule extends VuexModule {
    _all: ITransactions = {};

    get all() {
        return this._all;
    }

    @Mutation
    set({ pool, transaction }: { pool: IPool; transaction: TTransaction }) {
        if (!this._all[pool._id]) {
            Vue.set(this._all, pool._id, {});
        }
        Vue.set(this._all[pool._id], transaction.transactionHash, transaction);
    }

    @Action({ rawError: true })
    async list(pool: IPool) {
        const r = await axios({
            method: 'GET',
            url: '/transactions',
            headers: { 'X-PoolAddress': pool.address },
        });

        for (const transaction of r.data.results) {
            this.context.commit('set', { transaction, pool });
        }
    }
}
export default TransactionModule;
