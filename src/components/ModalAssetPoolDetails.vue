<template>
    <b-modal size="lg" :title="assetPool.poolToken.symbol + ' Pool'" :id="`modalAssetPoolDetails-${assetPool.address}`">
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
                                    Default duration of the poll that is started when a reward is claimed by or for a
                                    member. This poll should pass to be able to withdraw the reward. Only members with a
                                    manager role can vote on this poll.
                                    <strong>
                                        Withdraw Poll defauls can be overridden with the configuration of the reward.
                                    </strong>
                                </p>
                            </b-form-group>
                        </b-card>
                    </b-card-text>
                </b-tab>
                <b-tab title="Lending">
                    <b-card-text>
                        <p>Create loan pools that request a loan from on the THX Protocol.</p>
                        <p>Please contact us if you are interested in this.</p>
                    </b-card-text>
                </b-tab>
            </b-tabs>
        </b-overlay>

        <template v-slot:modal-footer="{ cancel }">
            <b-link @click="cancel()"> Cancel</b-link>
            <b-button :disabled="loading" variant="primary" class="rounded-pill" @click="update()"> Update </b-button>
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
    BLink,
    BModal,
    BOverlay,
    BTabs,
    BTab,
} from 'bootstrap-vue';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import axios from 'axios';

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
        'b-button': BButton,
        'b-collapse': BCollapse,
        'b-overlay': BOverlay,
    },
    computed: mapGetters({
        assetPools: 'assetPools/all',
        clients: 'clients/all',
    }),
})
export default class ModalAssetPoolDetails extends Vue {
    docsUrl = process.env.VUE_APP_DOCS_URL;
    apiUrl = process.env.VUE_APP_API_ROOT;

    error = '';
    loading = false;
    client: Client | null = null;
    enableGovernance = true;
    rewardPollDuration = 0;
    withdrawPollDuration = 0;
    network: NetworkProvider = NetworkProvider.Test;
    accessToken = '';

    @Prop() assetPool!: AssetPool;

    clients!: IClients;

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

    async update() {
        this.loading = true;
        try {
            await this.$store.dispatch('assetPools/update', {
                address: this.assetPool.address,
                client: {
                    clientId: '',
                    clientSecret: '',
                },
                bypassPolls: !this.enableGovernance,
                rewardPollDuration: this.rewardPollDuration,
                withdrawPollDuration: this.withdrawPollDuration,
                network: this.network,
            });

            await this.$store.dispatch('assetPools/read', this.assetPool.address);

            this.$bvModal.hide(`modalAssetPoolDetails-${this.assetPool.address}`);
        } catch (e) {
            console.error(e);
            this.error = 'Could not update your asset pool.';
        } finally {
            this.loading = false;
        }
    }
}
</script>
