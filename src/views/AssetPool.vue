<template>
    <div class="pt-5">
        <div class="container container-md" v-if="assetPool">
            <div class="d-flex align-items-center">
                <h1 class="mr-3">
                    {{ assetPool.poolToken.symbol + ' Pool' }}
                </h1>
                <b-badge variant="gray" class="text-white p-2" v-if="network === 0">Polygon Test</b-badge>
                <b-badge variant="primary" class="p-2" v-if="network === 1">Polygon Main</b-badge>
            </div>

            <!-- <p class="text-muted">Created at November 15th 4:30 am | Block #333213</p> -->
            <hr />
            <div class="d-flex mb-4 mt-5">
                <router-link
                    class="btn btn-tab shadow-sm"
                    :style="{
                        'background-image': `url(${require('../assets/thx_jumbotron.webp')})`,
                    }"
                    :to="`/pool/${assetPool.address}/info`"
                >
                    <img height="30" :src="require('../assets/thx_pool_info.webp')" />
                    <div class="d-none d-md-block">Information</div>
                </router-link>
                <router-link
                    class="btn btn-tab shadow-sm"
                    :style="{
                        'background-image': `url(${require('../assets/thx_jumbotron.webp')})`,
                    }"
                    :to="`/pool/${assetPool.address}/rewards`"
                >
                    <img height="30" :src="require('../assets/thx_pool_rewards.webp')" />
                    <div class="d-none d-md-block">Rewards</div>
                </router-link>
                <router-link
                    class="btn btn-tab shadow-sm"
                    :style="{
                        'background-image': `url(${require('../assets/thx_jumbotron.webp')})`,
                    }"
                    :to="`/pool/${assetPool.address}/widgets`"
                >
                    <img height="30" :src="require('../assets/thx_pool_widgets.webp')" />
                    <div class="d-none d-md-block">Widgets</div>
                </router-link>
                <router-link
                    class="btn btn-tab shadow-sm"
                    :style="{
                        'background-image': `url(${require('../assets/thx_jumbotron.webp')})`,
                    }"
                    :to="`/pool/${assetPool.address}/authorization`"
                >
                    <img height="30" :src="require('../assets/thx_pool_authorization.webp')" />
                    <div class="d-none d-md-block">Authorization</div>
                </router-link>
            </div>
            <router-view></router-view>
        </div>
    </div>
</template>

<script lang="ts">
import { Client, IClients } from '@/store/modules/clients';
import { IAssetPools, NetworkProvider } from '@/store/modules/assetPools';
import {
    BAlert,
    BBadge,
    BButton,
    BCard,
    BCardText,
    BCollapse,
    BFormCheckbox,
    BFormGroup,
    BFormInput,
    BFormTextarea,
    BFormSelect,
    BFormSelectOption,
    BInputGroup,
    BLink,
    BModal,
    BOverlay,
    BTabs,
    BTab,
    BListGroupItem,
    BListGroup,
    BPopover,
    BInputGroupAppend,
    BSpinner,
} from 'bootstrap-vue';
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import axios from 'axios';
import { IRewards, Reward } from '@/store/modules/rewards';
import { IWidgets } from '@/store/modules/widgets';

@Component({
    components: {
        'b-modal': BModal,
        'b-alert': BAlert,
        'b-tabs': BTabs,
        'b-tab': BTab,
        'b-card-text': BCardText,
        'b-link': BLink,
        'b-card': BCard,
        'b-badge': BBadge,
        'b-spinner': BSpinner,
        'b-form-checkbox': BFormCheckbox,
        'b-form-group': BFormGroup,
        'b-form-select': BFormSelect,
        'b-form-textarea': BFormTextarea,
        'b-form-select-option': BFormSelectOption,
        'b-form-input': BFormInput,
        'b-list-group': BListGroup,
        'b-list-group-item': BListGroupItem,
        'b-input-group': BInputGroup,
        'b-input-group-append': BInputGroupAppend,
        'b-button': BButton,
        'b-collapse': BCollapse,
        'b-overlay': BOverlay,
        'b-popover': BPopover,
    },
    computed: mapGetters({
        assetPools: 'assetPools/all',
        clients: 'clients/all',
        rewards: 'rewards/all',
        widgets: 'widgets/all',
    }),
})
export default class AssetPoolView extends Vue {
    docsUrl = process.env.VUE_APP_DOCS_URL;
    apiUrl = process.env.VUE_APP_API_ROOT;
    widgetUrl = process.env.VUE_APP_WIDGET_URL;

    error = '';
    loading = true;
    enableGovernance = false;
    rewardPollDuration = 0;
    withdrawPollDuration = 0;
    network: NetworkProvider = NetworkProvider.Test;
    accessToken = '';
    reward = {
        withdrawAmount: 0,
        withdrawDuration: 0,
    };

    widgetReward: Reward | null = null;
    widgetRequestUri = '';

    assetPools!: IAssetPools;
    clients!: IClients;
    rewards!: IRewards;
    widgets!: IWidgets;

    get assetPool() {
        return this.assetPools[this.$route.params.address];
    }

    get filteredRewards(): Reward[] {
        if (this.rewards[this.assetPool.address]) {
            return Object.values(this.rewards[this.assetPool.address]);
        }
        return [];
    }

    get client() {
        return (
            Object.values(this.clients).find(
                (client: Client) => client.registrationAccessToken === this.assetPool.rat,
            ) || null
        );
    }

    async getWidgets() {
        await this.$store.dispatch('widgets/list', this.assetPool.address);

        for (const rat in this.widgets[this.assetPool.address]) {
            const widget = this.widgets[this.assetPool.address][rat];
            const reward = this.rewards[this.assetPool.address][widget.metadata.rewardId];

            this.widgets[this.assetPool.address][rat].setReward(reward);
        }
    }

    async mounted() {
        try {
            await this.$store.dispatch('assetPools/read', this.$route.params.address);
            await this.$store.dispatch('clients/read', this.assetPool.rat);
            await this.$store.dispatch('rewards/read', this.assetPool.address);
            await this.getWidgets();

            this.widgetReward = this.filteredRewards[0];
            this.enableGovernance = !this.assetPool.bypassPolls;
            this.network = this.assetPool.network;
        } catch (e) {
            this.error = 'Could not get the rewards.';
        } finally {
            this.loading = false;
        }
    }

    async createWidget() {
        try {
            await this.$store.dispatch('widgets/create', {
                requestUris: [this.widgetRequestUri],
                redirectUris: [this.widgetRequestUri],
                postLogoutRedirectUris: [this.widgetRequestUri],
                metadata: {
                    rewardId: this.widgetReward?.id,
                    poolAddress: this.assetPool.address,
                },
            });
            await this.getWidgets();
        } catch (e) {
            debugger;
        }
    }

    async addReward() {
        this.loading = true;
        try {
            await this.$store.dispatch('rewards/create', {
                address: this.assetPool.address,
                withdrawAmount: this.reward.withdrawAmount,
                withdrawDuration: this.reward.withdrawDuration,
            });

            this.reward.withdrawAmount = 0;
            this.reward.withdrawDuration = 0;
        } catch (e) {
            console.log(e);
            this.error = 'Could not add the reward.';
        } finally {
            this.loading = false;
        }
    }

    authHeader() {
        return btoa(`${this.client?.clientId}:${this.client?.clientSecret}`);
    }

    async getAccessToken() {
        try {
            const data = new URLSearchParams();
            data.append('grant_type', 'client_credentials');
            data.append('scope', 'openid admin');

            const r = await axios({
                url: this.apiUrl + '/token',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + this.authHeader(),
                },
                data,
            });

            this.accessToken = r.data;
        } catch (e) {
            console.error(e);
            this.error = 'Could not request an access token.';
        }
    }

    async updateAssetPool() {
        this.loading = true;

        try {
            await this.$store.dispatch('assetPools/update', {
                address: this.assetPool.address,
                data: {
                    bypassPolls: !this.enableGovernance,
                    rewardPollDuration: this.rewardPollDuration,
                    withdrawPollDuration: this.withdrawPollDuration,
                },
            });
        } catch (e) {
            console.error(e);
            this.error = 'Could not update your asset pool.';
        } finally {
            this.loading = false;
        }
    }
}
</script>
