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

        <b-row>
            <b-col md="6" :key="reward.id" v-for="reward of filteredRewards">
                <base-card-reward :assetPool="assetPool" :reward="reward" :isGovernanceEnabled="isGovernanceEnabled" />
            </b-col>
        </b-row>
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
        'base-card-reward': BaseListItemReward,
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
