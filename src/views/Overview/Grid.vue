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
      <v-data-table
        :headers="headers_"
        :items="filteredData"
        :search="search"
        :options="options"
        item-key="id"
        :group-by="groupedBy"
        :expanded="expanded"
        show-group-by
        dense
        class="elevation-10"
        :footer-props="{
          showFirstLastPage: true,
          itemsPerPageOptions: [12,15,30,50,75,100,200,500, 1000, 2000],
        }"
      >
        <template v-slot:item.psMrpController="props">
          {{ props.item.psMrpController.split('_')[0] }}
        </template>
        <template v-slot:item.dispositionDeadline="props">
          <v-edit-dialog
            :return-value.sync="props.item.dispositionDeadline"
            large
            persistent
            @save="save"
            @cancel="cancel"
            @open="open"
            @close="close"
          >
            <div>{{ props.item.dispositionDeadline }}</div>
            <template v-slot:input>
              <div class="mt-4 title">
                Update Disposition Deadline
              </div>
            </template>
            <template v-slot:input>
              <v-text-field
                v-model="props.item.dispositionDeadline"
                :rules="[max25chars]"
                label="Edit"
                single-line
                autofocus
              />
            </template>
          </v-edit-dialog>
        </template>

        <template v-slot:item.actionNote="props">
          <v-edit-dialog
            :return-value.sync="props.item.actionNote"
            large
            persistent
            @save="save(props.item)"
            @cancel="cancel"
            @open="open"
            @close="close"
          >
            <div>{{ props.item.actionNote }}</div>
            <template v-slot:input>
              <div class="mt-4 title">
                Update Action Note
              </div>
            </template>
            <template v-slot:input>
              <v-text-field
                v-model="props.item.actionNote"
                label="Edit"
                single-line
                autofocus
              />
            </template>
          </v-edit-dialog>
        </template>

        <template v-slot:item.blockClass1="props">
          <v-edit-dialog
            :return-value.sync="props.item.blockClass1"
            large
            persistent
            @save="save"
            @cancel="cancel"
            @open="open"
            @close="close"
          >
            <div>{{ getRootCause ( props.item.blockClass1, npiConfigData) }}</div>
            <template v-slot:input>
              <div class="mt-4 title">
                Update Public Notes
              </div>
            </template>
            <template v-slot:input>
              <v-textarea
                v-model="props.item.blockClass1"
                label="Edit"
                auto-grow
                single-line
                autofocus
              />
            </template>
          </v-edit-dialog>
        </template>

        <template v-slot:item.comments="props">
          <v-edit-dialog
            :return-value.sync="props.item.comments"
            large
            persistent
            @save="save"
            @cancel="cancel"
            @open="open"
            @close="close"
          >
            <div>{{ props.item.comments }}</div>
            <template v-slot:input>
              <div class="mt-4 title">
                Update Block Class -1
              </div>
            </template>
            <template v-slot:input>
              <v-textarea
                v-model="props.item.comments"
                label="Edit"
                auto-grow
                single-line
                autofocus
              />
            </template>
          </v-edit-dialog>
        </template>
      </v-data-table>
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
    name: 'HomeGrid',
    inject: ['theme'],

    data () {
      return {
        options: {
          page: 1,
          itemsPerPage: 12,
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
      ...mapActions('npi', ['getNPIData', 'updateNPI']),
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
