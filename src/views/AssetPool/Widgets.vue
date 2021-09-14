<template>
    <div>
        <b-button
            v-b-modal="'modalWidgetCreate'"
            :disabled="!filteredRewards.length"
            class="float-right rounded-pill"
            variant="primary"
        >
            <i class="fas fa-plus mr-2"></i>
            <span>Create a widget</span>
        </b-button>
        <h2>Widgets</h2>
        <p>Use THX widgets for adding engagement features without too much effort.</p>
        <b-card class="shadow-sm">
            <b-alert v-if="!filteredRewards.length" variant="info" show>
                Your asset pool has no rewards configured.
            </b-alert>
            <div class="row pt-2 pb-2">
                <div class="col-md-3">
                    <strong>ID</strong>
                </div>
                <div class="col-md-4">
                    <strong>Page URL</strong>
                </div>
                <div class="col-md-2">
                    <strong>Reward</strong>
                </div>
                <div class="col-md-2">
                    <strong>Type</strong>
                </div>
                <div class="col-md-1"></div>
            </div>
            <b-form-group class="mb-0" :key="widget.clientId" v-for="widget of widgets[assetPool.address]">
                <hr />
                <div class="row pt-2 pb-2">
                    <div class="col-md-3 d-flex align-items-center">
                        {{ widget.clientId }}
                    </div>
                    <div class="col-md-4 d-flex align-items-center">
                        {{ widget.requestUri }}
                    </div>
                    <div class="col-md-2 d-flex align-items-center">
                        <template v-if="widget.reward"
                            >{{ widget.reward.withdrawAmount }} {{ assetPool.poolToken.symbol }}</template
                        >
                    </div>
                    <div class="col-md-2 d-flex align-items-center">Claim Button</div>
                    <div class="col-md-1 text-right">
                        <b-button class="rounded-pill" variant="light" v-b-modal="`modalWidgetEdit-${widget.clientId}`">
                            <i class="fas fa-pencil-alt text-primary ml-0"></i
                        ></b-button>
                    </div>
                </div>
                <base-modal-widget-edit :assetPool="assetPool" :filteredRewards="filteredRewards" :widget="widget" />
            </b-form-group>
        </b-card>

        <base-modal-widget-create @submit="getWidgets()" :assetPool="assetPool" :filteredRewards="filteredRewards" />
    </div>
</template>

<script lang="ts">
import { Client, IClients } from '@/store/modules/clients';
import { IAssetPools } from '@/store/modules/assetPools';
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
import { IRewards, Reward } from '@/store/modules/rewards';
import { IWidgets } from '@/store/modules/widgets';
import BaseModalWidgetCreate from '@/components/ModalWidgetCreate.vue';
import BaseModalWidgetEdit from '@/components/ModalWidgetEdit.vue';

@Component({
    components: {
        'base-modal-widget-create': BaseModalWidgetCreate,
        'base-modal-widget-edit': BaseModalWidgetEdit,
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

    error = '';
    loading = true;

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
        } catch (e) {
            this.error = 'Could not get the rewards.';
        } finally {
            this.loading = false;
        }
    }
}
</script>
