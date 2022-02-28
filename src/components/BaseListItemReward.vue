<template>
    <b-form-group class="mb-0">
        <hr />
        <div class="row pt-2 pb-2">
            <div class="col-md-1 d-flex align-items-center justify-content-center">
                <i
                    v-b-tooltip
                    :title="`ID #${reward.id}`"
                    class="fas fa-power-off ml-0 mr-2"
                    :class="{ 'text-danger': !reward.state, 'text-success': reward.state }"
                ></i>
                <span class="large mr-2 text-primary"></span>
                <template v-if="reward.poll">
                    <a :id="`rewardPoll-${reward.id}`">
                        <i class="fas fa-poll text-primary"></i>
                    </a>
                    <base-popover-reward-poll :target="`rewardPoll-${reward.id}`" :reward="reward" />
                </template>
            </div>
            <div class="col-md-3">
                <b-input-group :append="assetPool.poolToken.symbol">
                    <b-form-input disabled type="number" v-model="reward.withdrawAmount" />
                </b-input-group>
            </div>
            <div class="col-md-3" v-if="isGovernanceEnabled">
                <b-input-group append="Seconds">
                    <b-form-input type="number" v-model="reward.withdrawDuration" />
                </b-input-group>
            </div>
            <div class="col-md-3">
                <a v-if="channelItemURL" target="_blank" :href="channelItemURL">
                    <b-badge class="border p-2" variant="light">
                        <img
                            v-if="channelType"
                            class="mr-2"
                            height="15"
                            :src="require(`@/assets/logo-${channelType.toLowerCase()}.png`)"
                            alt=""
                        />
                        {{ channelAction }}
                    </b-badge>
                </a>
            </div>
            <div class="col-md-5">
                <div class="d-flex justify-content-end">
                    <b-button class="rounded-pill mr-2" variant="light" v-b-modal="`modal-reward-link-${reward.id}`">
                        <i class="fas fa-link ml-0 text-primary"></i>
                    </b-button>
                    <base-modal-reward-link :assetPool="assetPool" :reward="reward" :rewardURL="rewardURL" />
                    <b-button class="rounded-pill mr-2" variant="light" v-b-modal="`modal-reward-qrcode-${reward.id}`">
                        <i class="fas fa-qrcode ml-0 text-primary"></i>
                    </b-button>
                    <base-modal-reward-qrcode :assetPool="assetPool" :reward="reward" :rewardURL="rewardURL" />
                    <b-button class="rounded-pill" variant="light" @click="toggleState()">
                        <i
                            class="fas fa-power-off ml-0 mr-2"
                            :class="{ 'text-danger': reward.state, 'text-success': !reward.state }"
                        ></i>
                        {{ reward.state ? 'Disable' : 'Enable' }}
                    </b-button>
                </div>
            </div>
        </div>
    </b-form-group>
</template>

<script lang="ts">
import { AssetPool } from '@/store/modules/assetPools';
import { Reward, ChannelType, ChannelAction, RewardState } from '@/store/modules/rewards';
import { Component, Prop, Vue } from 'vue-property-decorator';
import BaseModalRewardLink from '@/components/BaseModalRewardLink.vue';
import BaseModalRewardQrcode from '@/components/BaseModalRewardQRCode.vue';
import BasePopoverRewardPoll from '@/components/BasePopoverRewardPoll.vue';

@Component({
    components: {
        BaseModalRewardLink,
        BaseModalRewardQrcode,
        BasePopoverRewardPoll,
    },
})
export default class BaseListItemReward extends Vue {
    walletUrl = process.env.VUE_APP_WALLET_URL;
    channelType = '';
    channelAction = '';
    channelItemURL = '';

    @Prop() assetPool!: AssetPool;
    @Prop() reward!: Reward;
    @Prop() isGovernanceEnabled!: boolean;

    mounted() {
        if (this.reward.withdrawCondition) {
            this.channelType = ChannelType[this.reward.withdrawCondition.channelType];
            this.channelAction = ChannelAction[this.reward.withdrawCondition.channelAction];
            this.channelItemURL = this.getChannelActionURL(
                this.reward.withdrawCondition.channelAction,
                this.reward.withdrawCondition.channelItem,
            );
        }
    }

    getChannelActionURL(channelAction: ChannelAction, channelItem: string) {
        switch (channelAction) {
            case ChannelAction.YouTubeLike:
                return `https://youtu.be/${channelItem}`;
            case ChannelAction.YouTubeSubscribe:
                return `https://youtube.com/channel/${channelItem}`;
            case ChannelAction.TwitterLike:
                return `https://www.twitter.com/twitter/status/${channelItem}`;
            case ChannelAction.TwitterRetweet:
                return `https://www.twitter.com/twitter/status/${channelItem}`;
            case ChannelAction.TwitterFollow:
                return `https://www.twitter.com/i/user/${channelItem}`;
            case ChannelAction.SpotifyUserFollow:
                return `https://open.spotify.com/artist/${channelItem}`;
            case ChannelAction.SpotifyPlaylistFollow:
                return `https://open.spotify.com/track/${channelItem}`;
            case ChannelAction.SpotifyTrackPlaying:
                return `https://open.spotify.com/track/${channelItem}`;
            case ChannelAction.SpotifyTrackSaved:
                return `https://open.spotify.com/track/${channelItem}`;
            default:
                return '';
        }
    }

    get rewardURL() {
        const data = {
            network: this.assetPool.network,
            poolAddress: this.assetPool.address,
            tokenSymbol: this.assetPool.poolToken.symbol,
            rewardId: this.reward.id,
            rewardAmount: this.reward.withdrawAmount,
            rewardCondition: this.reward.withdrawCondition,
        };
        return `${this.walletUrl}/claim?hash=${btoa(JSON.stringify(data))}`;
    }

    toggleState() {
        this.$store.dispatch('rewards/update', {
            reward: this.reward,
            data: {
                state: this.reward.state ? RewardState.Disabled : RewardState.Enabled,
            },
        });
    }
}
</script>
