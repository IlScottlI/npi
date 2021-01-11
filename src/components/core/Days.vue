<template>
  <div>
    <v-chip
      class="ma-2"
      :color="color"
      :text-color="text_color"
    >
      {{ cellData.value }}
    </v-chip>
  </div>
</template>
<script>

  export default {
    components: {
    },
    props: {
      cellData: {
        type: Object,
        default: () => {},
      },
    },
    data () {
      return {
        customizeTooltip: function (data) {
          return {
            text: `${parseInt(data.value)}%`,
          }
        },
      }
    },
    computed: {
      color () {
        let res = 'white'
        if (this.cellData.value > 90) {
          res = 'red'
        } else if (this.cellData.value > 45) {
          res = 'orange'
        }
        return res
      },
      text_color () {
        let res = 'black'
        if (this.cellData.value > 90) {
          res = 'white'
        } else if (this.cellData.value > 45) {
          res = 'white'
        }
        return res
      },
    },
  }
</script>
<style>
.dx-datagrid .dx-data-row > td.bullet {
  padding-top: 0;
  padding-bottom: 0;
}
</style>
