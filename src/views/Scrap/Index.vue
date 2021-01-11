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
          <v-tabs color="primary">
            <v-tab>
              <v-card ripple>
                <v-card-title class="text-center">
                  Pending
                </v-card-title>
                <v-card-subtitle>Steam Doc Creation</v-card-subtitle><v-spacer />
              </v-card>
            </v-tab>
            <v-tab>
              <v-card ripple>
                <v-card-title class="text-center">
                  Pending
                </v-card-title>
                <v-card-subtitle>Steam Doc Approval</v-card-subtitle><v-spacer />
              </v-card>
            </v-tab>
            <v-tab>
              <v-card ripple>
                <v-card-title class="text-center">
                  DBS
                </v-card-title>
                <v-card-subtitle>Actions Needed</v-card-subtitle><v-spacer />
              </v-card>
            </v-tab>
            <v-tab>
              <v-card>
                <v-card-title>SAP PE</v-card-title>
                <v-card-subtitle>Actions Needed</v-card-subtitle><v-spacer />
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
            <!-- Pending Steam Tab -->
            <v-tab-item>
              <v-container fluid>
                <v-card
                  v-if="showSteamButton"
                  class="d-flex justify-end"
                >
                  <v-dialog
                    v-model="dialog"
                    persistent
                    max-width="600px"
                    position="absolute"
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
                          steamNumber = null;
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
                                v-model="steamNumber"
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
                </v-card>
                <div>
                  <dx-data-grid
                    id="gridContainer"
                    width="100%"
                    :data-source="npiData"
                    :show-column-lines="false"
                    :show-row-lines="false"
                    :show-borders="false"
                    :row-alternation-enabled="false"
                    key-expr="id"
                    :allow-column-reordering="true"
                    :filter-value="Creation_filterValue"
                    :allow-column-resizing="true"
                    :on-initialized="onInitialized"
                    column-resizing-mode="widget"
                    @exporting="onExporting"
                    @row-updating="updateEvent"
                    @selection-changed="onSelectionChanged"
                  >
                    <dx-paging />
                    <dx-column-fixing :enabled="true" />
                    <dx-pager
                      :show-page-size-selector="true"
                      :allowed-page-sizes="pageSizes"
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
                      style="background: white !important; "
                      :position="filterBuilderPopupPosition"
                    />
                    <dx-header-filter :visible="true" />
                    <dx-scrolling
                      column-rendering-mode="virtual"
                      :mode="pager"
                    />
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
                            :editor-options="bucketOptions"
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
                      data-field="bucketID"
                      :editor-options="bucketOptions"
                      :visible="false"
                    >
                      <dx-lookup
                        :data-source="buckets"
                        value-expr="ID"
                        display-expr="Name"
                      />
                    </dx-column>
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
                      :visible="false"
                      data-field="materialDescription"
                    />
                    <dx-column
                      :visible="false"
                      data-field="rootCause"
                    />
                    <dx-column
                      :visible="false"
                      data-field="hierarchyCategory"
                    />
                    <dx-column
                      :visible="false"
                      data-field="subSector"
                    />
                    <dx-column
                      caption="NPI #"
                      data-field="npiNumber"
                      :visible="false"
                    />
                    <dx-column
                      caption="Days since blocked"
                      data-field="days_pending"
                      cell-template="DaysCell"
                      data-type="number"
                    />
                    <dx-column
                      caption="Days in current tab"
                      data-field="days_in_bucket"
                      cell-template="DaysCell"
                      data-type="number"
                    />
                    <dx-column
                      data-field="dispositionDeadline"
                      data-type="date"
                    />
                    <dx-column
                      data-field="material"
                    />
                    <dx-column
                      data-field="batchNumber"
                      caption="Batch Number"
                    />
                    <dx-column
                      data-field="buom"
                      caption="Buom Stock"
                      :visible="true"
                    />
                    <dx-column
                      data-field="buomName"
                      caption="UOM"
                    />
                    <dx-column
                      data-field="storageLocation"
                      :visible="false"
                    />
                    <dx-column
                      data-field="stdPallet"
                      caption="Pallets Qty"
                      :visible="true"
                    />
                    <dx-column
                      data-field="localStock"
                      :visible="false"
                    />
                    <dx-column
                      data-field="steamNumber"
                      :visible="false"
                    />
                    <dx-column
                      data-field="steamDocCreation"
                      data-type="date"
                      :visible="false"
                    />
                    <dx-column
                      data-field="steamDocApproval"
                      data-type="date"
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
                      data-field="scrapType"
                      :visible="false"
                      :allow-clearing="true"
                    >
                      <dx-lookup
                        :data-source="scrapTypes"
                      />
                    </dx-column>
                    <dx-column
                      :buttons="editButtons"
                      type="buttons"
                      caption="Actions"
                    />
                    <template #DaysCell="{ data: cellData }">
                      <days-cell :cell-data="cellData" />
                    </template>
                  </dx-data-grid>
                </div>
              </v-container>
            </v-tab-item>
            <!-- // End Pending Steam Creation Tab -->
            <!-- Pending Approval Tab -->
            <v-tab-item>
              <v-container fluid>
                <div>
                  <dx-data-grid
                    id="gridContainer"
                    width="100%"
                    :data-source="npiData"
                    :show-column-lines="false"
                    :show-row-lines="false"
                    :show-borders="false"
                    :row-alternation-enabled="false"
                    key-expr="id"
                    :allow-column-reordering="true"
                    :filter-value="Approval_filterValue"
                    :allow-column-resizing="true"
                    column-resizing-mode="widget"
                    @exporting="onExporting"
                    @row-updating="updateEvent"
                  >
                    <dx-paging />
                    <dx-pager
                      :show-page-size-selector="true"
                      :allowed-page-sizes="pageSizes"
                      :show-info="true"
                    />
                    <dx-selection
                      :deferred="false"
                      :show-check-boxes-mode="'onClick'"
                      mode="multiple"
                    />
                    <dx-filter-row :visible="true" />
                    <dx-filter-panel :visible="true" />
                    <dx-filter-builder-popup
                      :position="filterBuilderPopupPosition"
                    />
                    <dx-header-filter :visible="true" />
                    <dx-scrolling :mode="pager" />
                    <dx-column-fixing :enabled="true" />
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
                        :show-title="false"
                        max-width="90%"
                        max-height="90%"
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
                            data-field="storageLocation"
                            :disabled="true"
                          />
                          <dx-item
                            data-field="buom"
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
                          <dx-item data-field="legalEntity" />
                          <dx-item
                            data-field="buomName"
                            :disabled="true"
                          />
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
                            :disabled="true"
                          />
                          <dx-item
                            data-field="rootCauseName"
                            :disabled="true"
                          />

                          <dx-item
                            :col-span="2"
                            :editor-options="{ height: 100 }"
                            data-field="actionNote"
                            editor-type="dxTextArea"
                            :visible="false"
                          />
                          <dx-item
                            :col-span="4"
                            :editor-options="{ height: 100 }"
                            data-field="comments"
                            editor-type="dxTextArea"
                          />
                          <dx-text-area />
                          <dx-item
                            :col-count="4"
                            :col-span="4"
                            item-type="group"
                            caption="Steam Data"
                          >
                            <dx-item data-field="steamNumber" />
                            <dx-item data-field="steamStatus" />
                            <dx-item data-field="steamDocCreation" />
                            <dx-item data-field="steamDocApproval" />
                          </dx-item>
                          <dx-item
                            :col-span="4"
                            :col-count="4"
                            item-type="group"
                            caption="Work Process"
                          >
                            <dx-item
                              data-field="dispositionDeadline"
                              data-type="date"
                            />
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
                          </dx-item>
                        </dx-item>
                      </dx-form>
                    </dx-editing>
                    <dx-column-chooser
                      v-model="columns"
                      :enabled="true"
                    />
                    <dx-column
                      data-field="bucketID"
                      :editor-options="bucketOptions"
                      :visible="false"
                    >
                      <dx-lookup
                        :data-source="buckets"
                        value-expr="ID"
                        display-expr="Name"
                      />
                    </dx-column>
                    <dx-column
                      :visible="false"
                      data-field="materialType"
                    />
                    <dx-column
                      :visible="false"
                      data-field="rootCauseName"
                      caption="Root Cause"
                    />
                    <dx-column
                      :visible="false"
                      data-field="materialDescription"
                    />
                    <dx-column
                      :visible="false"
                      data-field="hierarchyCategory"
                    />
                    <dx-column
                      :visible="false"
                      data-field="subSector"
                    />
                    <dx-column
                      caption="Days since blocked"
                      data-field="days_pending"
                      cell-template="DaysCell"
                      data-type="number"
                    />
                    <dx-column
                      caption="Days in current tab"
                      data-field="days_in_bucket"
                      cell-template="DaysCell"
                      data-type="number"
                    />
                    <dx-column
                      caption="Disposition Days"
                      data-field="days_after_submittion"
                      cell-template="DaysCell"
                      data-type="number"
                    />
                    <dx-column
                      data-field="dispositionDeadline"
                      data-type="date"
                      :visible="false"
                    />
                    <dx-column
                      data-field="material"
                    />
                    <dx-column
                      data-field="batchNumber"
                    />
                    <dx-column
                      data-field="localStock"
                      :visible="true"
                    />
                    <dx-column
                      data-field="storageLocation"
                      :visible="false"
                    />
                    <dx-column
                      data-field="buomName"
                    />
                    <dx-column
                      data-field="buom"
                    />
                    <dx-column
                      data-field="steamNumber"
                      cell-template="steamCellTemplate"
                    />
                    <dx-column
                      data-field="steamNumber"
                      caption="steam#"
                      cell-template="steamCellTemplate"
                      :visible="false"
                    />
                    <dx-column
                      data-field="steamDocCreation"
                      data-type="date"
                    />
                    <dx-column
                      data-field="steamDocApproval"
                      data-type="date"
                    />
                    <dx-column
                      data-field="steamStatus"
                    />
                    <dx-column
                      data-field="inCategoryDateCounter"
                      caption="Days Pending Scrap Action"
                      :visible="false"
                    />
                    <dx-column
                      data-field="legalEntity"
                      caption="Owner"
                      :visible="false"
                    />
                    <dx-column
                      data-field="comments"
                      :visible="true"
                      caption="Public Notes"
                    />
                    <dx-column
                      data-field="initiatedBy"
                      caption="Steam submitted by"
                    />
                    <dx-column
                      data-field="actionNote"
                      :visible="false"
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
                      data-field="scrapForcast"
                      :width="100"
                      caption="Planned Scrap Date"
                      data-type="date"
                      :visible="false"
                    />
                    <dx-column
                      :buttons="editButtons"
                      type="buttons"
                      caption="Actions"
                    />
                    <template #DaysCell="{ data: cellData }">
                      <days-cell :cell-data="cellData" />
                    </template>
                    <template #steamCellTemplate="{ data: cellData }">
                      <steam-cell :cell-data="cellData" />
                    </template>
                  </dx-data-grid>
                </div>
              </v-container>
            </v-tab-item>
            <!-- // End Pending Approval Tab -->
            <!-- DBS Action Tab -->
            <v-tab-item>
              <v-container fluid>
                <div>
                  <dx-data-grid
                    id="gridContainer"
                    width="100%"
                    :data-source="npiData"
                    :show-column-lines="false"
                    :show-row-lines="false"
                    :show-borders="false"
                    :row-alternation-enabled="false"
                    key-expr="id"
                    :allow-column-reordering="true"
                    :filter-value="DBS_filterValue"
                    :allow-column-resizing="true"
                    column-resizing-mode="widget"
                    @exporting="onExporting"
                    @row-updating="updateEvent"
                  >
                    <dx-paging />
                    <dx-pager
                      :show-page-size-selector="true"
                      :allowed-page-sizes="pageSizes"
                      :show-info="true"
                    />
                    <dx-selection
                      :deferred="false"
                      :show-check-boxes-mode="'onClick'"
                      mode="multiple"
                    />
                    <dx-filter-row :visible="true" />
                    <dx-filter-panel :visible="true" />
                    <dx-filter-builder-popup
                      :position="filterBuilderPopupPosition"
                    />
                    <dx-header-filter :visible="true" />
                    <dx-scrolling :mode="pager" />
                    <dx-column-fixing :enabled="true" />
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
                        :show-title="false"
                        max-mwidth="90%"
                        max-height="90%"
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
                        />
                        <dx-item
                          :col-count="4"
                          :col-span="2"
                          item-type="group"
                          caption="NPI Data"
                        >
                          <dx-item
                            data-field="id"
                            :disabled="true"
                          />
                          <dx-item
                            data-field="material"
                            caption="GCAS"
                            :disabled="true"
                          />
                          <dx-item
                            data-field="batchNumber"
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
                            :disabled="true"
                          />
                          <dx-item
                            data-field="materialType"
                            :disabled="true"
                          />
                          <dx-item
                            data-field="legalEntity"
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
                            data-field="subSector"
                            :disabled="true"
                          />
                          <dx-item
                            :col-span="2"
                            :editor-options="{ height: 100 }"
                            :visible="false"
                            data-field="actionNote"
                            editor-type="dxTextArea"
                          />
                          <dx-item
                            :col-count="1"
                            :col-span="4"
                            :editor-options="{ height: 100 }"
                            data-field="comments"
                            editor-type="dxTextArea"
                          />
                          <dx-text-area />
                          <dx-item
                            :col-count="4"
                            :col-span="4"
                            item-type="group"
                            caption="Steam Data"
                          >
                            <dx-item data-field="steamNumber" />
                            <dx-item data-field="steamStatus" />
                            <dx-item data-field="steamDocCreation" />
                            <dx-item data-field="steamDocApproval" />
                          </dx-item>
                          <dx-item
                            :col-span="4"
                            :col-count="4"
                            item-type="group"
                            caption="Work Process"
                            :visible="true"
                          >
                            <dx-item
                              data-field="subBucketID"
                            >
                              <dx-lookup
                                :data-source="subBuckets"
                                value-expr="ID"
                                display-expr="Name"
                              />
                            </dx-item>
                          </dx-item>
                        </dx-item>
                      </dx-form>
                    </dx-editing>
                    <dx-column-chooser
                      v-model="columns"
                      :enabled="true"
                    />
                    <dx-column
                      data-field="id"
                      :visible="false"
                    />
                    <dx-column
                      :visible="false"
                      data-field="materialType"
                    />
                    <dx-column
                      :visible="false"
                      data-field="materialDescription"
                    />
                    <dx-column
                      :visible="false"
                      data-field="rootCauseName"
                      caption="Root Cause"
                    />
                    <dx-column
                      :visible="false"
                      data-field="hierarchyCategory"
                    />
                    <dx-column
                      :visible="false"
                      data-field="subSector"
                    />
                    <dx-column
                      :width="125"
                      data-field="subBucketID"
                      caption="Sub-Bucket"
                      :visible="false"
                    >
                      <dx-lookup
                        :data-source="subBuckets"
                        value-expr="ID"
                        display-expr="Name"
                      />
                    </dx-column>
                    <dx-column
                      caption="Days"
                      data-field="days_after_approval"
                      :fixed="false"
                      cell-template="DaysCell"
                      data-type="number"
                      sort-order="desc"
                    />
                    <dx-column
                      data-field="material"
                    />
                    <dx-column
                      data-field="batchNumber"
                    />
                    <dx-column
                      data-field="storageLocation"
                      :visible="false"
                    />
                    <dx-column
                      data-field="localStock"
                      :visible="true"
                    />
                    <dx-column
                      data-field="buomName"
                      :visible="true"
                    />
                    <dx-column
                      data-field="buom"
                      :visible="true"
                    />
                    <dx-column
                      :allow-grouping="false"
                      data-field="scraped_percent"
                      caption="Scrapped %"
                      data-type="number"
                      format="percent"
                      alignment="center"
                      cell-template="InventoryCell"
                      class="bullet"
                      :visible="false"
                    />
                    <dx-column
                      data-field="junk_total"
                      caption="Scrapped Total"
                      :visible="false"
                    />
                    <dx-column
                      data-field="adjusted_stock"
                      :visible="false"
                    />
                    <dx-column
                      :allow-grouping="false"
                      data-field="remaining_percent"
                      caption="Remaining %"
                      data-type="number"
                      format="percent"
                      alignment="center"
                      cell-template="InventoryDbsCell"
                      class="bullet"
                      :visible="false"
                    />
                    <dx-column
                      data-field="steamDocCreation"
                      caption="Steam Doc Creation"
                      data-type="date"
                      :visible="true"
                    />
                    <dx-column
                      data-field="steamDocApproval"
                      data-type="date"
                      :visible="true"
                    />
                    <dx-column
                      data-field="steamNumber"
                    />
                    <dx-column
                      data-field="steamNumber"
                      caption="steam#"
                      cell-template="steamCellTemplate"
                      :visible="false"
                    />
                    <dx-column
                      data-field="steamStatus"
                      :visible="true"
                    />
                    <dx-column
                      data-field="legalEntity"
                      caption="Owner"
                      :visible="false"
                    />
                    <dx-column
                      data-field="actionNote"
                      :visible="false"
                    />
                    <dx-column
                      data-field="comments"
                      caption="Public Notes"
                      :visible="true"
                    />
                    <dx-column
                      data-field="initiatedBy"
                      caption="Steam submitted by"
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
                      :buttons="editButtons"
                      type="buttons"
                      caption="Actions"
                    />
                    <template #steamCellTemplate="{ data: cellData }">
                      <steam-cell :cell-data="cellData" />
                    </template>
                    <template #DaysCell="{ data: cellData }">
                      <days-cell :cell-data="cellData" />
                    </template>
                    <template #InventoryDbsCell="{ data: cellData }">
                      <inventory-dbs-cell :cell-data="cellData" />
                    </template>
                    <template #InventoryCell="{ data: cellData }">
                      <inventory-cell :cell-data="cellData" />
                    </template>
                  </dx-data-grid>
                </div>
              </v-container>
            </v-tab-item>
            <!-- // End DBS Tab -->
            <!-- SAP PE Tab -->
            <v-tab-item>
              <v-container fluid>
                <div>
                  <dx-data-grid
                    id="gridContainer"
                    width="100%"
                    :data-source="npiData"
                    :show-column-lines="false"
                    :show-row-lines="false"
                    :show-borders="false"
                    :row-alternation-enabled="false"
                    key-expr="id"
                    :allow-column-reordering="true"
                    :filter-value="PE_filterValue"
                    :allow-column-resizing="true"
                    column-resizing-mode="widget"
                    @exporting="onExporting"
                    @row-updating="updateEvent"
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
                      :position="filterBuilderPopupPosition"
                    />
                    <dx-selection
                      :deferred="false"
                      :show-check-boxes-mode="'onClick'"
                      mode="multiple"
                    />
                    <dx-column-fixing :enabled="true" />
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
                        :show-title="false"
                        max-width="80%"
                        max-height="80%"
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
                          <dx-item
                            data-field="id"
                            :disabled="true"
                            :visible="false"
                          />
                          <dx-item
                            data-field="material"
                            caption="GCAS"
                            :disabled="true"
                          />
                          <dx-item
                            data-field="batchNumber"
                            caption="Batch"
                            :disabled="true"
                            :col-span="2"
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
                            :disabled="true"
                          />
                          <dx-item
                            :col-span="2"
                            data-field="materialType"
                            :disabled="true"
                          />
                          <dx-item data-field="legalEntity" />
                          <dx-item
                            data-field="rootCauseName"
                            :visible="false"
                          />
                          <dx-item
                            :col-span="2"
                            data-field="hierarchyCategory"
                            :disabled="true"
                          />
                          <dx-item
                            data-field="subSector"
                            :disabled="true"
                          />
                          <dx-item
                            :col-span="2"
                            :editor-options="{ height: 100 }"
                            :visible="false"
                            data-field="actionNote"
                            editor-type="dxTextArea"
                          />
                          <dx-item
                            :col-span="4"
                            :editor-options="{ height: 100 }"
                            data-field="comments"
                            editor-type="dxTextArea"
                          />
                          <dx-text-area />
                          <dx-item
                            :col-count="4"
                            :col-span="4"
                            item-type="group"
                            caption="Steam Data"
                          >
                            <dx-item data-field="steamNumber" />
                            <dx-item data-field="steamStatus" />
                            <dx-item data-field="steamDocCreation" />
                            <dx-item data-field="steamDocApproval" />
                          </dx-item>
                          <dx-item
                            :col-span="4"
                            :col-count="4"
                            item-type="group"
                            caption="Work Process"
                            :visible="true"
                          >
                            <dx-item
                              data-field="scrapForcast"
                              data-type="date"
                              :visible="false"
                            />
                            <dx-item
                              data-field="subBucketID"
                              :visible="true"
                            >
                              <dx-lookup
                                :data-source="subBuckets"
                                value-expr="ID"
                                display-expr="Name"
                              />
                            </dx-item>
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
                      data-field="materialType"
                    />
                    <dx-column
                      :visible="false"
                      data-field="materialDescription"
                    />
                    <dx-column
                      :visible="false"
                      data-field="rootCause"
                    />
                    <dx-column
                      :visible="false"
                      data-field="hierarchyCategory"
                    />
                    <dx-column
                      :visible="false"
                      data-field="subSector"
                    />
                    <dx-column
                      caption="Days"
                      data-field="days_after_approval"
                      :fixed="false"
                      cell-template="DaysCell"
                      data-type="number"
                      sort-order="desc"
                    />
                    <dx-column
                      data-field="material"
                    />
                    <dx-column
                      data-field="batchNumber"
                      caption="Batch Number"
                    />
                    <dx-column
                      data-field="localStock"
                      :visible="false"
                    />
                    <dx-column
                      data-field="junk_Sloc"
                      caption="Location"
                    />
                    <dx-column
                      data-field="buom"
                      :visible="true"
                    />
                    <dx-column
                      data-field="buomName"
                      :visible="true"
                    />
                    <dx-column
                      data-field="junk_total"
                      caption="Scrapped Total"
                    />
                    <dx-column
                      :allow-grouping="false"
                      data-field="scraped_percent"
                      caption="Scrapped %"
                      data-type="number"
                      format="percent"
                      alignment="center"
                      cell-template="InventoryCell"
                      class="bullet"
                    />
                    <dx-column
                      data-field="adjusted_stock"
                    />
                    <dx-column
                      data-field="steamNumber"
                      caption="Steam #"
                    />
                    <dx-column
                      data-field="steamDocCreation"
                      data-type="date"
                      :visible="false"
                    />
                    <dx-column
                      data-field="steamDocApproval"
                      data-type="date"
                      :visible="false"
                    />
                    <dx-column
                      data-field="steamStatus"
                    />
                    <dx-column
                      data-field="initiatedBy"
                      caption="Steam submitted by"
                    />
                    <dx-column
                      data-field="legalEntity"
                      caption="Owner"
                      :visible="false"
                    />
                    <dx-column
                      data-field="actionNote"
                      :visible="false"
                    />
                    <dx-column
                      data-field="comments"
                      caption="Public Notes"
                      :visible="false"
                    />
                    <dx-column
                      data-field="scrapForcast"
                      caption="Planned Scrap Date"
                      data-type="date"
                      :visible="false"
                    />
                    <dx-column
                      data-field="subBucketID"
                      caption="Sub-Bucket"
                      :visible="false"
                    >
                      <dx-lookup
                        :data-source="subBuckets"
                        value-expr="ID"
                        display-expr="Name"
                      />
                    </dx-column>
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
                      :buttons="editButtons"
                      type="buttons"
                      caption="Actions"
                    />
                    <template #steamCellTemplate="{ data: cellData }">
                      <steam-cell :cell-data="cellData" />
                    </template>
                    <template #InventoryCell="{ data: cellData }">
                      <inventory-cell :cell-data="cellData" />
                    </template>
                    <template #DaysCell="{ data: cellData }">
                      <days-cell :cell-data="cellData" />
                    </template>
                  </dx-data-grid>
                </div>
              </v-container>
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
  } from 'devextreme-vue/data-grid'
  import { exportDataGrid } from 'devextreme/excel_exporter'
  import { DxItem } from 'devextreme-vue/form'
  import { DxTextArea } from 'devextreme-vue/text-area'
  import ExcelJS from 'exceljs'
  import saveAs from 'file-saver'
  import { mapActions, mapState, mapGetters, mapMutations } from 'vuex'
  import XlsxWorkbook from 'vue-xlsx/dist/components/XlsxWorkbook'
  import XlsxSheet from 'vue-xlsx/dist/components/XlsxSheet'
  import XlsxDownload from 'vue-xlsx/dist/components/XlsxDownload'
  import SteamCell from './SteamCell.vue'
  import InventoryCell from '../../components/core/Inventory.vue'
  import InventoryDbsCell from '../../components/core/InventoryDBS.vue'
  import DaysCell from '../../components/core/Days'
  export default {
    name: 'HomeGrid',
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
      DxColumnFixing,
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
      DxLookup,
      SteamCell,
      InventoryDbsCell,
      InventoryCell,
      DaysCell,
      Toast: () => import('@/components/core/Toast'),
    },

    data () {
      return {
        pager: 'pager',
        Create_pager: 'virtual',
        pageSizes: [5, 10, 20, 100],
        scrapTypes: ['', 'Heritage', 'Awesome'],
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
        buckets: [
          { ID: '1', Name: 'Investigate' },
          { ID: '2', Name: 'Scrap' },
          { ID: '3', Name: 'Rework' },
          { ID: '4', Name: 'Donate' },
          { ID: '5', Name: 'Return to Vendor' },
          { ID: '6', Name: 'Release' },
          { ID: '7', Name: 'Unpickable' },
        ],
        bucketOptions: {
          onValueChanged: (e) => {
            // this.bucketID = e.value
            // this.selectedItem.value = e.value
            if (e.value === '2') {
              this.showScrapType = true
            } else {
              this.showScrapType = false
            }
            this.selectedBucketId = e.value
            this.bucketDialog = true
            this.dialogCLose1 = true
          },
        },
      }
    },
    computed: {
      ...mapState('npi', ['loading', 'npiConfigData', 'Category', 'Material', 'stack', 'CategoryBucket', 'npiBuckets']),
      ...mapGetters('npi', [
        'rootCauseData',
        'rootCauseData',
        'filteredData',
        'token',
      ]),
      InventoryCell () {
        return this.InventoryCell
      },
      sheets () { return [{ name: 'Steam Export', data: this.collection }] },
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
      Approval_filterValue () {
        const response = []
        response.push(['steamNumber', '<>', null])
        response.push('and')
        response.push(['steamStatus', 'noneof', ['Approved']])
        // response.push('and')                   //  After all items use the correct work process this can be enabled
        // response.push(['bucketID', '=', '2'])  //  After all items use the correct work process this can be enabled
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
      DBS_filterValue () {
        const response = []
        response.push(['steamStatus', '=', 'Approved'])
        response.push('and')
        response.push(['adjusted_stock', '>', 0])
        response.push('and')
        response.push(['subBucketID', 'noneof', ['1', '2']])

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
      PE_filterValue () {
        const response = []
        response.push(['steamStatus', '=', 'Approved'])
        response.push('and')
        response.push(['junk_total', '>', 0])
        response.push('and')
        response.push(['subBucketID', '<>', '2'])
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
      groupedBy (item) {
        this.options.groupBy = [item]
      },
    },

    methods: {
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
      updateSteamNumbers () {
        console.log(this.selectedRows.length)
        this.selectedRows.forEach((element) => {
          const event = {
            steamUpdate: true,
            newData: { steamNumber: this.steamNumber },
            oldData: element,
          }
          this.updateEvent(event)
        })
        this.getNPIData()
        this.getNPIMaster()
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
        console.log(item)
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
