<template>
    <b-modal size="lg" :title="assetPool.title" :id="`modalAssetPoolDetails-${assetPool.address}`">
        <b-overlay :show="loading" class="m-n3 pt-3 pb-3">
            <div class="ml-3 mr-3">
                <b-form-group>
                    <label for="title">Title:</label>
                    <b-form-input id="title" v-model="title" />
                </b-form-group>
                <b-form-group>
                    <label for="clientId">Connected App:</label>
                    <b-form-select v-model="application">
                        <b-form-select-option
                            :value="application"
                            :key="application.clientId"
                            v-for="application of applications"
                        >
                            {{ application.clientName }}
                        </b-form-select-option>
                    </b-form-select>
                </b-form-group>
                <b-form-group>
                    <label for="clientId">
                        Smart Contract Address
                        <b-badge variant="primary" v-if="network === 0">Test</b-badge>
                        <b-badge variant="success" v-if="network === 1">Main</b-badge>
                    </label>
                    <b-form-input readonly id="address" v-model="assetPool.address" />
                    <p class="text-muted small mb-0">
                        View your pool transactions in the
                        <a
                            v-if="network === 0"
                            target="_blank"
                            :href="`https://explorer-mumbai.maticvigil.com/address/${assetPool.address}/transactions`"
                        >
                            Polygon testnet block explorer
                        </a>
                        <a
                            v-if="network === 1"
                            target="_blank"
                            :href="`https://explorer-mainnet.maticvigil.com/address/${assetPool.address}/transactions`"
                        >
                            Polygon mainnet block explorer
                        </a>
                        .
                    </p>
                </b-form-group>
                <b-form-group>
                    <b-form-checkbox v-model="enableGovernance">
                        <strong>
                            Enable governance
                            <a :href="docsUrl + '/asset_pools#2-asset-pool-governance'" target="_blank">
                                <i class="fas fa-question-circle"></i>
                            </a>
                        </strong>
                    </b-form-checkbox>
                    <p class="text-muted mb-0">
                        Enabling governance will require a voting procedure for high risk transactions.
                    </p>
                </b-form-group>
                <b-card bg-variant="light" v-if="enableGovernance">
                    <b-form-group>
                        <label for="rewardPollDuration">Default Reward Poll Duration:</label>
                        <b-form-input id="rewardPollDuration" type="number" v-model="rewardPollDuration" />
                        <p class="text-muted small">
                            Default duration of the poll that is started when a reward configuration is added or
                            changed. This poll should pass to approve the changes.
                        </p>
                    </b-form-group>
                    <b-form-group>
                        <label for="withdrawPollDuration">Default Withdraw Poll Duration:</label>
                        <b-form-input id="withdrawPollDuration" type="number" v-model="withdrawPollDuration" />
                        <p class="text-muted small">
                            Default duration of the poll that is started when a reward is claimed by or for a member.
                            This poll should pass to be able to withdraw the reward. Only members with a manager role
                            can vote on this poll.
                            <strong
                                >Withdraw Poll defauls can be overridden with the configuration of the reward.</strong
                            >
                        </p>
                    </b-form-group>
                </b-card>
            </div>
        </b-overlay>

        <template v-slot:modal-footer="{ cancel }">
            <b-link @click="cancel()"> Cancel</b-link>
            <b-button :disabled="loading" variant="primary" class="btn-rounded" @click="update()"> Update </b-button>
        </template>
    </b-modal>
</template>

<script lang="ts">
import { Application, IApplications } from '@/store/modules/applications';
import { AssetPool, NetworkProvider } from '@/store/modules/assetPools';
import {
    BAlert,
    BBadge,
    BButton,
    BCard,
    BCollapse,
    BFormCheckbox,
    BFormGroup,
    BFormInput,
    BFormSelect,
    BFormSelectOption,
    BLink,
    BModal,
    BOverlay,
} from 'bootstrap-vue';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';

@Component({
    components: {
        'b-modal': BModal,
        'b-alert': BAlert,
        'b-link': BLink,
        'b-card': BCard,
        'b-badge': BBadge,
        'b-form-checkbox': BFormCheckbox,
        'b-form-group': BFormGroup,
        'b-form-select': BFormSelect,
        'b-form-select-option': BFormSelectOption,
        'b-form-input': BFormInput,
        'b-button': BButton,
        'b-collapse': BCollapse,
        'b-overlay': BOverlay,
    },
    computed: mapGetters({
        assetPools: 'assetPools/all',
        applications: 'applications/all',
    }),
})
export default class ModalAssetPoolDetails extends Vue {
    docsUrl = process.env.VUE_APP_DOCS_URL;
    loading = false;
    application: Application | null = null;
    enableGovernance = true;
    rewardPollDuration = 0;
    withdrawPollDuration = 0;
    network: NetworkProvider = NetworkProvider.Test;
    title = '';

    @Prop() assetPool!: AssetPool;

    applications!: IApplications;

    mounted() {
        this.application =
            Object.values(this.applications).find((app: Application) => app.clientId === this.assetPool.aud) || null;
        this.title = this.assetPool.title;
        this.enableGovernance = !this.assetPool.bypassPolls;
        this.network = this.assetPool.network;
    }

    async update() {
        this.loading = true;
        try {
            await this.$store.dispatch('assetPools/update', {
                address: this.assetPool.address,
                title: this.title,
                aud: this.application?.clientId,
                bypassPolls: !this.enableGovernance,
                rewardPollDuration: this.rewardPollDuration,
                withdrawPollDuration: this.withdrawPollDuration,
                network: this.network,
            });

            await this.$store.dispatch('assetPools/read', this.assetPool.address);

            this.$bvModal.hide(`modalAssetPoolDetails-${this.assetPool.address}`);
        } catch (e) {
            console.error(e);
        } finally {
            this.loading = false;
        }
    }
}
</script>
