import Vue from 'vue';
import Vuex from 'vuex';

import AccountStore from './modules/account';
import PoolStore from './modules/pools';
import PromoCodeStore from './modules/promoCodes';
import RewardStore from './modules/rewards';
import WidgetStore from './modules/widgets';
import ERC20Store from './modules/erc20';
import ERC721Store from './modules/erc721';

Vue.use(Vuex);

const mutations = {};
const actions = {};
const getters = {};
const modules = {
    account: AccountStore,
    pools: PoolStore,
    promoCodes: PromoCodeStore,
    rewards: RewardStore,
    widgets: WidgetStore,
    erc20: ERC20Store,
    erc721: ERC721Store,
};

export default new Vuex.Store({
    state: {},
    getters,
    mutations,
    actions,
    modules,
});
