import axios from 'axios';
import Vue from 'vue';
import { Action, Module, VuexModule } from 'vuex-module-decorators';

export interface TBrand {
    logoImgUrl: string;
    backgroundImgUrl: string;
}

export interface TBrandState {
    [poolId: string]: string;
}

@Module({ namespaced: true })
class BrandModule extends VuexModule {
    _all: TBrandState = {};

    get all() {
        return this._all;
    }

    @Action({ rawError: true })
    async pool(poolId: string) {
        try {
            if (this._all[poolId]) {
                return this._all[poolId];
            }

            const { data } = await axios({
                url: '/brands',
                method: 'GET',
                headers: {
                    'X-PoolId': poolId,
                },
            });

            Vue.set(this._all, poolId, data);
            return data;
        } catch (e) {
            console.log(e);
            return {};
        }
    }

    @Action({ rawError: true })
    async update({ backgroundImgUrl, logoImgUrl, poolId }: TBrand & { poolId: string }) {
        return axios({
            url: '/brands',
            method: 'PUT',
            headers: {
                'X-PoolId': poolId,
            },
            data: {
                backgroundImgUrl,
                logoImgUrl,
            },
        });
    }
}

export default BrandModule;
