<template>
    <b-modal
        size="lg"
        @show="onShow()"
        :title="assetPool.poolToken.symbol + ' Pool'"
        :id="`modalAssetPoolDetails-${assetPool.address}`"
    >
        <b-overlay :show="loading" class="m-n3 pb-3">
            <b-alert variant="danger" show v-if="error">
                {{ error }}
            </b-alert>
            <b-tabs card>
                <b-tab title="Information" active>
                    <b-card-text>
                        <b-form-group>
                            <label>
                                <strong>Blockchain Network</strong>
                            </label>
                            <b-form-input readonly v-if="network === 0" value="Polygon Test" />
                            <b-form-input readonly v-if="network === 1" value="Polygon Mainnet" />
                        </b-form-group>
                        <b-form-group>
                            <label for="clientId">
                                <strong class="mr-2">Smart Contract Address</strong>
                                <b-badge variant="primary" v-if="network === 0">Polygon Test</b-badge>
                                <b-badge variant="success" v-if="network === 1">Polygon Main</b-badge>
                            </label>
                            <b-form-input readonly id="address" v-model="assetPool.address" />
                            <p class="text-muted small mb-0">
                                View your asset pool transactions in the
                                <a
                                    v-if="network === 0"
                                    target="_blank"
                                    :href="`https://mumbai.polygonscan.com/address/${assetPool.address}/transactions`"
                                >
                                    Polygon testnet block explorer
                                </a>
                                <a
                                    v-if="network === 1"
                                    target="_blank"
                                    :href="`https://polygonscan.com/address/${assetPool.address}/transactions`"
                                >
                                    Polygon mainnet block explorer
                                </a>
                                .
                            </p>
                        </b-form-group>
                    </b-card-text>
                </b-tab>
                <b-tab title="Authorization">
                    <b-card-text>
                        <b-form-group v-if="client">
                            <strong>
                                Authorization
                                <a :href="docsUrl + '/authorization'" target="_blank">
                                    <i class="fas fa-question-circle"></i>
                                </a>
                            </strong>
                            <p>
                                Use you client credentials to create a
                                <a
                                    :href="docsUrl + '/authorization#2-create-a-basic-authentication-header'"
                                    target="_blank"
                                >
                                    Basic Authentication header
                                </a>
                                and request an access token to authorize your application with THX API.
                            </p>
                            <b-form-group>
                                <label for="clientId"> Client ID: </label>
                                <b-form-input readonly id="clientId" v-model="client.clientId" />
                            </b-form-group>
                            <b-form-group>
                                <label for="clientSecret"> Client Secret: </label>
                                <b-form-input readonly id="clientSecret" v-model="client.clientSecret" />
                            </b-form-group>
                            <hr />
                            <strong>Example code</strong>
                            <p>These examples should demonstrate how to authorize with the THX API.</p>
                            <b-tabs card>
                                <b-tab title="Simulator" active>
                                    <b-card-text>
                                        <b-button variant="primary" class="rounded-pill" @click="getAccessToken()">
                                            Request Access Token
                                        </b-button>
                                        <template v-if="accessToken">
                                            <code class="mt-3 d-block">
                                                <small>{{ accessToken.access_token }}</small>
                                            </code>
                                            <b-alert class="mt-3" variant="warning" show>
                                                This access token is only valid for a limited amount of time ({{
                                                    accessToken.expires_in
                                                }}
                                                seconds).
                                            </b-alert>
                                        </template>
                                    </b-card-text>
                                </b-tab>
                                <b-tab title="Basic Authorization header">
                                    <b-card-text>
                                        <p>
                                            This example demonstrates the authorization header you should use to request
                                            your access token.
                                            <a
                                                :href="
                                                    docsUrl + '/authorization#2-create-a-basic-authentication-header'
                                                "
                                                target="_blank"
                                            >
                                                Read more about constructing it yourself</a
                                            >.
                                        </p>
                                        <pre>
Authorization: Basic {{ authHeader() }}
                                        </pre>
                                    </b-card-text>
                                </b-tab>
                                <b-tab title="CURL">
                                    <b-card-text>
                                        <pre>
curl "https://api.thx.network/token" \
    -X "POST" \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    -H 'Authorization: Basic {{ authHeader() }}' \
    -d 'grant_type=client_credentials&scope=openid admin'
                                        </pre>
                                    </b-card-text>
                                </b-tab>
                                <b-tab title="Axios">
                                    <b-card-text>
                                        <pre>
axios({
    url: 'https://api.thx.network/token', 
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic {{ authHeader() }}',
    },
    data: {
        grant_type: 'client_credentials',
        scope: 'openid admin',
    }
});
                                        </pre>
                                    </b-card-text>
                                </b-tab>
                                <b-tab title="Vanilla JS">
                                    <b-card-text>
                                        <pre>
var params = new URLSearchParams();
params.append('grant_type', 'client_credentials');
params.append('scope', 'openid admin');
var xhr = new XMLHttpRequest();
xhr.open("POST", "https://api.thx.network/token", true);
xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
xhr.setRequestHeader('Authorization', 'Basic {{ authHeader() }}');
xhr.send(params);
                                        </pre>
                                    </b-card-text>
                                </b-tab>
                            </b-tabs>
                        </b-form-group>
                    </b-card-text>
                </b-tab>
                <b-tab title="Rewards">
                    <b-card-text>
                        <p>Integrate THX API in your app to increase engement with gamified rewards.</p>
                        <hr />
                        <b-form-group>
                            <b-form-checkbox @change="updateAssetPool()" v-model="enableGovernance">
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
                                <b-input-group size="sm">
                                    <b-form-input id="rewardPollDuration" type="number" v-model="rewardPollDuration" />
                                    <b-input-group-append>
                                        <b-button size="sm" variant="dark" @click="updateAssetPool()">
                                            Update <i class="fas fa-save"></i
                                        ></b-button>
                                    </b-input-group-append>
                                </b-input-group>
                                <p class="text-muted small">
                                    Default duration of the poll that is started when a reward configuration is added or
                                    changed. This poll should pass to approve the changes.
                                </p>
                            </b-form-group>
                            <b-form-group>
                                <label for="withdrawPollDuration">Default Withdraw Poll Duration:</label>
                                <b-input-group size="sm">
                                    <b-form-input
                                        id="withdrawPollDuration"
                                        type="number"
                                        v-model="withdrawPollDuration"
                                    />
                                    <b-input-group-append>
                                        <b-button size="sm" variant="dark" @click="updateAssetPool()">
                                            Update <i class="fas fa-save"></i
                                        ></b-button>
                                    </b-input-group-append>
                                </b-input-group>
                                <p class="text-muted small">
                                    Default duration of the poll that is started when a reward is claimed by or for a
                                    member. This poll should pass to be able to withdraw the reward. Only members with a
                                    manager role can vote on this poll.
                                    <strong>
                                        Withdraw Poll defauls can be overridden with the configuration of the reward.
                                    </strong>
                                </p>
                            </b-form-group>
                        </b-card>
                        <hr />
                        <strong>
                            Create rewards
                            <a :href="docsUrl + '/rewards#1-create-a-reward'" target="_blank">
                                <i class="fas fa-question-circle"></i>
                            </a>
                        </strong>
                        <p class="text-muted mb-0">Create rewards that can be given to pool members.</p>
                        <b-form-group>
                            <div class="container pl-4 pr-4">
                                <div class="row mt-3">
                                    <div class="col-md-4 offset-md-1">
                                        <strong class="text-muted m-0"> Withdraw amount </strong>
                                        <a
                                            :href="docsUrl + '/rewards'"
                                            v-b-tooltip
                                            :title="`The amount of ${assetPool.poolToken.symbol} earned with this reward.`"
                                            target="_blank"
                                        >
                                            <i class="fas fa-question-circle"></i>
                                        </a>
                                    </div>
                                    <div class="col-md-5">
                                        <strong class="text-muted"> Withdraw poll duration </strong>
                                        <a
                                            :href="docsUrl + '/rewards'"
                                            v-b-tooltip
                                            title="The duration in seconds of the withdraw poll that is started when the rewards is claimed or given."
                                            target="_blank"
                                        >
                                            <i class="fas fa-question-circle"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <b-card bg-variant="light" class="mt-2" body-class="pt-2 pb-2">
                                <div class="row">
                                    <div class="col-md-1">
                                        <code class="mr-3">#{{ filteredRewards.length + 1 }}</code>
                                    </div>
                                    <div class="col-md-4">
                                        <b-input-group size="sm" :append="assetPool.poolToken.symbol">
                                            <b-form-input type="number" v-model="reward.withdrawAmount" />
                                        </b-input-group>
                                    </div>

                                    <div class="col-md-5">
                                        <b-input-group size="sm" append="Seconds">
                                            <b-form-input
                                                type="number"
                                                :disabled="!enableGovernance"
                                                v-model="reward.withdrawDuration"
                                            />
                                        </b-input-group>
                                    </div>

                                    <div class="col-md-2">
                                        <b-button
                                            @click="addReward()"
                                            variant="dark"
                                            size="sm"
                                            class="rounded-pill"
                                            block
                                        >
                                            <span>Add</span>
                                            <i class="fas fa-plus"></i>
                                        </b-button>
                                    </div>
                                </div>
                            </b-card>
                        </b-form-group>
                        <hr />
                        <strong>
                            Update rewards
                            <a :href="docsUrl + '/rewards#2-change-reward-configuration'" target="_blank">
                                <i class="fas fa-question-circle"></i>
                            </a>
                        </strong>
                        <p class="text-muted mb-3">
                            Update existing rewards immediately or start a poll for the change if governance is enabled.
                        </p>
                        <b-form-group>
                            <b-list-group>
                                <b-list-group-item class="pt-2 pb-2" :key="reward.id" v-for="reward of filteredRewards">
                                    <div class="row">
                                        <div class="col-md-1 d-flex align-items-center">
                                            <code class="mr-2">#{{ reward.id }}</code>
                                            <template v-if="reward.poll">
                                                <a :id="`rewardPoll-${reward.id}`">
                                                    <i class="fas fa-poll text-primary"></i>
                                                </a>
                                                <b-popover
                                                    :target="`rewardPoll-${reward.id}`"
                                                    triggers="hover"
                                                    placement="top"
                                                >
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
                                            <b-input-group size="sm" :append="assetPool.poolToken.symbol">
                                                <b-form-input type="number" v-model="reward.withdrawAmount" />
                                            </b-input-group>
                                        </div>
                                        <div class="col-md-5">
                                            <b-input-group size="sm" append="Seconds">
                                                <b-form-input
                                                    type="number"
                                                    :disabled="!enableGovernance"
                                                    v-model="reward.withdrawDuration"
                                                />
                                            </b-input-group>
                                        </div>
                                        <div class="col-md-2">
                                            <b-button variant="dark" size="sm" class="rounded-pill" block>
                                                Update
                                                <i class="fas fa-save"></i>
                                            </b-button>
                                        </div>
                                    </div>
                                </b-list-group-item>
                            </b-list-group>
                        </b-form-group>
                    </b-card-text>
                </b-tab>
            </b-tabs>
        </b-overlay>

        <template v-slot:modal-footer="{ ok }">
            <div class="d-none">
                <b-button @click="ok()"></b-button>
            </div>
        </template>
    </b-modal>
</template>

<script lang="ts">
import { Client, IClients } from '@/store/modules/clients';
import { AssetPool, NetworkProvider } from '@/store/modules/assetPools';
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
} from 'bootstrap-vue';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import axios from 'axios';
import { IRewards, Reward } from '@/store/modules/rewards';

@Component({
    components: {
        'b-modal': BModal,
        'b-alert': BAlert,
        'b-tabs': BTabs,
        'b-tab': BTab,
        'b-card-text': BCardText,
        'b-link': BLink,
        'b-card': BCard,
        'b-badge': BBadge,
        'b-form-checkbox': BFormCheckbox,
        'b-form-group': BFormGroup,
        'b-form-select': BFormSelect,
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
    },
    computed: mapGetters({
        assetPools: 'assetPools/all',
        clients: 'clients/all',
        rewards: 'rewards/all',
    }),
})
export default class ModalAssetPoolDetails extends Vue {
    docsUrl = process.env.VUE_APP_DOCS_URL;
    apiUrl = process.env.VUE_APP_API_ROOT;

    error = '';
    loading = true;
    client: Client | null = null;
    enableGovernance = true;
    rewardPollDuration = 0;
    withdrawPollDuration = 0;
    network: NetworkProvider = NetworkProvider.Test;
    accessToken = '';
    reward = {
        withdrawAmount: 0,
        withdrawDuration: 0,
    };

    @Prop() assetPool!: AssetPool;

    clients!: IClients;
    rewards!: IRewards;

    get filteredRewards(): Reward[] {
        if (this.rewards[this.assetPool.address]) {
            return Object.values(this.rewards[this.assetPool.address]);
        }
        return [];
    }

    async onShow() {
        try {
            await this.$store.dispatch('rewards/read', this.assetPool.address);
        } catch (e) {
            debugger;
        } finally {
            this.loading = false;
        }
    }

    async addReward() {
        this.loading = true;
        try {
            await this.$store.dispatch('rewards/create', {
                address: this.assetPool.address,
                withdrawAmount: this.reward.withdrawAmount,
                withdrawDuration: this.reward.withdrawDuration,
            });
        } catch (e) {
            debugger;
        } finally {
            this.loading = false;
        }
    }

    mounted() {
        this.client =
            Object.values(this.clients).find(
                (client: Client) => client.registrationAccessToken === this.assetPool.rat,
            ) || null;

        this.enableGovernance = !this.assetPool.bypassPolls;
        this.network = this.assetPool.network;
    }

    authHeader() {
        return btoa(`${this.client?.clientId}:${this.client?.clientSecret}`);
    }

    async getAccessToken() {
        try {
            const data = new URLSearchParams();
            data.append('grant_type', 'client_credentials');
            data.append('scope', 'openid admin');

            const r = await axios({
                url: this.apiUrl + '/token',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + this.authHeader(),
                },
                data,
            });

            this.accessToken = r.data;
        } catch (e) {
            console.error(e);
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
                    withdrawPollDuration: this.withdrawPollDuration,
                },
            });
        } catch (e) {
            console.error(e);
            this.error = 'Could not update your asset pool.';
        } finally {
            this.loading = false;
        }
    }
}
</script>
