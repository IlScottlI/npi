<template>
  <div>
    <v-skeleton-loader
      v-if="loading"
      type="card"
    />
    <apexchart
      v-if="!loading"
      type="bar"
      :options="chartOptions"
      :series="series"
    />
  </div>
</template>

<script>
  import VueApexCharts from 'vue-apexcharts'
  import { mapState } from 'vuex'
  export default {
    name: 'OwnerChart',
    components: {
      apexchart: VueApexCharts,
    },
    data () {
      return {
        showChart: false,
        series: [{
          data: [44, 55, 41, 64, 22, 43, 21],
        }],
        chartOptions: {
          chart: {
            type: 'bar',
            toolbar: {
              show: false,
            },
          },
          plotOptions: {
            bar: {
              horizontal: false,
              dataLabels: {
                position: 'top',
              },
            },
          },
          dataLabels: {
            enabled: true,
            offsetX: -6,
            style: {
              fontSize: '12px',
              colors: ['#fff'],
            },
          },
          stroke: {
            show: true,
            width: 1,
            colors: ['#fff'],
          },
          xaxis: {
            categories: [2001, 2002, 2003, 2004, 2005, 2006, 2007],
          },
        },
      }
    },
    computed: {
      ...mapState('npi', ['loading']),
    },
  }
</script>
