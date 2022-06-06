<template>
  <div class="container">
    <Bar v-if="loaded" :chart-data="chartData" />
  </div>
</template>

<script  lang="ts">
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import { Component, Prop, Vue } from 'vue-property-decorator';
import { TTransaction } from '@/store/modules/transactions';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

@Component({
    components: { Bar }
})

export default class BaseTransactionsChart extends Vue {
  loaded = false;

  @Prop() chartData!: number[];

  async mounted () {
    this.loaded = false

    try {
      this.chartData = [1,34, 67, 78];
      this.loaded = true
    } catch (e) {
      console.error(e)
    }
  }
}
</script>