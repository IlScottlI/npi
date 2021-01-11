<template>
  <v-app>
    <v-app-bar
      color="primary"
      dark
      app
    >
      <!-- <v-app-bar-nav-icon /> -->

      <v-toolbar-title class="headline">
        <template v-if="$vuetify.breakpoint.smAndUp">
          <span class="font-weight-bold"> NPI </span>
          <span class="font-weight-light"> TOOL </span>
        </template>
      </v-toolbar-title>
      <v-col
        class="dense"
        cols="12"
        sm="6"
        md="2"
        lg="2"
        xl="2"
      >
        <v-autocomplete
          v-model="CategoryBucket"
          :items="npiBuckets"
          item-text="bucket"
          item-value="id"
          class="mx-4"
          flat
          hide-no-data
          hide-details
          label="NPI Bucket"
          solo-inverted
          dense
          clearable
          disable-lookup
        />
      </v-col>
      <v-autocomplete
        v-model="Category"
        :items="categories"
        class="mx-4"
        flat
        hide-no-data
        hide-details
        label="Business Category"
        solo-inverted
        dense
        clearable
        disable-lookup
      />
      <v-autocomplete
        v-model="Material"
        :items="materials"
        class="mx-4"
        flat
        hide-no-data
        hide-details
        label="Material Type"
        solo-inverted
        dense
        clearable
        disable-lookup
      />
      <v-spacer />

      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
      <v-btn
        icon
        @click="
          getNPIData();
          getNPIMaster();
        "
      >
        <v-icon>mdi-reload</v-icon>
      </v-btn>

      <template v-slot:extension>
        <v-btn
          v-for="([link, text], i) in links"
          :key="i"
          :to="link"
          class="font-weight-light hidden-sm-and-down ml-2"
          large
          text
        >
          {{ text }}
        </v-btn>
      </template>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <core-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
  import { mapActions, mapState, mapGetters, mapMutations } from 'vuex'
  export default {
    name: 'App',

    components: {
      CoreView: () => import('@/components/core/View'),
    },
    data () {
      return {
        tab: null,
      }
    },

    metaInfo: {
      titleTemplate: '%s | NPI Tool',
    },

    computed: {
      ...mapState('app', ['links']),
      ...mapState('npi', ['Action', 'Material', 'Bucket', 'npiBuckets']),
      ...mapGetters('npi', ['categories', 'materials']),
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
      Material: {
        get () {
          return this.$store.state.npi.Material
        },
        set (value) {
          // this.setCategory(value)
          this.setMaterial(value)
          this.setAction(null)
        },
      },
      CategoryBucket: {
        get () {
          return this.$store.state.npi.CategoryBucket
        },
        set (value) {
          this.setCategoryBucket(value)
          this.setAction(null)
        },
      },
      $vue: function () {
        return this.$vuetify
      },
      height: function () {
        return this.$vuetify.breakpoint.height
      },
      width: function () {
        return this.$vuetify.breakpoint.width
      },
      breakpoint () {
        return this.$vuetify.breakpoint.name
      },
    },

    created () {
      this.getNPIData()
      this.getNPIMaster()
      this.getNPIConfigData()
      this.getNPIBUs()
    },

    methods: {
      ...mapMutations('npi', [
        'setCategory',
        'setMaterial',
        'setgroupedBy',
        'setAction',
        'setCategoryBucket',
      ]),
      ...mapActions('npi', [
        'getNPIData',
        'getNPIConfigData',
        'getNPIBUs',
        'getNPIMaster',
      ]),
    },
  }
</script>

<style>
.v-application {
  background: #c9c9c9 !important;
}
#hero h1 {
  letter-spacing: 4px !important;
}
</style>
