<template>
    <base-modal title="Create Reward" id="modalRewardCreate" @show="onShow" :error="error" :loading="loading">
        <template #modal-body v-if="profile && !loading">
            <form v-on:submit.prevent="submit" id="formRewardCreate">
                <b-card class="border-0" bg-variant="light" body-class="p-md-5">
                    <b-row>
                        <b-col md="12">
                            <b-form-group>
                                <label> Title </label>
                                <b-form-input v-model="rewardTitle" placeholder="A token of appreciation" />
                            </b-form-group>
                        </b-col>
                    </b-row>
                    <template v-if="erc721 && erc721metadata">
                        <label>
                            NFT
                            <a
                                class="mr-2"
                                v-b-tooltip
                                title="Select the metadata for the NFT that should be minted when this reward is claimed."
                            >
                                <i class="fas fa-question-circle"></i>
                            </a>
                        </label>
                        <b-dropdown variant="link" class="dropdown-select bg-white mb-3">
                            <template #button-content>
                                <div class="d-block" v-if="filteredMetadata.length">
                                    {{ erc721metadata.title }}
                                </div>
                                <div v-else>Create some metadata first</div>
                            </template>
                            <b-dropdown-item
                                :key="key"
                                v-for="(metadata, key) of filteredMetadata"
                                @click="erc721metadata = metadata"
                            >
                                <div class="d-flex justify-content-between">
                                    <div>
                                        {{ erc721metadata.title }}
                                    </div>
                                    <small class="text-muted">
                                        {{ format(new Date(metadata.createdAt), 'dd-MM-yyyy HH:mm') }}
                                    </small>
                                </div>
                            </b-dropdown-item>
                        </b-dropdown>
                    </template>
                    <template v-if="pool.isDefaultPool">
                        <label>Withdrawal</label>
                        <b-card bg-variant="white" class="mb-3">
                            <b-row>
                                <b-col md="6">
                                    <b-form-group>
                                        <label>
                                            Amount
                                            <a
                                                v-b-tooltip
                                                :title="`The amount of ${pool.token.symbol} tokens earned with this reward.`"
                                                target="_blank"
                                            >
                                                <i class="fas fa-question-circle"></i>
                                            </a>
                                        </label>
                                        <b-input-group :append="pool.token.symbol">
                                            <b-form-input type="number" v-model="rewardWithdrawAmount" />
                                        </b-input-group>
                                    </b-form-group>
                                </b-col>
                                <b-col md="6">
                                    <label>
                                        Limit
                                        <a
                                            v-b-tooltip
                                            title="The total amount of times this reward could be claimed. Leave 0 for an infinite amount of times."
                                        >
                                            <i class="fas fa-question-circle"></i>
                                        </a>
                                    </label>
                                    <b-form-input type="number" v-model="rewardWithdrawLimit" />
                                </b-col>
                                <b-col md="12">
                                    <label>
                                        Unlock Date
                                        <a
                                            v-b-tooltip
                                            title="The benficiary will not be able to withdraw the tokens prior to this date. Leave blank for not locking the reward."
                                        >
                                            <i class="fas fa-question-circle"></i>
                                        </a>
                                    </label>
                                    <b-form-datepicker
                                        v-model="rewardWithdrawUnlockDate"
                                        :min="getDefaultUnlockDate()"
                                    />
                                </b-col>
                            </b-row>
                        </b-card>
                    </template>
                    <b-form-group>
                        <label> Expiration Date </label>
                        <b-row>
                            <b-col md="6">
                                <b-datepicker value-as-date :min="minDate" v-model="rewardExpireDate" />
                            </b-col>
                            <b-col md="6">
                                <b-timepicker :disabled="!rewardExpireDate" v-model="rewardExpireTime" />
                            </b-col>
                        </b-row>
                    </b-form-group>
                    <b-form-group>
                        <b-row>
                            <b-col md="6">
                                <label> Social Channel</label>
                                <base-dropdown-channel-types :channel="channel" @selected="onChannelClick($event)" />
                            </b-col>
                            <b-col md="6">
                                <label> Channel Interaction</label>
                                <base-dropdown-channel-actions
                                    v-if="channel && channel.actions.length > 0"
                                    :actions="channelActions.filter((action) => channel.actions.includes(action.type))"
                                    @selected="onActionClick($event)"
                                />
                                <p v-else class="small text-muted">Select a channel first.</p>
                            </b-col>
                        </b-row>
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
                        <template
                            v-if="channel && action && (action.type === 7 || action.type === 8 || action.type === 9)"
                        >
                            <base-dropdown-spotify-track :items="action.items" @selected="item = $event" />
                        </template>
                        <template v-if="channel && action && action.type === 6">
                            <base-dropdown-spotify-playlist @selected="item = $event" :items="action.items" />
                        </template>
                    </b-form-group>
                    <b-form-group v-if="action && [2, 3, 4].includes(action.type)">
                        <b-alert variant="warning" show class="m-0">
                            <template v-if="action.type == 2"> Validation is limited to the last 100 likes. </template>
                            <template v-if="action.type == 3">
                                Validation is limited to the last 100 retweets.
                            </template>
                            <template v-if="action.type == 4">
                                Validation is limited to the last 5000 followers.
                            </template>
                        </b-alert>
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
        </template>
        <template #btn-primary>
            <b-button
                :disabled="isSubmitDisabled"
                class="rounded-pill"
                type="submit"
                form="formRewardCreate"
                variant="primary"
                block
            >
                Create Reward
            </b-button>
        </template>
    </base-modal>
</template>

<script lang="ts">
import { IPool } from '@/store/modules/pools';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import { channelActionList, ChannelType, ChannelAction, IChannel, IChannelAction, Reward } from '@/types/rewards';
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
import slugify from '@/utils/slugify';
import BaseModal from './BaseModal.vue';
import { TERC721, TERC721Metadata } from '@/types/erc721';
import { format } from 'date-fns';

@Component({
    components: {
        BaseModal,
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
    format = format;

    isClaimOnce = true;
    isMembershipRequired = false;
    erc721metadata: TERC721Metadata | null = null;
    rewardWithdrawAmount = 0;
    rewardWithdrawDuration = 0;
    rewardWithdrawLimit = 0;
    rewardWithdrawUnlockDate = null;
    rewardTitle = '';

    rewardExpireDate: Date | null = null;
    rewardExpireTime = '00:00:00';

    channel: null | IChannel = null;
    action: null | IChannelAction = null;
    item: any = null;

    profile!: IAccount;
    youtube!: IYoutube;
    twitter!: ITwitter;
    spotify!: ISpotify;

    @Prop() pool!: IPool;
    @Prop() erc721!: TERC721;
    @Prop() filteredRewards!: Reward[];
    @Prop() isGovernanceEnabled!: boolean;

    get minDate() {
        let date = new Date();
        date.setDate(date.getDate() + 1);
        return date;
    }

    get isSubmitDisabled() {
        return (
            this.loading ||
            (this.pool.isNFTPool && !this.erc721metadata) ||
            (this.pool.isDefaultPool && this.rewardWithdrawLimit < 0) ||
            (this.pool.isDefaultPool && this.rewardWithdrawAmount <= 0) ||
            (this.channel?.type !== ChannelType.None && !this.item)
        );
    }

    onShow() {
        this.erc721metadata = this.filteredMetadata ? this.filteredMetadata[0] : null;
    }

    getDefaultUnlockDate() {
        return new Date();
    }

    get filteredMetadata() {
        return this.erc721 && this.erc721.metadata.filter((m: TERC721Metadata) => !m.tokenId);
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
        const { isAuthorized } = await this.$store.dispatch('account/getSpotify');

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

    concatDatetime(date: Date, time: string) {
        const concatedDate = new Date(date);
        // time will alway have format "HH:MM:SS"
        const [hours, minutes, seconds] = time.split(':').map((item) => Number(item));
        concatedDate.setHours(hours, minutes, seconds);
        return concatedDate;
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
        const expiryDate = this.rewardExpireDate && this.concatDatetime(this.rewardExpireDate, this.rewardExpireTime);
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

        const slug = slugify(this.rewardTitle);

        await this.$store.dispatch('rewards/create', {
            poolId: this.pool._id,
            slug,
            title: this.rewardTitle,
            expiryDate: expiryDate?.toISOString(),
            erc721metadataId: this.erc721metadata?._id,
            withdrawLimit: this.rewardWithdrawLimit,
            withdrawAmount: this.pool.isNFTPool ? 1 : this.rewardWithdrawAmount,
            withdrawDuration: this.rewardWithdrawDuration,
            withdrawUnlockDate: this.rewardWithdrawUnlockDate,
            withdrawCondition,
            isClaimOnce: this.isClaimOnce,
            isMembershipRequired: this.isMembershipRequired,
        });

        this.rewardWithdrawLimit = 0;
        this.rewardWithdrawAmount = 0;
        this.rewardWithdrawDuration = 0;
        this.rewardWithdrawUnlockDate = null;
        this.rewardTitle = '';
        this.rewardExpireDate = null;
        this.rewardExpireTime = '00:00:00';

        if (close) {
            this.$bvModal.hide(`modalRewardCreate`);
        }

        this.loading = false;
    }
}
</script>
