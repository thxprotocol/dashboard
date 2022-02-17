<template>
    <div>
        <b-jumbotron
            class="jumbotron-header text-left"
            :style="{
                'background-image': `url(${require('../assets/thx_jumbotron.webp')})`,
            }"
        >
            <div class="container container-md pt-10 pb-5">
                <p class="brand-text">{{ greeting }}</p>
                <div class="lead mb-5">
                    Welcome to the head quarters of all your token operations! This is where you create and deploy your
                    token on the Polygon blockchain and configure rewards to share with your audience.
                </div>
                <b-button v-b-modal="'modalAssetPoolCreate'" class="rounded-pill" variant="secondary">
                    <i class="fas fa-plus mr-2"></i>
                    <span>Create token</span>
                </b-button>
                <b-button :href="docsUrl" target="_blank" variant="link" class="text-light">
                    <i class="far fa-file-alt mr-2"></i>
                    <span>View Developer Docs</span>
                </b-button>
            </div>
        </b-jumbotron>
        <div class="container container-md">
            <b-alert show variant="info" class="alert-top">
                <b-link
                    target="_blank"
                    href="https://medium.com/thxprotocol/product-update-shipped-twitter-conditional-rewards-ed3d03cbd5ff"
                >
                    <strong>New:</strong> Twitter Conditional Rewards!🐦🏆✨
                </b-link>
            </b-alert>
            <div class="row" v-if="assetPools">
                <div class="col-md-6 col-lg-4" :key="assetPool.address" v-for="assetPool of assetPools">
                    <base-asset-pool :assetPool="assetPool" />
                </div>
            </div>
        </div>
        <modal-asset-pool-create />
    </div>
</template>

<script lang="ts">
import BaseAssetPool from '@/components/BaseAssetPool.vue';
import ModalAssetPoolCreate from '@/components/ModalAssetPoolCreate.vue';
import { IAccount } from '@/store/modules/account';
import { IAssetPools } from '@/store/modules/assetPools';
import { BAlert, BButton, BCard, BJumbotron, BLink, BModal } from 'bootstrap-vue';
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';

@Component({
    components: {
        BaseAssetPool,
        ModalAssetPoolCreate,
        BJumbotron,
        BAlert,
        BLink,
        BButton,
        BCard,
        BModal,
    },
    computed: mapGetters({
        profile: 'account/profile',
        assetPools: 'assetPools/all',
    }),
})
export default class Home extends Vue {
    profile!: IAccount;
    assetPools!: IAssetPools;
    docsUrl = process.env.VUE_APP_DOCS_URL;

    get greeting() {
        const greetings = ['Hi there', 'Howdy', 'Hello'];
        return greetings[Math.floor(Math.random() * greetings.length)];
    }

    async mounted() {
        try {
            await this.$store.dispatch('account/getProfile');
            await this.$store.dispatch('assetPools/list');
        } catch (e) {
            debugger;
        }
    }
}
</script>
