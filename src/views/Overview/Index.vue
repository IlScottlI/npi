<template>
  <section id="overview">
    <v-card>
      <tab-nav />
      <v-container
        class="mt-0"
        fluid
      >
        <v-row
          dense
        >
          <v-col
            cols="12"
            :sm="category.sm"
            :md="category.md"
            :lg="category.lg"
            :xl="category.xl"
          >
            <v-card>
              <v-card-actions
                dense
                class="pa-0"
                right
              >
                <v-row
                  justify="space-around"
                  dense
                >
                  <span class="text-h6 ml-4">
                    Category
                  </span>
                  <v-spacer />
                  <v-btn-toggle
                    v-model="toggle_exclusive"
                    icon
                    dense
                    mandatory
                  >
                    <v-btn icon>
                      <v-icon
                        color="blue-grey "
                        @click="category = { sm: 12, md: 6, lg: 3, xl: 3 }"
                      >
                        mdi-chart-pie
                      </v-icon>
                    </v-btn>
                    <v-btn icon>
                      <v-icon
                        color="blue-grey lighten-2"
                        @click="category[breakpoint] = 12"
                      >
                        mdi-fullscreen
                      </v-icon>
                    </v-btn>
                  </v-btn-toggle>
                </v-row>
              </v-card-actions>
              <v-divider />
              <v-card-text>
                <category-chart />
                <filter-chips
                  v-if="Category"
                  class="filters"
                />
              </v-card-text>
            </v-card>
          </v-col>
          <v-col
            cols="12"
            :sm="material.sm"
            :md="material.md"
            :lg="material.lg"
            :xl="material.xl"
          >
            <v-card dense>
              <v-card-actions
                dense
                class="pa-0"
                right
              >
                <v-row
                  justify="space-around"
                  dense
                >
                  <span class="text-h6 ml-4">
                    Material
                  </span>
                  <v-spacer />
                  <v-btn-toggle
                    v-model="toggle_exclusive_material"
                    icon
                    mandatory
                    dense
                  >
                    <v-btn icon>
                      <v-icon
                        class="mdi-rotate-90"
                        color="blue-grey "
                        @click="material = { sm: 12, md: 6, lg: 3, xl: 3 }"
                      >
                        mdi-chart-bar
                      </v-icon>
                    </v-btn>
                    <v-btn
                      icon
                      @click="material[breakpoint] = 12"
                    >
                      <v-icon
                        color="blue-grey lighten-2"
                      >
                        mdi-fullscreen
                      </v-icon>
                    </v-btn>
                  </v-btn-toggle>
                </v-row>
              </v-card-actions>
              <v-divider />
              <v-card-text>
                <material-chart />
                <filter-chips
                  v-if="Material"
                  class="filters"
                />
              </v-card-text>
            </v-card>
          </v-col>

          <v-col
            cols="12"
            :sm="action.sm"
            :md="action.md"
            :lg="action.lg"
            :xl="action.xl"
          >
            <v-card dense>
              <v-card-actions
                dense
                class="pa-0"
                right
              >
                <v-row
                  justify="space-around"
                  dense
                >
                  <span class="text-h6 ml-4">
                    Action Disposition
                  </span>
                  <v-spacer />
                  <v-btn-toggle
                    v-model="toggle_exclusive_action"
                    icon
                    dense
                    mandatory
                  >
                    <v-btn icon>
                      <v-icon
                        class="mdi-rotate-90"
                        color="blue-grey "
                        @click="action = { sm: 12, md: 6, lg: 3, xl: 3 }"
                      >
                        mdi-developer-board
                      </v-icon>
                    </v-btn>
                    <v-btn
                      icon
                      @click="action[breakpoint] = 12"
                    >
                      <v-icon
                        color="blue-grey lighten-2"
                      >
                        mdi-fullscreen
                      </v-icon>
                    </v-btn>
                  </v-btn-toggle>
                </v-row>
              </v-card-actions>
              <v-divider />
              <v-card-text>
                <tree-map />
                <filter-chips
                  v-if="Action"
                  class="filters"
                />
              </v-card-text>
            </v-card>
          </v-col>

          <v-col
            cols="12"
            :sm="owner.sm"
            :md="owner.md"
            :lg="owner.lg"
            :xl="owner.xl"
          >
            <v-card dense>
              <v-card-actions
                dense
                class="pa-0"
                right
              >
                <v-row
                  justify="space-around"
                  dense
                >
                  <span class="text-h6 ml-4">
                    Owner Disposition
                  </span>
                  <v-spacer />
                  <v-btn-toggle
                    v-model="toggle_exclusive_owner"
                    icon
                    dense
                    mandatory
                  >
                    <v-btn icon>
                      <v-icon
                        class="mdi-rotate-90"
                        color="blue-grey "
                        @click="owner = { sm: 12, md: 6, lg: 3, xl: 3 }"
                      >
                        mdi-developer-board
                      </v-icon>
                    </v-btn>

                    <v-btn
                      icon
                      @click="owner[breakpoint] = 12"
                    >
                      <v-icon
                        color="blue-grey lighten-2"
                      >
                        mdi-fullscreen
                      </v-icon>
                    </v-btn>
                  </v-btn-toggle>
                </v-row>
              </v-card-actions>
              <v-divider />
              <v-card-text>
                <owner-cost />
                <filter-chips
                  v-if="Owner "
                  class="filters"
                />
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <v-container fluid>
        <v-row
          no-gutters
          dense
        >
          <v-col>
            <v-tabs
              v-model="tab"
              active-class="black--text text--lighten-1"
              right
            >
              <v-tab
                v-for="item in [{ id: 0, tab: 'Gallery', icon:'mdi-format-list-bulleted-type' }, { id: 1, tab: 'Grid', icon:'mdi-grid' }]"
                :key="item.tab"
              >
                <v-icon class="mr-2">
                  {{ item.icon }}
                </v-icon>
                {{ item.tab }}
              </v-tab>
            </v-tabs>

            <v-tabs-items
              v-model="tab"
            >
              <v-tab-item>
                <v-card flat>
                  <virtual-scroll />
                </v-card>
              </v-tab-item>
              <v-tab-item>
                <v-card flat>
                  <grid />
                </v-card>
              </v-tab-item>
            </v-tabs-items>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </section>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'HomeIndex',

    components: {
      TabNav: () => import('./TabNav'),
      Grid: () => import('./Grid'),
      CategoryChart: () => import('./CategoryChart'),
      MaterialChart: () => import('./MaterialChart'),
      VirtualScroll: () => import('./VirtualScroll'),
      FilterChips: () => import('./FilterChips'),
      TreeMap: () => import('./TreeMap'),
      OwnerCost: () => import('./OwnerCost'),
    },
    data () {
      return {
        tabs: [{ id: 0, tab: 'Grid' }, { id: 1, tab: 'Scroll' }],
        tab: 1,
        text: '',
        toggle_exclusive: 0,
        toggle_exclusive_material: 0,
        toggle_exclusive_action: 0,
        toggle_exclusive_owner: 0,
        owner: { sm: 12, md: 6, lg: 3, xl: 3 },
        action: { sm: 12, md: 6, lg: 3, xl: 3 },
        material: { sm: 12, md: 6, lg: 3, xl: 3 },
        category: { sm: 12, md: 6, lg: 3, xl: 3 },
      }
    },

    metaInfo: {
      title: 'NPI Tool',
    },

    computed: {
      ...mapState('npi', ['Action', 'Category', 'Material', 'Owner']),
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
    watch: {

    },

  }
</script>
<style>
  /* This is for documentation purposes and will not be needed in your application */
  .filters {
    bottom: -1rem;
    position: absolute;
  }
</style>
