<template>
  <div>
    <v-skeleton-loader
      v-if="loading"
      type="card"
    />
    <v-data-table
      v-if="!loading"
      dense
      height="295"
      sort-by="y"
      hide-default-footer
      :items="ownerValuesSummary"
      :headers="[
        { text: 'Owner', value: 'x' },
        { text: '$', value: 'y' },
      ]"
      sort-desc
    >
      <template v-slot:item.y="{ item }">
        {{ formatMoney(item.y) }}
      </template>
    </v-data-table>
  </div>
</template>

<script>
  import { mapGetters, mapState, mapMutations } from 'vuex'

  export default {
    name: 'OwnerCost',

    data: function () {
      return {
        selected: {},
      }
    },
    computed: {
      ...mapGetters('npi', [
        'categories',
        'categoryValues',
        'categorySummary',
        'ownerValuesSummary',
      ]),
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
          dataLabels: {
            enabled: true,
            formatter: function (value, { seriesIndex, dataPointIndex, w }) {
              function formatMoney (
                amount,
                decimalCount = 2,
                decimal = '.',
                thousands = ',',
              ) {
                try {
                  decimalCount = Math.abs(decimalCount)
                  decimalCount = isNaN(decimalCount) ? 2 : decimalCount

                  const negativeSign = amount < 0 ? '-' : ''

                  const i = parseInt(
                    (amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)),
                  ).toString()
                  const j = i.length > 3 ? i.length % 3 : 0

                  return (
                    '$' +
                    negativeSign +
                    (j ? i.substr(0, j) + thousands : '') +
                    i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousands) +
                    (decimalCount
                      ? decimal +
                        Math.abs(amount - i)
                          .toFixed(decimalCount)
                          .slice(2)
                      : '')
                  )
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
        this.categoryValues.forEach((element) => {
          series.push(Math.round(element.valueOf()))
        })
        return series
      },
    },

    methods: {
      ...mapMutations('npi', [
        'setCategory',
        'setMaterial',
        'setgroupedBy',
        'setAction',
      ]),
      dataPointSelectionHandler (e, chartContext, config) {
        console.log(config.dataPointIndex)
        this.selected.Category = this.categories[config.dataPointIndex]
        this.selected.TotalCost = this.formatMoney(
          this.categoryValues[config.dataPointIndex],
        )
        if (this.Category === this.categories[config.dataPointIndex]) {
          this.Category = null
        } else {
          this.Category = this.categories[config.dataPointIndex]
        }
      },
      formatMoney (amount, decimalCount = 0, decimal = '.', thousands = ',') {
        try {
          decimalCount = Math.abs(decimalCount)
          decimalCount = isNaN(decimalCount) ? 2 : decimalCount

          const negativeSign = amount < 0 ? '-' : ''

          const i = parseInt(
            (amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)),
          ).toString()
          const j = i.length > 3 ? i.length % 3 : 0

          return (
            '$' +
            negativeSign +
            (j ? i.substr(0, j) + thousands : '') +
            i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousands) +
            (decimalCount
              ? decimal +
                Math.abs(amount - i)
                  .toFixed(decimalCount)
                  .slice(2)
              : '')
          )
        } catch (e) {
          console.log(e)
        }
      },
    },
  }
</script>
