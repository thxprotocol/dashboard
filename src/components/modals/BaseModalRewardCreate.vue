<template>
    <base-modal size="xl" :title="modalName" id="modalRewardCreate" :error="error" :loading="loading">
        <template #modal-body v-if="profile && !loading">
            <form v-on:submit.prevent="submit" id="formRewardCreate">
                <hr />
                <b-form-row label="Variant">
                    <b-col md="6">
                        <b-form-radio
                            class="mb-0"
                            @change="onRewardVariantChanged"
                            v-model="rewardVariant"
                            name="rewardVariant"
                            :value="RewardVariant.Token"
                        >
                            <strong> Token Reward</strong>
                            <p>Let your users withdraw your tokens into their wallet.</p>
                            <small class="text-muted">2.5% protocol fee on withdrawals</small>
                        </b-form-radio>
                    </b-col>
                    <b-col md="6">
                        <b-form-radio
                            class="mb-0"
                            @change="onRewardVariantChanged"
                            v-model="rewardVariant"
                            name="rewardVariant"
                            :value="RewardVariant.NFT"
                        >
                            <strong> NFT Reward</strong>
                            <p>Let your users mint an NFT for your collection.</p>
                            <small class="text-muted">2.5% protocol fee on sales through Payment Requests</small>
                        </b-form-radio>
                    </b-col>
                </b-form-row>
                <hr />
                <b-tabs content-class="mt-3" fill>
                    <b-tab title="General" active>
                        <b-form-group>
                            <label> Label </label>
                            <b-form-input v-model="rewardTitle" placeholder="A token of appreciation" />
                        </b-form-group>
                        <b-form-group v-if="rewardVariant === RewardVariant.Token && pool.erc20">
                            <label>
                                Tokens
                                <a
                                    v-b-tooltip
                                    :title="`The amount of ${pool.erc20.symbol} tokens earned with this reward.`"
                                    target="_blank"
                                >
                                    <i class="fas fa-question-circle"></i>
                                </a>
                            </label>
                            <b-input-group :append="pool.erc20.symbol">
                                <b-form-input type="number" v-model="rewardWithdrawAmount" />
                            </b-input-group>
                        </b-form-group>
                        <b-form-group v-if="rewardVariant === RewardVariant.NFT && erc721metadata">
                            <label>
                                Metadata
                                <base-tooltip-info
                                    class="mr-2"
                                    title="Select the metadata for the NFT that should be minted when this reward is claimed."
                                />
                            </label>
                            <BaseDropdownERC721Metadata
                                :erc721metadata="erc721metadata"
                                :pool="pool"
                                @selected="onSelectMetadata"
                            />
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
                    </b-tab>
                    <b-tab title="Expiration & Limit">
                        <b-form-group>
                            <label> Expiration </label>
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
                            <label>
                                Reward Limit
                                <a
                                    v-b-tooltip
                                    title="The total amount of times this reward could be claimed. Leave 0 for an infinite amount of times, but be aware that this could drain your pool."
                                >
                                    <i class="fas fa-question-circle"></i>
                                </a>
                            </label>
                            <b-form-input type="number" v-model="rewardWithdrawLimit" />
                        </b-form-group>
                    </b-tab>
                    <b-tab title="QR Codes">
                        <b-form-group>
                            <label>
                                Amount of unique QR Codes
                                <a v-b-tooltip title="Minimal value: 1">
                                    <i class="fas fa-question-circle"></i>
                                </a>
                            </label>
                            <b-input-group>
                                <b-form-input type="number" v-model="amount" min="1" max="10000" />
                            </b-input-group>
                        </b-form-group>
                    </b-tab>
                    <b-tab title="Conditions">
                        <b-form-group>
                            <b-row>
                                <b-col md="6">
                                    <label> Social Channel</label>
                                    <base-dropdown-channel-types
                                        :channel="channel"
                                        @selected="onChannelClick($event)"
                                    />
                                </b-col>
                                <b-col md="6">
                                    <label> Action</label>
                                    <base-dropdown-channel-actions
                                        v-if="channel && channel.actions.length > 0"
                                        :actions="
                                            channelActions.filter((action) => {
                                                if (!channel) return;
                                                return channel.actions.includes(action.type);
                                            })
                                        "
                                        :action="action"
                                        @selected="onActionClick($event)"
                                    />
                                    <p v-else class="small text-muted">Please choose a channel.</p>
                                </b-col>
                            </b-row>
                        </b-form-group>
                        <b-form-group>
                            <template v-if="channel && action && action.items.length > 0">
                                <base-dropdown-youtube-uploads
                                    v-if="action.type === ChannelAction.YouTubeLike"
                                    @selected="item = $event"
                                    :items="action.items"
                                    :item="
                                        reward && reward.withdrawCondition ? reward.withdrawCondition.channelItem : null
                                    "
                                />
                                <base-dropdown-youtube-channels
                                    v-if="action.type === ChannelAction.YouTubeSubscribe"
                                    @selected="item = $event"
                                    :items="action.items"
                                    :item="
                                        reward && reward.withdrawCondition ? reward.withdrawCondition.channelItem : null
                                    "
                                />
                                <base-dropdown-twitter-tweets
                                    v-if="
                                        action.type === ChannelAction.TwitterLike ||
                                        action.type === ChannelAction.TwitterRetweet
                                    "
                                    @selected="item = $event"
                                    :items="action.items"
                                    :item="
                                        reward && reward.withdrawCondition ? reward.withdrawCondition.channelItem : null
                                    "
                                />
                                <base-dropdown-twitter-users
                                    v-if="action.type === ChannelAction.TwitterFollow"
                                    @selected="item = $event"
                                    :items="action.items"
                                    :item="
                                        reward && reward.withdrawCondition ? reward.withdrawCondition.channelItem : null
                                    "
                                />
                            </template>
                            <b-alert show variant="warning" v-if="warning">{{ warning }}</b-alert>
                            <template v-if="channel && action && action.type === 0">
                                <base-dropdown-youtube-video :url="item" @selected="item = $event" />
                            </template>
                        </b-form-group>
                        <b-form-group
                            v-if="
                                action &&
                                [
                                    ChannelAction.TwitterLike,
                                    ChannelAction.TwitterRetweet,
                                    ChannelAction.TwitterFollow,
                                ].includes(action.type)
                            "
                        >
                            <b-alert variant="warning" show class="m-0">
                                <template v-if="action.type == ChannelAction.TwitterLike">
                                    Validation is limited to the last 100 likes.
                                </template>
                                <template v-if="action.type == ChannelAction.TwitterRetweet">
                                    Validation is limited to the last 100 retweets.
                                </template>
                                <template v-if="action.type == ChannelAction.TwitterFollow">
                                    Validation is limited to the last 5000 followers.
                                </template>
                            </b-alert>
                        </b-form-group>
                    </b-tab>
                </b-tabs>
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
                {{ reward ? 'Update Reward' : 'Create Reward' }}
            </b-button>
        </template>
    </base-modal>
</template>

<script lang="ts">
import { IPool } from '@/store/modules/pools';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import {
    channelActionList,
    ChannelType,
    ChannelAction,
    IChannel,
    IChannelAction,
    Reward,
    channelList,
} from '@/types/rewards';
import { IAccount, ITwitter, IYoutube } from '@/types/account';
import BaseDropdownYoutubeVideo from '../dropdowns/BaseDropdownYoutubeVideo.vue';
import BaseDropdownYoutubeUploads from '../dropdowns/BaseDropdownYoutubeUploads.vue';
import BaseDropdownYoutubeChannels from '../dropdowns/BaseDropdownYoutubeChannels.vue';
import BaseDropdownChannelActions from '../dropdowns/BaseDropdownChannelActions.vue';
import BaseDropdownTwitterTweets from '../dropdowns/BaseDropdownTwitterTweets.vue';
import BaseDropdownTwitterUsers from '../dropdowns/BaseDropdownTwitterUsers.vue';
import BaseDropdownChannelTypes from '../dropdowns/BaseDropdownChannelTypes.vue';
import slugify from '@/utils/slugify';
import BaseModal from './BaseModal.vue';
import { TERC721, TERC721Metadata } from '@/types/erc721';
import { format } from 'date-fns';
import BaseTooltipInfo from '../tooltips/BaseTooltipInfo.vue';
import BaseDropdownERC721Metadata from '../dropdowns/BaseDropdownERC721Metadata.vue';

enum RewardVariant {
    Token = 0,
    NFT = 1,
}

@Component({
    components: {
        BaseModal,
        BaseTooltipInfo,
        BaseDropdownYoutubeVideo,
        BaseDropdownYoutubeUploads,
        BaseDropdownYoutubeChannels,
        BaseDropdownTwitterTweets,
        BaseDropdownTwitterUsers,
        BaseDropdownChannelActions,
        BaseDropdownChannelTypes,
        BaseDropdownERC721Metadata,
    },
    computed: mapGetters({
        profile: 'account/profile',
        youtube: 'account/youtube',
        twitter: 'account/twitter',
    }),
})
export default class ModalRewardCreate extends Vue {
    ChannelAction = ChannelAction;
    channelActions = channelActionList;
    docsUrl = process.env.VUE_APP_DOCS_URL;
    loading = false;
    error = '';
    warning = '';
    format = format;
    RewardVariant = RewardVariant;

    isClaimOnce = true;
    isMembershipRequired = false;
    erc721metadata: TERC721Metadata | null = null;
    rewardWithdrawAmount = 0;
    rewardWithdrawDuration = 0;
    rewardWithdrawLimit = 0;
    rewardWithdrawUnlockDate = null;
    rewardTitle = '';
    amount = 1;

    rewardVariant: RewardVariant = RewardVariant.Token;
    rewardExpireDate: Date | null = null;
    rewardExpireTime = '00:00:00';

    channel: null | IChannel = null;
    action: null | IChannelAction = null;
    item: any = null;

    profile!: IAccount;
    youtube!: IYoutube;
    twitter!: ITwitter;

    @Prop() pool!: IPool;
    @Prop() erc721!: TERC721;
    @Prop() filteredRewards!: Reward[];
    @Prop() filteredMetadata!: TERC721Metadata[];
    @Prop({ required: false }) reward!: Reward;

    get isEditting() {
        return !!this.reward;
    }

    get modalName() {
        return this.isEditting ? 'Update Reward' : 'Create Reward';
    }

    @Watch('reward')
    async onRewardChange() {
        if (!this.reward) return;

        if (this.reward.erc721metadataId) {
            this.onRewardVariantChanged(RewardVariant.NFT);
            await this.$store.dispatch('erc721/readMetadata', {
                erc721: this.erc721,
                metadataId: this.reward.erc721metadataId,
            });
            this.erc721metadata =
                this.erc721?.metadata?.find((meta) => meta._id === this.reward.erc721metadataId) || null;
        } else {
            this.onRewardVariantChanged(RewardVariant.Token);
        }

        if (this.reward.withdrawCondition) {
            const channel = channelList.find((channel) => channel.type === this.reward.withdrawCondition.channelType);

            if (channel) {
                this.channel = channel;

                await this.onChannelClick(
                    this.channel,
                    this.channelActions[this.reward.withdrawCondition.channelAction],
                );
            }
        }

        this.rewardTitle = this.reward.title || '';
        this.rewardWithdrawLimit = this.reward.withdrawLimit || 0;
        this.rewardWithdrawAmount = this.reward.withdrawAmount || 0;
        this.rewardWithdrawDuration = this.reward.withdrawDuration || 0;
        this.rewardExpireDate = this.reward.expiryDate || null;
        this.rewardExpireTime = this.reward.expiryDate
            ? `${String(this.reward.expiryDate.getHours()).padStart(2, '0')}:${String(
                  this.reward.expiryDate.getMinutes(),
              ).padStart(2, '0')}:${String(this.reward.expiryDate.getSeconds()).padStart(2, '0')}`
            : '00:00:00';
        this.amount = this.reward.amount || 1;
    }

    get minDate() {
        let date = new Date();
        date.setDate(date.getDate() + 1);
        return date;
    }

    get isSubmitDisabled() {
        return (
            this.loading ||
            (this.rewardVariant === RewardVariant.NFT && !this.erc721metadata) ||
            (this.rewardVariant === RewardVariant.Token && this.rewardWithdrawLimit < 0) ||
            (this.rewardVariant === RewardVariant.Token && this.rewardWithdrawAmount <= 0) ||
            (this.channel?.type !== ChannelType.None && !this.item)
        );
    }

    onRewardVariantChanged(variant: RewardVariant) {
        switch (variant) {
            case RewardVariant.NFT: {
                this.rewardWithdrawAmount = 0;
                this.rewardWithdrawLimit = 0;
                this.erc721metadata = this.filteredMetadata ? this.filteredMetadata[0] : null;
                break;
            }
            case RewardVariant.Token: {
                this.erc721metadata = null;
                break;
            }
        }
        this.rewardVariant = variant;
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

    concatDatetime(date: Date, time: string) {
        const concatedDate = new Date(date);
        const [hours, minutes, seconds] = time.split(':').map((item) => Number(item));
        concatedDate.setHours(hours, minutes, seconds);
        return concatedDate;
    }

    async onChannelClick(channel: IChannel, action: IChannelAction | null = null) {
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

        this.channel = channel;

        if (action) {
            this.action = action;
        }
    }

    async onActionClick(action: IChannelAction) {
        this.action = action;
        if (!this.item) this.item = this.channelActions[action.type].items[0];
    }

    async submit() {
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
                          this.item.referenced_tweets[0] &&
                          this.item.referenced_tweets[0].type === 'retweeted'
                              ? this.item.referenced_tweets[0].id
                              : this.item.id,
                  }
                : null;

        const slug = slugify(this.rewardTitle);

        if (this.reward) {
            await this.$store.dispatch('rewards/update', {
                pool: this.pool,
                reward: {
                    ...this.reward,
                    slug,
                    title: this.rewardTitle,
                    expiryDate: expiryDate?.toISOString(),
                    erc721metadataId: this.erc721metadata?._id,
                    withdrawLimit: this.rewardWithdrawLimit,
                    withdrawAmount: this.rewardVariant ? 1 : this.rewardWithdrawAmount,
                    withdrawDuration: this.rewardWithdrawDuration,
                    withdrawCondition,
                    isClaimOnce: this.isClaimOnce,
                    isMembershipRequired: this.isMembershipRequired,
                    amount: this.amount,
                },
            });
        } else {
            await this.$store.dispatch('rewards/create', {
                poolId: this.pool._id,
                slug,
                title: this.rewardTitle,
                expiryDate: expiryDate?.toISOString(),
                erc721metadataId: this.erc721metadata?._id,
                withdrawLimit: this.rewardWithdrawLimit,
                withdrawAmount: this.rewardVariant ? 1 : this.rewardWithdrawAmount,
                withdrawDuration: this.rewardWithdrawDuration,
                withdrawCondition,
                isClaimOnce: this.isClaimOnce,
                isMembershipRequired: this.isMembershipRequired,
                amount: this.amount,
            });
        }

        this.rewardWithdrawLimit = 0;
        this.rewardWithdrawAmount = 0;
        this.rewardWithdrawDuration = 0;
        this.rewardTitle = '';
        this.rewardExpireDate = null;
        this.rewardExpireTime = '00:00:00';
        this.amount = 1;
        this.erc721metadata = null;
        this.$bvModal.hide(`modalRewardCreate`);
        this.loading = false;
        this.$emit('submit');
    }

    onSelectMetadata(metadata: TERC721Metadata) {
        this.erc721metadata = metadata;
    }
}
</script>
