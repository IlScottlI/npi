<template>
  <v-footer
    absolute
    class="my-3 mx-auto"
    color="transparent"
    height="auto"
    max-width="95%"
  >
    <v-row justify="center">
      <v-btn
        v-for="([link, text], i) in links"
        :key="`link-${i}`"
        :href="link"
        target="_blank"
        class="mx-auto hidden-sm-and-down"
        small
        text
      >
        {{ text }}
      </v-btn>

      <v-spacer />

      <v-col
        class="hidden-md-and-up"
        cols="12"
      />
    </v-row>
  </v-footer>
</template>

<script>
  // Utilities
  import {
    mapState,
  } from 'vuex'

  export default {
    name: 'CoreFooter',

    data: () => ({

    }),

    computed: {
      ...mapState('app', ['links']),
      categories () {
        return []
      },
    },
  }
</script>
