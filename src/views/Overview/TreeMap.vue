<template>
  <div id="treeChart">
    <v-skeleton-loader
      v-if="loading"
      type="card"
    />
    <apexchart
      v-if="!loading"
      ref="TreeMap"
      type="treemap"
      :options="chartOptions"
      :series="series_"
      height="280"
      @dataPointSelection="dataPointSelectionHandler"
    />
  </div>
</template>

<script>
  import VueApexCharts from 'vue-apexcharts'
  import { mapGetters, mapMutations, mapState } from 'vuex'

  export default {
    name: 'TreeMap',
    components: {
      apexchart: VueApexCharts,
    },
    data: () => ({
      selected: {},
      series: [
        {
          data: [
            {
              x: 'null',
              y: 0,
            },
          ],
        },
      ],
    }),

    computed: {
      ...mapGetters('npi', ['actionValuesSummary']),
      ...mapState('npi', ['loading']),
      items () {
        return Array.from({ length: this.length }, (k, v) => v + 1)
      },
      length () {
        return 10
      },
      series_ () {
        const arr = [{ data: this.actionValuesSummary }]
        return arr
      },
      Action: {
        get () {
          return this.$store.state.npi.Action
        },
        set (value) {
          this.setAction(value)
          this.setMaterial(null)
          this.setCategory(null)
        },
      },
      chartOptions () {
        var chartOptions = [{
          theme: {
            palette: 'palette1',
          },
          chart: {
            height: 350,
            type: 'treemap',
            toolbar: {
              show: false,
            },
          },
          plotOptions: {
            treemap: {
              distributed: true,
              enableShades: false,
            },
          },
        }]
        return chartOptions[0]
      },
    },

    watch: {
      series_ (item) {
        this.series = item
      },
    },

    methods: {
      ...mapMutations('npi', ['setCategory', 'setMaterial', 'setgroupedBy', 'setAction']),
      dataPointSelectionHandler (mouseEvent, t, chartContext, w) {
        this.selected.Action = t.series.w.config.series[0].data[chartContext.dataPointIndex].x
        this.selected.TotalCost = this.formatMoney(t.series.w.config.series[0].data[chartContext.dataPointIndex].y)
        if (this.Action === t.series.w.config.series[0].data[chartContext.dataPointIndex].x) {
          this.Action = null
        } else {
          this.Action = t.series.w.config.series[0].data[chartContext.dataPointIndex].x
        }
      },
      formatMoney (amount, decimalCount = 2, decimal = '.', thousands = ',') {
        try {
          decimalCount = Math.abs(decimalCount)
          decimalCount = isNaN(decimalCount) ? 2 : decimalCount

          const negativeSign = amount < 0 ? '-' : ''

          const i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString()
          const j = (i.length > 3) ? i.length % 3 : 0

          return '$' + negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : '')
        } catch (e) {
          console.log(e)
        }
      },
    },
  }
</script>
