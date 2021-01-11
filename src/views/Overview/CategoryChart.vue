<template>
  <div>
    <v-skeleton-loader
      v-if="loading"
      type="card"
    />
    <apexchart
      v-if="!loading"
      ref="categoryChart"
      type="pie"
      height="290"
      :options="chartOptions"
      :series="categoryValues"
      @dataPointSelection="dataPointSelectionHandler"
    />
  </div>
</template>

<script>
  import VueApexCharts from 'vue-apexcharts'
  import { mapGetters, mapState, mapMutations } from 'vuex'

  export default {
    name: 'Pie',
    components: {
      apexchart: VueApexCharts,
    },
    data: function () {
      return {
        selected: {},
      }
    },
    computed: {
      ...mapGetters('npi', ['categories', 'categoryValues', 'categorySummary']),
      ...mapState('npi', ['loading']),
      Category: {
        get () {
          return this.$store.state.npi.Category
        },
        set (value) {
          this.setCategory(value)
          this.setMaterial(null)
          this.setAction(null)
        },
      },
      groupedBy: {
        get () {
          return this.$store.state.npi.groupedBy
        },
        set (value) {
          this.setgroupedBy(value)
        },
      },
      chartOptions () {
        var item = {
          theme: {
            palette: 'palette2',
          },
          id: 'categoryChart',
          labels: this.categories,
          dataLabels: {
            enabled: true,
            formatter: function (value, { seriesIndex, dataPointIndex, w }) {
              function formatMoney (amount, decimalCount = 2, decimal = '.', thousands = ',') {
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
              }
              return formatMoney(w.config.series[seriesIndex])
            },
          },
        }
        return item
      },
      pieChart () {
        return {}
      },
      series () {
        const series = []
        this.categoryValues.forEach(element => {
          series.push(Math.round(element.valueOf()))
        })
        return series
      },
    },

    methods: {
      ...mapMutations('npi', ['setCategory', 'setMaterial', 'setgroupedBy', 'setAction']),
      dataPointSelectionHandler (e, chartContext, config) {
        try {
          if (this.Category === this.categories[config.dataPointIndex]) {
            this.Category = null
          } else {
            this.Category = this.categories[config.dataPointIndex]
          }
        } catch (error) {

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

        }
      },
    },

  }
</script>

<style>
.tooltip {
background-clip: rgba(0,0,0,.5) !important;
}
</style>
