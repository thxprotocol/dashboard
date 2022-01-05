<template>
    <b-modal
        size="lg"
        title="Create Reward"
        id="modalRewardCreate"
        no-close-on-backdrop
        no-close-on-esc
        centered
        :hide-footer="loading"
    >
        <b-alert variant="danger" show v-if="error && !loading">
            {{ error }}
        </b-alert>
        <template v-slot:modal-header v-if="loading">
            <div
                class="w-auto center-center bg-secondary mx-n5 mt-n5 pt-5 pb-5 flex-grow-1 flex-column position-relative"
                :style="`
                    border-top-left-radius: 0.5rem;
                    border-top-right-radius: 0.5rem;
                    background-image: url(${require('../assets/thx_modal-header.webp')});
                `"
            >
                <h2 class="d-block">Give us a moment!</h2>
                <div
                    class="shadow-sm bg-white p-2 rounded-pill d-flex align-items-center justify-content-center"
                    style="position: absolute; bottom: 0; left: 50%; margin-left: -32px; margin-bottom: -32px"
                >
                    <b-spinner size="lg" style="width: 3rem; height: 3rem" variant="primary"></b-spinner>
                </div>
            </div>
        </template>
        <div class="pt-5 pb-3" v-if="loading">
            <p class="text-center">
                <strong>We are creating your reward</strong><br /><span class="text-muted">
                    Hang tight, this can take a few seconds...
                </span>
            </p>
        </div>
        <form v-else v-on:submit.prevent="submit" id="formRewardCreate">
            <p>
                Create rewards that can be given to pool members.
                <a :href="docsUrl + '/rewards#1-create-a-reward'" target="_blank">
                    <i class="fas fa-question-circle"></i>
                </a>
            </p>
            <b-card class="border-0" bg-variant="light" body-class="p-5">
                <b-form-group>
                    <label>
                        Withdraw amount
                        <a
                            :href="docsUrl + '/rewards'"
                            v-b-tooltip
                            :title="`The amount of ${assetPool.poolToken.symbol} earned with this reward.`"
                            target="_blank"
                        >
                            <i class="fas fa-question-circle"></i>
                        </a>
                    </label>
                    <b-input-group :append="assetPool.poolToken.symbol">
                        <b-form-input type="number" v-model="rewardWithdrawAmount" />
                    </b-input-group>
                </b-form-group>

                <b-form-group>
                    <div class="row">
                        <div class="col-md-6">
                            <label> Social Channel:</label>
                            <b-dropdown variant="link" class="dropdown-select bg-white">
                                <template #button-content>
                                    <div v-if="channel">
                                        <img
                                            :src="channel.logoURI"
                                            v-if="channel.logoURI"
                                            width="20"
                                            class="mr-2"
                                            :alt="channel.name"
                                        />
                                        {{ channel.name }}
                                    </div>
                                </template>
                                <b-dropdown-item-button
                                    :key="channel.id"
                                    v-for="channel of channelList"
                                    @click="onChannelClick(channel)"
                                >
                                    <img
                                        :src="channel.logoURI"
                                        v-if="channel.logoURI"
                                        width="20"
                                        class="mr-3"
                                        :alt="channel.name"
                                    />
                                    {{ channel.name }}
                                </b-dropdown-item-button>
                            </b-dropdown>
                        </div>
                        <div class="col-md-6">
                            <label> Engagement type:</label>
                            <base-dropdown-channel-actions
                                v-if="channel && channel.actions.length > 0"
                                :actions="channelActions.filter((action) => channel.actions.includes(action.type))"
                                @selected="onActionClick(channel.type, $event)"
                            />
                            <p v-else class="small text-muted">Select a channel first.</p>
                        </div>
                    </div>
                </b-form-group>
                <b-form-group>
                    <label> Item:</label>
                    <template v-if="channel && action && action.items.length > 0">
                        <base-dropdown-youtube-videos
                            v-if="action.type === 0"
                            @selected="item = $event"
                            :items="action.items"
                        />
                        <base-dropdown-youtube-channels
                            v-if="action.type === 1"
                            @selected="item = $event"
                            :items="action.items"
                        />
                        <base-dropdown-twitter-tweets
                            v-if="action.type === 2 || action.type === 3"
                            @selected="item = $event"
                            :items="action.items"
                        />
                    </template>
                    <p v-else class="small text-muted">No items found for this engagement type.</p>
                </b-form-group>
                <b-form-group v-if="isGovernanceEnabled">
                    <label>
                        Withdraw poll duration
                        <a
                            :href="docsUrl + '/rewards'"
                            v-b-tooltip
                            title="The duration in seconds of the withdraw poll that is started when the rewards is claimed or given."
                            target="_blank"
                        >
                            <i class="fas fa-question-circle"></i>
                        </a>
                    </label>
                    <b-input-group append="Seconds">
                        <b-form-input type="number" v-model="rewardWithdrawDuration" />
                    </b-input-group>
                </b-form-group>
                <hr />
                <b-form-group class="mb-0">
                    <b-form-checkbox v-model="isMembershipRequired">
                        <strong> Membership required </strong>
                        <p>Verifies that the user claiming the reward has a membership for the pool.</p>
                    </b-form-checkbox>
                </b-form-group>
                <b-form-group class="mb-0">
                    <b-form-checkbox class="mb-0" v-model="isClaimOnce">
                        <strong> Claim once </strong>
                        <p>Allows the user to claim the reward only once.</p>
                    </b-form-checkbox>
                </b-form-group>
            </b-card>
        </form>
        <template v-slot:modal-footer="{}">
            <b-button
                :disabled="loading"
                class="rounded-pill"
                type="submit"
                variant="primary"
                form="formRewardCreate"
                block
            >
                Add Reward
            </b-button>
        </template>
    </b-modal>
</template>

<script lang="ts">
import { AssetPool } from '@/store/modules/assetPools';
import {
    BAlert,
    BButton,
    BCard,
    BCollapse,
    BDropdown,
    BDropdownItemButton,
    BFormCheckbox,
    BFormGroup,
    BFormInput,
    BFormRadio,
    BFormSelect,
    BFormSelectOption,
    BInputGroup,
    BLink,
    BModal,
    BBadge,
    BSpinner,
} from 'bootstrap-vue';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import { ChannelType, ChannelAction, IChannel, IChannelAction, Reward } from '@/store/modules/rewards';
import { IAccount, ITwitter, IYoutube } from '@/store/modules/account';
import BaseDropdownYoutubeVideos from './BaseDropdownYoutubeVideos.vue';
import BaseDropdownYoutubeChannels from './BaseDropdownYoutubeChannels.vue';
import BaseDropdownChannelActions from './BaseDropdownChannelActions.vue';
import BaseDropdownTwitterTweets from './BaseDropdownTwitterTweets.vue';

@Component({
    components: {
        BModal,
        BAlert,
        BLink,
        BCard,
        BBadge,
        BInputGroup,
        BDropdown,
        BDropdownItemButton,
        BFormRadio,
        BFormGroup,
        BFormInput,
        BButton,
        BCollapse,
        BFormSelect,
        BFormSelectOption,
        BSpinner,
        BFormCheckbox,
        BaseDropdownYoutubeVideos,
        BaseDropdownYoutubeChannels,
        BaseDropdownTwitterTweets,
        BaseDropdownChannelActions,
    },
    computed: mapGetters({
        profile: 'account/profile',
        youtube: 'account/youtube',
        twitter: 'account/twitter',
    }),
})
export default class ModalRewardCreate extends Vue {
    docsUrl = process.env.VUE_APP_DOCS_URL;
    loading = false;
    error = '';
    isClaimOnce = true;
    isMembershipRequired = false;
    rewardWithdrawAmount = 0;
    rewardWithdrawDuration = 0;
    channel: null | IChannel = null;
    action: null | IChannelAction = null;
    item: any = null;
    channelList = [
        {
            type: ChannelType.None,
            name: ChannelType[0],
            logoURI: '',
            actions: [],
        },
        {
            type: ChannelType.YouTube,
            name: ChannelType[1],
            logoURI: require('@/assets/logo-youtube.png'),
            actions: [ChannelAction.YouTubeLike, ChannelAction.YouTubeSubscribe],
        },
        {
            type: ChannelType.Twitter,
            name: ChannelType[2],
            logoURI: require('@/assets/logo-twitter.png'),
            actions: [ChannelAction.TwitterLike, ChannelAction.TwitterRetweet],
        },
    ];
    channelActions = [
        {
            type: ChannelAction.YouTubeLike,
            name: 'Like',
            items: [],
        },
        {
            type: ChannelAction.YouTubeSubscribe,
            name: 'Subscribe',
            items: [],
        },
        {
            type: ChannelAction.TwitterLike,
            name: 'Like',
            items: [],
        },
        {
            type: ChannelAction.TwitterRetweet,
            name: 'Retweet',
            items: [],
        },
    ];
    profile!: IAccount;
    youtube!: IYoutube;
    twitter!: ITwitter;

    @Prop() assetPool!: AssetPool;
    @Prop() filteredRewards!: Reward[];
    @Prop() isGovernanceEnabled!: boolean;

    async mounted() {
        this.channel = this.channelList[0];
    }

    async getYoutube() {
        const { error } = await this.$store.dispatch('account/getYoutube');

        if (error) {
            this.error =
                error.response.status === 403
                    ? 'Please enable the Youtube integration first.'
                    : 'An issue occured while connecting to Youtube.';
        } else if (this.channel) {
            this.channelActions[ChannelAction.YouTubeLike].items = this.youtube.videos;
            this.channelActions[ChannelAction.YouTubeSubscribe].items = this.youtube.channels;
        }
    }

    async getTwitter() {
        const { error } = await this.$store.dispatch('account/getTwitter');

        if (error) {
            this.error =
                error.response.status === 403
                    ? 'Please enable the Twitter integration first.'
                    : 'An issue occured while connecting to Twitter.';
        } else if (this.channel) {
            this.channelActions[ChannelAction.TwitterLike].items = this.twitter.tweets;
            this.channelActions[ChannelAction.TwitterRetweet].items = this.twitter.tweets;
        }
    }

    async onChannelClick(channel: IChannel) {
        this.action = null;
        this.item = null;
        this.channel = channel;

        switch (channel.type) {
            case ChannelType.None:
                break;
            case ChannelType.YouTube:
                this.action = this.channelActions[channel.actions[0]];
                await this.getYoutube();
                break;
            case ChannelType.Twitter:
                this.action = this.channelActions[channel.actions[0]];
                await this.getTwitter();
                break;
            default:
                this.error = 'Channel type is not known.';
                break;
        }
    }

    async onActionClick(channelType: ChannelType, action: IChannelAction) {
        this.action = action;
        this.item = this.channelActions[action.type].items[0];
    }

    async submit(close: boolean) {
        this.loading = true;
        try {
            const withdrawCondition =
                this.channel?.type !== ChannelType.None
                    ? {
                          channelType: this.channel?.type,
                          channelAction: this.action?.type,
                          channelItem: this.item.id,
                      }
                    : null;

            await this.$store.dispatch('rewards/create', {
                address: this.assetPool.address,
                withdrawAmount: this.rewardWithdrawAmount,
                withdrawDuration: this.rewardWithdrawDuration,
                withdrawCondition,
                isClaimOnce: this.isClaimOnce,
                isMembershipRequired: this.isMembershipRequired,
            });

            this.rewardWithdrawAmount = 0;
            this.rewardWithdrawDuration = 0;

            if (close) {
                this.$bvModal.hide(`modalRewardCreate`);
            }
        } catch (e) {
            this.error = 'Could not add the reward.';
        } finally {
            this.loading = false;
        }
    }
}
</script>
<style lang="scss"></style>
