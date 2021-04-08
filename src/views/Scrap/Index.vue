<template>
  <section id="scrap">
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
      <v-container fluid>
        <v-card>
          <v-tabs
            v-model="activeTab"
            color="primary"
          >
            <v-tab>
              <v-card ripple>
                <v-card-title class="text-center">
                  Pending
                </v-card-title>
                <v-card-subtitle>Steam Doc Creation</v-card-subtitle>
              </v-card>
            </v-tab>
            <v-tab>
              <v-card ripple>
                <v-card-title class="text-center">
                  Pending
                </v-card-title>
                <v-card-subtitle>Steam Doc Approval</v-card-subtitle>
              </v-card>
            </v-tab>
            <v-tab>
              <v-card ripple>
                <v-card-title class="text-center">
                  DBS
                </v-card-title>
                <v-card-subtitle>Actions Needed</v-card-subtitle>
              </v-card>
            </v-tab>
            <v-tab>
              <v-card>
                <v-card-title>SAP PE</v-card-title>
                <v-card-subtitle>Actions Needed</v-card-subtitle>
              </v-card>
            </v-tab>
            <v-menu
              bottom
              right
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item>
                  <v-btn
                    v-if="pager === 'pager'"
                    @click="pager = 'virtual'"
                  >
                    <v-list-item-title>Virtual</v-list-item-title>
                  </v-btn>
                  <v-btn
                    v-else
                    color="primary"
                    @click="pager = 'virtual'"
                  >
                    <v-list-item-title>Virtual</v-list-item-title>
                  </v-btn>
                </v-list-item>
                <v-list-item>
                  <v-btn
                    v-if="pager === 'virtual'"
                    @click="pager = 'pager'"
                  >
                    <v-list-item-title>Pager</v-list-item-title>
                  </v-btn>
                  <v-btn
                    v-else
                    color="primary"
                    @click="pager = 'pager'"
                  >
                    <v-list-item-title>Pager</v-list-item-title>
                  </v-btn>
                </v-list-item>
              </v-list>
            </v-menu>
            <v-spacer />
            <!-- Steam Enter Dialog -->
            <steam-enter :selectedrows="selectedRows" />
            <!-- // End Steam Enter Dialog -->
            <!-- Pending Steam Tab -->
            <v-tab-item>
              <pending-steam />
            </v-tab-item>
            <!-- // End Pending Steam Creation Tab -->
            <!-- Pending Approval Tab -->
            <v-tab-item>
              <pending-approval />
            </v-tab-item>
            <!-- // End Pending Approval Tab -->
            <!-- DBS Action Tab -->
            <v-tab-item>
              <pending-dbs />
            </v-tab-item>
            <!-- // End DBS Tab -->
            <!-- SAP PE Tab -->
            <v-tab-item>
              <pending-sap />
            </v-tab-item>
            <!-- // End SAP PE Tab -->
          </v-tabs>
        </v-card>
      </v-container>
    </v-card>
    <toast
      v-if="viewToast"
      :options="toastOptions"
    />
  </section>
</template>

<script>
  import { mapActions, mapState, mapGetters, mapMutations } from 'vuex'
  import PendingSteam from './001_PendingSteam/PendingSteam.vue'
  import PendingApproval from './002_PendingApproval/PendingApproval.vue'
  import PendingDbs from './003_PendingDBS/PendingDBS.vue'
  import PendingSap from './004_PendingSAP/PendingSAP.vue'
  export default {
    name: 'HomeGrid',
    inject: ['theme'],
    components: {
      Toast: () => import('@/components/core/Toast'),
      PendingSteam,
      PendingApproval,
      PendingDbs,
      PendingSap,
      SteamEnter: () => import('./001_PendingSteam/SteamEnter'),
    },

    data () {
      return {
        dialog: false,
        vis: false,
        file: null,
        selectedSheet: null,
        sheetName: null,
        collection: [],
        selectedRows: [],
        columns: null,
        steamNumber: null,
        filterBuilderPopupPosition: {
          of: window,
          at: 'top',
          my: 'top',
          offset: { y: 10 },
        },
        viewToast: false,
        toastOptions: { text: 'Update Success', type: 'success', time: 1000 },
        editButtons: ['edit'],
        showFilterRow: true,
        events: [],
        welcomeMsg: '',
        showSteamButton: false,
        subBuckets: [{ ID: '0', Name: '' }, { ID: '1', Name: 'SAP PE' }, { ID: '2', Name: 'SAP PE Complete' }],
      }
    },
    computed: {
      ...mapState('app', ['selectedRowsData']),
      ...mapState('npi', ['npiConfigData', 'Category', 'Material', 'stack', 'CategoryBucket', 'npiBuckets', 'loading']),
      ...mapGetters('npi', [
        'rootCauseData',
        'rootCauseData',
        'filteredData',
        'token',
      ]),
      InventoryCell () {
        return this.InventoryCell
      },
      pager: {
        get () {
          return this.$store.state.app.pager
        },
        set (value) {
          this.setPager(value)
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
      npiMaster: {
        get () {
          return this.$store.state.npi.npiMaster
        },
        set (value) {
          this.setSelectedChunk(value)
        },
      },
      npiData: {
        get () {
          return this.$store.state.npi.npiData
        },
        set (value) {
          this.setNPIData(value)
        },
      },
      activeTab: {
        get () {
          return this.$store.state.app.activeTab
        },
        set (value) {
          this.setActiveTab(value)
        },
      },
    },

    watch: {
      groupedBy (item) {
        this.options.groupBy = [item]
      },
    },

    methods: {
      ...mapMutations('app', ['setPager', 'setActiveTab']),
      ...mapMutations('npi', ['setgroupedBy', 'setNPIData']),
      ...mapActions('npi', ['getNPIData', 'updateNPI', 'getNPIMaster']),
      onInitialized (e) {
        this.dataGrid = e.component
      },
      onSelectionChanged () {
        this.dataGrid.getSelectedRowsData().then((rowData) => {
          this.collection = rowData
          const data = rowData[0]
          this.showSteamButton = !!data
        })
      },
      getSelectedRowsData (e) {
        this.dataGrid.getSelectedRowsData().then((rowData) => {
          this.selectedRows = rowData
        })
      },
      updateEvent (event) {
        console.log(event)
        if (event.oldData.npiNumber) {
        } else {
          event.oldData.npiNumber = event.oldData.id
        }
        if (event.newData.actionNote) {
        } else {
          event.newData.actionNote = 'Scrap'
        }
        console.log(event.oldData.npiNumber)
        const body = []
        body.push({
          steamUpdate: event.steamUpdate,
          npiMasterID: event.oldData.npiMasterID,
          updatePrams: event.newData,
          oldValues: event.oldData,
          id: event.oldData.npiNumber,
          Cookie: this.token,
        })
        fetch('https://tsp-appserver.na.pg.com/APIs/NPI/update.php', {
          method: 'POST',
          body: JSON.stringify(body[0]),
        })
          .then((response) => {
            if (response.ok) {
              return response.json()
            } else {
              console.log(response)
            }
          })
          .then((response) => {
            console.log(response)
          })
          .finally(() => {
            this.viewToast = true
            setTimeout(() => {
              this.viewToast = false
            }, 300)
          })
          .catch((err) => {
            console.log(err)
          })
      },
      onChange (event) {
        this.file = event.target.files ? event.target.files[0] : null
      },
      addSheet () {
        this.sheets.push({ name: this.sheetName, data: [...this.collection] })
        this.sheetName = null
      },
      peAction (rowData) {
        let item
        if (rowData.peAction === true) {
          item = true
        } else {
          item = false
        }
        return item
      },
    },
  }
</script>
<style>
.dx-overlay-wrapper.dx-datagrid-edit-popup.dx-popup-wrapper.dx-overlay-modal.dx-overlay-shader {
  z-index: 200 !important;
};
</style>
