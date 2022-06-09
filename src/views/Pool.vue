<template>
    <div class="container container-md pt-10" v-if="pool">
        <div class="d-flex align-items-center">
            <h1 class="mr-3">{{ pool.token.poolBalance }} {{ pool.token.symbol }}</h1>
            <b-badge variant="gray" class="text-white p-2" v-if="pool.network === 0">Polygon Test</b-badge>
            <b-badge variant="success" class="p-2" v-if="pool.network === 1">Polygon Main</b-badge>
        </div>
        <div class="lead">
            {{ pool.token.name }}
        </div>
        <hr />
        <router-view></router-view>
    </div>
</template>

<script lang="ts">
import { IPools, NetworkProvider } from '@/store/modules/pools';
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';

@Component({
    computed: mapGetters({
        pools: 'pools/all',
    }),
})
export default class AssetPoolView extends Vue {
    network: NetworkProvider = NetworkProvider.Test;
    pools!: IPools;

    get pool() {
        return this.pools[this.$route.params.id];
    }

    async mounted() {
        this.$store.dispatch('account/getProfile');
        await this.$store.dispatch('pools/read', this.$route.params.id);
        this.network = this.pool.network;
    }
}
</script>
