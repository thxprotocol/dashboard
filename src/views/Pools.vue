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
                    <span>Create Pool</span>
                </b-button>
                <b-button to="/tokens" variant="link" class="text-light">
                    <i class="fas fa-coins mr-2"></i>
                    <span>Create a token</span>
                </b-button>
                <b-button to="/nft" variant="link" class="text-light">
                    <i class="fas fa-palette mr-2"></i>
                    <span>Create an NFT</span>
                </b-button>
                <b-button v-if="!showAll" variant="secondary" class="float-right" @click="toggleArchived()">
                    <i class="fas fa-eye mr-2"></i>
                    <span>Show Archived Pools</span>
                </b-button>
                <b-button v-if="showAll" variant="secondary" class="float-right" @click="toggleArchived()">
                    <i class="fas fa-eye-slash mr-2"></i>
                    <span>Hide Archived Pools</span>
                </b-button>
            </div>
        </b-jumbotron>
        <div class="container container-md">
            <base-list-state-empty
                v-if="!Object.values(pools).length"
                icon-class="fas fa-puzzle-piece"
                text-submit="Add a pool"
                title="You have not added a pool yet"
                description="Pools have a balance and you use them to send or receive tokens."
                @clicked="$bvModal.show('modalAssetPoolCreate')"
            />
            <div class="row" v-else>
                <div class="col-md-6 col-lg-4" :key="pool._id" v-for="pool of pools">
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
import BaseListStateEmpty from '@/components/BaseListStateEmpty.vue';
import { IAccount } from '@/types/account';
import { IPools } from '@/store/modules/pools';
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';

@Component({
    components: {
        BaseListStateEmpty,
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
    pools!: IPools;
    docsUrl = process.env.VUE_APP_DOCS_URL;
    showAll = false;

    getPools() {
        this.$store.dispatch('pools/list', { archived: this.showAll });
    }

    mounted() {
        this.$store.dispatch('account/getProfile');
        this.$store.dispatch('pools/list');
    }

    toggleArchived() {
        this.showAll === true ? (this.showAll = false) : (this.showAll = true);
        this.getPools();
    }
}
</script>
