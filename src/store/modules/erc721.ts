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
class ERC721Module extends VuexModule {
    _all: IERC721s = {};

    get all() {
        return this._all;
    }

    @Mutation
    set(erc721: TERC721) {
        Vue.set(this._all, erc721.id, erc721);
    }

    @Action({ rawError: true })
    async read(id: string) {
        const { data } = await axios({
            method: 'GET',
            url: '/erc721/' + id,
        });

        this.context.commit('set', data);
    }
}

export default ERC721Module;
