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
                    background-image: url(${require('@/assets/thx_modal-header.webp')});
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
            <b-card class="border-0" bg-variant="light" body-class="p-md-5">
                <b-form-group>
                    <label>
                        Withdraw amount
                        <a
                            :href="docsUrl + '/rewards'"
                            v-b-tooltip
                            :title="`The amount of ${assetPool.token.symbol} earned with this reward.`"
                            target="_blank"
                        >
                            <i class="fas fa-question-circle"></i>
                        </a>
                    </label>
                    <b-input-group :append="assetPool.token.symbol">
                        <b-form-input type="number" v-model="rewardWithdrawAmount" />
                    </b-input-group>
                </b-form-group>

                <b-form-group>
                    <label>
                        Withdraw limit
                        <a
                            v-b-tooltip
                            title="The total amount of times this reward could be claimed. Leave 0 for an infinite amount of times. `"
                            target="_blank"
                        >
                            <i class="fas fa-question-circle"></i>
                        </a>
                    </label>
                    <b-input-group :append="assetPool.token.symbol">
                        <b-form-input type="number" v-model="rewardWithdrawLimit" />
                    </b-input-group>
                </b-form-group>

                <b-form-group>
                    <div class="row">
                        <div class="col-md-6">
                            <label> Social Channel:</label>
                            <base-dropdown-channel-types :channel="channel" @selected="onChannelClick($event)" />
                        </div>
                        <div class="col-md-6">
                            <label> Engagement type:</label>
                            <base-dropdown-channel-actions
                                v-if="channel && channel.actions.length > 0"
                                :actions="channelActions.filter((action) => channel.actions.includes(action.type))"
                                @selected="onActionClick($event)"
                            />
                            <p v-else class="small text-muted">Select a channel first.</p>
                        </div>
                    </div>
                </b-form-group>
                <b-form-group>
                    <template v-if="channel && action && action.items.length > 0">
                        <base-dropdown-youtube-uploads
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
                        <base-dropdown-twitter-users
                            v-if="action.type === 4"
                            @selected="item = $event"
                            :items="action.items"
                        />
                    </template>
                    <b-alert show variant="warning" v-if="warning">{{ warning }}</b-alert>
                    <template v-if="channel && action && action.type === 0">
                        <base-dropdown-youtube-video @selected="item = $event" />
                    </template>
                    <template v-if="channel && action && (action.type === 7 || action.type === 8 || action.type === 9)">
                        <base-dropdown-spotify-track :items="action.items" @selected="item = $event" />
                    </template>
                    <template v-if="channel && action && action.type === 6">
                        <base-dropdown-spotify-playlist @selected="item = $event" :items="action.items" />
                    </template>
                </b-form-group>
                <b-form-group v-if="action && [2, 3, 4].includes(action.type)">
                    <b-alert variant="warning" show class="m-0">
                        <template v-if="action.type == 2"> Validation is limited to the last 100 likes. </template>
                        <template v-if="action.type == 3"> Validation is limited to the last 100 retweets. </template>
                        <template v-if="action.type == 4"> Validation is limited to the last 5000 followers. </template>
                    </b-alert>
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
                :disabled="isSubmitDisabled"
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
import { Component, Prop, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import {
    channelActionList,
    ChannelType,
    ChannelAction,
    IChannel,
    IChannelAction,
    Reward,
} from '@/store/modules/rewards';
import { IAccount, ISpotify, ITwitter, IYoutube } from '@/types/account';
import BaseDropdownYoutubeVideo from '../dropdowns/BaseDropdownYoutubeVideo.vue';
import BaseDropdownYoutubeUploads from '../dropdowns/BaseDropdownYoutubeUploads.vue';
import BaseDropdownYoutubeChannels from '../dropdowns/BaseDropdownYoutubeChannels.vue';
import BaseDropdownChannelActions from '../dropdowns/BaseDropdownChannelActions.vue';
import BaseDropdownTwitterTweets from '../dropdowns/BaseDropdownTwitterTweets.vue';
import BaseDropdownTwitterUsers from '../dropdowns/BaseDropdownTwitterUsers.vue';
import BaseDropdownSpotifyTrack from '../dropdowns/BaseDropdownSpotifyTrack.vue';
import BaseDropdownSpotifyPlaylist from '../dropdowns/BaseDropdownSpotifyPlaylist.vue';
import BaseDropdownChannelTypes from '../dropdowns/BaseDropdownChannelTypes.vue';

@Component({
    components: {
        BaseDropdownYoutubeVideo,
        BaseDropdownYoutubeUploads,
        BaseDropdownYoutubeChannels,
        BaseDropdownTwitterTweets,
        BaseDropdownTwitterUsers,
        BaseDropdownChannelActions,
        BaseDropdownChannelTypes,
        BaseDropdownSpotifyTrack,
        BaseDropdownSpotifyPlaylist,
    },
    computed: mapGetters({
        profile: 'account/profile',
        youtube: 'account/youtube',
        twitter: 'account/twitter',
        spotify: 'account/spotify',
    }),
})
export default class ModalRewardCreate extends Vue {
    channelActions = channelActionList;
    docsUrl = process.env.VUE_APP_DOCS_URL;
    loading = false;
    error = '';
    warning = '';

    isClaimOnce = true;
    isMembershipRequired = false;
    rewardWithdrawAmount = 0;
    rewardWithdrawDuration = 0;
    rewardWithdrawLimit = 0;

    channel: null | IChannel = null;
    action: null | IChannelAction = null;
    item: any = null;

    profile!: IAccount;
    youtube!: IYoutube;
    twitter!: ITwitter;
    spotify!: ISpotify;

    @Prop() assetPool!: AssetPool;
    @Prop() filteredRewards!: Reward[];
    @Prop() isGovernanceEnabled!: boolean;

    get isSubmitDisabled() {
        return (
            this.loading ||
            this.rewardWithdrawAmount <= 0 ||
            this.rewardWithdrawLimit < 0 ||
            (this.channel?.type !== ChannelType.None && !this.item)
        );
    }

    async getYoutube() {
        const { isAuthorized } = await this.$store.dispatch('account/getYoutube');

        if (!isAuthorized) {
            this.warning = 'Your YouTube account is not connected.';
        }

        if (isAuthorized && this.channel) {
            this.warning = '';
            this.channelActions[ChannelAction.YouTubeLike].items = this.youtube.videos;
            this.channelActions[ChannelAction.YouTubeSubscribe].items = this.youtube.channels;
        }
    }

    async getTwitter() {
        const { isAuthorized } = await this.$store.dispatch('account/getTwitter');

        if (!isAuthorized) {
            this.warning = 'Your Twitter account is not connected.';
        }

        if (isAuthorized && this.channel) {
            this.warning = '';
            this.channelActions[ChannelAction.TwitterLike].items = this.twitter.tweets;
            this.channelActions[ChannelAction.TwitterRetweet].items = this.twitter.tweets;
            this.channelActions[ChannelAction.TwitterFollow].items = this.twitter.users;
        }
    }

    async getSpotify() {
        const { isAuthorized } = (await this.$store.dispatch('account/getSpotify')).spotify;

        if (!isAuthorized) {
            this.warning = 'Your Spotify account is not connected.';
        }

        if (isAuthorized && this.channel) {
            this.warning = '';
            this.channelActions[ChannelAction.SpotifyUserFollow].items = this.spotify.users;
            this.channelActions[ChannelAction.SpotifyPlaylistFollow].items = this.spotify.playlists;
            this.channelActions[ChannelAction.SpotifyTrackPlaying].items = this.spotify.items;
            this.channelActions[ChannelAction.SpotifyTrackSaved].items = this.spotify.items;
        }
    }

    async onChannelClick(channel: IChannel) {
        this.item = null;
        this.action = null;
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
            case ChannelType.Spotify:
                this.action = this.channelActions[channel.actions[0]];
                await this.getSpotify();
                this.item = this.channelActions[channel.actions[0]].items[0];
                break;

            default:
                this.error = 'Channel type is not known.';
                break;
        }
    }

    async onActionClick(action: IChannelAction) {
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
                          channelItem:
                              this.item &&
                              this.item.referenced_tweets &&
                              this.item.referenced_tweets[0].type === 'retweeted'
                                  ? this.item.referenced_tweets[0].id
                                  : this.item.id,
                      }
                    : null;

            await this.$store.dispatch('rewards/create', {
                address: this.assetPool.address,
                withdrawLimit: this.rewardWithdrawLimit,
                withdrawAmount: this.rewardWithdrawAmount,
                withdrawDuration: this.rewardWithdrawDuration,
                withdrawCondition,
                isClaimOnce: this.isClaimOnce,
                isMembershipRequired: this.isMembershipRequired,
            });

            this.rewardWithdrawLimit = 0;
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
