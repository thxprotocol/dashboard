import { TDeposit } from '@/store/modules/deposits';

export interface IDeposits {
    [poolAddress: string]: { [id: string]: TDeposit };
}
