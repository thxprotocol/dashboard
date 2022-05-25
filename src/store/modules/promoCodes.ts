import { Vue } from 'vue-property-decorator';
import axios from 'axios';
import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators';
import { IPromoCodes } from '@/types/IPromoCodes';

export type TPromoCode = {
    id: string;
    poolAddress: string;
    title: string;
    description: string;
    value: string;
    price: number;
};

@Module({ namespaced: true })
class RewardModule extends VuexModule {
    _all: IPromoCodes = {};

    get all() {
        return this._all;
    }

    @Mutation
    set(promoCode: TPromoCode) {
        if (!this._all[promoCode.poolAddress]) {
            Vue.set(this._all, promoCode.poolAddress, {});
        }
        Vue.set(this._all[promoCode.poolAddress], promoCode.id, promoCode);
    }

    @Mutation
    remove(promoCode: TPromoCode) {
        Vue.delete(this._all[promoCode.poolAddress], promoCode.id);

        if (!Object.values(this._all[promoCode.poolAddress]).length) {
            Vue.delete(this._all, promoCode.poolAddress);
        }
    }

    @Action({ rawError: true })
    async list({ poolAddress }: { poolAddress: string }) {
        try {
            const r = await axios({
                method: 'GET',
                url: '/promotions',
                headers: { 'X-PoolAddress': poolAddress },
            });

            if (r.status !== 200) {
                throw new Error('Could not list promo codes.');
            }

            for (const data of r.data.results) {
                this.context.commit('set', { ...data, ...{ poolAddress } });
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
            const promoCode = { ...r.data, ...{ poolAddress } };

            this.context.commit('set', promoCode);

            return { promoCode };
        } catch (error) {
            return { error };
        }
    }

    @Action({ rawError: true })
    async delete(promoCode: TPromoCode) {
        try {
            const r = await axios({
                method: 'DELETE',
                url: '/promotions/' + promoCode.id,
                headers: { 'X-PoolAddress': promoCode.poolAddress },
            });

            if (r.status !== 204) {
                throw new Error('Could not delete promo code');
            }

            this.context.commit('remove', promoCode);
        } catch (error) {
            console.log(error);
            debugger;
            return { error };
        }
    }
}

export default RewardModule;
