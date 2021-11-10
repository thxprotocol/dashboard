<template>
    <div>
        <b-jumbotron
            class="jumbotron-header text-left"
            :style="{
                'background-image': `url(${require('../assets/thx_jumbotron.webp')})`,
            }"
        >
            <div class="container container-md pt-5">
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
            <b-skeleton-wrapper :loading="skeletonLoading">
                <template #loading>
                    <div class="row">
                        <div class="col-md-6 col-lg-4" v-for="index in 3" :key="index">
                            <b-card>
                                <b-skeleton animation="fade" width="85%"></b-skeleton>
                                <b-skeleton animation="fade" width="55%"></b-skeleton>
                                <b-skeleton animation="fade" width="70%"></b-skeleton>
                                <b-skeleton animation="fade" width="40%"></b-skeleton>
                            </b-card>
                        </div>
                    </div>
                </template>
                <div class="row" v-if="assetPools">
                    <div class="col-md-6 col-lg-4" :key="assetPool.address" v-for="assetPool of assetPools">
                        <base-asset-pool :assetPool="assetPool" />
                    </div>
                </div>
            </b-skeleton-wrapper>
        </div>
        <modal-asset-pool-create />
    </div>
</template>

<script lang="ts">
import BaseAssetPool from '@/components/BaseAssetPool.vue';
import ModalAssetPoolCreate from '@/components/ModalAssetPoolCreate.vue';
import { UserProfile } from '@/store/modules/account';
import { IAssetPools } from '@/store/modules/assetPools';
import { BAlert, BButton, BCard, BJumbotron, BModal, BSkeleton, BSkeletonWrapper } from 'bootstrap-vue';
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
        'b-skeleton': BSkeleton,
        'b-skeleton-wrapper': BSkeletonWrapper,
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
    skeletonLoading = true;

    async mounted() {
        try {
            await this.$store.dispatch('account/getProfile');
            await this.$store.dispatch('assetPools/list').then(() => {
                setTimeout(() => {
                    this.skeletonLoading = false;
                }, 2000);
            });
        } catch (e) {
            debugger;
        }
    }
}
</script>
