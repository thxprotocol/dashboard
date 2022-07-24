<template>
    <div class="mb-5 pb-5">
        <h2 class="font-weight-normal">Information</h2>
        <p>Addresses and links to the block explorer pages regarding the smart contracts related to your pool.</p>
        <b-card class="shadow-sm mb-5">
            <b-form-group>
                <label for="clientId"> Pool Contract </label>
                <div class="input-group">
                    <b-form-input readonly id="address" v-model="pool.address" />
                    <div class="input-group-append">
                        <b-button
                            class="btn btn-primary"
                            type="button"
                            variant="primary"
                            target="_blank"
                            v-b-tooltip
                            title="View your pool transactions on the Polygon block explorer"
                            :href="
                                (chainId === ChainId.PolygonMumbai
                                    ? `https://mumbai.polygonscan.com`
                                    : `https://polygonscan.com`) + `/address/${pool.address}/transactions`
                            "
                        >
                            <i class="fas fa-external-link-alt m-0" style="font-size: 1.2rem"></i>
                        </b-button>
                    </div>
                </div>
            </b-form-group>
            <b-form-group>
                <label for="erc20Address">Token Contract</label>
                <div class="input-group">
                    <b-form-input readonly id="address" v-model="pool.token.address" />
                    <div class="input-group-append">
                        <b-button
                            class="btn btn-primary"
                            type="button"
                            variant="primary"
                            target="_blank"
                            v-b-tooltip
                            title="View your token transactions on the Polygon block explorer"
                            :href="
                                (chainId === ChainId.PolygonMumbai
                                    ? `https://mumbai.polygonscan.com`
                                    : `https://polygonscan.com`) + `/token/${pool.token.address}`
                            "
                        >
                            <i class="fas fa-external-link-alt m-0" style="font-size: 1.2rem"></i>
                        </b-button>
                    </div>
                </div>
            </b-form-group>
        </b-card>
        <h2 class="font-weight-normal">Appearance</h2>
        <p>Change the appearance of the claim page people will see when claiming your rewards.</p>
        <b-card class="shadow-sm mb-5">
            <b-form-group>
                <label for="backgroundImgUrl">Background URL</label>
                <b-input-group>
                    <template #prepend>
                        <b-card
                            body-class="py-1 px-2 d-flex align-items-center"
                            v-if="backgroundImgUrl"
                            bg-variant="light"
                        >
                            <img height="30" width="30" class="m-0" :src="backgroundImgUrl" />
                        </b-card>
                    </template>
                    <b-form-input v-model="backgroundImgUrl" />
                </b-input-group>
            </b-form-group>

            <b-form-group>
                <label for="logoImgUrl">Token Icon URL</label>
                <b-input-group>
                    <template #prepend>
                        <b-card body-class="py-1 px-2 d-flex align-items-center" v-if="logoImgUrl" bg-variant="light">
                            <img height="30" width="30" class="m-0" :src="logoImgUrl" />
                        </b-card>
                    </template>
                    <b-form-input v-model="logoImgUrl" />
                </b-input-group>
            </b-form-group>
            <b-button variant="dark" :disabled="!isBrandUpdateInvalid" @click="updateBrand()" type="button">
                Update
                <i class="fas fa-save m-0" style="font-size: 1.2rem"></i>
            </b-button>
        </b-card>
        <h2 class="font-weight-normal">Authorization</h2>
        <p>
            Use you client credentials to create a
            <a :href="docsUrl + '/authorization#2-create-a-basic-authentication-header'" target="_blank">
                Basic Authentication header
            </a>
            and request an access token to authorize your application with THX API.
        </p>
        <base-pool-clients :poolId="pool._id" />
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
                        Authorization: Basic {{ authHeader }}
                    </b-card>
                </b-tab>
                <b-tab title="CURL">
                    <b-card bg-variant="light" class="border-0" body-class="p-5 small code">
                        <pre>
curl "https://api.thx.network/token" \
    -X "POST" \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    -H 'Authorization: Basic {{ authHeader }}' \
    -d 'grant_type=client_credentials&scope={{ adminScope }}'
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
        'Authorization': 'Basic {{ authHeader }}',
    },
    data: {
        grant_type: 'client_credentials',
        scope: '{{ adminScope }}',
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
params.append('scope', '{{ adminScope }}');
var xhr = new XMLHttpRequest();
xhr.open("POST", "https://api.thx.network/token", true);
xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
xhr.setRequestHeader('Authorization', 'Basic {{ authHeader }}');
xhr.send(params);
                                        </pre
                        >
                    </b-card>
                </b-tab>
            </b-tabs>
        </b-card>
    </div>
</template>

<script lang="ts">
import axios from 'axios';
import { IPools } from '@/store/modules/pools';
import { Component, Vue } from 'vue-property-decorator';
import { ADMIN_SCOPE } from '@/utils/oidc';
import { ChainId } from '@/types/enums/ChainId';
import { mapGetters } from 'vuex';

import BasePoolClients from '@/components/cards/BasePoolClients.vue';

const URL_CHECK_REGEX = /[(http(s)?)://(www.)?a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/;

@Component({
    components: {
        BasePoolClients,
    },
    computed: mapGetters({
        pools: 'pools/all',
    }),
})
export default class AssetPoolView extends Vue {
    ChainId = ChainId;
    docsUrl = process.env.VUE_APP_DOCS_URL;
    apiUrl = process.env.VUE_APP_API_ROOT;
    authUrl = process.env.VUE_APP_AUTH_URL;
    widgetUrl = process.env.VUE_APP_WIDGET_URL;

    error = '';
    loading = true;
    chainId: ChainId = ChainId.PolygonMumbai;

    pools!: IPools;

    authHeader = '';
    logoImgUrl = '';
    backgroundImgUrl = '';
    poolLoading = true;
    accessToken: any = null;
    adminScope = ADMIN_SCOPE;

    mounted() {
        this.authHeader = btoa(`${this.pool.clientId}:${this.pool.clientSecret}`);
        this.chainId = this.pool.chainId;
        this.getBrand().then(() => {
            this.loading = false;
        });
    }

    get isBrandUpdateInvalid() {
        const backgroundUrlIsValid = this.backgroundImgUrl.match(URL_CHECK_REGEX) || this.backgroundImgUrl === '';
        const logoUrlIsValid = this.logoImgUrl.match(URL_CHECK_REGEX) || this.logoImgUrl === '';
        return logoUrlIsValid && backgroundUrlIsValid;
    }

    get pool() {
        return this.pools[this.$route.params.id];
    }

    // TODO Introduce store for this
    async getBrand() {
        const { data } = await axios({
            url: '/brands',
            method: 'GET',
            headers: {
                'X-PoolId': this.pool._id,
            },
        });
        this.backgroundImgUrl = data.backgroundImgUrl;
        this.logoImgUrl = data.logoImgUrl;
    }

    // TODO Introduce store for this
    updateBrand() {
        return axios({
            url: '/brands',
            method: 'PUT',
            headers: {
                'X-PoolId': this.pool._id,
            },
            data: {
                backgroundImgUrl: this.backgroundImgUrl,
                logoImgUrl: this.logoImgUrl,
            },
        });
    }

    async getAccessToken() {
        const data = new URLSearchParams();
        data.append('grant_type', 'client_credentials');
        data.append('scope', this.adminScope);

        const r = await axios({
            url: this.authUrl + '/token',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + this.authHeader,
            },
            data,
        });

        this.accessToken = r.data;
    }
}
</script>
