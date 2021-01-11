<template>
  <v-app-bar
    :color="color"
    :dark="true"
    dense
    app
  >
    <v-app-bar-nav-icon
      class="hidden-md-and-up"
      @click="toggleDrawer"
    />

    <v-spacer class="hidden-sm-and-up" />

    <v-toolbar-title class="headline">
      <template v-if="$vuetify.breakpoint.smAndUp">
        <span class="font-weight-bold">
          NPI
        </span>
        <span class="font-weight-light">
          TOOL
        </span>
      </template>
    </v-toolbar-title>
    <v-autocomplete
      v-model="model"
      :items="items"
      :loading="isLoading"
      :search-input.sync="search"
      chips
      clearable
      hide-details
      hide-selected
      item-text="name"
      item-value="symbol"
      label="Search for a coin..."
      solo
    >
      <template v-slot:no-data>
        <v-list-item>
          <v-list-item-title>
            Search for your favorite
            <strong>Cryptocurrency</strong>
          </v-list-item-title>
        </v-list-item>
      </template>
      <template v-slot:selection="{ attr, on, item, selected }">
        <v-chip
          v-bind="attr"
          :input-value="selected"
          color="blue-grey"
          class="white--text"
          v-on="on"
        >
          <v-icon left>
            mdi-bitcoin
          </v-icon>
          <span v-text="item.name" />
        </v-chip>
      </template>
      <template v-slot:item="{ item }">
        <v-list-item-avatar
          color="indigo"
          class="headline font-weight-light white--text"
        >
          {{ item.name.charAt(0) }}
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title v-text="item.name" />
          <v-list-item-subtitle v-text="item.symbol" />
        </v-list-item-content>
        <v-list-item-action>
          <v-icon>mdi-bitcoin</v-icon>
        </v-list-item-action>
      </template>
    </v-autocomplete>
    <v-spacer />

    <v-btn
      v-for="([link, text], i) in links"
      :key="i"
      :href="link"
      target="_blank"
      class="font-weight-light hidden-sm-and-down ml-2"
      large
      text
    >
      {{ text }}
    </v-btn>
  </v-app-bar>
</template>

<script>
  // Utilities
  import {
    mapMutations,
    mapState,
  } from 'vuex'

  export default {
    name: 'CoreAppBar',

    data: () => ({
      hasColor: false,
    }),

    computed: {
      ...mapState('app', ['links']),
      color () {
        return this.hasColor ? 'primary' : 'primary'
      },
    },

    methods: {
      ...mapMutations('app', ['toggleDrawer']),
      onScroll () {
        this.hasColor = window.scrollY > 50
      },
    },
  }
</script>
