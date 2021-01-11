<template>
  <v-container fluid>
    <v-sheet
      v-if="showsteambutton"
      class="d-flex justify-end"
    >
      <v-dialog
        v-model="dialog"
        persistent
        max-width="600px"
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
            @click="
              getSelectedRowsData();
              steamnumber = null;
            "
          >
            Update Steam #
          </v-btn>
          <section>
            <xlsx-workbook>
              <xlsx-sheet
                v-for="sheet in sheets"
                :key="sheet.name"
                :collection="collection_"
                :sheet-name="sheet.name"
              />
              <xlsx-download :filename="'steamExport'+Date.now()+'.xlsx'">
                <v-btn
                  color="primary"
                  small
                  dark
                  class="primary ma-4"
                >
                  Steam Doc Export
                </v-btn>
              </xlsx-download>
            </xlsx-workbook>
          </section>
        </template>
        <v-card>
          <v-card-title>
            <span class="headline">Steam #</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="steamnumber"
                    label="Steam Number"
                  />
                </v-col>
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
              color="blue darken-1"
              text
              @click="
                dialog = false;
                updateSteamNumbers();
                dataGrid.clearSelection();
              "
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-sheet>
    <div>
      <dx-data-grid
        id="gridContainer"
        width="100%"
        :data-source="npidata"
        :show-column-lines="false"
        :show-row-lines="false"
        :show-borders="false"
        :row-alternation-enabled="false"
        key-expr="id"
        :allow-column-reordering="true"
        :filter-value="filtervalue"
        :allow-column-resizing="true"
        :on-initialized="onInitialized"
        @exporting="onExporting"
        @row-updating="updateEvent"
        @selection-changed="onSelectionChanged"
      >
        <dx-paging />
        <dx-pager
          :show-page-size-selector="true"
          :allowed-page-sizes="pagesizes"
          :show-info="true"
        />
        <dx-selection
          :deferred="true"
          :show-check-boxes-mode="'onClick'"
          mode="multiple"
        />
        <dx-filter-row :visible="true" />
        <dx-filter-panel :visible="true" />
        <dx-filter-builder-popup
          :position="filterbuilderpopupposition"
        />
        <dx-header-filter :visible="true" />
        <dx-scrolling :mode="pager" />
        <dx-group-panel :visible="true" />
        <dx-grouping :auto-expand-all="true" />
        <dx-export
          :enabled="true"
          :allow-export-selected-data="true"
        />
        <dx-editing
          :allow-updating="true"
          :use-icons="true"
          mode="popup"
        >
          <dx-popup
            :show-title="true"
            width="60%"
            height="60%"
            :title="'Details'"
          >
            <dx-position
              my="center"
              at="center"
              of="window"
            />
          </dx-popup>
          <dx-form>
            <dx-item
              :col-count="4"
              :col-span="2"
              item-type="group"
              caption="NPI Data"
            >
              <dx-item data-field="id" />
              <dx-item
                data-field="material"
                caption="GCAS"
              />
              <dx-item
                data-field="batchNumber"
                caption="Batch"
              />
              <dx-item data-field="buom" />
              <dx-item data-field="storageLocation" />
              <dx-item
                :col-span="2"
                data-field="materialDescription"
              />
              <dx-item data-field="materialType" />
              <dx-item data-field="legalEntity" />
              <dx-item data-field="rootCause" />
              <dx-item data-field="hierarchyCategory" />
              <dx-item data-field="subSector" />
              <dx-item
                :col-span="2"
                :editor-options="{ height: 100 }"
                data-field="actionNote"
                editor-type="dxTextArea"
              />
              <dx-item
                :col-span="2"
                :editor-options="{ height: 100 }"
                data-field="comments"
                editor-type="dxTextArea"
              />
              <dx-item data-field="scrapType" />
              <dx-text-area />
            </dx-item>
          </dx-form>
        </dx-editing>
        <dx-column-chooser
          v-model="columns"
          :enabled="true"
        />
        <dx-column
          caption="Hidden"
          :visible="false"
        >
          <dx-column
            :visible="false"
            data-field="id"
            caption="NPI ID"
          />
          <dx-column
            :visable="false"
            data-field="materialType"
          />
          <dx-column
            :visable="false"
            data-field="materialDescription"
          />
          <dx-column
            :visable="false"
            data-field="rootCause"
          />
          <dx-column
            :visable="false"
            data-field="hierarchyCategory"
          />
          <dx-column
            :visable="false"
            data-field="subSector"
          />
        </dx-column>
        <dx-column
          caption="NPI #"
          data-field="npiNumber"
          :visible="false"
        />
        <dx-column
          data-field="dispositionDeadline"
          caption="Disposition Deadline"
          :width="110"
          data-type="date"
        />
        <dx-column
          data-field="material"
          :width="100"
        />
        <dx-column
          data-field="batchNumber"
          caption="Batch Number"
          :width="150"
        />
        <dx-column
          data-field="buom"
          caption="Stock"
          :width="60"
        />
        <dx-column
          data-field="buomName"
          caption=""
          :width="40"
        />
        <dx-column
          data-field="storageLocation"
          caption="Loc"
          :width="50"
          :visible="false"
        />
        <dx-column
          data-field="stdPallet"
          caption="Qty"
          :width="110"
          :visible="true"
        />
        <dx-column
          data-field="scrapType"
          :width="150"
          :visible="true"
        />
        <dx-column
          data-field="pendingDays"
          :width="150"
          :visible="true"
        />

        <dx-column
          data-field="steamnumber"
          caption="Steam #"
          :width="100"
          :visible="false"
        />
        <dx-column
          data-field="steamDocCreation"
          data-type="date"
          :width="100"
          :visible="false"
        />
        <dx-column
          data-field="steamDocApproval"
          data-type="date"
          :width="100"
          :visible="false"
        />
        <dx-column
          data-field="steamStatus"
          :width="100"
          :visible="false"
        />
        <dx-column
          data-field="inCategoryDateCounter"
          caption="Pending Scrap Action"
          :visible="true"
          :width="120"
        />
        <dx-column
          data-field="legalEntity"
          caption="Owner"
          :width="110"
          :visible="true"
        />
        <dx-column
          data-field="actionNote"
          :width="110"
          :visible="false"
        />
        <dx-column
          data-field="comments"
          caption="Public notes"
          :width="110"
          :visible="true"
        />
        <dx-column
          data-field="scrapForcast"
          :width="100"
          caption="Planned Scrap Date"
          data-type="date"
          :visible="false"
        />
        <dx-column
          :buttons="editbuttons"
          type="buttons"
          caption="Actions"
        />
      </dx-data-grid>
    </div>
  </v-container>
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
  } from 'devextreme-vue/data-grid'
  import { DxItem } from 'devextreme-vue/form'
  import { DxTextArea } from 'devextreme-vue/text-area'
  import XlsxWorkbook from 'vue-xlsx/dist/components/XlsxWorkbook'
  import XlsxSheet from 'vue-xlsx/dist/components/XlsxSheet'
  import XlsxDownload from 'vue-xlsx/dist/components/XlsxDownload'
  import ExcelJS from 'exceljs'
  import saveAs from 'file-saver'
  import { exportDataGrid } from 'devextreme/excel_exporter'
  export default {
    name: 'Pending',
    inject: ['theme'],
    components: {
      XlsxWorkbook,
      XlsxSheet,
      XlsxDownload,
      DxDataGrid,
      DxColumn,
      DxTextArea,
      DxExport,
      DxGroupPanel,
      DxGrouping,
      DxScrolling,
      DxColumnChooser,
      DxItem,
      DxEditing,
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
    },
    props: ['showsteambutton', 'npidata', 'filtervalue', 'pagesizes', 'filterbuilderpopupposition', 'pager', 'columns', 'editbuttons', 'dialog', 'steamnumber'],
    data () {
      return {
        collection: [],
      }
    },
    computed: {
      collection_ () {
        const result = []
        try {
          this.collection.forEach(element => {
            result.push({ Category: element.hierarchyCategory, Material_Type: element.materialType, Material: element.material, Material_Description: element.materialDescription, Batch: element.batchNumber, BUOM_Stock: element.buom, Stock_$: element.localStock, Action_Note: element.actionNote, Public_Notes: element.comments, Root_Cause: element.rootCauseName, Stop_Ship_Date: element.stopShipDate_, Batch_Exp_Date: element.batchExpiryDate_, TDCVAL: element.tdcVal, Plant: element.plant })
          })
        } catch (error) {

        }
        return result
      },
      sheets () { return [{ name: 'Steam Export', data: this.collection }] },
    },
    methods: {
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
      updateEvent (event) {
        console.log(event)
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
      },
    },
  }
</script>
