<template>
    <div class="mb-5">
        <h2 class="font-weight-normal">Information</h2>
        <p>General and event information regarding your Asset Pool.</p>
        <b-card class="shadow-sm mb-5">
            <b-form-group>
                <label> Blockchain Network </label>
                <b-form-input readonly v-if="network === 0" value="Polygon Test" />
                <b-form-input readonly v-if="network === 1" value="Polygon Mainnet" />
                <b-link
                    target="_blank"
                    :href="network === 0 ? `https://mumbai.polygonscan.com` : `https://polygonscan.com`"
                >
                    Visit the Block Explorer
                </b-link>
            </b-form-group>
            <b-form-group>
                <label for="clientId"> Asset Pool Contract </label>
                <div class="input-group">
                    <b-form-input readonly id="address" v-model="assetPool.address" />
                    <div class="input-group-append">
                        <button class="btn btn-primary" type="button" v-clipboard:copy="assetPool.address">
                            <i class="far fa-copy m-0" style="font-size: 1.2rem"></i>
                        </button>
                    </div>
                </div>
                <b-link
                    target="_blank"
                    :href="
                        (network === 0 ? `https://mumbai.polygonscan.com` : `https://polygonscan.com`) +
                        `/address/${assetPool.address}/transactions`
                    "
                >
                    View your asset pool transactions
                </b-link>
            </b-form-group>
            <b-form-group>
                <label for="erc20Address">Token Contract</label>
                <div class="input-group">
                    <b-form-input readonly id="address" v-model="assetPool.poolToken.address" />
                    <div class="input-group-append">
                        <button class="btn btn-primary" type="button" v-clipboard:copy="assetPool.poolToken.address">
                            <i class="far fa-copy m-0" style="font-size: 1.2rem"></i>
                        </button>
                    </div>
                </div>
                <b-link
                    target="_blank"
                    :href="
                        (network === 0 ? `https://mumbai.polygonscan.com` : `https://polygonscan.com`) +
                        `/token/${assetPool.poolToken.address}`
                    "
                >
                    View your token transactions
                </b-link>
            </b-form-group>
        </b-card>
        <h2 class="font-weight-normal">Authorization</h2>
        <p>
            Use you client credentials to create a
            <a :href="docsUrl + '/authorization#2-create-a-basic-authentication-header'" target="_blank">
                Basic Authentication header
            </a>
            and request an access token to authorize your application with THX API.
        </p>
        <b-card class="shadow-sm mb-5">
            <b-form-group>
                <label for="clientId"> Client ID: </label>
                <b-input-group>
                    <b-form-input readonly id="clientId" v-model="assetPool.clientId" />
                    <b-input-group-append>
                        <b-button variant="primary" v-clipboard:copy="assetPool.clientId">
                            <i class="far fa-copy m-0" style="font-size: 1.2rem"></i>
                        </b-button>
                    </b-input-group-append>
                </b-input-group>
            </b-form-group>
            <b-form-group>
                <label for="clientSecret"> Client Secret: </label>
                <b-input-group>
                    <b-form-input readonly id="clientSecret" v-model="assetPool.clientSecret" />
                    <b-input-group-append>
                        <b-button variant="primary" v-clipboard:copy="assetPool.clientSecret">
                            <i class="far fa-copy m-0" style="font-size: 1.2rem"></i>
                        </b-button>
                    </b-input-group-append>
                </b-input-group>
            </b-form-group>
        </b-card>
        <h2 class="font-weight-normal">Example code</h2>
        <p>These examples should demonstrate how to authorize with the THX API.</p>
        <b-card class="shadow-sm mb-5">
            <b-tabs card class="m-n3">
                <b-tab title="Simulator" active>
                    <b-card-text>
                        <template v-if="accessToken">
                            <b-alert variant="warning" show>
                                This access token is only valid for a limited amount of time ({{
                                    accessToken.expires_in
                                }}
                                seconds).
                            </b-alert>
                            <b-card bg-variant="light" class="border-0" body-class="p-5 small code">
                                {{ accessToken.access_token }}
                            </b-card>
                        </template>
                        <b-button variant="primary" class="rounded-pill" @click="getAccessToken()">
                            Request Access Token
                        </b-button>
                    </b-card-text>
                </b-tab>
                <b-tab title="Basic Authorization header">
                    <p>
                        This example demonstrates the authorization header you should use to request your access token.
                        <a :href="docsUrl + '/authorization#2-create-a-basic-authentication-header'" target="_blank">
                            Read more about constructing it yourself</a
                        >.
                    </p>
                    <b-card bg-variant="light" class="border-0" body-class="p-5 small code">
                        Authorization: Basic {{ authHeader() }}
                    </b-card>
                </b-tab>
                <b-tab title="CURL">
                    <b-card bg-variant="light" class="border-0" body-class="p-5 small code">
                        <pre>
curl "https://api.thx.network/token" \
    -X "POST" \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    -H 'Authorization: Basic {{ authHeader() }}' \
    -d 'grant_type=client_credentials&scope=openid admin'
                            </pre
                        >
                    </b-card>
                </b-tab>
                <b-tab title="Axios">
                    <b-card bg-variant="light" class="border-0" body-class="p-5 small code">
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
                            </pre
                        >
                    </b-card>
                </b-tab>
                <b-tab title="Vanilla JS">
                    <b-card bg-variant="light" class="border-0" body-class="p-5 small code">
                        <pre>
var params = new URLSearchParams();
params.append('grant_type', 'client_credentials');
params.append('scope', 'openid admin');
var xhr = new XMLHttpRequest();
xhr.open("POST", "https://api.thx.network/token", true);
xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
xhr.setRequestHeader('Authorization', 'Basic {{ authHeader() }}');
xhr.send(params);
                                        </pre
                        >
                    </b-card>
                </b-tab>
            </b-tabs>
        </b-card>
        <h2>Governance</h2>
        <b-card class="shadow-sm mb-5">
            <b-form-group class="mb-0">
                <b-skeleton-wrapper :loading="assetPoolLoading">
                    <template #loading>
                        <b-card>
                            <b-form-group class="mb-0">
                                <div class="row pt-2 pb-2">
                                    <div class="col-md-1 d-flex center-center">
                                        <b-skeleton animation="fade" width="35%"></b-skeleton>
                                    </div>
                                    <div class="col-md-8">
                                        <b-skeleton animation="fade" width="45%"></b-skeleton>
                                        <b-skeleton animation="fade" width="80%"></b-skeleton>
                                    </div>
                                </div>
                            </b-form-group>
                        </b-card>
                        <hr />
                        <template>
                            <div class="row pt-2 pb-2" v-for="index of 2" :key="index">
                                <div class="col-md-4 d-flex align-items-center">
                                    <b-skeleton animation="fade" width="80%"></b-skeleton>
                                </div>
                                <div class="col-md-7">
                                    <b-skeleton animation="fade" width="90%"></b-skeleton>
                                    <b-skeleton animation="fade" width="90%"></b-skeleton>
                                </div>
                                <div class="col-md-1">
                                    <b-skeleton animation="fade" type="avatar"></b-skeleton>
                                </div>
                            </div>
                        </template>
                    </template>
                    <b-form-checkbox @change="updateAssetPool()" class="mb-0" v-model="isGovernanceEnabled">
                        <strong> Enable governance </strong>
                        (experimental)
                        <a :href="docsUrl + '/asset_pools#2-asset-pool-governance'" target="_blank">
                            <i class="fas fa-question-circle"></i>
                        </a>
                        <p class="text-muted mb-0">
                            Enabling governance will require a voting procedure for adding, updating or withdrawing
                            rewards.
                        </p>
                    </b-form-checkbox>
                </b-skeleton-wrapper>
            </b-form-group>
        </b-card>
        <template v-if="isGovernanceEnabled">
            <b-form-group class="mb-0">
                <hr />
                <div class="row">
                    <div class="col-md-4 d-flex align-items-center">
                        <label for="rewardPollDuration">
                            Default reward poll duration
                            <a
                                v-b-tooltip
                                title="Default duration of the poll that is started when a reward configuration is added or
                            changed. This poll should pass to approve the changes."
                            >
                                <i class="fas fa-question-circle"></i>
                            </a>
                        </label>
                    </div>
                    <div class="col-md-7">
                        <b-form-input id="rewardPollDuration" type="number" v-model="rewardPollDuration" />
                    </div>
                    <div class="col-md-1 text-right">
                        <b-button class="rounded-pill" variant="primary" @click="updateAssetPool()">
                            <i class="fas fa-save ml-0"></i
                        ></b-button>
                    </div>
                </div>
            </b-form-group>

            <b-form-group class="mb-0">
                <hr />
                <div class="row">
                    <div class="col-md-4 d-flex align-items-center">
                        <label for="rewardPollDuration">
                            Default withdraw poll duration
                            <a
                                v-b-tooltip
                                title=" Default duration of the poll that is started when a reward is claimed by or for a member. This
                        poll should pass to be able to withdraw the reward. Only members with a manager role can vote on
                        this poll."
                            >
                                <i class="fas fa-question-circle"></i>
                            </a>
                        </label>
                    </div>
                    <div class="col-md-7">
                        <b-form-input id="rewardPollDuration" type="number" v-model="proposeWithdrawPollDuration" />
                    </div>
                    <div class="col-md-1 text-right">
                        <b-button class="rounded-pill" variant="primary" @click="updateAssetPool()">
                            <i class="fas fa-save ml-0"></i
                        ></b-button>
                    </div>
                </div>
            </b-form-group>
        </template>
    </div>
</template>

<script lang="ts">
import { IAssetPools, NetworkProvider } from '@/store/modules/assetPools';
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import axios from 'axios';

@Component({
    computed: mapGetters({
        assetPools: 'assetPools/all',
        clients: 'clients/all',
        rewards: 'rewards/all',
        widgets: 'widgets/all',
    }),
})
export default class AssetPoolView extends Vue {
    docsUrl = process.env.VUE_APP_DOCS_URL;
    apiUrl = process.env.VUE_APP_API_ROOT;
    authUrl = process.env.VUE_APP_AUTH_URL;
    widgetUrl = process.env.VUE_APP_WIDGET_URL;

    error = '';
    loading = true;
    accessToken = '';
    assetPoolLoading = true;

    isGovernanceEnabled = false;
    rewardPollDuration = 0;
    proposeWithdrawPollDuration = 0;

    assetPools!: IAssetPools;

    network: NetworkProvider = NetworkProvider.Test;

    get assetPool() {
        return this.assetPools[this.$route.params.address];
    }

    async mounted() {
        try {
            this.network = this.assetPool.network;
            this.isGovernanceEnabled = !this.assetPool.bypassPolls;
            this.rewardPollDuration = this.assetPool.rewardPollDuration;
            this.proposeWithdrawPollDuration = this.assetPool.proposeWithdrawPollDuration;
        } catch (e) {
            this.error = 'Could get pool information.';
        } finally {
            this.loading = false;
        }
    }

    authHeader() {
        return btoa(`${this.assetPool.clientId}:${this.assetPool.clientSecret}`);
    }

    async updateAssetPool() {
        this.assetPoolLoading = true;

        try {
            await this.$store.dispatch('assetPools/update', {
                address: this.assetPool.address,
                data: {
                    bypassPolls: !this.isGovernanceEnabled,
                    rewardPollDuration: this.rewardPollDuration,
                    proposeWithdrawPollDuration: this.proposeWithdrawPollDuration,
                },
            });
        } catch (e) {
            this.error = 'Could not update your asset pool.';
        } finally {
            this.assetPoolLoading = false;
        }
    }
    async getAccessToken() {
        try {
            const data = new URLSearchParams();
            data.append('grant_type', 'client_credentials');
            data.append('scope', 'openid admin');

            const r = await axios({
                url: this.authUrl + '/token',
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
            this.error = 'Could not request an access token.';
        }
    }
}
</script>
