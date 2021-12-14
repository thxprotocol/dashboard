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
                            <b-dropdown
                                variant="link"
                                class="dropdown-select bg-white"
                                v-if="channel && channel.actions.length > 0"
                            >
                                <template #button-content>
                                    <div v-if="action">
                                        {{ action.name }}
                                    </div>
                                </template>
                                <b-dropdown-item-button
                                    :key="action.type"
                                    v-for="action of channel.actions"
                                    @click="onActionClick(action)"
                                >
                                    {{ action.name }}
                                </b-dropdown-item-button>
                            </b-dropdown>
                            <p v-else class="small text-muted">Select a channel first.</p>
                        </div>
                    </div>
                </b-form-group>
                <b-form-group>
                    <label> Item:</label>
                    <b-dropdown
                        variant="link"
                        class="dropdown-select bg-white"
                        v-if="channel && action && action.items.length > 0"
                    >
                        <template #button-content>
                            <div v-if="item">
                                <img
                                    :src="item.thumbnailURI"
                                    v-if="item.thumbnailURI"
                                    width="30"
                                    class="mr-2"
                                    :alt="item.title"
                                />
                                {{ item.title }}
                            </div>
                        </template>
                        <b-dropdown-item-button :key="item.id" v-for="item of action.items" @click="onItemClick(item)">
                            <div class="d-flex">
                                <div class="d-flex align-items-center">
                                    <img
                                        :src="item.thumbnailURI"
                                        v-if="item.thumbnailURI"
                                        height="50"
                                        width="auto"
                                        class="mr-3"
                                        :alt="item.title"
                                    />
                                </div>
                                <div class="d-flex flex-grow-1 flex-column">
                                    <div>
                                        {{ item.title }}
                                    </div>
                                    <div class="flex-row">
                                        <b-badge
                                            variant="secondary"
                                            class="font-weight-normal mr-1"
                                            :key="key"
                                            v-for="(tag, key) of item.tags"
                                        >
                                            {{ tag }}
                                        </b-badge>
                                    </div>
                                </div>
                            </div>
                        </b-dropdown-item-button>
                    </b-dropdown>
                    <p v-else class="small text-muted">No items found for this engagement type.</p>
                </b-form-group>
                <b-form-group v-if="enableGovernance">
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
import { ChannelType, ChannelYoutubeAction, IChannel, IChannelAction, Reward } from '@/store/modules/rewards';
import { IAccount, IYoutube } from '@/store/modules/account';

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
    },
    computed: mapGetters({
        profile: 'account/profile',
        youtube: 'account/youtube',
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
            actions: [
                {
                    type: ChannelYoutubeAction.None,
                    name: 'None',
                    items: [],
                },
                {
                    type: ChannelYoutubeAction.Like,
                    name: 'Like',
                    items: [],
                },
                {
                    type: ChannelYoutubeAction.Subscribe,
                    name: 'Subscribe',
                    items: [],
                },
            ],
        },
    ];
    profile!: IAccount;
    youtube!: IYoutube;

    @Prop() assetPool!: AssetPool;
    @Prop() filteredRewards!: Reward[];
    @Prop() enableGovernance!: boolean;

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
            this.channel.actions[ChannelYoutubeAction.None].items = [];
            this.channel.actions[ChannelYoutubeAction.Like].items = this.youtube.videos;
            this.channel.actions[ChannelYoutubeAction.Subscribe].items = this.youtube.channels;
        }
    }

    async onChannelClick(channel: IChannel) {
        this.action = null;
        this.item = null;

        switch (channel.type) {
            case ChannelType.None:
                this.channel = channel;
                break;
            case ChannelType.YouTube:
                this.channel = channel;
                this.action = channel.actions[0];
                await this.getYoutube();
                break;
            default:
                this.error = 'Channel type is not known.';
                break;
        }
    }

    async onActionClick(action: IChannelAction) {
        this.action = action;
        this.item = this.channelList[ChannelType.YouTube].actions[action.type].items[0];
    }

    onItemClick(item: any) {
        this.item = item;
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
