<template>
    <div class="container container-md pt-10" v-if="pool && pool.token">
        <div class="d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center justify-content-between">
                <h1 class="mr-3">{{ pool.token.poolBalance }} {{ pool.token.symbol }}</h1>
                <base-badge-network :chainId="pool.chainId" />
            </div>
            <div class="d-flex">
                <b-dropdown size="sm" no-caret variant="link" dropleft class="d-flex d-md-none">
                    <template #button-content>
                        <i class="fas fa-ellipsis-v text-muted ml-0" style="font-size: 1.2rem"></i>
                    </template>
                    <b-dropdown-item
                        :key="key"
                        v-for="(route, key) of visibleRoutes"
                        :to="`/pool/${pool._id}/${route.path}`"
                        class="nav-link-wrapper"
                    >
                        <i :class="route.iconClasses" class="ml-0 text-gray" style="width: 30px"></i>
                        {{ route.label }}
                    </b-dropdown-item>
                </b-dropdown>
            </div>
        </div>
        <div class="d-flex">
            <span class="lead">
                {{ pool.token.name }}
            </span>
            <b-button
                size="sm"
                variant="link"
                class="rounded-pill pl-3 ml-2"
                v-b-modal="`modalDepositCreate-${pool.token._id}`"
            >
                Top up
                <i class="fas fa-arrow-down ml-1 mr-1"></i>
            </b-button>
        </div>
        <hr />
        <router-view></router-view>
        <base-modal-deposit-create @submit="$store.dispatch('erc20/read', pool.token._id)" :pool="pool" />
    </div>
</template>

<script lang="ts">
import { ChainId } from '@/types/enums/ChainId';
import { IPools } from '@/store/modules/pools';
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import { getRoutes } from '@/utils/routes';
import { ERC20Type } from '@/types/erc20';
import BaseBadgeNetwork from '@/components/badges/BaseBadgeNetwork.vue';
import BaseModalDepositCreate from '@/components/modals/BaseModalDepositCreate.vue';

@Component({
    components: {
        BaseModalDepositCreate,
        BaseBadgeNetwork,
    },
    computed: mapGetters({
        pools: 'pools/all',
    }),
})
export default class AssetPoolView extends Vue {
    chainId: ChainId = ChainId.PolygonMumbai;
    pools!: IPools;
    ERC20Type = ERC20Type;

    get pool() {
        return this.pools[this.$route.params.id];
    }

    async mounted() {
        this.$store.cache.dispatch('account/getProfile');
        this.$store.cache.dispatch('pools/read', this.$route.params.id).then(() => {
            this.chainId = this.pool.chainId;
        });
        this.$store.cache.dispatch('pools/list');
    }

    get visibleRoutes() {
        return getRoutes(this.pool);
    }
}
</script>
