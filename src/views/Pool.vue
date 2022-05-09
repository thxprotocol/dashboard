<template>
    <div class="container container-md pt-10" v-if="pool">
        <div class="d-flex align-items-center">
            <h1 class="mr-3">{{ pool.token.poolBalance }} {{ pool.token.symbol }}</h1>
            <b-badge variant="gray" class="text-white p-2" v-if="network === 0">Polygon Test</b-badge>
            <b-badge variant="success" class="p-2" v-if="network === 1">Polygon Main</b-badge>
        </div>
        <div class="lead">
            {{ pool.token.name }}
        </div>
        <hr />
        <ul class="nav nav-pills nav-justified">
            <router-link
                active-class="active"
                class="nav-link"
                :to="`/pool/${pool.address}/metadata`"
                v-if="pool.isNFTPool"
            >
                <i class="fas fa-palette mr-2"></i>
                <span class="d-none d-md-inline-block">Metadata</span>
            </router-link>
            <router-link
                active-class="active"
                class="nav-link"
                :to="`/pool/${pool.address}/rewards`"
                v-if="pool.isDefaultPool || pool.isNFTPool"
            >
                <i class="fas fa-award mr-2"></i>
                <span class="d-none d-md-inline-block">Rewards</span>
            </router-link>
            <router-link
                active-class="active"
                class="nav-link"
                :to="`/pool/${pool.address}/promotions`"
                v-if="pool.isDefaultPool"
            >
                <i class="fas fa-tags mr-2"></i>
                <span class="d-none d-md-inline-block">Promotions</span>
            </router-link>
            <router-link
                active-class="active"
                class="nav-link"
                :to="`/pool/${pool.address}/widgets`"
                v-if="pool.isDefaultPool"
            >
                <i class="fas fa-code mr-2"></i>
                <span class="d-none d-md-inline-block">Widgets</span>
            </router-link>
            <router-link
                active-class="active"
                class="nav-link"
                :to="`/pool/${pool.address}/members`"
                v-if="pool.isDefaultPool"
            >
                <i class="fas fa-user mr-2"></i>
                <span class="d-none d-md-inline-block">Members</span>
            </router-link>
            <router-link
                active-class="active"
                class="nav-link"
                :to="`/pool/${pool.address}/info`"
                v-if="pool.isDefaultPool || pool.isNFTPool"
            >
                <i class="fas fa-info-circle mr-2"></i>
                <span class="d-none d-md-inline-block">Details</span>
            </router-link>
        </ul>
        <hr />
        <router-view></router-view>
    </div>
</template>

<script lang="ts">
import { IAssetPools, NetworkProvider } from '@/store/modules/pools';
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';

@Component({
    computed: mapGetters({
        pools: 'pools/all',
        rewards: 'rewards/all',
        widgets: 'widgets/all',
    }),
})
export default class AssetPoolView extends Vue {
    docsUrl = process.env.VUE_APP_DOCS_URL;
    apiUrl = process.env.VUE_APP_API_ROOT;
    widgetUrl = process.env.VUE_APP_WIDGET_URL;
    error = '';
    loading = true;
    network: NetworkProvider = NetworkProvider.Test;
    pools!: IAssetPools;

    get pool() {
        return this.pools[this.$route.params.address];
    }

    async mounted() {
        try {
            await this.$store.dispatch('account/getProfile');
            await this.$store.dispatch('pools/read', this.$route.params.address);

            this.network = this.pool.network;
        } catch (e) {
            this.error = 'Could not get the rewards.';
        } finally {
            this.loading = false;
        }
    }
}
</script>
