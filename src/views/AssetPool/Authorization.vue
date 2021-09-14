<template>
    <b-card-text>
        <b-form-group v-if="client">
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
                        <b-form-input readonly id="clientId" v-model="client.clientId" />
                        <b-input-group-append>
                            <b-button variant="primary" v-clipboard:copy="client.clientId">
                                <i class="far fa-copy m-0" style="font-size: 1.2rem"></i>
                            </b-button>
                        </b-input-group-append>
                    </b-input-group>
                </b-form-group>
                <b-form-group>
                    <label for="clientSecret"> Client Secret: </label>
                    <b-input-group>
                        <b-form-input readonly id="clientSecret" v-model="client.clientSecret" />
                        <b-input-group-append>
                            <b-button variant="primary" v-clipboard:copy="client.clientSecret">
                                <i class="far fa-copy m-0" style="font-size: 1.2rem"></i>
                            </b-button>
                        </b-input-group-append>
                    </b-input-group>
                </b-form-group>
            </b-card>
            <h2 class="font-weight-normal">Example code</h2>
            <p>These examples should demonstrate how to authorize with the THX API.</p>
            <b-card class="shadow-sm mb-3">
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
                            This example demonstrates the authorization header you should use to request your access
                            token.
                            <a
                                :href="docsUrl + '/authorization#2-create-a-basic-authentication-header'"
                                target="_blank"
                            >
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
                            </pre>
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
                            </pre>
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
        </b-form-group>
    </b-card-text>
</template>

<script lang="ts">
import { Client, IClients } from '@/store/modules/clients';
import { IAssetPools } from '@/store/modules/assetPools';
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
    BFormTextarea,
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
    BSpinner,
} from 'bootstrap-vue';
import { Component, Vue } from 'vue-property-decorator';
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
        'b-spinner': BSpinner,
        'b-form-checkbox': BFormCheckbox,
        'b-form-group': BFormGroup,
        'b-form-select': BFormSelect,
        'b-form-textarea': BFormTextarea,
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
    }),
})
export default class AssetPoolView extends Vue {
    docsUrl = process.env.VUE_APP_DOCS_URL;
    apiUrl = process.env.VUE_APP_API_ROOT;
    widgetUrl = process.env.VUE_APP_WIDGET_URL;

    error = '';
    loading = true;
    accessToken = '';

    assetPools!: IAssetPools;
    clients!: IClients;

    get assetPool() {
        return this.assetPools[this.$route.params.address];
    }

    get client() {
        return (
            Object.values(this.clients).find(
                (client: Client) => client.registrationAccessToken === this.assetPool.rat,
            ) || null
        );
    }

    async mounted() {
        try {
            await this.$store.dispatch('assetPools/read', this.$route.params.address);
            await this.$store.dispatch('clients/read', this.assetPool.rat);
        } catch (e) {
            this.error = 'Could not get the rewards.';
        } finally {
            this.loading = false;
        }
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
            this.error = 'Could not request an access token.';
        }
    }
}
</script>
