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
      <b-dialog
        v-if="bucketDialog"
        align-center
        :selected-bucket-id="selectedBucketId"
        :show-scrap-type="showScrapType"
      />
      <!-- <v-card
        v-if="showSteamButton"
        class="d-flex justify-end"
      >
        <v-dialog
          v-model="dialog"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              dark
              v-bind="attrs"
              class="primary ma-4"
              dense
              small
              v-on="on"
              @click="getSelectedRowsData();blockClass = null"
            >
              Assign Bucket
            </v-btn>
          </template>
          <v-sheet>
            <v-card>
              <v-card-title>
                <span class="headline">Assign Bucket</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col
                      cols="12"
                      sm="6"
                    >
                      <v-select
                        v-model="buckedId"
                        :items="buckets"
                        label="Bucket"
                        item-text="Name"
                        item-value="ID"
                      />
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                    >
                      <v-autocomplete
                        v-model="blockClass"
                        :items="blockClasses"
                        label="Block Class *"
                        item-text="name"
                        item-value="id"
                        required
                      />
                    </v-col>
                    <v-col
                      v-show="buckedId === '2'"
                      cols="2"
                    >
                      <v-autocomplete
                        v-model="scrapType"
                        :items="scrapTypes"
                        label="Scrap Type"
                        item-text="Name"
                        item-value="ID"
                      />
                    </v-col>
                    <v-col>
                      <v-textarea
                        v-model="Quality_Notes"
                        name="input-7-1"
                        label="Quality Notes"
                        auto-grow
                      />
                    </v-col>
                    <v-col>
                      <v-textarea
                        v-model="Public_Notes"
                        name="input-7-1"
                        label="Public Notes"
                        auto-grow
                        maxlength="400"
                        counter
                      />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <v-simple-table dense>
                        <template v-slot:default>
                          <thead>
                            <tr>
                              <th class="text-left">
                                GCAS
                              </th>
                              <th class="text-left">
                                Batch
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr
                              v-for="item in collection"
                              :key="item.id"
                            >
                              <td>{{ item.material }}</td>
                              <td>{{ item.batchNumber }}</td>
                            </tr>
                          </tbody>
                        </template>
                      </v-simple-table>
                    </v-col>
                  </v-row>
                </v-container>
                <small>This will apply the steam number to all rows
                </small>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn
                  color="blue darken-1"
                  text
                  @click="dialog = false"
                >
                  Close
                </v-btn>
                <v-btn
                  v-show="buckedId != '1'"
                  color="blue darken-1"
                  text
                  :disabled="blockClass === null"
                  @click="
                    dialog = false;
                    updateBuckets();
                    dataGrid.clearSelection();
                  "
                >
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-sheet>
        </v-dialog>
      </v-card> -->
      <v-container fluid>
        <v-card>
          <v-tabs color="primary">
            <v-tab>
              <v-card ripple>
                <v-card-title class="text-center">
                  Investigate
                </v-card-title>
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
                <v-list-item
                  v-for="(item, i) in ['virtual', 'pager']"
                  :key="i"
                  v-model="pager"
                >
                  <v-btn @click="pager = item">
                    <v-list-item-title>{{ item }}</v-list-item-title>
                  </v-btn>
                </v-list-item>
              </v-list>
            </v-menu>
            <v-tab-item>
              <v-container fluid>
                <div width="100%">
                  <dx-data-grid
                    id="gridContainer"
                    ref="dataGridRefKey"
                    width="100%"
                    overflow="scroll"
                    :data-source="npiData"
                    :show-column-lines="false"
                    :show-row-lines="false"
                    :show-borders="false"
                    :row-alternation-enabled="true"
                    :focused-row-enabled="true"
                    :key-expr="'id'"
                    :allow-column-reordering="true"
                    :filter-value="Investigate_filter"
                    :allow-column-resizing="true"
                    :on-initialized="onInitialized"
                    :repaint-changes-only="true"
                    :highlight-changes="true"
                    :two-way-binding-enabled="true"
                    column-resizing-mode="widget"
                    @exporting="onExporting"
                    @row-updating="updateEvent"
                    @selection-changed="onSelectionChanged"
                    @editing-start="setSelectedItem"
                  >
                    <dx-paging />
                    <dx-pager
                      :show-page-size-selector="true"
                      :allowed-page-sizes="pageSizes"
                      :show-info="true"
                    />
                    <dx-filter-row :visible="true" />
                    <dx-filter-panel :visible="true" />
                    <dx-filter-builder-popup />
                    <dx-header-filter :visible="true" />
                    <dx-scrolling
                      column-rendering-mode="virtual"
                      :mode="pager"
                    />
                    <dx-column-fixing :enabled="true" />
                    <dx-group-panel :visible="true" />
                    <dx-grouping :auto-expand-all="true" />
                    <dx-export
                      :enabled="true"
                      :allow-export-selected-data="true"
                    />
                    <dx-selection
                      :deferred="true"
                      :show-check-boxes-mode="'onClick'"
                      mode="multiple"
                    />
                    <dx-editing
                      :allow-updating="true"
                      :use-icons="true"
                      mode="popup"
                    >
                      <dx-popup
                        :show-title="true"
                        :title="'Details'"
                        max-width="80%"
                        max-height="80%"
                        :visible="this.$store.state.app.dialogCLose"
                        @mouseover="echo"
                      >
                        <dx-position
                          my="center"
                          at="center"
                          of="#form"
                        />
                      </dx-popup>
                      <dx-form>
                        <dx-item
                          :col-count="4"
                          :col-span="2"
                          item-type="group"
                          caption="NPI Data"
                        >
                          <dx-item
                            data-field="material"
                            caption="GCAS"
                            :disabled="true"
                          />
                          <dx-item
                            data-field="batchNumber"
                            caption="Batch"
                            :disabled="true"
                          />
                          <dx-item
                            data-field="buom"
                            :disabled="true"
                          />
                          <dx-item
                            data-field="storageLocation"
                            :disabled="true"
                          />
                          <dx-item
                            :col-span="2"
                            data-field="materialDescription"
                            caption="Description"
                            :disabled="true"
                          />
                          <dx-item
                            data-field="materialType"
                            :disabled="true"
                          />
                          <dx-item
                            data-field="processOrder"
                            :disabled="true"
                          />
                          <dx-item data-field="steamNumber" />
                          <dx-item
                            data-field="hierarchyCategory"
                            :disabled="true"
                          />
                          <dx-item
                            data-field="subSector"
                            :disabled="true"
                          />
                          <dx-item
                            data-field="dispositionDeadline"
                            :col-span="2"
                            :disabled="false"
                          />
                          <dx-item
                            :col-span="2"
                            :editor-options="{ height: 100 }"
                            :visible="false"
                            data-field="actionNote"
                            editor-type="dxTextArea"
                          />
                          <dx-item
                            :col-span="2"
                            :editor-options="{ height: 100 }"
                            data-field="comments"
                            editor-type="dxTextArea"
                          />

                          <dx-item data-field="legalEntity" />
                          <dx-item
                            data-field="bucketID"
                            :editor-options="bucketOptions"
                          >
                            <dx-lookup
                              :data-source="buckets"
                              value-expr="ID"
                              display-expr="Name"
                            />
                          </dx-item>
                          <dx-item
                            :col-span="4"
                            :editor-options="{ height: 100 }"
                            data-field="QANotes"
                            editor-type="dxTextArea"
                          >
                            <dx-text-area />
                          </dx-item>
                        </dx-item>
                      </dx-form>
                    </dx-editing>
                    <dx-column-chooser
                      v-model="columns"
                      :enabled="true"
                    />
                    <dx-column
                      :visible="false"
                      data-field="id"
                      caption="NPI ID"
                    />
                    <dx-column
                      :visible="false"
                      data-field="materialType"
                    />
                    <dx-column
                      data-field="hierarchyCategory"
                      :visible="false"
                    />
                    <dx-column
                      data-field="subSector"
                      :visible="false"
                    />
                    <dx-column
                      caption="NPI #"
                      data-field="npiNumber"
                      :visible="false"
                    />
                    <dx-column
                      caption="Steam Number"
                      data-field="steamNumber"
                      :visible="false"
                    />
                    <dx-column
                      caption="Blocked Date"
                      data-field="Created"
                      data-type="date"
                    />
                    <dx-column
                      caption="Counter"
                      data-field="days_pending"
                      cell-template="DaysCell"
                      data-type="number"
                      sort-order="desc"
                    />
                    <dx-column
                      data-field="line"
                      caption="Line"
                      :visible="false"
                    />

                    <dx-column
                      data-field="processOrder"
                      :visible="false"
                    />
                    <dx-column
                      data-field="material"
                    />
                    <dx-column
                      data-field="materialDescription"
                      caption="Description"
                    />
                    <dx-column
                      data-field="batchNumber"
                      caption="Batch"
                    />
                    <dx-column
                      data-field="buom"
                    />
                    <dx-column
                      data-field="buomName"
                    />
                    <dx-column
                      data-field="storageLocation"
                      caption="Loc"
                      :visible="false"
                    />
                    <dx-column
                      data-field="stdPallet"
                      caption="pallet"
                      :visible="true"
                    />
                    <dx-column
                      data-field="localStock"
                      format="currency"
                      caption="Cost"
                      :visible="true"
                    />
                    <dx-column
                      data-field="QANotes"
                      caption="QA Notes"
                      :visible="true"
                    />

                    <dx-column
                      data-field="blockClassName"
                      caption="Block Class"
                      :visible="false"
                    />
                    <dx-column
                      :visible="false"
                      data-field="blockClass1"
                    >
                      <dx-lookup
                        :data-source="blockClasses"
                        value-expr="id"
                        display-expr="name"
                      />
                    </dx-column>
                    <dx-column
                      data-field="nextAction"
                      caption="Next Action"
                      :visible="false"
                    />
                    <dx-column
                      data-field="steamStatus"
                      :visible="false"
                    />
                    <dx-column
                      data-field="inCategoryDateCounter"
                      caption="Pending Scrap Action"
                      :visible="false"
                    />
                    <dx-column
                      data-field="actionNote"
                      :visible="false"
                    />
                    <dx-column
                      data-field="comments"
                      caption="Public notes"
                      :visible="true"
                    />
                    <dx-column
                      data-field="legalEntity"
                      caption="Owner"
                      :visible="true"
                    />
                    <dx-column
                      data-field="category"
                      :visible="false"
                    >
                      <dx-lookup
                        :data-source="npiBuckets"
                        value-expr="id"
                        display-expr="bucket"
                      />
                    </dx-column>
                    <dx-column
                      data-field="dispositionDeadline"
                      data-type="date"
                      :visible="false"
                    />
                    <dx-column
                      :buttons="editButtons"
                      type="buttons"
                      caption="Actions"
                    />
                    <dx-column
                      data-field="bucketID"
                      caption="Bucket"
                      :visible="false"
                    >
                      <dx-lookup
                        :data-source="buckets"
                        value-expr="ID"
                        display-expr="Name"
                      />
                    </dx-column>
                    <dx-column
                      data-field="scrapType"
                      :visible="false"
                      :allow-clearing="true"
                    >
                      <dx-lookup :data-source="scrapTypes" />
                    </dx-column>
                    <template #DaysCell="{ data: cellData }">
                      <days-cell :cell-data="cellData" />
                    </template>
                  </dx-data-grid>
                </div>
              </v-container>
            </v-tab-item>
          </v-tabs>
        </v-card>
        <v-card>
          <toast
            v-if="viewToast"
            :options="toastOptions"
          />
        </v-card>
      </v-container>
    </v-card>
  </section>
</template>

<script>
  import {
    DxDataGrid,
    DxColumn,
    DxExport,
    DxGroupPanel,
    DxScrolling,
    DxGrouping,
    DxEditing,
    DxColumnChooser,
    DxColumnFixing,
    DxPopup,
    DxPosition,
    DxForm,
    DxHeaderFilter,
    DxFilterRow,
    DxFilterPanel,
    DxFilterBuilderPopup,
    DxPager,
    DxSelection,
    DxPaging,
    DxLookup,
  } from 'devextreme-vue/data-grid'
  import { exportDataGrid } from 'devextreme/excel_exporter'
  import { DxItem } from 'devextreme-vue/form'
  import { DxTextArea } from 'devextreme-vue/text-area'
  import ExcelJS from 'exceljs'
  import saveAs from 'file-saver'
  import { mapActions, mapState, mapGetters, mapMutations } from 'vuex'
  import DaysCell from '../../components/core/Days'

  export default {
    name: 'HomeGrid',
    inject: ['theme'],
    components: {
      DxDataGrid,
      DxColumn,
      DxTextArea,
      DxExport,
      DxGroupPanel,
      DxGrouping,
      DxScrolling,
      DxColumnChooser,
      DxColumnFixing,
      DxItem,
      DxEditing,
      DxPopup,
      DxPosition,
      DxForm,
      DxHeaderFilter,
      DxFilterRow,
      DxSelection,
      DxFilterPanel,
      DxFilterBuilderPopup,
      DxPager,
      DxPaging,
      DxLookup,
      DaysCell,
      Toast: () => import('@/components/core/Toast'),
      BDialog: () => import('./Dialog'),
    },

    data () {
      return {
        Quality_Notes: null,
        Public_Notes: null,
        showScrapType: false,
        selectedBucketId: '0',
        isScrapTypeVisible: false,
        bucketOptions: {
          onValueChanged: (e) => {
            if (e.value === '2') {
              this.showScrapType = true
            } else {
              this.showScrapType = false
            }
            this.selectedBucketId = e.value
            // console.log(e)
            this.bucketDialog = true
            this.dialogCLose1 = true
          },
        },
        selected: null,
        editForm: false,
        buckets: [
          { ID: '1', Name: 'Investigate' },
          { ID: '2', Name: 'Scrap' },
          { ID: '3', Name: 'Rework' },
          { ID: '4', Name: 'Donate' },
          { ID: '5', Name: 'Return to Vendor' },
          { ID: '6', Name: 'Release' },
          { ID: '7', Name: 'Unpickable' },
        ],
        scrapTypes: ['', 'Heritage', 'Awesome'],
        pager: 'pager',
        Create_pager: 'virtual',
        pageSizes: [5, 10, 20, 100],
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
        editButtons: ['edit'],
        showFilterRow: true,
        events: [],
        welcomeMsg: '',
        showSteamButton: false,
        dataGridRefKey: 'dataGrid',
        buckedId: '1',
        blockClass: null,
        scrapType: null,
      }
    },
    computed: {
      ...mapState('npi', [
        'loading',
        'npiConfigData',
        'Category',
        'Material',
        'Bucket',
        'npiBuckets',
        'viewToast',
      ]),
      ...mapGetters('npi', [
        'rootCauseData',
        'rootCauseData',
        'filteredData',
        'token',
      ]),
      selectedItem: {
        get () {
          return this.$store.state.app.selectedItem
        },
        set (value) {
          this.setSelectedItem(value)
          this.dialogCLose1 = null
        },
      },
      blockClasses () {
        const arr = []
        this.$store.state.npi.npiConfigData.forEach((element) => {
          if (element.dataSource === 'blockClass') {
            arr.push({
              id: '' + element.JSON_Data.id + '',
              name: element.JSON_Data.name,
            })
          }
        })
        return arr
      },
      bucketDialog: {
        get () {
          return this.$store.state.app.bucketDialog
        },
        set (value) {
          this.toggleBucketDialog(value)
        },
      },
      viewToast: {
        get () {
          return this.$store.state.app.viewToast
        },
        set (value) {
          this.setViewToast(value)
        },
      },
      toastOptions: {
        get () {
          return this.$store.state.app.toastOptions
        },
        set (value) {
          this.setToastOptions(value)
        },
      },
      dialogCLose1: {
        get () {
          return this.$store.state.app.dialogCLose
        },
        set (value) {
          this.setdialogCLose(value)
          this.dataGrid.refresh()
        },
      },
      sheets () {
        return [{ name: 'Steam Export', data: this.collection }]
      },
      collection_ () {
        const result = []
        try {
          this.collection.forEach((element) => {
            result.push({
              Category: element.hierarchyCategory,
              Material_Type: element.materialType,
              Material: element.material,
              Batch: element.batchNumber,
              BUOM_Stock: element.buom,
              Stock_$: element.localStock,
              Action_Note: element.actionNote,
              Public_Notes: element.comments,
              Root_Cause: element.rootCauseName,
              Stop_Ship_Date: element.stopShipDate_,
              Batch_Exp_Date: element.batchExpiryDate_,
              TDCVAL: element.tdcVal,
              Plant: element.plant,
            })
          })
        } catch (error) {}
        return result
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
      CategoryBucket: {
        get () {
          return this.$store.state.npi.CategoryBucket
        },
        set (value) {
          this.setBucket(value)
          this.setAction(null)
        },
      },
      Investigate_filter () {
        const response = []
        response.push(['bucketID', '=', '1']) // Base Filter
        // IF Category Filter is applied
        if (this.Category) {
          response.push('and')
          response.push(['hierarchyCategory', 'anyof', [this.Category]])
        }
        // IF MATERIAL Filter is applied
        if (this.Material) {
          response.push('and')
          response.push(['materialType', 'anyof', [this.Material]])
        }
        // IF MATERIAL Filter is applied
        if (this.CategoryBucket) {
          response.push('and')
          response.push(['category', 'anyof', [this.CategoryBucket]])
        }
        return response
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
    },

    watch: {
      showScrapType (item) {
        if (this.buckedId === '2') {
          this.showScrapType = true
        } else {
          this.showScrapType = false
        }
      },
      groupedBy (item) {
        this.options.groupBy = [item]
      },
      bucketDialog (bucketDialog) {
        if (bucketDialog !== true) {
          this.selected = null
          // this.dialogCLose1 = false
        }
      },
    },

    methods: {
      ...mapMutations('npi', ['setgroupedBy', 'setNPIData']),
      ...mapMutations('app', ['toggleBucketDialog', 'setSelectedItem', 'setdialogCLose', 'setViewToast', 'setToastOptions']),
      ...mapActions('npi', ['getNPIData', 'updateNPI', 'getNPIMaster']),
      checkScrap (e) {
        console.log(e)
      },
      echo (e) {
        console.log(e)
      },
      refreshDataGrid () {
        this.dataGrid.refresh()
          .then(function () {
            // ...
          })
          .catch(function (error) {
            console.log(error)
          })
      },
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
      updateBuckets () {
        this.selectedRows.forEach((element) => {
          const event = {
            newData: {
              bucketID: this.buckedId,
              QANotes: this.Quality_Notes,
              comments: this.Public_Notes,
            },
            oldData: element,
          }
          this.updateEvent(event)
        })
        this.getNPIData()
      },
      getSelectedRowsData (e) {
        this.dataGrid.getSelectedRowsData().then((rowData) => {
          this.selectedRows = rowData
        })
      },
      updateEvent (event) {
        // console.log(event)
        if (event.oldData.npiNumber) {
        } else {
          event.oldData.npiNumber = event.oldData.id
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
          .catch((err) => {
            console.log(err)
          })
          .finally(() => {
            this.viewToast = true
            setTimeout(() => {
              this.viewToast = false
            }, 300)
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
      onExporting (e) {
        const workbook = new ExcelJS.Workbook()
        const worksheet = workbook.addWorksheet('NPI Tool')
        exportDataGrid({
          component: e.component,
          worksheet: worksheet,
          autoFilterEnabled: false,
        }).then(function () {
          // https://github.com/exceljs/exceljs#writing-xlsx
          workbook.xlsx.writeBuffer().then(function (buffer) {
            saveAs(
              new Blob([buffer], { type: 'application/octet-stream' }),
              'Investigate.xlsx',
            )
          })
        })
        e.cancel = true
      },
      getRootCause (item, configData) {
        let response = item
        try {
          configData.forEach((element) => {
            if (item === element.JSON_Data.id) {
              response = element.JSON_Data.name
            }
          })
        } catch (error) {}

        return response
      },
      save (item) {
        this.updateNPI(item)
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

<style>
.dx-overlay-wrapper.dx-datagrid-edit-popup.dx-popup-wrapper.dx-overlay-modal.dx-overlay-shader {
  z-index: 200 !important;
};

</style>
