<template>
    <div>
        <BaseTransactionsChart />
    </div>
</template>

<script lang="ts">
import { mapGetters } from 'vuex';
import { Component, Vue } from 'vue-property-decorator';
import { IPools } from '@/store/modules/pools';
import { ITransactions } from '@/types/ITransactions';
import BaseNothingHere from '@/components/BaseNothingHere.vue';
import BaseTransactionsChart from '@/components/charts/BaseTransactionsChart.vue';

@Component({
    components: { BaseNothingHere, BaseTransactionsChart },
    computed: mapGetters({
        pools: 'pools/all',
        transactions: 'transactions/all',
    }),
})
export default class TransactionsView extends Vue {
    pools!: IPools;
    transactions!: ITransactions;

    get pool() {
        return this.pools[this.$route.params.id];
    }

    get transactionsForPool() {
        return this.transactions[this.$route.params.id];
    }

    async mounted() {
        await this.$store.dispatch('transactions/list', this.pool);
    }
}
</script>
