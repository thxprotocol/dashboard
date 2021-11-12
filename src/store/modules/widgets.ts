import { Vue } from 'vue-property-decorator';
import axios from 'axios';
import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators';
import { Reward } from './rewards';

export class Widget {
    clientId: string;
    clientSecret: string;
    registrationAccessToken: string;
    requestUri: string;
    metadata: any;
    reward: Reward | null = null;

    constructor(data: any) {
        this.clientId = data.clientId;
        this.clientSecret = data.clientSecret;
        this.registrationAccessToken = data.registrationAccessToken;
        this.requestUri = data.requestUris[0];
        this.metadata = {
            height: 60,
            width: 310,
            rewardId: data.metadata.rewardId,
            poolAddress: data.metadata.poolAddress,
        };
    }

    setReward(reward: Reward) {
        this.reward = reward;
    }
}

export interface IWidgets {
    [poolAddress: string]: { [rat: string]: Widget };
}

@Module({ namespaced: true })
class WidgetModule extends VuexModule {
    _all: IWidgets = {};

    get all() {
        return this._all;
    }

    @Mutation
    set(widget: Widget) {
        if (!this._all[widget.metadata.poolAddress]) {
            Vue.set(this._all, widget.metadata.poolAddress, {});
        }
        Vue.set(this._all[widget.metadata.poolAddress], widget.clientId, widget);
    }

    @Mutation
    unset(data: { clientId: string; poolAddress: string }) {
        Vue.delete(this._all[data.poolAddress], data.clientId);
    }

    @Action
    async list(poolAddress: string) {
        try {
            const r = await axios({
                method: 'GET',
                url: '/widgets?asset_pool=' + poolAddress,
            });

            if (r.status !== 200) {
                throw new Error('GET /widgets failed.');
            }

            for (const rat of r.data) {
                const r = await axios({
                    method: 'GET',
                    url: '/widgets/' + rat,
                });

                this.context.commit('set', new Widget(r.data));
            }
        } catch (e) {
            console.error(e);
        }
    }

    @Action
    async create(data: {
        metadata: { rewardId: number; poolAddress: string };
        requestUris: string[];
        redirectUris: string[];
        postLogoutRedirectUris: string[];
    }) {
        try {
            const r = await axios({
                method: 'POST',
                url: '/widgets',
                data,
            });

            if (r.status !== 201) {
                throw new Error('POST /widgets failed.');
            }
        } catch (e) {
            console.error(e);
        }
    }

    @Action
    async remove(data: { clientId: string; poolAddress: string }) {
        try {
            await axios({
                method: 'DELETE',
                url: '/widgets/' + data.clientId,
            });

            this.context.commit('unset', { clientId: data.clientId, poolAddress: data.poolAddress });
        } catch (e) {
            console.log(e);
            debugger;
        }
    }
}

export default WidgetModule;
