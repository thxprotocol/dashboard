<template>
    <div class="container container-md pt-10" v-if="assetPool">
        <div class="d-flex align-items-center">
            <h1 class="mr-3">{{ assetPool.poolToken.balance }} {{ assetPool.poolToken.symbol }}</h1>
            <b-badge variant="gray" class="text-white p-2" v-if="network === 0">Polygon Test</b-badge>
            <b-badge variant="success" class="p-2" v-if="network === 1">Polygon Main</b-badge>
        </div>
        <div class="lead">
            {{ assetPool.poolToken.name }}
            <strong>(Balance: {{ assetPool.poolToken.balance }} {{ assetPool.poolToken.symbol }})</strong>
        </div>

        <hr />
        <ul class="nav nav-pills nav-justified">
            <router-link active-class="active" class="nav-link" :to="`/pool/${assetPool.address}/rewards`">
                <i class="fas fa-award mr-2"></i>
                <span class="d-none d-md-inline-block">Rewards</span>
            </router-link>
            <router-link active-class="active" class="nav-link" :to="`/pool/${assetPool.address}/promocodes`">
                <i class="fas fa-tags mr-2"></i>
                <span class="d-none d-md-inline-block">Promotions</span>
            </router-link>
            <router-link active-class="active" class="nav-link" :to="`/pool/${assetPool.address}/widgets`">
                <i class="fas fa-code mr-2"></i>
                <span class="d-none d-md-inline-block">Widgets</span>
            </router-link>
            <router-link active-class="active" class="nav-link" :to="`/pool/${assetPool.address}/info`">
                <i class="fas fa-info-circle mr-2"></i>
                <span class="d-none d-md-inline-block">Details</span>
            </router-link>
        </ul>
        <hr />
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
