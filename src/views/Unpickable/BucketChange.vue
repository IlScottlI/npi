<template>
  <div>
    <v-dialog
      v-model="dialog"
      persistent
    >
      <template v-slot:activator="{ on, attrs }">
        <v-row class="d-flex justify-end mt-3 mr-6">
          <v-btn
            v-if="selectedRows.length > 1"
            small
            v-bind="attrs"
            v-on="on"
          >
            Bulk Change
          </v-btn>
        </v-row>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">Bulk Change</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form
              ref="form"
              v-model="valid"
              lazy-validation
            >
              <v-container>
                <v-row>
                  <v-col
                    cols="12"
                    md="9"
                  >
                    <h1>
                      Work Process
                    </h1>
                  </v-col>
                </v-row>

                <v-divider class=" mb-5" />
                <v-row>
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-textarea
                      v-model="QANotes"
                      dense
                      label="Quality Notes"
                    />
                  </v-col>
                  <v-spacer />
                  <v-col
                    cols="12"
                    md="3"
                  >
                    <v-text-field
                      v-model="legalEntity"
                      dense
                      label="Owner"
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col
                    cols="12"
                    md="3"
                  >
                    <v-select
                      v-model="bucketID"
                      dense
                      :items="buckets"
                      item-text="Name"
                      item-value="ID"
                      label="Bucket"
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    md="3"
                  >
                    <v-select
                      v-if="scrapTypeVis"
                      v-model="scrapType"
                      dense
                      :items="scrapTypes"
                      label="Scrap Type"
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    md="3"
                  />
                  <v-col
                    cols="12"
                    md="3"
                  >
                    <v-menu
                      v-model="modal"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="dispositionDeadline"
                          label="Disposition Deadline"
                          prepend-icon="mdi-calendar"
                          clearable
                          v-bind="attrs"
                          v-on="on"
                        />
                      </template>
                      <v-date-picker
                        v-model="dispositionDeadline"
                        @input="modal = false"
                      />
                    </v-menu>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col
                    cols="12"
                    md="3"
                  >
                    <v-select
                      v-if="blockClassVis"
                      v-model="blockClass1"
                      dense
                      :items="blockClasses"
                      item-text="name"
                      item-value="id"
                      label="Block Class"
                      required
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    md="3"
                  />
                </v-row>
              </v-container>
            </v-form>
          </v-container>
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
            :disabled="save"
            class="mr-4"
            @click="handleUpdate()"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <toast
      v-if="viewToast"
      :options="toastOptions"
    />
  </div>
</template>

<script>
  import { mapMutations, mapState } from 'vuex'
  export default {
    components: {
      Toast: () => import('@/components/core/Toast'),
    },
    props: {
      selectedRows: {
        type: Array,
        default: () => [],
      },
    },
    data () {
      return {
        toastOptions: { text: 'Update Success', type: 'success', time: 1000 },
        valid: true,
        dialog: false,
        modal: false,
        bucketID: '1',
        QANotes: null,
        dispositionDeadline: null,
        blockClassVis: false,
        blockClass1: null,
        legalEntity: null,
        scrapTypeVis: false,
        scrapType: null,
        viewToast: false,
        save: true,
      }
    },
    computed: {
      ...mapState('app', ['buckets', 'scrapTypes', 'oldValues']),

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
    },
    watch: {
      bucketID (e) {
        this.bucketID = `${e}`
        if (e === '1') {
          this.blockClassVis = false
        } else {
          this.blockClassVis = true
        }
        if (e === '2') {
          this.scrapTypeVis = true
        } else {
          this.scrapTypeVis = false
        }
      },
      blockClassVis (blockClassVis) {
        if (this.blockClassVis) {
          if (this.blockClass1) {
            this.save = false
          } else {
            this.save = true
          }
        }
      },
      blockClass1 (blockClass1) {
        if (this.bucketID !== '1') {
          if (blockClass1) {
            if (this.bucketID === '2') {
              if (this.scrapType) {
                this.save = false
              } else {
                this.save = true
              }
            } else {
              this.save = false
            }
          } else {
            this.save = true
          }
        }
      },
      scrapType (scrapType) {
        if (this.bucketID !== '1') {
          if (scrapType) {
            if (this.bucketID === '2') {
              if (this.blockClass1) {
                this.save = false
              } else {
                this.save = true
              }
            } else {
              this.save = true
            }
          }
        }
      },
    },
    created () {

    },
    methods: {
      ...mapMutations('app', ['setDialog']),
      validate () {
        this.$refs.form.validate()
      },
      reset () {
        this.$refs.form.reset()
      },
      resetValidation () {
        this.$refs.form.resetValidation()
      },
      handleUpdate () {
        this.selectedRows.forEach((e) => {
          this.updateEvent(e.id, e)
        })
      },
      updateEvent ($id, oldValues) {
        const body = []
        body.push({
          npiMasterID: $id,
          updatePrams: {
            dispositionDeadline: this.dispositionDeadline,
            QANotes: this.QANotes,
            legalEntity: this.legalEntity,
            bucketID: this.bucketID,
            scrapType: this.scrapType,
            blockClass1: this.blockClass1,
          },
          oldValues: oldValues,
          id: $id,
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
            this.dialog = false
            this.viewToast = true
            this.cellData.component.refresh()
            setTimeout(() => {
              this.viewToast = false
            }, 300)
          })
      },
    },
  }
</script>
