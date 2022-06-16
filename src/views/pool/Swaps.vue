<template>
    <div class="container pt-3 h-100 d-flex flex-column">
        <b-card class="shadow-sm">
            <div class="row pt-2 pb-2">
                <div class="col-md-4">
                    <strong>Token Address</strong>
                </div>
                <div class="col-md-2">
                    <strong>Token Multiplier</strong>
                </div>
                <div class="col-md-4"></div>
            </div>
            <b-skeleton-wrapper :loading="loading">
                <template #loading>
                    <b-form-group class="mb-0">
                        <hr />
                        <div class="row pt-2 pb-2">
                            <div class="col-md-4">
                                <b-skeleton animation="fade" width="85%"></b-skeleton>
                                <b-skeleton animation="fade" width="80%"></b-skeleton>
                            </div>
                            <div class="col-md-2">
                                <b-skeleton animation="fade" width="85%"></b-skeleton>
                                <b-skeleton animation="fade" width="80%"></b-skeleton>
                            </div>
                            <div class="col-md-4 text-right d-flex justify-content-end">
                                <b-skeleton type="avatar" class="inline"></b-skeleton>
                                <b-skeleton type="avatar" class="inline ml-1"></b-skeleton>
                            </div>
                        </div>
                    </b-form-group>
                </template>
                <b-form-group class="mb-0" :key="swapRule.id" v-for="swapRule of swapRules">
                    <hr />
                    <div class="row pt-2 pb-2">
                        <div class="col-md-4 d-flex align-items-center">
                            {{ swapRule.tokeInAddress }}
                        </div>
                        <div class="col-md-2 d-flex align-items-center">
                            {{ swapRule.tokenMultiplier }}
                        </div>
                    </div>
                </b-form-group>
            </b-skeleton-wrapper>
        </b-card>
        <b-pagination
            class="mt-3"
            @change="onChangePage"
            v-model="currentPage"
            :per-page="perPage"
            :total-rows="total"
            align="center"
        ></b-pagination>
        <div class="container container-md">
            <base-nothing-here
                v-if="!Object.values(pools).length"
                item="a Pool"
                @clicked="$bvModal.show('modalSwapRuleCreate')"
            />
            <div class="row" v-else>
                <div class="col-md-6 col-lg-4" :key="pool._id" v-for="pool of pools">
                    <base-card-pool :pool="pool" />
                </div>
            </div>
        </div>
        <base-modal-erc20-swap-rule-create />
    </div>
</template>

<script lang="ts">
import ModalERC20SwapRuleCreate from '@/components/modals/BaseModalERC20SwapRuleCreate.vue';
import { IERC20SwapRuleByPage } from '@/store/modules/erc20Swaps';
import { GetMembersProps, GetMembersResponse, IPools } from '@/store/modules/pools';
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';

@Component({
    components: {
        ModalERC20SwapRuleCreate,
    },
    computed: mapGetters({
        pools: 'pools/all',
    }),
})
export default class Members extends Vue {
    swapRulePerPage: IERC20SwapRuleByPage = {};
    loading = false;
    currentPage = 1;
    perPage = 10;
    total = 0;

    pools!: IPools;

    get swapRules() {
        return this.swapRulePerPage[this.currentPage] || [];
    }

    get pool() {
        return this.pools[this.$route.params.id];
    }

    async getMoreMembers({ pool, page, limit }: GetMembersProps) {
        this.loading = true;
        const response: GetMembersResponse = await this.$store.dispatch('/erc20Swaps', {
            pool,
            page,
            limit,
        });

        Vue.set(this.swapRulePerPage, this.currentPage, response.results);
        this.total = response.total;
        this.loading = false;
    }

    async onChangePage(page: number) {
        await this.getMoreMembers({
            pool: this.pool,
            page: page,
            limit: this.perPage,
        });
    }

    async mounted() {
        await this.getMoreMembers({
            pool: this.pool,
            page: this.currentPage,
            limit: this.perPage,
        });
    }
}
</script>
