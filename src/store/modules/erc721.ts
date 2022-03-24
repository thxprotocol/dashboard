import { Vue } from 'vue-property-decorator';
import axios from 'axios';
import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators';

type TERC721 = {
    id: string;
    address: string;
    name: string;
    symbol: string;
    description: string;
    baseURL: string;
};

interface IERC721s {
    [id: string]: TERC721[];
}

@Module({ namespaced: true })
class RewardModule extends VuexModule {
    _all: IERC721s = {};

    get all() {
        return this._all;
    }

    @Mutation
    set(erc721: TERC721) {
        Vue.set(this._all, erc721.id, erc721);
    }

    @Action
    async read({ poolAddress, id }: { poolAddress: string; id: string }) {
        try {
            const { data } = await axios({
                method: 'GET',
                url: '/promo_codes/' + id,
                headers: { AssetPool: poolAddress },
            });

            this.context.commit('set', data);
        } catch (error) {
            return { error };
        }
    }
}

export default RewardModule;
