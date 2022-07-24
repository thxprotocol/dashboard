import { Vue } from 'vue-property-decorator';
import axios from 'axios';
import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators';
import { IPool } from './pools';
import { ChainId } from '@/types/enums/ChainId';
import { TERC721, IERC721s, TERC721Metadata, TERC721DefaultProp } from '@/types/erc721';

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

    @Mutation
    setMetadata(payload: { erc721: TERC721; metadata: TERC721Metadata }) {
        if (!this._all[payload.erc721._id].metadata) {
            return Vue.set(this._all[payload.erc721._id], 'metadata', [payload.metadata]);
        }
        const index = payload.erc721.metadata.findIndex((m: TERC721Metadata) => m._id === payload.metadata._id) || 0;

        Vue.set(
            this._all[payload.erc721._id]['metadata'],
            index > -1 ? index : payload.erc721.metadata.length++,
            payload.metadata,
        );
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
    async listMetadata(erc721: TERC721) {
        const { data } = await axios({
            method: 'GET',
            url: `/erc721/${erc721._id}/metadata`,
        });

        for (const metadata of data) {
            this.context.commit('setMetadata', { erc721, metadata });
        }
    }

    @Action({ rawError: true })
    async read(id: string) {
        const { data } = await axios({
            method: 'GET',
            url: '/erc721/' + id,
        });

        data.properties.map((prop: TERC721DefaultProp) => {
            prop.value = '';
            return prop;
        });

        const erc721 = {
            ...data,
            loading: false,
            logoURI: `https://avatars.dicebear.com/api/identicon/${data._id}.svg`,
        };

        this.context.commit('set', erc721);

        return erc721;
    }

    @Action({ rawError: true })
    async create(payload: { network: ChainId; name: string; symbol: string; schema: string[] }) {
        const { data } = await axios({
            method: 'POST',
            url: '/erc721',
            data: payload,
        });

        this.context.commit('set', data);
    }

    @Action({ rawError: true })
    async createMetadata(payload: {
        pool: IPool;
        erc721: TERC721;
        title?: string;
        description?: string;
        attributes: any;
        recipient?: string;
    }) {
        const { data } = await axios({
            method: 'POST',
            url: `/erc721/${payload.erc721._id}/metadata`,
            headers: { 'X-PoolId': payload.pool._id },
            data: {
                title: payload.title,
                description: payload.description,
                attributes: payload.attributes,
                recipient: payload.recipient,
            },
        });
        this.context.commit('setMetadata', { erc721: payload.erc721, metadata: data });
    }

    @Action({ rawError: true })
    async mint({
        pool,
        erc721,
        erc721Metadata,
        recipient,
    }: {
        pool: IPool;
        erc721: TERC721;
        erc721Metadata: TERC721Metadata;
        recipient?: string;
    }) {
        const { data } = await axios({
            method: 'POST',
            url: `/erc721/${erc721._id}/metadata/${erc721Metadata._id}/mint`,
            headers: { 'X-PoolId': pool._id },
            data: {
                recipient,
            },
        });
        this.context.commit('setMetadata', { erc721, metadata: data });
    }
}

export default ERC721Module;
