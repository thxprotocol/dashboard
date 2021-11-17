<template>
    <div>
        <b-jumbotron
            class="jumbotron-header text-left"
            :style="{
                'background-image': `url(${require('../assets/thx_jumbotron.webp')})`,
            }"
        >
            <div class="container container-md pt-5 pb-5">
                <p class="brand-text">Hello!</p>
                <p>
                    Welcome to your personal dashboard. Here you can create and maintain your asset pools on the Polygon
                    (Ethereum L2) blockchain.
                </p>
                <hr class="bg-white mt-5 mb-5" />
                <b-button v-b-modal="'modalAssetPoolCreate'" class="rounded-pill" variant="light">
                    <i class="fas fa-plus mr-2"></i>
                    <span>Create asset pool</span>
                </b-button>
                <b-button :href="docsUrl" target="_blank" variant="link" class="text-light">
                    <i class="far fa-file-alt mr-2"></i>
                    <span>View Developer Docs</span>
                </b-button>
            </div>
        </b-jumbotron>
        <div class="container container-md">
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
import { UserProfile } from '@/store/modules/account';
import { IAssetPools } from '@/store/modules/assetPools';
import { BAlert, BButton, BCard, BJumbotron, BModal } from 'bootstrap-vue';
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';

@Component({
    components: {
        'base-asset-pool': BaseAssetPool,
        'modal-asset-pool-create': ModalAssetPoolCreate,
        'b-jumbotron': BJumbotron,
        'b-alert': BAlert,
        'b-button': BButton,
        'b-card': BCard,
        'b-modal': BModal,
    },
    computed: mapGetters({
        profile: 'account/profile',
        assetPools: 'assetPools/all',
    }),
})
export default class Home extends Vue {
    profile!: UserProfile;
    assetPools!: IAssetPools;
    docsUrl = process.env.VUE_APP_DOCS_URL;

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
