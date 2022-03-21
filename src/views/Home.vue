<template>
    <div class="center-center h-100" v-if="!profile">
        <b-spinner variant="primary"></b-spinner>
    </div>
    <div v-else>
        <b-jumbotron
            class="jumbotron-header text-left"
            :style="{
                'background-image': `url(${require('@/assets/thx_jumbotron.webp')})`,
            }"
        >
            <div
                class="container container-md pt-10 pb-5"
                :style="{
                    'background-image': `url(${require('@/assets/thx_diamonds.webp')})`,
                }"
            >
                <p class="brand-text">{{ greeting }}</p>
                <div class="lead mb-5">Welcome to your Tokenization Head Quarters</div>
                <!-- <b-button v-b-tooltip title="Deploy tokens" to="/token" class="rounded-pill mr-3" variant="primary">
                    <i class="fas fa-coins m-0"></i>
                </b-button> -->
                <b-button v-b-tooltip title="Deploy pools" to="/pools" class="rounded-pill mr-3" variant="primary">
                    <i class="fas fa-chart-pie m-0"></i>
                </b-button>
                <b-button
                    v-b-tooltip
                    title="Visit developer docs"
                    :href="docsUrl"
                    target="_blank"
                    variant="link"
                    class="text-light bg-dark rounded-pill"
                >
                    <i class="far fa-file-alt m-0 text-gray"></i>
                </b-button>
            </div>
        </b-jumbotron>
        <div class="container container-md">
            <b-alert show variant="info">
                <i class="fas fa-gift mr-2"></i><strong>New:</strong> Twitter Conditional Rewards!
                <b-link
                    class="float-right"
                    target="_blank"
                    href="https://medium.com/thxprotocol/product-update-shipped-twitter-conditional-rewards-ed3d03cbd5ff"
                >
                    Read more
                    <i class="fas fa-chevron-right"></i>
                </b-link>
            </b-alert>
            <b-row>
                <!-- <b-col md="6">
                    <b-card
                        @click="$router.push('/tokens')"
                        class="mt-3 mb-3 shadow-sm cursor-pointer"
                        :img-src="require('@/assets/thx_tokens.webp')"
                        img-alt="Image"
                        img-top
                    >
                        <strong>Tokens</strong>
                        <p class="text-muted m-0">Create ERC-20 token variations.</p>
                    </b-card>
                </b-col> -->
                <b-col md="6">
                    <b-card
                        @click="$router.push('/pools')"
                        class="mt-3 mb-3 shadow-sm cursor-pointer"
                        :img-src="require('@/assets/thx_pools.webp')"
                        img-alt="Image"
                        img-top
                    >
                        <strong>Pools</strong>
                        <p class="text-muted m-0">Distribute tokens in user-friendly ways.</p>
                    </b-card>
                </b-col>
                <b-col md="6">
                    <b-card
                        @click="window.open(docsUrl, '_blank')"
                        class="mt-3 mb-3 shadow-sm cursor-pointer"
                        :img-src="require('@/assets/thx_docs.webp')"
                        img-alt="Image"
                        img-top
                    >
                        <strong>Documentation</strong>
                        <p class="text-muted m-0">View SDK, OAuth2 and API details.</p>
                    </b-card>
                </b-col>
            </b-row>
        </div>
        <modal-asset-pool-create />
    </div>
</template>

<script lang="ts">
import BaseAssetPool from '@/components/BaseAssetPool.vue';
import ModalAssetPoolCreate from '@/components/ModalAssetPoolCreate.vue';
import { IAccount } from '@/types/account';
import { IAssetPools } from '@/store/modules/assetPools';
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';

@Component({
    components: {
        BaseAssetPool,
        ModalAssetPoolCreate,
    },
    computed: mapGetters({
        profile: 'account/profile',
        assetPools: 'assetPools/all',
    }),
})
export default class Home extends Vue {
    window = window;
    profile!: IAccount;
    assetPools!: IAssetPools;
    docsUrl = process.env.VUE_APP_DOCS_URL;

    get greeting() {
        return 'Hi ' + (!this.profile.firstName ? 'Anon' : this.profile.firstName);
    }

    async mounted() {
        try {
            await this.$store.dispatch('account/getProfile');
        } catch (e) {
            debugger;
        }
    }
}
</script>
<style scoped>
.jumbotron-header > .container {
    background-repeat: no-repeat;
    background-position: 80% 25px;
    background-size: 350px auto;
}
</style>
