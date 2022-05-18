<template>
    <div>
        <b-row class="mb-3">
            <b-col class="d-flex align-items-center">
                <h2 class="mb-0">Deposit</h2>
            </b-col>
            <b-col class="d-flex justify-content-end">
                <b-button v-b-modal="'modalDepositCreate'" class="rounded-pill" variant="primary">
                    <i class="fas fa-plus mr-2"></i>
                    <span class="d-none d-md-inline">Add a deposit</span>
                </b-button>
            </b-col>
        </b-row>
        <base-nothing-here v-if="!depositForPool" item="a Deposit" @clicked="$bvModal.show('modalDepositCreate')" />

        <base-modal-deposit-create :pool="pool" />
    </div>
</template>

<script lang="ts">
import { mapGetters } from 'vuex';
import { Component, Vue } from 'vue-property-decorator';
import { IAssetPools } from '@/store/modules/pools';
import BaseNothingHere from '@/components/BaseNothingHere.vue';
import BaseModalDepositCreate from '@/components/modals/BaseModalDepositCreate.vue';
import { IDeposits } from '@/types/IDeposits';

@Component({
    components: { BaseNothingHere, BaseModalDepositCreate },
    computed: mapGetters({
        pools: 'pools/all',
        deposit: 'deposits/all',
    }),
})
export default class DepositView extends Vue {
    pools!: IAssetPools;
    deposit!: IDeposits;
    error = '';
    loading = true;
    skeletonLoading = true;

    get pool() {
        return this.pools[this.$route.params.address];
    }

    get depositForPool() {
        return this.deposit[this.$route.params.address];
    }

    async mounted() {
        try {
            await this.$store.dispatch('deposits/list', { poolAddress: this.pool.address });
            this.skeletonLoading = false;
        } catch (e) {
            this.error = 'Could not get the deposits.';
        } finally {
            this.loading = false;
        }
    }
}
</script>
