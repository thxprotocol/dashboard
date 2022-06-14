<template>
    <div class="container container-md pt-10" v-if="pool">
        <div class="d-flex align-items-center">
            <h1 class="mr-3">{{ pool.token.poolBalance }} {{ pool.token.symbol }}</h1>
            <base-badge-network :chainId="pool.chainId" />
        </div>
        <div class="lead">
            {{ pool.token.name }}
        </div>
        <hr />
        <router-view></router-view>
    </div>
</template>

<script lang="ts">
import { ChainId } from '@/types/enums/ChainId';
import { IPools } from '@/store/modules/pools';
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import BaseBadgeNetwork from '@/components/badges/BaseBadgeNetwork.vue';

@Component({
    components: {
        BaseBadgeNetwork,
    },
    computed: mapGetters({
        pools: 'pools/all',
    }),
})
export default class AssetPoolView extends Vue {
    chainId: ChainId = ChainId.PolygonMumbai;
    pools!: IPools;

    get pool() {
        return this.pools[this.$route.params.id];
    }

    async mounted() {
        this.$store.dispatch('account/getProfile');
        await this.$store.dispatch('pools/read', this.$route.params.id);
        this.chainId = this.pool.chainId;
    }
}
</script>
