import { Vue } from 'vue-property-decorator';
import axios from 'axios';
import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators';
import { NetworkProvider } from './pools';

type TERC721 = {
    _id: string;
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
        Vue.set(this._all, erc721._id, erc721);
    }

    @Action({ rawError: true })
    async list() {
        const { data } = await axios({
            method: 'GET',
            url: '/erc721',
        });

        for (const _id of data) {
            this.context.commit('set', { _id, loading: true });
        }
    }

    @Action({ rawError: true })
    async read(id: string) {
        const { data } = await axios({
            method: 'GET',
            url: '/erc721/' + id,
        });
        this.context.commit('set', {
            ...data,
            loading: false,
            logoURI: `https://avatars.dicebear.com/api/identicon/${data._id}.svg`,
        });
    }

    @Action({ rawError: true })
    async create(payload: { network: NetworkProvider; name: string; symbol: string; schema: string[] }) {
        const { data } = await axios({
            method: 'POST',
            url: '/erc721',
            data: payload,
        });

        this.context.commit('set', data);
    }
}

export default ERC721Module;
