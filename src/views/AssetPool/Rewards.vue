<template>
    <div>
        <b-row class="mb-3">
            <b-col class="d-flex align-items-center">
                <h2 class="mb-0">Rewards</h2>
            </b-col>
            <b-col class="d-flex justify-content-end">
                <b-button v-b-modal="'modalRewardCreate'" class="rounded-pill" variant="primary">
                    <i class="fas fa-plus mr-2"></i>
                    <span class="d-none d-md-inline">Create a reward</span>
                </b-button>
            </b-col>
        </b-row>
        <b-card class="shadow-sm">
            <div class="row pt-2 pb-2">
                <div class="col-md-3 offset-md-1">
                    <strong>Withdraw amount</strong>
                </div>
                <div v-if="isGovernanceEnabled" class="col-md-3">
                    <strong>Withdraw poll duration</strong>
                </div>
                <div class="col-md-3">
                    <strong>Withdraw condition</strong>
                </div>
                <div v-if="isGovernanceEnabled ? 'col-md-5' : 'col-md-4'">
                    <strong></strong>
                </div>
            </div>
            <b-skeleton-wrapper :loading="rewardsLoading">
                <template #loading>
                    <b-form-group class="mb-0">
                        <hr />
                        <div class="row pt-2 pb-2">
                            <div class="col-md-1">
                                <b-skeleton animation="fade" width="85%"></b-skeleton>
                                <b-skeleton animation="fade" width="80%"></b-skeleton>
                            </div>
                            <div class="col-md-4">
                                <b-skeleton animation="fade" width="85%"></b-skeleton>
                                <b-skeleton animation="fade" width="80%"></b-skeleton>
                            </div>
                            <div class="col-md-6">
                                <b-skeleton animation="fade" width="85%"></b-skeleton>
                                <b-skeleton animation="fade" width="80%"></b-skeleton>
                            </div>
                            <div class="col-md-1">
                                <b-skeleton type="avatar"></b-skeleton>
                            </div>
                        </div>
                    </b-form-group>
                </template>
                <base-list-item-reward
                    :assetPool="assetPool"
                    :reward="reward"
                    :isGovernanceEnabled="isGovernanceEnabled"
                    :key="reward.id"
                    v-for="reward of filteredRewards"
                />
            </b-skeleton-wrapper>
        </b-card>
        <base-modal-reward-create
            :assetPool="assetPool"
            :filteredRewards="filteredRewards"
            :isGovernanceEnabled="isGovernanceEnabled"
        />
    </div>
</template>

<script lang="ts">
import { IAssetPools } from '@/store/modules/assetPools';
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import { IRewards, Reward } from '@/store/modules/rewards';
import BaseModalRewardCreate from '@/components/modals/BaseModalRewardCreate.vue';
import BaseListItemReward from '@/components/list-items/BaseListItemReward.vue';

@Component({
    components: {
        BaseModalRewardCreate,
        BaseListItemReward,
    },
    computed: mapGetters({
        assetPools: 'assetPools/all',
        rewards: 'rewards/all',
    }),
})
export default class AssetPoolView extends Vue {
    docsUrl = process.env.VUE_APP_DOCS_URL;
    apiUrl = process.env.VUE_APP_API_ROOT;
    widgetUrl = process.env.VUE_APP_WIDGET_URL;

    error = '';
    loading = true;
    rewardsLoading = true;
    assetPoolLoading = true;
    isGovernanceEnabled = false;

    assetPools!: IAssetPools;
    rewards!: IRewards;

    get assetPool() {
        return this.assetPools[this.$route.params.address];
    }

    get filteredRewards(): Reward[] {
        if (this.rewards[this.assetPool.address]) {
            return Object.values(this.rewards[this.assetPool.address]);
        }
        return [];
    }

    async mounted() {
        try {
            await this.$store.dispatch('rewards/read', this.assetPool.address);

            this.isGovernanceEnabled = !this.assetPool.bypassPolls;
        } catch (e) {
            this.error = 'Could not get the rewards.';
        } finally {
            this.rewardsLoading = false;
            this.assetPoolLoading = false;
        }
    }
}
</script>
