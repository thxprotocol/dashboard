<template>


    <div class="container pt-3 h-100 d-flex flex-column">
        <b-card class="shadow-sm">
            <b-alert v-if="deposits.length === 0" variant="info" show> There no deposit on this pool yet. </b-alert>
            <div class="row pt-3 pb-2">
                <div class="col-md-3">
                    <strong>Amount</strong>
                </div>
                <div class="col-md">
                    <strong>Created At</strong>
                </div>
                <div class="col-md">
                    <strong>State</strong>
                </div>
            </div>
            <b-skeleton-wrapper :loading="loading">
                <template #loading>
                    <b-form-group class="mb-0">
                        <hr />
                        <div class="row pt-2 pb-2">
                            <div class="col-md-3">
                                <b-skeleton animation="fade" width="85%"></b-skeleton>
                                <b-skeleton animation="fade" width="80%"></b-skeleton>
                            </div>
                            <div class="col-md-3">
                                <b-skeleton animation="fade" width="85%"></b-skeleton>
                                <b-skeleton animation="fade" width="80%"></b-skeleton>
                            </div>
                            <div class="col-md-3 text-right d-flex justify-content-end">
                                <b-skeleton type="avatar" class="inline"></b-skeleton>
                                <b-skeleton type="avatar" class="inline ml-1"></b-skeleton>
                            </div>
                        </div>
                    </b-form-group>
                </template>
                <b-form-group class="mb-0" :key="deposit.id" v-for="deposit of deposits">
                    <hr />
                    <div class="row pt-2 pb-2">
                        <div class="col-md-3 d-flex align-items-center">
                            {{ toEther(Number(deposit.amount)) }}
                        </div>
                        <div class="col-md d-flex align-items-center">
                            {{ new Date(deposit.createdAt.toString()).toLocaleString() }}
                        </div>
                        <div class="col-md d-flex align-items-center">
                            {{  getdepositState(Number(deposit.state))  }}
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
        <base-nothing-here item="a Deposit" @clicked="$bvModal.show('modalDepositCreate')" />
        <base-modal-deposit-create :pool="pool" />
    </div>
</template>

<script lang="ts">
import { GetDepositsProps, GetDepositsResponse, IAssetPools, IDepositsByPage } from '@/store/modules/pools';
import BaseNothingHere from '@/components/BaseNothingHere.vue';
import BaseModalDepositCreate from '@/components/modals/BaseModalDepositCreate.vue';
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import { DepositState } from '../../store/modules/deposits'
@Component({
components: { BaseNothingHere, BaseModalDepositCreate },

    computed: mapGetters({
        pools: 'pools/all',
    }),
})
export default class Deposits extends Vue {
    depositPerPage: IDepositsByPage = {};
    loading = false;
    currentPage = 1;
    perPage = 10;
    total = 0;

    pools!: IAssetPools;

    get deposits() {
        return this.depositPerPage[this.currentPage] || [];
    }

    get pool() {
        return this.pools[this.$route.params.address];
    }

    toEther(value: number) {
        return value > 0 ? value / 1e18 : 0;
    }

    getdepositState(value: number) {
        return DepositState[value];
    }

    async getMoreDeposits({ address, page, limit }: GetDepositsProps) {
        this.loading = true;
        const response: GetDepositsResponse = await this.$store.dispatch('pools/getDeposits', {
            address,
            page,
            limit,
        });

        Vue.set(this.depositPerPage, this.currentPage, response.results);
        this.total = response.total;
        this.loading = false;
    }

    async onChangePage(page: number) {
        await this.getMoreDeposits({
            address: this.pool.address,
            page: page,
            limit: this.perPage,
        });
    }

    async mounted() {
        await this.getMoreDeposits({
            address: this.pool.address,
            page: this.currentPage,
            limit: this.perPage,
        });
    }
}
</script>


