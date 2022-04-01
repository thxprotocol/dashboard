import { Vue } from 'vue-property-decorator';
import axios from 'axios';
import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators';

export type TERC20 = {
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
class ERC20Module extends VuexModule {
    _all: IERC20s = {};

    get all() {
        return this._all;
    }

    @Mutation
    set(erc721: TERC20) {
        Vue.set(this._all, erc721.id, erc721);
    }

    @Action({ rawError: true })
    async list() {
        const { data } = await axios({
            method: 'GET',
            url: '/erc20',
        });
        data.forEach((erc20: TERC20) => this.context.commit('set', erc20));
    }

    @Action({ rawError: true })
    async read(id: string) {
        const { data } = await axios({
            method: 'GET',
            url: '/erc20/' + id,
        });

        this.context.commit('set', data);
    }

    @Action({ rawError: true })
    async create(payload: any) {
        const { data } = await axios({
            method: 'POST',
            url: '/erc20/',
            data: payload,
        });

        this.context.commit('set', data);
    }
}

export default ERC20Module;
