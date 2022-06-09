import { TTransaction } from '@/store/modules/transactions';

export interface ITransactions {
    [poolAddress: string]: { [id: string]: TTransaction };
}
