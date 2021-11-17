<template>
    <div>
        <b-button v-b-modal="'modalRewardCreate'" class="float-right rounded-pill" variant="primary">
            <i class="fas fa-plus mr-2"></i>
            <span>Create a reward</span>
        </b-button>
        <h2 class="font-weight-normal">Rewards</h2>
        <p>Integrate THX API in your app to increase engement with gamified rewards.</p>
        <b-card class="shadow-sm mb-5">
            <b-form-group class="mb-0">
                <b-form-checkbox @change="updateAssetPool()" class="mb-0" v-model="enableGovernance">
                    <strong> Enable governance </strong>
                    (experimental)
                    <a :href="docsUrl + '/asset_pools#2-asset-pool-governance'" target="_blank">
                        <i class="fas fa-question-circle"></i>
                    </a>
                    <p class="text-muted mb-0">
                        Enabling governance will require a voting procedure for adding, updating or withdrawing rewards.
                    </p>
                </b-form-checkbox>
            </b-form-group>
            <template v-if="enableGovernance">
                <b-form-group class="mb-0">
                    <hr />
                    <div class="row">
                        <div class="col-md-4 d-flex align-items-center">
                            <label for="rewardPollDuration">
                                Default reward poll duration
                                <a
                                    v-b-tooltip
                                    title="Default duration of the poll that is started when a reward configuration is added or
                            changed. This poll should pass to approve the changes."
                                >
                                    <i class="fas fa-question-circle"></i>
                                </a>
                            </label>
                        </div>
                        <div class="col-md-7">
                            <b-form-input id="rewardPollDuration" type="number" v-model="rewardPollDuration" />
                        </div>
                        <div class="col-md-1 text-right">
                            <b-button class="rounded-pill" variant="primary" @click="updateAssetPool()">
                                <i class="fas fa-save ml-0"></i
                            ></b-button>
                        </div>
                    </div>
                </b-form-group>

                <b-form-group class="mb-0">
                    <hr />
                    <div class="row">
                        <div class="col-md-4 d-flex align-items-center">
                            <label for="rewardPollDuration">
                                Default withdraw poll duration
                                <a
                                    v-b-tooltip
                                    title=" Default duration of the poll that is started when a reward is claimed by or for a member. This
                        poll should pass to be able to withdraw the reward. Only members with a manager role can vote on
                        this poll."
                                >
                                    <i class="fas fa-question-circle"></i>
                                </a>
                            </label>
                        </div>
                        <div class="col-md-7">
                            <b-form-input id="rewardPollDuration" type="number" v-model="proposeWithdrawPollDuration" />
                        </div>
                        <div class="col-md-1 text-right">
                            <b-button class="rounded-pill" variant="primary" @click="updateAssetPool()">
                                <i class="fas fa-save ml-0"></i
                            ></b-button>
                        </div>
                    </div>
                </b-form-group>
            </template>
        </b-card>
        <h2>Update rewards</h2>
        <p>
            Update existing rewards immediately or start a poll for the change if governance is enabled.
            <a :href="docsUrl + '/rewards#2-change-reward-configuration'" target="_blank">
                <i class="fas fa-question-circle"></i>
            </a>
        </p>
        <b-card class="shadow-sm">
            <div class="row pt-2 pb-2">
                <div class="col-md-1">
                    <strong>#</strong>
                </div>
                <div class="col-md-4">
                    <strong>Withdraw amount</strong>
                </div>
                <div class="col-md-6">
                    <strong>Withdraw poll duration</strong>
                </div>
                <div class="col-md-1"></div>
            </div>
            <b-skeleton-wrapper :loading="skeletonLoading">
                <template #loading>
                    <b-form-group class="mb-0" v-for="index in 2" :key="index">
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
                <b-form-group class="mb-0" :key="reward.id" v-for="reward of filteredRewards">
                    <hr />
                    <div class="row pt-2 pb-2">
                        <div class="col-md-1 d-flex align-items-center">
                            <span class="large mr-2 text-primary">#{{ reward.id }}</span>
                            <template v-if="reward.poll">
                                <a :id="`rewardPoll-${reward.id}`">
                                    <i class="fas fa-poll text-primary"></i>
                                </a>
                                <b-popover :target="`rewardPoll-${reward.id}`" triggers="hover" placement="top">
                                    <template #title>Active poll</template>

                                    <p>
                                        Start {{ reward.poll.startTime }}<br />
                                        End:{{ reward.poll.endTime }}
                                    </p>

                                    <p>
                                        Yes: {{ reward.poll.yesCounter }}<br />
                                        No: {{ reward.poll.noCounter }}
                                    </p>
                                </b-popover>
                            </template>
                        </div>
                        <div class="col-md-4">
                            <b-input-group :append="assetPool.poolToken.symbol">
                                <b-form-input disabled type="number" v-model="reward.withdrawAmount" />
                            </b-input-group>
                        </div>
                        <div class="col-md-6">
                            <b-input-group append="Seconds">
                                <b-form-input
                                    type="number"
                                    :disabled="!enableGovernance"
                                    v-model="reward.withdrawDuration"
                                />
                            </b-input-group>
                        </div>
                        <div class="col-md-1 text-right">
                            <b-button class="rounded-pill" variant="primary" @click="updateReward()">
                                <i class="fas fa-save ml-0"></i
                            ></b-button>
                        </div>
                    </div>
                </b-form-group>
            </b-skeleton-wrapper>
        </b-card>
        <base-modal-reward-create
            :assetPool="assetPool"
            :filteredRewards="filteredRewards"
            :enableGovernance="enableGovernance"
        />
    </div>
</template>

<script lang="ts">
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
    BSkeleton,
    BSkeletonWrapper,
} from 'bootstrap-vue';
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import { IRewards, Reward } from '@/store/modules/rewards';
import BaseModalRewardCreate from '@/components/ModalRewardCreate.vue';

@Component({
    components: {
        'base-modal-reward-create': BaseModalRewardCreate,
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
        'b-skeleton': BSkeleton,
        'b-skeleton-wrapper': BSkeletonWrapper,
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
    skeletonLoading = true;

    enableGovernance = false;
    rewardPollDuration = 0;
    proposeWithdrawPollDuration = 0;

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
            await this.$store.dispatch('assetPools/read', this.$route.params.address);
            await this.$store.dispatch('rewards/read', this.assetPool.address);

            this.enableGovernance = !this.assetPool.bypassPolls;
            this.rewardPollDuration = this.assetPool.rewardPollDuration;
            this.proposeWithdrawPollDuration = this.assetPool.proposeWithdrawPollDuration;
            this.skeletonLoading = false;
        } catch (e) {
            this.error = 'Could not get the rewards.';
        } finally {
            this.loading = false;
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
                    proposeWithdrawPollDuration: this.proposeWithdrawPollDuration,
                },
            });
        } catch (e) {
            this.error = 'Could not update your asset pool.';
        } finally {
            this.loading = false;
        }
    }
}
</script>
