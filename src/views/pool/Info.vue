<template>
    <div class="mb-5 pb-5">
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
                <label for="clientId"> Pool Contract </label>
                <div class="input-group">
                    <b-form-input readonly id="address" v-model="pool.address" />
                    <div class="input-group-append">
                        <button class="btn btn-primary" type="button" v-clipboard:copy="pool.address">
                            <i class="far fa-copy m-0" style="font-size: 1.2rem"></i>
                        </button>
                    </div>
                </div>
                <b-link
                    target="_blank"
                    :href="
                        (network === 0 ? `https://mumbai.polygonscan.com` : `https://polygonscan.com`) +
                        `/address/${pool.address}/transactions`
                    "
                >
                    View your pool transactions
                </b-link>
            </b-form-group>
            <b-form-group>
                <label for="erc20Address">Token Contract</label>
                <div class="input-group">
                    <b-form-input readonly id="address" v-model="pool.token.address" />
                    <div class="input-group-append">
                        <button class="btn btn-primary" type="button" v-clipboard:copy="pool.token.address">
                            <i class="far fa-copy m-0" style="font-size: 1.2rem"></i>
                        </button>
                    </div>
                </div>
                <b-link
                    target="_blank"
                    :href="
                        (network === 0 ? `https://mumbai.polygonscan.com` : `https://polygonscan.com`) +
                        `/token/${pool.token.address}`
                    "
                >
                    View your token transactions
                </b-link>
            </b-form-group>

            <b-form-group>
                <label for="backgroundImgUrl">Pool Background URL</label>
                <div class="input-group">
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
                            class="btn btn-danger"
                            type="button"
                        >
                            <i class="fa fa-sync m-0" style="font-size: 1.2rem"></i>
                        </button>
                    </div>
                </div>
            </b-form-group>

            <b-form-group>
                <label for="logoImgUrl">Pool Logo URL</label>
                <div class="input-group">
                    <b-form-input id="logoImgUrl" @input.native="onLogoImgChange" v-model="skin.logoImgUrl" />
                    <div v-if="!logoImgUrlModified" class="input-group-append">
                        <button class="btn btn-primary" type="button">
                            <i class="fa fa-check m-0" style="font-size: 1.2rem"></i>
                        </button>
                    </div>

                    <div v-if="logoImgUrlModified" class="input-group-append">
                        <button
                            class="btn btn-danger"
                            :disabled="!logoImgUrlValid"
                            @click="updateLogoUrl"
                            type="button"
                        >
                            <i class="fa fa-sync m-0" style="font-size: 1.2rem"></i>
                        </button>
                    </div>
                </div>
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
    </div>
</template>

<script lang="ts">
import { IPools, NetworkProvider } from '@/store/modules/pools';
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import axios from 'axios';

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
