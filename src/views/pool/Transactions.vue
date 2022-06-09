<template>
    <div>
        <b-row class="mb-3">
            <b-col class="d-flex align-items-center">
                <h2 class="mb-0">Pool Transactions in the last 30 days</h2>
            </b-col>
        </b-row>
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
            <BarChart :chartData="chartData" :chart-options="chartOptions" />
        </b-skeleton-wrapper>
    </div>
</template>

<script lang="ts">
import { mapGetters } from 'vuex';
import { Component, Vue } from 'vue-property-decorator';
import { IPools } from '@/store/modules/pools';
import { ITransactions } from '@/types/ITransactions';
import BaseNothingHere from '@/components/BaseNothingHere.vue';
import BarChart from '@/components/charts/BarChart.vue';
import { GetTransactionsResponse } from '@/store/modules/transactions';

@Component({
    components: { BaseNothingHere, BarChart },
    computed: mapGetters({
        pools: 'pools/all',
        transactions: 'transactions/all',
    }),
})
export default class TransactionsView extends Vue {
    pools!: IPools;
    transactions!: ITransactions;
    loading = false;

    chartData: any = {
        labels: [],
        datasets: [
            {
                label: 'Num of Transactions',
                backgroundColor: '#5942c1',
                data: [],
            },
        ],
    };

    chartOptions = {
        scales: {
            yAxes: [
                {
                    ticks: {
                        beginAtZero: true,
                    },
                },
            ],
        },
        responsive: true,
        maintainAspectRatio: false,
        legend: {
            display: false,
        },
    };

    get pool() {
        return this.pools[this.$route.params.id];
    }

    formatDateLabel(date: Date): string {
        const month = date.getUTCMonth() + 1;
        const day = date.getDate();
        return `${month}/${day}`;
    }

    async mounted() {
        this.loading = true;

        // CREATE THE DATE RANGES FOR THE QUERY
        let lastDate = new Date();
        lastDate.setHours(0, 0, 0, 0);

        let startDate = new Date(lastDate);
        startDate.setDate(startDate.getDate() - 30); // subtract 30 days

        const labels = [];
        const data = [];

        while (startDate.getTime() <= lastDate.getTime()) {

            labels.push(this.formatDateLabel(startDate));
            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + 1);

            const response: GetTransactionsResponse | undefined = await this.$store.dispatch('transactions/list', {
                poolAddress: this.pool.address,
                startDate: startDate.getTime(),
                endDate: endDate.getTime(),
            });

            data.push(response ? response.total : 0);
            startDate.setDate(startDate.getDate() + 1);
        }

        this.chartData.labels = labels;
        this.chartData.datasets[0].data = data;
        this.loading = false;
    }
}
</script>
