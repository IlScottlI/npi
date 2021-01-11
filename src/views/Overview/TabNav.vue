<template>
  <v-card class="mr-2 ml-2">
    <v-container fluid>
      <v-row no-gutters>
        <v-col
          v-for="item in BUs"
          :key="item.Category"
        >
          <tab-card :data="item" />
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>
<script>
  import { mapGetters, mapState, mapMutations } from 'vuex'

  export default {
    name: 'TabNav',
    components: {

      TabCard: () => import('./TabCard'),
    },
    data: function () {
      return {
        selected: {},
        tab: null,

      }
    },

    computed: {
      ...mapGetters('npi', ['categories', 'categoryValues', 'categorySummary']),
      ...mapState('npi', ['loading', 'BUs']),
      series () {
        const series = []
        this.categoryValues.forEach(element => {
          series.push(Math.round(element.valueOf()))
        })
        return series
      },
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
    },

    methods: {
      ...mapMutations('npi', ['setCategory', 'setMaterial', 'setgroupedBy', 'setAction']),
      dataPointSelectionHandler (e, chartContext, config) {
        console.log(config.dataPointIndex)
        this.selected.Category = this.categories[config.dataPointIndex]
        this.selected.TotalCost = this.formatMoney(this.categoryValues[config.dataPointIndex])
        if (this.Category === this.categories[config.dataPointIndex]) {
          this.Category = null
        } else {
          this.Category = this.categories[config.dataPointIndex]
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
