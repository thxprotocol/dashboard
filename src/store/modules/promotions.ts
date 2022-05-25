import { Vue } from 'vue-property-decorator';
import axios from 'axios';
import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators';
import { IPromotions } from '@/types/IPromotions';
import { IPool } from './pools';

export type TPromotion = {
    id: string;
    poolAddress: string;
    title: string;
    description: string;
    value: string;
    price: number;
};

@Module({ namespaced: true })
class RewardModule extends VuexModule {
    _all: IPromotions = {};

    get all() {
        return this._all;
    }

    @Mutation
    set({ pool, promotion }: { pool: IPool; promotion: TPromotion }) {
        if (!this._all[pool._id]) {
            Vue.set(this._all, pool._id, {});
        }
        Vue.set(this._all[pool._id], promotion.id, promotion);
    }

    @Mutation
    remove({ pool, promotion }: { pool: IPool; promotion: TPromotion }) {
        Vue.delete(this._all[pool._id], promotion.id);

        if (!Object.values(this._all[pool._id]).length) {
            Vue.delete(this._all, pool._id);
        }
    }

    @Action({ rawError: true })
    async list(pool: IPool) {
        try {
            const r = await axios({
                method: 'GET',
                url: '/promotions',
                headers: { 'X-PoolAddress': pool.address },
            });

            if (r.status !== 200) {
                throw new Error('Could not list promo codes.');
            }

            for (const promotion of r.data.results) {
                this.context.commit('set', { promotion, pool });
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
                url: '/promotions/' + id,
                headers: { 'X-PoolAddress': poolAddress },
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
    async create({
        title,
        description,
        price,
        value,
        poolAddress,
    }: {
        title: string;
        description: string;
        price: number;
        value: string;
        poolAddress: string;
    }) {
        try {
            const r = await axios({
                method: 'POST',
                url: '/promotions',
                headers: { 'X-PoolAddress': poolAddress },
                data: {
                    title,
                    description,
                    price,
                    value,
                },
            });

            if (r.status !== 201) {
                throw new Error('Could not create promo code');
            }
            const promotion = { ...r.data, ...{ poolAddress } };

            this.context.commit('set', promotion);

            return { promotion };
        } catch (error) {
            return { error };
        }
    }

    @Action({ rawError: true })
    async delete(promotion: TPromotion) {
        try {
            const r = await axios({
                method: 'DELETE',
                url: '/promotions/' + promotion.id,
                headers: { 'X-PoolAddress': promotion.poolAddress },
            });

            if (r.status !== 204) {
                throw new Error('Could not delete promo code');
            }

            this.context.commit('remove', promotion);
        } catch (error) {
            console.log(error);
            debugger;
            return { error };
        }
    }
}

export default RewardModule;
