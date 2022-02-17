import Vue from 'vue';
import Vuex from 'vuex';

import AccountStore from './modules/account';
import AssetPoolStore from './modules/assetPools';
import PromoCodeStore from './modules/promoCodes';
import RewardStore from './modules/rewards';
import WidgetStore from './modules/widgets';

Vue.use(Vuex);

const mutations = {};
const actions = {};
const getters = {};
const modules = {
    account: AccountStore,
    assetPools: AssetPoolStore,
    promoCodes: PromoCodeStore,
    rewards: RewardStore,
    widgets: WidgetStore,
};

export default new Vuex.Store({
    state: {},
    getters,
    mutations,
    actions,
    modules,
});
