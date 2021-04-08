<template>
  <v-card
    v-if="vis"
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
          @click="onSteamBtn()"
        >
          Update Steam #
        </v-btn>
        <section>
          <xlsx-workbook>
            <xlsx-sheet
              v-for="sheet in sheets"
              :key="sheet.name"
              :collection="collection"
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
                        <th>
                          Batch
                        </th>
                        <th class="text-left">
                          Scrap Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="item in selectedRowsData"
                        :key="item.id"
                      >
                        <td>{{ item.material }}</td>
                        <td>{{ item.batchNumber }}</td>
                        <td>
                          <v-text-field
                            v-model="item.scrapAmountAllowed"
                          />
                        </td>
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
          <v-btn v-if="loading">
            <v-progress-circular
              :size="30"
              :width="7"
              color="success"
              indeterminate
            />
          </v-btn>
          <v-btn
            v-if="!loading"
            color="blue darken-1"
            text
            :disabled="save"
            class="mr-4"
            @click="
              loading = true;
              updateSteamNumbers();
            "
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
  import XlsxDownload from 'vue-xlsx/dist/components/XlsxDownload'
  import XlsxWorkbook from 'vue-xlsx/dist/components/XlsxWorkbook'
  import XlsxSheet from 'vue-xlsx/dist/components/XlsxSheet'
  import { mapState } from 'vuex'
  export default {
    components: {
      XlsxDownload,
      XlsxWorkbook,
      XlsxSheet,
    },
    props: {
      selectedrows: {
        type: Array,
        default: () => [],
      },
    },
    data () {
      return {
        dialog: false,
        steamNumber: null,
        loading: false,
      }
    },
    computed: {
      ...mapState('app', ['selectedRowsData', 'activeTab', 'pendingSteamGrid', 'pendingApprovalGrid']),
      selectedRowsData: {
        get () {
          return this.$store.state.app.selectedRowsData
        },
        set (value) {
          this.setSelectedRowsData(value)
        },
      },
      save () {
        try {
          return this.steamNumber.trim().length < 8
        } catch (error) {
          return true
        }
      },
      vis () { return this.selectedRowsData.length > 0 && this.activeTab === 0 },
      sheets () { return [{ name: 'Steam Export', data: this.collection }] },
      collection () {
        const result = []
        try {
          this.selectedRowsData.forEach(element => {
            result.push({
              Category: element.hierarchyCategory,
              Material_Type: element.materialType,
              Material: element.material,
              Material_Description: element.materialDescription,
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
        } catch (error) {

        }
        return result
      },
    },
    created () {
      this.selectedRowsData.forEach(element => {
        console.log(element)
        element.scrapAmountAllowed = element.buom
      })
    },
    methods: {
      onSteamBtn () {
        this.steamNumber = null
        console.log('Steam Button Clicked!')
        this.selectedRowsData.forEach(element => {
          console.log(element)
          element.scrapAmountAllowed = element.buom
        })
      },
      updateEvent (event) {
        console.log(event.oldData.scrapAmountAllowed)
        this.loading = true
        const body = []
        body.push({
          npiMasterID: event.oldData.id,
          updatePrams: {
            steamNumber: this.steamNumber.trim(),
            scrapAmountAllowed: event.oldData.scrapAmountAllowed,
          },
          oldValues: event.oldData,
          id: event.oldData.id,
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
              this.loading = false
              this.dialog = false
              this.$store.state.app.pendingSteamGrid.refresh()
              this.$store.state.app.pendingSteamGrid.clearSelection()
              this.$store.state.app.pendingSteamGrid.repaint()
              this.$store.state.app.pendingApprovalGrid.refresh()
              this.$store.state.app.pendingApprovalGrid.clearSelection()
              this.$store.state.app.pendingApprovalGrid.repaint()
              window.location.reload()
              setTimeout(() => {
                this.viewToast = false
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
            try {
              this.$store.state.app.pendingSteamGrid.refresh()
              this.$store.state.app.pendingSteamGrid.clearSelection()
              this.$store.state.app.pendingApprovalGrid.refresh()
            } catch (error) {

            }
          })
      },
      updateSteamNumbers () {
        this.selectedRowsData.forEach((element) => {
          const event = {
            oldData: element,
          }
          this.updateEvent(event)
        })
      },
    },
  }
</script>

<style>

</style>
