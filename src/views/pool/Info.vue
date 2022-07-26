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
    </div>
</template>

<script lang="ts">
import axios from 'axios';
import { IPools } from '@/store/modules/pools';
import { Component, Vue } from 'vue-property-decorator';
import { ADMIN_SCOPE } from '@/utils/oidc';
import { ChainId } from '@/types/enums/ChainId';
import { mapGetters } from 'vuex';
import { isValidUrl } from '@/utils/url';

@Component({
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
        const backgroundUrlIsValid = this.backgroundImgUrl
            ? isValidUrl(this.backgroundImgUrl)
            : this.backgroundImgUrl === '';
        const logoUrlIsValid = this.logoImgUrl ? isValidUrl(this.logoImgUrl) : this.logoImgUrl === '';
        return logoUrlIsValid && backgroundUrlIsValid;
    }

    get pool() {
        return this.pools[this.$route.params.id];
    }

    async getBrand() {
        const data = await this.$store.dispatch('brands/pool', this.pool._id);
        if (data) {
            this.backgroundImgUrl = data.backgroundImgUrl;
            this.logoImgUrl = data.logoImgUrl;
        }
    }

    async updateBrand() {
        await this.$store.dispatch('brands/update', {
            poolId: this.pool._id,
            backgroundImgUrl: this.backgroundImgUrl,
            logoImgUrl: this.logoImgUrl,
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
