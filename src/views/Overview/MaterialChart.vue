<template>
  <div>
    <v-skeleton-loader
      v-if="loading"
      type="card"
    />
    <apexchart
      v-if="!loading"
      ref="materialChart"
      type="bar"
      height="280"
      :options="chartOptions"
      :series="materialSeries"
      @dataPointSelection="dataPointSelectionHandler"
    />
  </div>
</template>

<script>
  import VueApexCharts from 'vue-apexcharts'
  import { mapGetters, mapMutations, mapState } from 'vuex'

  export default {
    name: 'MaterialChart',
    components: {
      apexchart: VueApexCharts,
    },
    data: function () {
      return {
        selected: {},
      }
    },

    computed: {
      ...mapGetters('npi', ['materialSummary', 'materialValues', 'materials']),
      ...mapState('npi', ['loading']),
      Material: {
        get () {
          return this.$store.state.npi.Material
        },
        set (value) {
          this.setMaterial(value)
          this.setCategory(null)
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
      pieChart () {
        return {}
      },
      categories () {
        const arr = []
        this.materialSummary.forEach(element => {
          arr.push(element.material)
        })
        return arr
      },
      series () {
        const series = []
        this.materialValues.forEach(element => {
          series.push(Math.round(element.valueOf()))
        })
        return [{ data: series }]
      },
      materialSeries () {
        const series = []
        this.materialSummary.forEach(element => {
          series.push({ name: element.material, data: [Math.round(element.count.valueOf())] })
        })
        return series
      },
      chartOptions () {
        var item = {
          chart: {
            type: 'bar',

            toolbar: {
              show: false,
            },
          },
          plotOptions: {
            bar: {
              horizontal: true,
            },
          },
          dataLabels: {
            enabled: true,
          },
          legend: { show: false },
          xaxis: {
            categories: this.categories,
          },
          tooltip:
            {
              custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                return '<v-card class="pa-5 primary white--text"  fill-opacity=".2">' +
                  '<span><strong>' + w.config.xaxis.categories[seriesIndex] + '</strong></span><br>' +
                  '<span><strong>' + series[seriesIndex] + '</strong><small> Avg. RED NPI(days)</small>' +
                  '</v-card>'
              },
            },
        }
        return item
      },
    },

    watch: {

      loading: function () {
        setTimeout(() => {
          this.$refs.materialChart.updateOptions({
            dataLabels: { enabled: false },
            xaxis: {
              categories: this.materials,
              title: { text: 'Avg. RED NPI (days)' },
            },
          })
        }, 100)
      },

    },

    methods: {
      ...mapMutations('npi', ['setCategory', 'setMaterial', 'setgroupedBy', 'setAction']),
      dataPointSelectionHandler (e, chartContext, config, w) {
        this.selected.Material = this.materials[config.seriesIndex]
        this.selected.TotalCost = this.formatMoney(this.materialValues[config.seriesIndex])
        if (this.Material === this.materials[config.seriesIndex]) {
          this.Material = null
          this.groupedBy = null
        } else {
          this.Material = this.materials[config.seriesIndex]
          this.groupedBy = 'materialType'
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
