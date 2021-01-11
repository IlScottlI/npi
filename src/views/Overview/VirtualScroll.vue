<template>
  <div>
    <v-card
      v-if="loading"
      :color="`grey ${theme.isDark ? 'darken-2' : 'lighten-4'}`"
      class="px-3 pt-3 pb-3"
    >
      <v-skeleton-loader
        class="mx-auto"
        type="table-row-divider@10"
      />
    </v-card>
    <v-card v-if="!loading">
      <v-virtual-scroll
        elevation="10"
        :items="filteredData"
        :item-height="50"
        height="468"
      >
        <template v-slot="{ item }">
          <v-list-item>
            <v-list-item-avatar>
              <v-tooltip
                right
                color="primary"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-avatar
                    size="35"
                    class="white--text"
                    color="red"
                    v-bind="attrs"
                    v-on="on"
                  >
                    {{ item.inCategoryDateCounter }}
                  </v-avatar>
                </template>
                <span>Red NPI Days</span>
              </v-tooltip>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>
                <v-tooltip
                  left
                  color="primary"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-card
                      v-bind="attrs"
                      v-on="on"
                    >
                      {{ item.material }}
                    </v-card>
                  </template>
                  <span>GCAS</span>
                </v-tooltip>
              </v-list-item-title>
              <v-list-item-title>
                {{ item.materialDescription }}
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-content>
              <v-list-item-title title="Line/Area">
                {{ item.psMrpController.split('_')[0] }}
              </v-list-item-title>
              <v-list-item-title title="Business">
                {{ item.subSector }}
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-content>
              <v-list-item-title title="Batch ID">
                {{ item.batchNumber }}
              </v-list-item-title>
              <v-list-item-title>{{ item.purchaseOrderNumber }}</v-list-item-title>
            </v-list-item-content>
            <v-list-item-content>
              <v-list-item-title>{{ item.material }}</v-list-item-title>
              <v-list-item-title>{{ item.materialDescription }}</v-list-item-title>
            </v-list-item-content>
            <v-list-item-content>
              <v-list-item-title>{{ item.psMrpController.split('_')[0] }}</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn
                depressed
                small
              >
                Details

                <v-icon
                  color="primary"
                  right
                >
                  mdi-subtitles-outline
                </v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </template>
      </v-virtual-scroll>
    </v-card>

    <v-snackbar
      v-model="snack"
      :timeout="3000"
      :color="snackColor"
    >
      {{ snackText }}

      <template v-slot:action="{ attrs }">
        <v-btn
          v-bind="attrs"
          text
          @click="snack = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
  import { mapActions, mapState, mapGetters, mapMutations } from 'vuex'

  export default {
    name: 'VirtualScroll',
    inject: ['theme'],

    data () {
      return {
        options: {
          page: 1,
          itemsPerPage: 15,
        },
        expanded: [],
        singleExpand: false,
        search: '',
        snack: false,
        snackColor: '',
        snackText: '',
        max25chars: v => v.length <= 25 || 'Input too long!',
        pagination: {},
        headers_: [
          { text: 'GCAS', value: 'material', groupable: true },
          { text: 'Batch', value: 'batchNumber', groupable: true },
          { text: 'Type', value: 'materialType', groupable: true },
          { text: 'Line', value: 'psMrpController', groupable: true },
          { text: 'Stock', value: 'buom', groupable: false },
          { text: '', value: 'buomName', groupable: false },
          { text: 'Storage Location', value: 'storageLocation' },
          { text: 'Action Note', value: 'actionNote' },
          { text: 'Root Cause', value: 'blockClass1' },
          { text: 'RED NPI Days', value: 'inCategoryDateCounter' },
          { text: 'Owner', value: 'legalEntity' },
          { text: 'Last Updated', value: '' },
        ],
      }
    },
    computed: {
      ...mapState('npi', ['loading', 'npiConfigData']),
      ...mapGetters('npi', ['rootCauseData', 'rootCauseData', 'filteredData']),
      groupedBy: {
        get () {
          return this.$store.state.npi.groupedBy
        },
        set (value) {
          this.setgroupedBy(value)
        },
      },
      npiData: {
        get () {
          return this.$store.state.npi.npiData
        },
        set (value) {
          this.setSelectedChunk(value)
        },
      },
    },

    watch: {
      groupedBy (item) {
        this.options.groupBy = [item]
      },
    },

    methods: {
      ...mapMutations('npi', ['setgroupedBy']),
      ...mapActions('npi', ['getNPIData']),
      getRootCause (item, configData) {
        let response = item
        try {
          configData.forEach(element => {
            if (item === element.JSON_Data.id) {
              response = element.JSON_Data.name
            }
          })
        } catch (error) {

        }

        return response
      },
      save () {
        this.snack = true
        this.snackColor = 'success'
        this.snackText = 'Data saved'
      },
      cancel () {
        this.snack = true
        this.snackColor = 'error'
        this.snackText = 'Canceled'
      },
      open () {
        this.snack = true
        this.snackColor = 'info'
        this.snackText = 'Dialog opened'
      },
      close () {
        console.log('Dialog closed')
      },
    },
  }
</script>
