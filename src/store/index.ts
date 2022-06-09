import Vue from 'vue';
import Vuex from 'vuex';

import AccountStore from './modules/account';
import PoolStore from './modules/pools';
import PromotionStore from './modules/promotions';
import RewardStore from './modules/rewards';
import WidgetStore from './modules/widgets';
import ERC20Store from './modules/erc20';
import ERC721Store from './modules/erc721';
import DepositStore from './modules/deposits';
import PaymentStore from './modules/payments';

Vue.use(Vuex);

const mutations = {};
const actions = {};
const getters = {};
const modules = {
    account: AccountStore,
    pools: PoolStore,
    promotions: PromotionStore,
    rewards: RewardStore,
    widgets: WidgetStore,
    erc20: ERC20Store,
    erc721: ERC721Store,
    deposits: DepositStore,
    payments: PaymentStore,
};

export default new Vuex.Store({
    state: {},
    getters,
    mutations,
    actions,
    modules,
});
