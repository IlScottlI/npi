<template>
  <v-combobox
    v-if="chips.length > 0"
    v-model="chips"
    chips
    clearable
    label="Applied Filters"
    multiple
    prepend-icon="mdi-filter"
    solo
    @click:clear="clearAllFilters"
  >
    <template v-slot:selection="{ attrs, item, select, selected }">
      <v-chip
        v-bind="attrs"
        :input-value="selected"
        close
        @click="select"
        @click:close="remove(item)"
      >
        <strong>{{ item.type }}</strong>&nbsp;
        <span>({{ item.value }})</span>
      </v-chip>
    </template>
  </v-combobox>
</template>
<script>
  import { mapState, mapMutations } from 'vuex'
  export default {
    data () {
      return {
      }
    },
    computed: {
      ...mapState('npi', ['Category', 'Action', 'Material']),
      chips: {
        get () {
          const arr = []
          if (this.Category) {
            arr.push({ type: 'Category', value: this.Category })
          }
          if (this.Material) {
            arr.push({ type: 'Material', value: this.Material })
          }
          if (this.Action) {
            arr.push({ type: 'Action', value: this.Action })
          }
          return arr
        },
        set (value) {
          this.setFilters(value)
          if (value.length > 0) {
            value.forEach(element => {
              if (element.type === 'Category') {
                this.setCategory(element.value)
              } else {
                this.setCategory(null)
              }
              if (element.type === 'Material') {
                this.setMaterial(element.value)
              } else {
                this.setMaterial(null)
              }
              if (element.type === 'Action') {
                this.setAction(element.value)
              } else {
                this.setAction(null)
              }
            })
          } else {
            this.clearAllFilters()
          }
        },
      },
    },
    methods: {
      ...mapMutations('npi', ['setAction', 'setCategory', 'setMaterial', 'setFilters']),
      remove (item) {
        this.chips.splice(this.chips.indexOf(item), 1)
        this.chips = [...this.chips]
      },
      clearAllFilters () {
        this.setCategory(null)
        this.setMaterial(null)
        this.setAction(null)
      },
    },
  }
</script>
