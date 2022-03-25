import { Vue } from 'vue-property-decorator';
import axios from 'axios';
import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators';

export interface IPromoCodes {
    [poolAddress: string]: { [id: string]: PromoCode };
}

export class PromoCode {
    id: string;
    poolAddress: string;
    title: string;
    description: string;
    value: string;
    price: number;

    constructor(data: any) {
        this.id = data.id;
        this.poolAddress = data.poolAddress;
        this.title = data.title;
        this.description = data.description;
        this.value = data.value;
        this.price = data.price;
    }
}

@Module({ namespaced: true })
class RewardModule extends VuexModule {
    _all: IPromoCodes = {};

    get all() {
        return this._all;
    }

    @Mutation
    set(promoCode: PromoCode) {
        if (!this._all[promoCode.poolAddress]) {
            Vue.set(this._all, promoCode.poolAddress, {});
        }
        Vue.set(this._all[promoCode.poolAddress], promoCode.id, promoCode);
    }

    @Mutation
    remove(promoCode: PromoCode) {
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
                url: '/promo_codes',
                headers: { AssetPool: poolAddress },
            });

            if (r.status !== 200) {
                throw new Error('Could not list promo codes.');
            }

            for (const data of r.data.results) {
                this.context.commit('set', new PromoCode({ ...data, ...{ poolAddress } }));
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
                url: '/promo_codes/' + id,
                headers: { AssetPool: poolAddress },
            });

            if (r.status !== 200) {
                throw new Error('GET all rewards failed');
            }

            this.context.commit('set', new PromoCode({ ...r.data, ...{ poolAddress } }));
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
                url: '/promo_codes',
                headers: {
                    AssetPool: poolAddress,
                },
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
            const promoCode = new PromoCode({ ...r.data, ...{ poolAddress } });

            this.context.commit('set', promoCode);

            return { promoCode };
        } catch (error) {
            return { error };
        }
    }

    @Action({ rawError: true })
    async delete(promoCode: PromoCode) {
        try {
            const r = await axios({
                method: 'DELETE',
                url: '/promo_codes/' + promoCode.id,
                headers: {
                    AssetPool: promoCode.poolAddress,
                },
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
