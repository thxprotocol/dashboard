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
        const r = await axios({
            method: 'GET',
            url: '/promotions',
            headers: { 'X-PoolAddress': pool.address },
        });

        for (const promotion of r.data.results) {
            this.context.commit('set', { promotion, pool });
        }
    }

    @Action({ rawError: true })
    async read({ pool, id }: { pool: IPool; id: string }) {
        const r = await axios({
            method: 'GET',
            url: '/promotions/' + id,
            headers: { 'X-PoolAddress': pool.address },
        });

        this.context.commit('set', { pool, promotion: r.data });
    }

    @Action({ rawError: true })
    async create({ pool, promotion }: { pool: IPool; promotion: TPromotion }) {
        await axios({
            method: 'POST',
            url: '/promotions',
            headers: { 'X-PoolAddress': pool.address },
            data: promotion,
        });

        this.context.commit('set', { promotion, pool });
    }

    @Action({ rawError: true })
    async delete(promotion: TPromotion) {
        await axios({
            method: 'DELETE',
            url: '/promotions/' + promotion.id,
            headers: { 'X-PoolAddress': promotion.poolAddress },
        });

        this.context.commit('remove', promotion);
    }
}

export default RewardModule;