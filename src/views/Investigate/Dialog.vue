<template>
  <v-row justify="center">
    <v-dialog
      v-model="bucketDialog"
      persistent
      width="40%"
    >
      <v-card>
        <v-card-title>
          <span class="headline">Change Bucket</span>
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
                  :disabled="true"
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
                v-show="showScrapType"
                cols="12"
                sm="6"
              >
                <v-autocomplete
                  v-model="scrapType"
                  :items="scrapTypes"
                  label="Scrap Type"
                  item-text="Name"
                  item-value="ID"
                  :visible="showScrapType"
                />
              </v-col>
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="blue darken-1"
            text
            @click="closebucketDialog"
          >
            Close
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="updateEvent"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
  import { mapMutations, mapActions } from 'vuex'
  export default {
    props: {
      selectedBucketId: {
        type: String,
        default: '0',
      },
      showScrapType: {
        type: Boolean,

      },
    },
    data () {
      return {
        buckets: [
          { ID: '1', Name: 'Investigate' },
          { ID: '2', Name: 'Scrap' },
          { ID: '3', Name: 'Rework' },
          { ID: '4', Name: 'Donate' },
          { ID: '5', Name: 'Return to Vendor' },
          { ID: '6', Name: 'Release' },
        ],
        scrapTypes: ['', 'Heritage', 'Awesome'],
        buckedId: null,
        blockClass: null,
        scrapType: null,
      }
    },
    computed: {
      npiData: {
        get () {
          return this.$store.state.npi.npiData
        },
        set (value) {
          this.setNPIData(value)
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
      bucketDialog: {
        get () {
          return this.$store.state.app.bucketDialog
        },
        set (value) {
          this.toggleBucketDialog(value)
        },
      },
      dialogCLose1: {
        get () {
          return this.$store.state.app.dialogCLose
        },
        set (value) {
          this.setdialogCLose(value)
        },
      },
      selectedItem: {
        get () {
          return this.$store.state.app.selectedItem
        },
        set (value) {
          this.setSelectedItem(value)
        },
      },
      blockClasses () {
        const arr = []
        this.$store.state.npi.npiConfigData.forEach(element => {
          if (element.dataSource === 'blockClass') {
            arr.push({ id: '' + element.JSON_Data.id + '', name: element.JSON_Data.name })
          }
        })
        return arr
      },
    },

    created () {
      this.buckedId = this.selectedBucketId
      this.blockClass = this.selectedItem.data.blockClass1
      this.scrapType = this.selectedItem.scrapType
    },

    methods: {
      ...mapMutations('app', ['toggleBucketDialog']),
      ...mapMutations('app', ['setSelectedItem']),
      ...mapMutations('app', ['setdialogCLose', 'setViewToast', 'setToastOptions']),
      ...mapMutations('npi', ['setgroupedBy', 'setNPIData']),
      ...mapActions('npi', ['getNPIData', 'updateNPI', 'getNPIMaster']),
      echo () {
        const body = []
        body.push({
          npiMasterID: this.selectedItem.data.id,
          updatePrams: {},
          oldValues: this.selectedItem.data,
          id: this.selectedItem.data.id,
        })
      },
      closebucketDialog () {
        this.bucketDialog = false
        console.log(this.$store.state.app.dialogCLose)
        this.dialogCLose1 = true
        console.log(this.dialogCLose1)
        console.log(this.$store.state.app.dialogCLose)
      },
      updateEvent () {
        const body = []
        body.push({
          npiMasterID: this.selectedItem.data.id,
          updatePrams: { blockClass1: this.blockClass, bucketID: this.buckedId, scrapType: this.scrapType },
          oldValues: this.selectedItem.data,
          id: this.selectedItem.data.id,
          Cookie: this.token,
        })
        fetch('https://tsp-appserver.na.pg.com/APIs/NPI/update.php', {
          method: 'POST',
          body: JSON.stringify(body[0]),
        })
          .then((response) => {
            if (response.ok) {
              // console.log(response)
              // return response.json()
              document.querySelector('[aria-label="Save"]').click()
              setTimeout(() => {
                this.dialogCLose1 = false
              }, 200)
              // return this.$refs.gridContainerTest.instance.refresh()
              return response// .json()
            } else {
              console.log(response)
            }
          })
          .then((response) => {
            this.getNPIData()
          })
          .catch((err) => {
            console.log(err)
          })
          .finally(() => {
            this.viewToast = true
            this.bucketDialog = false
            setTimeout(() => {
              this.viewToast = false
            }, 300)
          })
      },
    },
  }
</script>
