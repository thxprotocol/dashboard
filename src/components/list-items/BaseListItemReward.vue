<template>
    <base-card>
        <template #card-body>
            <b-alert variant="info" show v-if="isDownloadScheduled">
                You will receive an e-mail when you can download your file.
            </b-alert>
            <b-row>
                <b-col md="3" class="d-flex mb-3 mb-sm-0">
                    <b-button
                        v-if="reward.amount === 1"
                        v-b-tooltip
                        block
                        title="Click to download the QR code as a jpg file"
                        :download="`${reward._id}.jpg`"
                        variant="light"
                        class="p-3 m-auto m-0"
                        :href="qrURL"
                    >
                        <vue-qr
                            style="width: 50px; height: 50px"
                            :callback="onQRLoaded"
                            :logoSrc="imgData"
                            :text="claimURL"
                            :correctLevel="3"
                            :logoScale="0.3"
                            :logoCornerRadius="0"
                            :logoMargin="0"
                            :margin="10"
                            :size="480"
                        />
                    </b-button>
                    <b-button v-else block title="Download QR codes" variant="primary" @click="getQRCodes()">
                        <b-spinner small variant="white" v-if="isDownloading" />
                        <template v-else>
                            <i class="fas fa-download mr-3"></i>
                            <strong>{{ reward.amount }}</strong> QR Codes
                        </template>
                    </b-button>
                </b-col>
                <b-col class="d-flex flex-column">
                    <div class="d-flex align-items-center">
                        <h3 class="text-primary">{{ reward.withdrawAmount }} {{ pool.token.symbol }}</h3>
                        <sup
                            class="fas fa-circle ml-1 mr-auto"
                            :class="{ 'text-danger': !reward.state, 'text-success': reward.state }"
                            style="font-size: 0.8rem"
                        >
                        </sup>
                        <b-dropdown size="sm" variant="white" no-caret>
                            <template #button-content>
                                <i
                                    class="fas fa-ellipsis-v m-0 p-1 px-2 text-muted"
                                    style="font-size: 1.2rem"
                                    aria-hidden="true"
                                ></i>
                            </template>
                            <b-dropdown-item-button @click="toggleState()">
                                <i class="fas fa-power-off mr-3"></i>{{ reward.state ? 'Disable' : 'Enable' }}
                            </b-dropdown-item-button>
                        </b-dropdown>
                    </div>
                    <p>{{ reward.title }}</p>
                    <b-input-group size="sm" class="mt-auto" v-if="reward.amount === 1">
                        <b-form-input size="sm" readonly :value="claimURL" />
                        <b-input-group-append>
                            <b-button variant="primary" v-clipboard:copy="claimURL">
                                <i class="far fa-copy m-0" style="font-size: 1rem"></i>
                            </b-button>
                        </b-input-group-append>
                    </b-input-group>
                </b-col>
            </b-row>
            <hr />
            <template v-if="pool.isDefaultPool">
                <label>
                    Supply Limit: <strong v-if="reward.withdrawLimit" class="">{{ reward.withdrawLimit }}</strong>
                </label>
                <b-progress>
                    <b-progress-bar
                        :label="
                            reward.withdrawLimit
                                ? `${reward.progress}/${reward.withdrawLimit}`
                                : String(reward.progress)
                        "
                        :value="reward.progress"
                        :min="0"
                        :max="reward.withdrawLimit || reward.progress"
                    />
                </b-progress>
            </template>
            <label class="mt-3">Reward Conditions:</label>
            <div>
                <b-badge
                    v-b-tooltip
                    title="Amount of times the user is able to claim this reward per account."
                    class="border p-2 mb-1 mr-1"
                    variant="light"
                >
                    {{ reward.isClaimOnce ? 'Claim once' : 'Claim unlimited' }}
                </b-badge>

                <b-badge
                    v-b-tooltip
                    title="Verifies that the user claiming the reward has a membership for the pool."
                    class="border p-2 mb-1 mr-1"
                    v-if="reward.isMembershipRequired"
                    variant="light"
                >
                    Members only
                </b-badge>
                <b-link
                    v-if="channelItemURL"
                    v-b-tooltip
                    title="Verifies that the user has engaged with a given item in a social channel."
                    target="_blank"
                    :href="channelItemURL"
                >
                    <b-badge class="border p-2 mb-1 mr-1" variant="light">
                        <img
                            v-if="channelType"
                            height="10"
                            class="mr-1"
                            :src="require(`@/assets/logo-${channelType.toLowerCase()}.png`)"
                            alt=""
                        />
                        {{ channelAction }}
                    </b-badge>
                </b-link>
                <b-badge
                    v-b-tooltip
                    v-if="reward.expiryDate"
                    class="border p-2 mb-1 mr-1 font-weight-normal"
                    title="Until this date and time the reward could be claimed.'"
                    variant="light"
                >
                    <strong>Expiry:</strong> {{ new Date(reward.expiryDate).toLocaleString() }}
                </b-badge>
                <b-badge
                    v-b-tooltip
                    title="This reward could be claimed, but only withdrawn after this date."
                    v-if="reward.withdrawUnlockDate"
                    class="border p-2 mb-1 mr-1 font-weight-normal"
                    variant="light"
                >
                    <strong>Unlocked:</strong> {{ new Date(reward.withdrawUnlockDate).toLocaleString() }}
                </b-badge>
            </div>
        </template>
    </base-card>
</template>

<script lang="ts">
import { IPool } from '@/store/modules/pools';
import { Reward, ChannelType, ChannelAction, RewardState } from '@/types/rewards';
import { Component, Prop, Vue } from 'vue-property-decorator';
import BaseCard from '../cards/BaseCard.vue';
import VueQr from 'vue-qr';
import { BASE_URL, WALLET_URL } from '@/utils/secrets';
import { mapGetters } from 'vuex';
import { TBrandState } from '@/store/modules/brands';

const getBase64Image = (url: string): Promise<string> => {
    return new Promise((resolve) => {
        const img = new Image();
        img.setAttribute('crossOrigin', 'anonymous');
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0);
            resolve(canvas.toDataURL('image/png'));
        };
        img.src = url;
    });
};

@Component({
    computed: mapGetters({
        brands: 'brands/all',
    }),
    components: {
        BaseCard,
        VueQr,
    },
})
export default class BaseListItemReward extends Vue {
    channelType = '';
    channelAction = '';
    channelItemURL = '';
    imgData = '';
    claimURL = '';
    qrURL = '';
    isDownloading = false;
    isDownloadScheduled = false;

    @Prop() pool!: IPool;
    @Prop() reward!: Reward;

    brands!: TBrandState;

    get expired() {
        if (!this.reward.expiryDate) return false;
        const currentTime = new Date().getTime();
        const expiryTime = new Date(this.reward.expiryDate).getTime();
        return currentTime < expiryTime;
    }

    mounted() {
        if (this.reward.withdrawCondition) {
            this.channelType = ChannelType[this.reward.withdrawCondition.channelType];
            this.channelAction = ChannelAction[this.reward.withdrawCondition.channelAction];
            this.channelItemURL = this.getChannelActionURL(
                this.reward.withdrawCondition.channelAction,
                this.reward.withdrawCondition.channelItem,
            );
        }
        if (this.reward.amount == 1) {
            this.$store.dispatch('brands/pool', this.pool._id).then((res) => {
                getBase64Image(res.logoImgUrl || BASE_URL + require('@/assets/qr-logo.jpg')).then((data) => {
                    this.imgData = data;
                    this.claimURL = `${WALLET_URL}/claim/${this.reward.claims[0]._id}`;
                });
            });
        }
    }

    onQRLoaded(dataUrl: string) {
        this.qrURL = dataUrl;
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
                return `https://open.spotify.com/playlist/${channelItem}`;
            case ChannelAction.SpotifyTrackPlaying:
                return `https://open.spotify.com/track/${channelItem}`;
            case ChannelAction.SpotifyTrackSaved:
                return `https://open.spotify.com/track/${channelItem}`;
            default:
                return '';
        }
    }

    toggleState() {
        this.$store.dispatch('rewards/update', {
            reward: this.reward,
            data: {
                state: this.reward.state ? RewardState.Disabled : RewardState.Enabled,
            },
        });
    }

    async getQRCodes() {
        this.isDownloading = true;
        this.isDownloadScheduled = await this.$store.dispatch('rewards/getQRCodes', {
            reward: this.reward,
        });
        this.isDownloading = false;
    }
}
</script>
