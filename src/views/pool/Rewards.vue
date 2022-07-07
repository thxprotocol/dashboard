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
        <base-nothing-here
            v-if="!filteredRewards.length"
            text-submit="Create a Reward"
            title="You have not created a reward yet"
            description="Use rewards to send your tokens to people and use reward configuration to limit claims."
            @clicked="$bvModal.show('modalRewardCreate')"
        />
        <b-row v-else>
            <b-col md="6" :key="reward.id" v-for="reward of filteredRewards">
                <base-card-reward :pool="pool" :reward="reward" />
            </b-col>
        </b-row>
        <base-modal-reward-create :pool="pool" :erc721="erc721" :filteredRewards="filteredRewards" />
    </div>
</template>

<script lang="ts">
import { IPools } from '@/store/modules/pools';
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import { IRewards, Reward } from '@/types/rewards';
import BaseModalRewardCreate from '@/components/modals/BaseModalRewardCreate.vue';
import BaseListItemReward from '@/components/list-items/BaseListItemReward.vue';
import BaseNothingHere from '@/components/BaseListStateEmpty.vue';
import { IERC721s, TERC721 } from '@/types/erc721';

@Component({
    components: {
        BaseNothingHere,
        BaseModalRewardCreate,
        'base-card-reward': BaseListItemReward,
    },
    computed: mapGetters({
        pools: 'pools/all',
        rewards: 'rewards/all',
        erc721s: 'erc721/all',
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

    pools!: IPools;
    rewards!: IRewards;
    erc721s!: IERC721s;

    get pool() {
        return this.pools[this.$route.params.id];
    }

    get erc721(): TERC721 {
        return this.erc721s[this.pool.token._id];
    }

    get filteredRewards(): Reward[] {
        if (!this.rewards[this.$route.params.id]) return [];
        return Object.values(this.rewards[this.$route.params.id]);
    }

    mounted() {
        this.$store.dispatch('rewards/list', this.pool._id);

        if (this.pool.isNFTPool) {
            this.$store.dispatch('erc721/read', this.pool.token._id).then(async () => {
                await this.$store.dispatch('erc721/listMetadata', this.erc721);
            });
        }
    }
}
</script>
