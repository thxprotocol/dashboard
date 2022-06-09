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
                                (network === 0 ? `https://mumbai.polygonscan.com` : `https://polygonscan.com`) +
                                `/address/${pool.address}/transactions`
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
                                (network === 0 ? `https://mumbai.polygonscan.com` : `https://polygonscan.com`) +
                                `/token/${pool.token.address}`
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
                            v-if="skin.backgroundImgUrl"
                            bg-variant="light"
                        >
                            <img height="30" width="30" class="m-0" :src="skin.backgroundImgUrl" />
                        </b-card>
                    </template>
                    <b-form-input
                        id="backgroundImgUrl"
                        @input.native="onBackgroundImgChange"
                        :aria-invalid="!backgroundImgUrlValid"
                        v-model="skin.backgroundImgUrl"
                    />
                    <div v-if="!backgroundImgUrlModified" class="input-group-append">
                        <button class="btn btn-primary" type="button">
                            <i class="fa fa-check m-0" style="font-size: 1.2rem"></i>
                        </button>
                    </div>

                    <div v-if="backgroundImgUrlModified" class="input-group-append">
                        <button
                            :disabled="!backgroundImgUrlValid"
                            @click="updateBackgroundUrl"
                            class="btn btn-dark"
                            type="button"
                        >
                            <i class="fas fa-save m-0" style="font-size: 1.2rem"></i>
                        </button>
                    </div>
                </b-input-group>
            </b-form-group>

            <b-form-group>
                <label for="logoImgUrl">Token Icon URL</label>
                <b-input-group>
                    <template #prepend>
                        <b-card
                            body-class="py-1 px-2 d-flex align-items-center"
                            v-if="skin.logoImgUrl"
                            bg-variant="light"
                        >
                            <img height="30" width="30" class="m-0" :src="skin.logoImgUrl" />
                        </b-card>
                    </template>
                    <b-form-input id="logoImgUrl" @input.native="onLogoImgChange" v-model="skin.logoImgUrl" />
                    <div v-if="!logoImgUrlModified" class="input-group-append">
                        <button class="btn btn-primary" type="button">
                            <i class="fa fa-check m-0" style="font-size: 1.2rem"></i>
                        </button>
                    </div>

                    <div v-if="logoImgUrlModified" class="input-group-append">
                        <button class="btn btn-dark" :disabled="!logoImgUrlValid" @click="updateLogoUrl" type="button">
                            <i class="fas fa-save m-0" style="font-size: 1.2rem"></i>
                        </button>
                    </div>
                </b-input-group>
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
                    <b-form-input readonly id="clientId" v-model="pool.clientId" />
                    <b-input-group-append>
                        <b-button variant="primary" v-clipboard:copy="pool.clientId">
                            <i class="far fa-copy m-0" style="font-size: 1.2rem"></i>
                        </b-button>
                    </b-input-group-append>
                </b-input-group>
            </b-form-group>
            <b-form-group>
                <label for="clientSecret"> Client Secret: </label>
                <b-input-group>
                    <b-form-input readonly id="clientSecret" v-model="pool.clientSecret" />
                    <b-input-group-append>
                        <b-button variant="primary" v-clipboard:copy="pool.clientSecret">
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
        'Authorization': 'Basic {{ authHeader() }}',
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
xhr.setRequestHeader('Authorization', 'Basic {{ authHeader() }}');
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
import { IPools, NetworkProvider } from '@/store/modules/pools';
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import axios from 'axios';
import { ADMIN_SCOPE } from '@/utils/oidc';

const URL_CHECK_REGEX = /[(http(s)?)://(www.)?a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/;

const DEFAULT_SKIN: ISkin = {
    logoImgUrl: '',
    backgroundImgUrl: '',
};

interface ISkin {
    logoImgUrl: string;
    backgroundImgUrl: string;
}

@Component({
    computed: mapGetters({
        pools: 'pools/all',
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
    poolLoading = true;
    pools!: IPools;
    skin: ISkin = { ...DEFAULT_SKIN };
    remoteSkin: ISkin = { ...DEFAULT_SKIN };
    adminScope = ADMIN_SCOPE;

    network: NetworkProvider = NetworkProvider.Test;

    get backgroundImgUrlModified() {
        return this.skin.backgroundImgUrl !== this.remoteSkin.backgroundImgUrl;
    }

    get backgroundImgUrlValid() {
        return URL_CHECK_REGEX.test(this.skin.backgroundImgUrl);
    }

    get logoImgUrlModified() {
        return this.skin.logoImgUrl !== this.remoteSkin.logoImgUrl;
    }

    get logoImgUrlValid() {
        return URL_CHECK_REGEX.test(this.skin.logoImgUrl);
    }

    get pool() {
        return this.pools[this.$route.params.id];
    }

    async onBackgroundImgChange(e: any) {
        Vue.set(this.skin, 'backgroundImgUrl', e.target.value);
    }

    async onLogoImgChange(e: any) {
        Vue.set(this.skin, 'logoImgUrl', e.target.value);
    }

    async updateSkin(skin: Partial<ISkin>) {
        try {
            const r = await axios({
                url: this.authUrl + '/skin' + `/${this.pool.address}`,
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + this.authHeader(),
                },
                data: skin,
            });

            this.skin = JSON.parse(JSON.stringify(r.data));
            this.remoteSkin = JSON.parse(JSON.stringify(r.data));
        } catch {
            /* NO-OP */
        }
    }

    async updateBackgroundUrl() {
        await this.updateSkin({ backgroundImgUrl: this.skin.backgroundImgUrl, logoImgUrl: this.remoteSkin.logoImgUrl });
    }

    async updateLogoUrl() {
        await this.updateSkin({ backgroundImgUrl: this.remoteSkin.backgroundImgUrl, logoImgUrl: this.skin.logoImgUrl });
    }

    async getSkin() {
        try {
            const r = await axios({
                url: this.authUrl + '/skin' + `/${this.pool.address}`,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + this.authHeader(),
                },
            });

            this.skin = JSON.parse(JSON.stringify(r.data));
            this.remoteSkin = JSON.parse(JSON.stringify(r.data));
        } catch {
            /* NO-OP */
        }
    }

    async mounted() {
        try {
            this.network = this.pool.network;
            await this.getSkin();
        } catch (e) {
            this.error = 'Could get pool information.';
        } finally {
            this.loading = false;
        }
    }

    authHeader() {
        return btoa(`${this.pool.clientId}:${this.pool.clientSecret}`);
    }

    async getAccessToken() {
        try {
            const data = new URLSearchParams();
            data.append('grant_type', 'client_credentials');
            data.append('scope', this.adminScope);

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
