import { TPromotion } from '@/store/modules/promotions';

export interface IPromotions {
    [poolAddress: string]: { [id: string]: TPromotion };
}
