<template>
  <div>
    <v-dialog
      v-model="dialog"
      persistent
      scrollable
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          x-small
          v-bind="attrs"
          icon
          color="blue darken-1"
          v-on="on"
        >
          <v-icon dense>
            mdi-lead-pencil
          </v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-text>
          <v-container>
            <v-form
              ref="form"
              v-model="valid"
              lazy-validation
              class="compact-form"
            >
              <v-container>
                <v-tabs
                  color="primary"
                >
                  <v-tab>
                    <v-card
                      ripple
                    >
                      <v-card-title class="text-center">
                        NPI Data
                      </v-card-title>
                      <v-card-subtitle>Work Process</v-card-subtitle>
                    </v-card>
                  </v-tab>
                  <v-tab-item scrollable>
                    <v-divider class="mt-5 mb-4" />
                    <v-row>
                      <v-col
                        cols="12"
                        sm="3"
                      >
                        <v-text-field
                          dense
                          :value="cellData.data.material"
                          label="GCAS"
                          disabled
                        />
                      </v-col>
                      <v-col
                        cols="12"
                        sm="3"
                      >
                        <v-text-field
                          dense
                          :value="cellData.data.batchNumber"
                          label="Batch"
                          disabled
                        />
                      </v-col>
                      <v-col
                        cols="12"
                        sm="3"
                      >
                        <v-text-field
                          dense
                          :value="cellData.data.buom"
                          label="Cases"
                          disabled
                        />
                      </v-col>
                      <v-col
                        cols="12"
                        sm="3"
                      >
                        <v-text-field
                          dense
                          :value="cellData.data.stdPallet"
                          label="Pallets"
                          disabled
                        />
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col
                        cols="12"
                        sm="6"
                      >
                        <v-text-field
                          dense
                          :value="cellData.data.materialDescription"
                          label="Description"
                          disabled
                        />
                      </v-col>
                      <v-col
                        cols="12"
                        sm="3"
                      >
                        <v-text-field
                          dense
                          :value="cellData.data.subSector"
                          label="Business Category"
                          disabled
                        />
                      </v-col>
                      <v-col
                        cols="12"
                        sm="3"
                      >
                        <v-text-field
                          dense
                          :value="cellData.data.materialType"
                          label="Material Type"
                          disabled
                        />
                      </v-col>
                    </v-row>
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
                      <v-col
                        cols="12"
                        md="6"
                      >
                        <v-textarea
                          v-model="comments"
                          dense
                          label="Public Notes"
                          counter
                          maxlength="400"
                        />
                      </v-col>
                    </v-row>
                    <v-spacer />
                    <v-row>
                      <v-col
                        cols="12"
                        md="6"
                      >
                        <h1>
                          Work Process
                        </h1>
                      </v-col>
                      <v-col
                        cols="12"
                        md="3"
                      />
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

                    <v-divider class=" mb-5" />
                    <v-row>
                      <v-col
                        cols="12"
                        md="3"
                      >
                        <v-select
                          v-model="donateStatus"
                          dense
                          :items="[{id:null,name:'QA Approved'},{id:'2',name:'Pickup Coordinated'},{id:'3',name:'Pickup Complete'}]"
                          item-text="name"
                          item-value="id"
                          label="Donation Status"
                        />
                      </v-col>

                      <v-col
                        cols="12"
                        md="3"
                      />

                      <v-col
                        cols="12"
                        md="6"
                      >
                        <v-text-field
                          v-model="donateRecipient"
                          dense
                          label="Recipient"
                        />
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col
                        cols="12"
                        md="3"
                      >
                        <v-select
                          v-if="donateStatus !== null"
                          v-model="donatePickup"
                          dense
                          :items="[{id:null,name:'No'},{id:'yes',name:'Yes'}]"
                          item-text="name"
                          item-value="id"
                          label="Pickup Complete"
                        />
                      </v-col>
                      <v-col
                        cols="12"
                        md="3"
                      />
                      <v-col
                        cols="12"
                        md="3"
                      />
                      <v-col
                        cols="12"
                        md="3"
                      />
                    </v-row>
                    <v-row>
                      <v-col
                        cols="12"
                        md="3"
                      />
                      <v-col
                        cols="12"
                        md="3"
                      />
                      <v-col
                        cols="12"
                        md="3"
                      />
                      <v-col
                        cols="12"
                        md="3"
                      />
                    </v-row>
                  </v-tab-item>
                </v-tabs>
              </v-container>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions class="mr-16 pb-6">
          <v-spacer />
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
            @click="updateEvent()"
          >
            Save
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="dialog = false"
          >
            Cancel
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
  import { mdiLeadPencil } from '@mdi/js'
  export default {
    components: {
      Toast: () => import('@/components/core/Toast'),
    },
    props: {
      cellData: {
        type: Object,
        default: () => {},
      },
    },
    data () {
      return {
        toastOptions: { text: 'Update Success', type: 'success', time: 1000 },
        valid: true,
        dialog: false,
        mdiLeadPencil,
        modal: false,
        modal2: false,
        dispositionDeadline: null,
        bucketID: null,
        QANotes: null,
        blockClassVis: false,
        blockClass1: null,
        comments: null,
        legalEntity: null,
        scrapTypeVis: false,
        scrapType: null,
        viewToast: false,
        save: false,
        loading: false,
        reworkProtocolComplete: null,
        subBucketID: null,
        returnVendorContact: null,
        returnRMA: null,
        vendorLot: null,
        returnBOL: null,
        returnPalletQty: null,
        donateStatus: null,
        donatePickup: null,
        donateRecipient: null,
        headers: [
          { text: 'ULID', value: 'ULID' },
          { text: 'Quantity', value: 'CASQTY' },
          { text: 'UOM', value: 'CASQTY_UOM' },
          { text: 'Vendor Lot', value: 'VENDORLOT' },
        ],
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
        if (e === this.cellData.data.bucketID) {
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
        if (this.bucketID !== this.cellData.data.bucketID) {
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
        if (this.bucketID !== this.cellData.data.bucketID) {
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
      if (this.cellData.data.dispositionDeadline) {
        this.dispositionDeadline = this.$moment(this.cellData.data.dispositionDeadline).format('YYYY-MM-DD')
      } else {
        this.dispositionDeadline = this.cellData.data.dispositionDeadline
      }
      this.QANotes = this.cellData.data.QANotes
      this.comments = this.cellData.data.comments
      this.legalEntity = this.cellData.data.legalEntity
      this.bucketID = this.cellData.data.bucketID
      this.scrapType = this.cellData.data.scrapType
      this.blockClass1 = this.cellData.data.blockClass1
      this.subBucketID = this.cellData.data.subBucketID
      this.donateStatus = this.cellData.data.donateStatus
      this.donatePickup = this.cellData.data.donatePickup
      this.donateRecipient = this.cellData.data.donateRecipient
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
      updateEvent () {
        this.loading = true
        const body = []
        if (this.donateStatus === '2') {
          this.subBucketID = 'fpwh'
          this.donatePickup = null
        } else if (this.donateStatus === '3') {
          this.subBucketID = 'pe'
        } else {
          this.subBucketID = null
          this.donatePickup = null
        }
        body.push({
          npiMasterID: this.cellData.data.id,
          updatePrams: {
            dispositionDeadline: this.dispositionDeadline,
            QANotes: this.QANotes,
            comments: this.comments,
            legalEntity: this.legalEntity,
            bucketID: this.bucketID,
            scrapType: this.scrapType,
            blockClass1: this.blockClass1,
            subBucketID: this.subBucketID,
            donateStatus: this.donateStatus,
            donatePickup: this.donatePickup,
            donateRecipient: this.donateRecipient,
          },
          oldValues: this.cellData.data,
          id: this.cellData.data.id,
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
            this.cellData.data.QANotes = this.QANotes
            this.cellData.data.comments = this.comments
            this.cellData.data.bucketID = this.bucketID
            this.cellData.data.scrapType = this.scrapType
            this.cellData.data.blockClass1 = this.blockClass1
            this.cellData.data.dispositionDeadline = this.dispositionDeadline
            this.cellData.data.legalEntity = this.legalEntity
            this.cellData.data.subBucketID = this.subBucketID
            this.cellData.data.donateStatus = this.donateStatus
            this.cellData.data.donatePickup = this.donatePickup
            this.cellData.data.donateRecipient = this.donateRecipient
            this.dialog = false
            this.cellData.component.refresh()
          })
      },
    },
  }
</script>

<style>

</style>
