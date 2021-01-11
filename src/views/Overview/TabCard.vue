<template>
  <v-card
    :elevation="ele"
    @mouseover="ele = 11"
    @mouseleave="ele = 2"
  >
    <v-sheet
      v-if="loading"
      :color="`grey ${theme.isDark ? 'darken-2' : 'lighten-4'}`"
      class="pa-3"
    >
      <v-skeleton-loader
        class="mx-auto"
        type="card"
        height="65"
      />
    </v-sheet>
    <v-card-text
      v-if="!loading"
      @click="setCookie(data.Category)"
    >
      <h4
        class="text-center"
        v-html="data.Category"
      />
      <h2
        class="text-center"
        style="color:green"
      >
        {{ formatMoney(data.Sum) }}
      </h2>
      <v-btn
        icon
      >
        <v-icon v-if="Category === data.Category">
          mdi-filter
        </v-icon>
      </v-btn>
    </v-card-text>
  </v-card>
</template>
<script>
  import { mapGetters, mapState, mapMutations } from 'vuex'

  export default {
    inject: ['theme'],

    props: {
      data: {
        type: Object,
        default: function () {
          return { }
        },
      },
    },
    data: () => ({
      ele: 2,
    }),

    computed: {
      ...mapGetters('npi', ['categories', 'categoryValues', 'categorySummary']),
      ...mapState('npi', ['loading']),
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
      setCookie: function (sel) {
        console.log(sel)
        this.setCategory(sel)
      },
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
      formatMoney (amount, decimalCount = 0, decimal = '.', thousands = ',') {
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
