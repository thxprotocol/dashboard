import { TPayment } from '@/store/modules/payments';

export interface IPayments {
    [poolId: string]: { [id: string]: TPayment };
}
