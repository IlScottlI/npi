<template>
  <div>
    <v-virtual-scroll
      :bench="benched"
      :items="items"
      item-height="30"
    >
      <template v-slot="{ item }">
        <v-list-item
          :key="item"
          class="pa-0 ma-0"
        >
          User Database Record
        </v-list-item>
      </template>
    </v-virtual-scroll>
  </div>
</template>

<script>
  export default {
    data: () => ({
      benched: 0,
    }),
    computed: {
      items () {
        return Array.from({ length: this.length }, (k, v) => v + 1)
      },
      length () {
        return 10
      },
    },
  }
</script>
