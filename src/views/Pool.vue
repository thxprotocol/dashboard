<template>
    <div class="container container-md pt-5" v-if="pool && pool.token">
        <div class="d-flex align-items-center">
            <h1 class="mr-3">{{ pool.token.poolBalance }} {{ pool.token.symbol }}</h1>
            <base-badge-network :chainId="pool.chainId" />
        </div>
        <span class="lead">
            {{ pool.token.name }}
        </span>
        <b-dropdown size="sm" variant="link" class="d-inline-block">
            <template #button-content>
                <small>Pool #{{ pool._id.substring(0, 5) }}...</small>
            </template>
            <b-dropdown-item-btn
                @click="goTo(`/pool/${p._id}/info`)"
                button-class="py-1"
                :class="{ 'd-none': pool._id === p._id }"
                :key="key"
                v-for="(p, key) of pools"
            >
                <code class="text-muted">#{{ p._id }}</code>
                <i class="fas fa-arrow-alt-circle-right text-muted ml-2"></i>
            </b-dropdown-item-btn>
        </b-dropdown>
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

    async goTo(path: string) {
        await this.$router.push(path);
        this.$store.dispatch('pools/read', this.$route.params.id);
    }

    async mounted() {
        this.$store.dispatch('account/getProfile');
        this.$store.dispatch('pools/read', this.$route.params.id).then(() => {
            this.chainId = this.pool.chainId;
        });
        this.$store.dispatch('pools/list');
    }
}
</script>
