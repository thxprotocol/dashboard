import { TDeposit } from '@/store/modules/deposits';

export interface IDeposits {
    [poolAddress: string]: { [id: string]: TDeposit };
}

export type IDepositByPage = { [page: number]: IDeposits[] };
