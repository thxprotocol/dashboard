<template>
    <div class="container container-md pt-10" v-if="assetPool">
        <div class="d-flex align-items-center">
            <h1 class="mr-3">{{ assetPool.poolToken.balance }} {{ assetPool.poolToken.symbol }}</h1>
            <b-badge variant="gray" class="text-white p-2" v-if="network === 0">Polygon Test</b-badge>
            <b-badge variant="primary" class="p-2" v-if="network === 1">Polygon Main</b-badge>
        </div>
        <div class="lead">
            {{ assetPool.poolToken.name }}
            <strong>(Total Supply: {{ assetPool.poolToken.totalSupply }} {{ assetPool.poolToken.symbol }})</strong>
        </div>
        <div class="d-flex mb-4 mt-5">
            <router-link class="btn btn-tab shadow-sm" :to="`/pool/${assetPool.address}/rewards`">
                <img height="30" :src="require('../assets/thx_pool_rewards.webp')" />
                <div class="d-none d-md-block">Rewards</div>
            </router-link>
            <router-link class="btn btn-tab shadow-sm" :to="`/pool/${assetPool.address}/promocodes`">
                <img height="30" :src="require('../assets/thx_pool_authorization.webp')" />
                <div class="d-none d-md-block">Promo Codes</div>
            </router-link>
            <router-link class="btn btn-tab shadow-sm" :to="`/pool/${assetPool.address}/widgets`">
                <img height="30" :src="require('../assets/thx_pool_widgets.webp')" />
                <div class="d-none d-md-block">Widgets</div>
            </router-link>
            <router-link class="btn btn-tab shadow-sm" :to="`/pool/${assetPool.address}/info`">
                <img height="30" :src="require('../assets/thx_pool_info.webp')" />
                <div class="d-none d-md-block">Details</div>
            </router-link>
        </div>
        <router-view></router-view>
    </div>
</template>

<script lang="ts">
import { IAssetPools, NetworkProvider } from '@/store/modules/assetPools';
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';

@Component({
    computed: mapGetters({
        assetPools: 'assetPools/all',
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
    assetPools!: IAssetPools;

    get assetPool() {
        return this.assetPools[this.$route.params.address];
    }

    async mounted() {
        try {
            await this.$store.dispatch('account/getProfile');
            await this.$store.dispatch('assetPools/read', this.$route.params.address);

            this.network = this.assetPool.network;
        } catch (e) {
            this.error = 'Could not get the rewards.';
        } finally {
            this.loading = false;
        }
    }
}
</script>
