
/* eslint-disable vue/valid-v-model */
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
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            icon
            v-on="on"
            @click="
              getNPIData();
              getNPIMaster();
            "
          >
            <v-icon>mdi-reload</v-icon>
          </v-btn>
        </template>
        <span>Reloads Data</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            icon
            v-on="on"
            @click="clearAll()"
          >
            <v-icon>mdi-eraser</v-icon>
          </v-btn>
        </template>
        <span>Clear all stored preference</span>
      </v-tooltip>

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
        <v-spacer />
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
        fab: false,
        hidden: false,
        tabs: null,
      }
    },

    metaInfo: {
      titleTemplate: 'NPI Tool',
    },

    computed: {
      ...mapState('app', ['links']),
      ...mapState('npi', ['Action', 'Material', 'Bucket', 'npiBuckets']),
      ...mapGetters('npi', ['categories', 'materials']),
      activeFab () {
        switch (this.tabs) {
          case 'one': return { color: 'success', icon: 'mdi-share-variant' }
          case 'two': return { color: 'red', icon: 'mdi-pencil' }
          case 'three': return { color: 'green', icon: 'mdi-chevron-up' }
          default: return { color: 'primary', icon: 'mdi-chevron-up' }
        }
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
      zoomLevel: {
        get () {
          if (localStorage.getItem('zoomLevel')) {
            document.getElementsByTagName('html')[0].style.zoom = this.$store.state.app.zoomLevel + '%'
            return this.$store.state.app.zoomLevel
          } else {
            localStorage.setItem('zoomLevel', 100)
            return 100
          }
        },
        set (value) {
          this.setZoomLevel(value)
          localStorage.setItem('zoomLevel', parseInt(value))
          document.getElementsByTagName('html')[0].style.zoom = `${value}%`
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
      ...mapMutations('app', ['setZoomLevel']),
      ...mapActions('npi', [
        'getNPIData',
        'getNPIConfigData',
        'getNPIBUs',
        'getNPIMaster',
      ]),
      clearAll () {
        localStorage.clear()
        window.location = ''
      },
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
  #lateral .v-btn--example {
    bottom: 0;
    position: absolute;
    margin: 0rem 0rem 0 0 ;
  }
</style>
