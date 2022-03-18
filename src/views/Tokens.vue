<template>
    <div>
        <b-jumbotron
            class="jumbotron-header text-left"
            :style="{
                'background-image': `url(${require('../assets/thx_jumbotron.webp')})`,
            }"
        >
            <div class="container container-md pt-5 pb-5">
                <p class="brand-text">Tokens</p>
                <b-button v-b-modal="'modalTokenCreate'" class="rounded-pill" variant="secondary">
                    <i class="fas fa-plus mr-2"></i>
                    <span>Create Token</span>
                </b-button>
                <b-button to="/pools" variant="link" class="text-light">
                    <i class="fas fa-chart-pie mr-2"></i>
                    <span>Deploy pool for this token</span>
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
