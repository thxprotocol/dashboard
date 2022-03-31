import { Vue } from 'vue-property-decorator';
import axios from 'axios';
import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators';

type TERC20 = {
    id: string;
    address: string;
    name: string;
    symbol: string;
    description: string;
    baseURL: string;
};

interface IERC20s {
    [id: string]: TERC20[];
}

@Module({ namespaced: true })
class RewardModule extends VuexModule {
    _all: IERC20s = {};

    get all() {
        return this._all;
    }

    @Mutation
    set(erc721: TERC20) {
        Vue.set(this._all, erc721.id, erc721);
    }

    @Action
    async read({ poolAddress, id }: { poolAddress: string; id: string }) {
        try {
            const { data } = await axios({
                method: 'GET',
                url: '/erc20/' + id,
                headers: { AssetPool: poolAddress },
            });

            this.context.commit('set', data);
        } catch (error) {
            return { error };
        }
    }

    @Action
    async list() {
        try {
            const { data } = await axios({
                method: 'GET',
                url: '/erc20',
            });
            debugger;
            this.context.commit('set', data);
        } catch (error) {
            return { error };
        }
    }
}

export default RewardModule;
