<template>
    <div class="container pt-3 h-100 d-flex flex-column">
        <b-row class="mb-3">
            <b-col class="d-flex justify-content-end">
                <b-button
                    :disabled="loading"
                    class="btn rounded-pill"
                    @click="$bvModal.show('modalERC20SwapRuleCreate')"
                    variant="primary"
                >
                    Create Swap Rule
                </b-button>
            </b-col>
        </b-row>

        <b-card class="shadow-sm">
            <div class="row pt-2 pb-2">
                <div class="col-md-6">
                    <strong>Token In</strong>
                </div>
                <div>
                    <strong>Token Multiplier</strong>
                </div>
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
                <base-form-group-swap-rule :swap-rule="swapRule" :key="swapRule._id" v-for="swapRule of swapRules" />
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
                v-if="total == 0"
                text-submit="Create a Swap Rile"
                title="You have not created a Swap Rule yet"
                @clicked="$bvModal.show('modalERC20SwapRuleCreate')"
            />
        </div>
        <ModalERC20SwapRuleCreate :onSuccess="onSwapRuleCreated" />
    </div>
</template>

<script lang="ts">
import ModalERC20SwapRuleCreate from '@/components/modals/BaseModalERC20SwapRuleCreate.vue';
import BaseNothingHere from '@/components/BaseListStateEmpty.vue';
import { GetERC20SwapRulesProps, GetERC20SwapRulesResponse, IERC20SwapRuleByPage } from '@/types/IERC20SwapRules';
import { IPools } from '@/store/modules/pools';
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import BaseIdenticon from '@/components/BaseIdenticon.vue';
import BaseFormGroupSwapRule from '@/components/form-group/BaseFormGroupSwapRule.vue';

@Component({
    components: {
        BaseFormGroupSwapRule,
        ModalERC20SwapRuleCreate,
        BaseNothingHere,
        BaseIdenticon,
    },
    computed: mapGetters({
        pools: 'pools/all',
    }),
})
export default class ERC20Swaps extends Vue {
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

    async getMoreResults({ pool, page, limit }: GetERC20SwapRulesProps) {
        this.loading = true;
        const response: GetERC20SwapRulesResponse = await this.$store.dispatch('swaprules/list', {
            pool: pool,
            page,
            limit,
        });

        Vue.set(this.swapRulePerPage, this.currentPage, response.results);
        this.total = response.total;
        this.loading = false;
    }

    async onSwapRuleCreated() {
        this.currentPage = 1;
        this.onChangePage(1);
    }

    async onChangePage(page: number) {
        await this.getMoreResults({
            pool: this.pool,
            page: page,
            limit: this.perPage,
        });
    }

    async mounted() {
        await this.getMoreResults({
            pool: this.pool,
            page: this.currentPage,
            limit: this.perPage,
        });
    }
}
</script>
