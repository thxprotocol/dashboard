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
            <base-nothing-here
                v-if="!Object.values(pools).length"
                item="a Pool"
                @clicked="$bvModal.show('modalAssetPoolCreate')"
            />
            <div class="row" v-else>
                <div class="col-md-6 col-lg-4" :key="pool.address" v-for="pool of pools">
                    <base-card-pool :pool="pool" />
                </div>
            </div>
        </div>
        <base-modal-pool-create />
    </div>
</template>

<script lang="ts">
import BaseCardPool from '@/components/cards/BaseCardPool.vue';
import BaseModalPoolCreate from '@/components/modals/BaseModalPoolCreate.vue';
import BaseNothingHere from '@/components/BaseNothingHere.vue';
import { IAccount } from '@/types/account';
import { IAssetPools } from '@/store/modules/pools';
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';

@Component({
    components: {
        BaseNothingHere,
        BaseCardPool,
        BaseModalPoolCreate,
    },
    computed: mapGetters({
        profile: 'account/profile',
        pools: 'pools/all',
    }),
})
export default class Home extends Vue {
    profile!: IAccount;
    pools!: IAssetPools;
    docsUrl = process.env.VUE_APP_DOCS_URL;

    mounted() {
        this.$store.dispatch('account/getProfile');
        this.$store.dispatch('pools/list');
    }
}
</script>
