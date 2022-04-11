<template>
    <div>
        <b-jumbotron
            class="jumbotron-header text-left"
            :style="{
                'background-image': `url(${require('@/assets/thx_jumbotron.webp')})`,
            }"
        >
            <div class="container container-md pt-5 pb-5">
                <p class="brand-text">Pools</p>
                <b-button v-b-modal="'modalAssetPoolCreate'" class="rounded-pill" variant="secondary">
                    <i class="fas fa-plus mr-2"></i>
                    <span>Create pool</span>
                </b-button>
                <b-button to="/tokens" variant="link" class="text-light">
                    <i class="fas fa-coins mr-2"></i>
                    <span>Create token for this pool</span>
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
import BaseAssetPool from '@/components/cards/BaseAssetPool.vue';
import ModalAssetPoolCreate from '@/components/modals/BaseModalAssetPoolCreate.vue';
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
    profile!: IAccount;
    assetPools!: IAssetPools;
    docsUrl = process.env.VUE_APP_DOCS_URL;

    get greeting() {
        const greetings = ['Hi there', 'Howdy', 'Hello'];
        return greetings[Math.floor(Math.random() * greetings.length)];
    }

    mounted() {
        this.$store.dispatch('account/getProfile');
        this.$store.dispatch('assetPools/list');
    }
}
</script>
