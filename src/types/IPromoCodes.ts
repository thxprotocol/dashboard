import { TPromoCode } from '@/store/modules/promoCodes';

export interface IPromoCodes {
    [poolAddress: string]: { [id: string]: TPromoCode };
}
