import { Vue } from 'vue-property-decorator';
import axios from 'axios';
import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators';
import { IERC20s, TERC20 } from '@/types/erc20';

@Module({ namespaced: true })
class ERC20Module extends VuexModule {
    _all: IERC20s = {};

    get all() {
        return this._all;
    }

    @Mutation
    set(erc20: TERC20) {
        Vue.set(this._all, erc20._id, erc20);
    }

    @Mutation
    unset(id: string) {
        Vue.delete(this._all, id);
    }

    @Action({ rawError: true })
    async list() {
        const { data } = await axios({
            method: 'GET',
            url: '/erc20',
        });

        for (const _id of data) {
            this.context.commit('set', { _id });
        }
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

    @Action({ rawError: true })
    async remove(id: string) {
        await axios({
            method: 'DELETE',
            url: '/erc20/' + id,
        });

        this.context.commit('unset', id);
    }
}

export default ERC20Module;
