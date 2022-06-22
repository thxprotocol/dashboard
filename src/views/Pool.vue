<template>
    <div v-if="pool" class="p-3 d-inline-block">
        <b-dropdown size="sm" variant="link">
            <template #button-content>
                <small>Pool #{{ pool._id.substring(0, 5) }}...</small>
            </template>
            <b-dropdown-item-btn
                @click="goTo(`/pool/${p._id}`)"
                button-class="py-1"
                :class="{ 'd-none': pool._id === p._id }"
                :key="key"
                v-for="(p, key) of pools"
            >
                <code class="text-muted">#{{ p._id }}</code>
                <i class="fas fa-arrow-alt-circle-right text-muted ml-2"></i>
            </b-dropdown-item-btn>
        </b-dropdown>
        <div class="container container-md pt-10" v-if="pool.token">
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

    async goTo(path: string) {
        await this.$router.push(path);
        this.$store.dispatch('pools/read', this.$route.params.id);
    }

    async mounted() {
        this.$store.dispatch('account/getProfile');
        await this.$store.dispatch('pools/list');
        await this.$store.dispatch('pools/read', this.$route.params.id);
        this.chainId = this.pool.chainId;
    }
}
</script>
