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
                <div class="col-md-4">
                    <strong>Page URL</strong>
                </div>
                <div class="col-md-2">
                    <strong>Reward</strong>
                </div>
                <div class="col-md-2">
                    <strong>Type</strong>
                </div>
                <div class="col-md-2"></div>
            </div>
            <b-skeleton-wrapper :loading="skeletonLoading">
                <template #loading>
                    <b-form-group class="mb-0">
                        <hr />
                        <div class="row pt-2 pb-2">
                            <div class="col-md-4">
                                <b-skeleton animation="fade" width="85%"></b-skeleton>
                                <b-skeleton animation="fade" width="80%"></b-skeleton>
                            </div>
                            <div class="col-md-2">
                                <b-skeleton animation="fade" width="85%"></b-skeleton>
                                <b-skeleton animation="fade" width="80%"></b-skeleton>
                            </div>
                            <div class="col-md-2">
                                <b-skeleton animation="fade" width="85%"></b-skeleton>
                                <b-skeleton animation="fade" width="80%"></b-skeleton>
                            </div>
                            <div class="col-md-4 text-right d-flex justify-content-end">
                                <b-skeleton type="avatar" class="inline"></b-skeleton>
                                <b-skeleton type="avatar" class="inline ml-1"></b-skeleton>
                            </div>
                        </div>
                    </b-form-group>
                </template>
                <b-form-group class="mb-0" :key="widget.clientId" v-for="widget of widgets[assetPool.address]">
                    <hr />
                    <div class="row pt-2 pb-2">
                        <div class="col-md-4 d-flex align-items-center">
                            {{ widget.requestUri }}
                        </div>
                        <div class="col-md-2 d-flex align-items-center">
                            <template v-if="widget.reward"
                                >{{ widget.reward.withdrawAmount }} {{ assetPool.token.symbol }}</template
                            >
                        </div>
                        <div class="col-md-2 d-flex align-items-center">Claim Button</div>
                        <div class="col-md-4 text-right">
                            <b-button
                                class="rounded-pill"
                                variant="light"
                                v-b-modal="`modalWidgetEdit-${widget.clientId}`"
                            >
                                <i class="fas fa-pencil-alt text-primary ml-0"></i>
                            </b-button>
                            <b-button
                                class="rounded-pill ml-1"
                                variant="light"
                                v-b-modal="`modalDelete-${widget.clientId}`"
                            >
                                <i class="far fa-trash-alt text-primary ml-0"></i>
                            </b-button>
                        </div>
                    </div>
                    <base-modal-widget-edit
                        :assetPool="assetPool"
                        :filteredRewards="filteredRewards"
                        :widget="widget"
                    />
                    <modal-delete :id="`modalDelete-${widget.clientId}`" :call="remove" :subject="widget.clientId" />
                </b-form-group>
            </b-skeleton-wrapper>
        </b-card>

        <base-modal-widget-create @submit="getWidgets()" :assetPool="assetPool" :filteredRewards="filteredRewards" />
    </div>
</template>

<script lang="ts">
import { IAssetPools } from '@/store/modules/assetPools';
import { BAlert, BButton, BCard, BFormGroup, BModal, BSkeleton, BSkeletonWrapper } from 'bootstrap-vue';
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import { IRewards, Reward } from '@/store/modules/rewards';
import { IWidgets } from '@/store/modules/widgets';
import BaseModalWidgetCreate from '@/components/modals/BaseModalWidgetCreate.vue';
import BaseModalWidgetEdit from '@/components/modals/BaseModalWidgetEdit.vue';
import ModalDelete from '@/components/modals/BaseModalDelete.vue';

@Component({
    components: {
        BaseModalWidgetCreate,
        BaseModalWidgetEdit,
        ModalDelete,
        BFormGroup,
        BModal,
        BAlert,
        BCard,
        BButton,
        BSkeleton,
        BSkeletonWrapper,
    },
    computed: mapGetters({
        assetPools: 'assetPools/all',
        rewards: 'rewards/all',
        widgets: 'widgets/all',
    }),
})
export default class AssetPoolView extends Vue {
    docsUrl = process.env.VUE_APP_DOCS_URL;
    apiUrl = process.env.VUE_APP_API_ROOT;

    error = '';
    loading = true;
    skeletonLoading = true;

    assetPools!: IAssetPools;
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

    async getWidgets() {
        await this.$store.dispatch('widgets/list', this.assetPool.address);

        for (const clientId in this.widgets[this.assetPool.address]) {
            const widget = this.widgets[this.assetPool.address][clientId];
            const reward = this.rewards[this.assetPool.address][widget.metadata.rewardId];

            this.widgets[this.assetPool.address][clientId].setReward(reward);
        }
    }

    async mounted() {
        try {
            await this.$store.dispatch('account/getProfile');
            await this.$store.dispatch('rewards/read', this.assetPool.address);
            await this.getWidgets();
            this.skeletonLoading = false;
        } catch (e) {
            this.error = 'Could not get the rewards.';
        } finally {
            this.loading = false;
        }
    }

    async remove(clientId: string) {
        this.loading = true;
        try {
            await this.$store.dispatch('widgets/remove', { clientId, poolAddress: this.assetPool.address });
        } catch (e) {
            console.error(e);
        } finally {
            this.loading = false;
        }
    }
}
</script>
