<template>
  <v-container
    fluid
  >
    <div
      v-observe-visibility="{
        callback: visibilityChanged,
        throttle,
        intersection: {
          threshold,
        },
      }"
    >
      <dx-data-grid
        id="gridContainer"
        width="100%"
        :data-source="npiData"
        :show-column-lines="false"
        :show-row-lines="false"
        :show-borders="false"
        :row-alternation-enabled="true"
        :focused-row-enabled="false"
        key-expr="id"
        :remote-operations="true"
        :allow-column-reordering="true"
        :filter-value="Creation_filterValue"
        :allow-column-resizing="true"
        :on-initialized="onInitialized"
        :repaint-changes-only="true"
        :highlight-changes="true"
        column-resizing-mode="widget"
        :hover-state-enabled="true"
        :column-hiding-enabled="true"
        :column-auto-width="true"
        @exporting="onExporting"
        @row-updating="updateEvent"
        @selection-changed="selectionChangedEcho"
        @toolbar-preparing="onToolbarPreparing"
      >
        <dx-paging />
        <dx-pager
          :show-page-size-selector="true"
          :allowed-page-sizes="pageSizes"
          :show-info="true"
        />
        <dx-filter-row :visible="true" />
        <dx-filter-panel :visible="true" />
        <dx-filter-builder-popup
          style="background: white !important; "
          :position="filterBuilderPopupPosition"
        />
        <dx-header-filter :visible="true" />
        <dx-column-fixing :enabled="true" />
        <dx-scrolling
          column-rendering-mode="virtual"
          :mode="pager"
        />
        <dx-group-panel :visible="true" />
        <dx-grouping :auto-expand-all="true" />
        <dx-selection
          :allow-select-all="false"
          :deferred="false"
          :show-check-boxes-mode="'onClick'"
          mode="multiple"
        />
        <dx-state-storing
          :enabled="true"
          type="localStorage"
          storage-key="pending-steam"
        />
        <dx-export
          :enabled="true"
          :allow-export-selected-data="true"
        />
        <dx-editing
          :start-edit-action="'dblClick'"
          refresh-mode="repaint"
          mode="batch"
          :allow-updating="true"
        >
          <dx-popup
            :show-title="false"
            max-width="80%"
            max-height="80%"
            align-center
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
                data-field="buomName"
                :disabled="true"
              />
              <dx-item
                data-field="storageLocation"
                :disabled="true"
              />
              <dx-item
                data-field="materialDescription"
                :disabled="true"
              />
              <dx-item
                data-field="materialType"
                :disabled="true"
              />
              <dx-item
                data-field="rootCauseName"
                :disabled="true"
              />
              <dx-item
                data-field="hierarchyCategory"
                :disabled="true"
              />
              <dx-item
                data-field="legalEntity"
                :disabled="true"
              />
              <dx-item
                data-field="subSector"
                :disabled="true"
              />
              <dx-item
                data-field="dispositionDeadline"
                data-type="date"
              />
              <dx-item data-field="steamNumber" />
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
              <dx-item
                data-field="scrapType"
                :allow-clearing="true"
              >
                <dx-lookup
                  :data-source="scrapTypes"
                />
              </dx-item>

              <dx-text-area />
              <dx-item
                data-field="bucketID"
              >
                <dx-lookup
                  :data-source="buckets"
                  value-expr="ID"
                  display-expr="Name"
                />
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
          :allow-editing="false"
        />
        <dx-column
          :visible="false"
          data-field="materialType"
          :allow-editing="false"
        />
        <dx-column
          data-field="hierarchyCategory"
          :visible="false"
          :allow-editing="false"
        />
        <dx-column
          data-field="subSector"
          :visible="false"
          :allow-editing="false"
        />
        <dx-column
          caption="NPI #"
          data-field="npiNumber"
          :visible="false"
          :allow-editing="false"
        />
        <dx-column
          caption="Blocked Date"
          data-field="Created"
          data-type="date"
          :allow-editing="false"
          :width="96"
          :visible="false"
        />
        <dx-column
          caption="Days Blocked"
          data-field="days_pending"
          cell-template="DaysCell"
          data-type="number"
          :allow-editing="false"
          :width="95"
        />
        <dx-column
          caption="Days Pending Execution"
          data-field="days_in_bucket"
          cell-template="DaysCell"
          data-type="number"
          :allow-editing="false"
          :width="95"
        />
        <dx-column
          caption="Days Pending Steam Doc Creation"
          data-field="days_pen_exe"
          cell-template="DaysCell"
          data-type="number"
          :allow-editing="false"
          :width="95"
        />
        <dx-column
          data-field="line"
          caption="Line"
          :visible="false"
          :allow-editing="false"
        />
        <dx-column
          caption="Steam #"
          data-field="steamNumber"
          :visible="false"
        />
        <dx-column
          data-field="steamStatus"
          :visible="false"
        />
        <dx-column
          data-field="processOrder"
          :visible="false"
          :allow-editing="false"
        />
        <dx-column
          data-field="material"
          :allow-editing="false"
        />
        <dx-column
          data-field="batchNumber"
          caption="Batch"
          :allow-editing="false"
        />
        <dx-column
          data-field="materialDescription"
          caption="Description"
          width="244"
          :visible="false"
          :allow-editing="false"
        />
        <dx-column
          data-field="buom"
          :allow-editing="false"
          caption="Buom Stock"
          :visible="true"
        />
        <dx-column
          data-field="buomName"
          caption="UOM"
          :allow-editing="false"
          :visible="true"
        />
        <dx-column
          data-field="storageLocation"
          caption="Loc"
          :visible="false"
          :allow-editing="false"
        />
        <dx-column
          data-field="stdPallet"
          caption="Pallets"
          :visible="true"
          :allow-editing="false"
        />
        <dx-column
          data-field="localStock"
          format="currency"
          caption="Local Stock"
          :visible="true"
          :allow-editing="false"
        />
        <dx-column
          data-field="scrapType"
          :allow-clearing="true"
        >
          <dx-lookup :data-source="scrapTypes" />
        </dx-column>
        <dx-column
          data-field="QANotes"
          caption="QA Notes"
          :visible="false"
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
          :allow-editing="false"
        />
        <dx-column
          data-field="inCategoryDateCounter"
          caption="Pending Scrap Action"
          :visible="false"
          :allow-editing="false"
        />
        <dx-column
          data-field="actionNote"
          :visible="false"
        />
        <dx-column
          data-field="swifferCategory"
          :visible="false"
        />
        <dx-column
          data-field="comments"
          caption="Public notes"
          :visible="true"
          :width="253"
        />
        <dx-column
          data-field="dispositionDeadline"
          data-type="date"
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
        >
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
          cell-template="EditCell"
          caption=""
          :fixed="true"
          :width="50"
          fixed-position="right"
        />
        <template #DaysCell="{ data: cellData }">
          <days-cell :cell-data="cellData" />
        </template>
        <template #EditCell="{data: cellData}">
          <edit-form :cell-data="cellData" />
        </template>
      </dx-data-grid>
    </div>
  </v-container>
</template>

<script>
  import { DxItem } from 'devextreme-vue/form'
  import { DxTextArea } from 'devextreme-vue/text-area'
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
    DxSelection,
    DxPager,
    DxPaging,
    DxLookup,
    DxStateStoring,
  } from 'devextreme-vue/data-grid'
  import DaysCell from '../../../components/core/Days'
  import ExcelJS from 'exceljs'
  import saveAs from 'file-saver'
  import { exportDataGrid } from 'devextreme/excel_exporter'
  import { mapMutations, mapState } from 'vuex'
  export default {
    components: {
      DxItem,
      DxTextArea,
      DaysCell,
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
      DxSelection,
      DxPager,
      DxPaging,
      DxLookup,
      DxStateStoring,
      EditForm: () => import('./EditForm'),
    },
    data () {
      return {
        showSteamButton: false,
        columns: null,
        steamNumber: null,
        collection: [],
        snack: null,
        snackColor: null,
        snackText: null,
        dataGrid: null,
        show: true,
        isVisible: true,
        throttle: 0,
        threshold: 0,
      }
    },
    computed: {
      ...mapState('app', ['buckets', 'scrapTypes']),
      ...mapState('app', ['pageSizes', 'editButtons', 'filterBuilderPopupPosition']),
      ...mapState('npi', ['npiConfigData', 'Category', 'Material', 'stack', 'CategoryBucket', 'npiBuckets', 'loading']),
      ...mapState('npi', ['npiBuckets']),
      activeTab: {
        get () {
          return this.$store.state.app.activeTab
        },
        set (value) {
          this.setActiveTab(value)
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

      selectedRowsData: {
        get () {
          return this.$store.state.app.selectedRowsData
        },
        set (value) {
          this.setSelectedRowsData(value)
        },
      },
      sheets () { return [{ name: 'Steam Export', data: this.collection_ }] },
      pager: {
        get () {
          return this.$store.state.app.pager
        },
        set (value) {
          this.setPager(value)
        },
      },
      dialog: {
        get () {
          return this.$store.state.app.dialog
        },
        set (value) {
          this.setDialog(value)
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
      Creation_filterValue () {
        const response = []
        response.push(['steamNumber', 'anyof', [null]])
        response.push('and')
        response.push(['bucketID', '=', '2'])
        if (this.Category) {
          response.push('and')
          response.push(['hierarchyCategory', 'anyof', [this.Category]])
        }
        if (this.Material) {
          response.push('and')
          response.push(['materialType', 'anyof', [this.Material]])
        }
        if (this.CategoryBucket) {
          response.push('and')
          response.push(['category', 'anyof', [this.CategoryBucket]])
        }
        return response
      },
    },
    methods: {
      ...mapMutations('app', ['setPager', 'setDialog', 'setSelectedRowsData', 'setActiveTab', 'setPendingSteamGrid']),
      visibilityChanged: function (isVisible, entry) {
        this.isVisible = isVisible
        if (isVisible) {
          setTimeout(() => {
            this.dataGrid.refresh()
          }, 400)
        }
      },
      onToolbarPreparing (e) {
        const dataGrid = e.component
        const toolbarItems = e.toolbarOptions.items
        toolbarItems.push({
          widget: 'dxButton',
          options: {
            icon: 'clearformat',
            onClick: function () {
              localStorage.removeItem('pending-steam')
              window.location.reload()
            },
            hint: 'Clear Saved Filter',
          },
          location: 'after',
        })
        toolbarItems.push({
          widget: 'dxButton',
          options: {
            icon: 'refresh',
            onClick: function () {
              dataGrid.refresh()
              dataGrid.repaint()
            },
            hint: 'Reload Table',
          },
          location: 'after',
        })
      },
      getSelectedRowsData (e) {
        this.dataGrid.getSelectedRowsData().then((rowData) => {
          this.selectedRows = rowData
        })
      },
      selectionChangedEcho (e) {
        console.log('selectionChanged', e)
        this.selectedRowsData = e.selectedRowsData
      },
      onInitialized (e) {
        this.dataGrid = e.component
        this.setPendingSteamGrid(e.component)
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

            }
          })
          .then((response) => {
            if (response.response.status === 0) {
              this.viewToast = true
              this.dataGrid.refresh()
              this.dataGrid.clearSelection()
              setTimeout(() => {
                this.viewToast = false
                this.loading = false
              }, 3000)
            } else {
              this.viewToast = false
              this.loading = false
            }
          })
          .catch((err) => {
            console.log(err)
          })
          .finally(() => {
            this.dataGrid.refresh()
            this.dataGrid.clearSelection()
          })
      },
      onSelectionChanged () {
        this.dataGrid.getSelectedRowsData().then((rowData) => {
          this.collection = rowData
          const data = rowData[0]
          this.showSteamButton = !!data
        })
      },
      save (item) {
        console.log(item)
        this.snack = true
        this.snackColor = 'success'
        this.snackText = 'Data saved'
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
              'Scrap.xlsx',
            )
          })
        })
        e.cancel = true
      },
    },
  }
</script>
