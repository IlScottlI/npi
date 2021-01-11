<template>
  <div>
    <v-btn
      dense
      small
      @click="addToStack(cellData.value)"
    >
      {{ cellData.value }}
    </v-btn>
    <v-progress-linear
      v-if="inStack(cellData.value)"
      color="blue accent-4"
      indeterminate
      rounded
      height="6"
    />
    <v-snackbar
      v-model="snackbar"
      color="blue darken-2"
      :timeout="timeout"
    >
      {{ text }}

      <template v-slot:action="{ attrs }">
        <v-btn
          color="blue"
          text
          v-bind="attrs"
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
<script>

  import { mapState, mapMutations } from 'vuex'
  export default {

    props: {
      cellData: {
        type: Object,
        default: () => {},
      },
    },
    data () {
      return {
        customizeTooltip: function (data) {
          return {
            text: `${parseInt(data.value)}%`,
          }
        },
        snackbar: false,
        text: '',
        timeout: 4000,
        temp: null,
      }
    },
    computed: {
      ...mapState('npi', ['stack']),
      stack: {
        get () {
          return this.$store.state.npi.stack
        },
        set (value) {
          this.setStack(value)
        },
      },
    },
    methods: {
      ...mapMutations('npi', ['setStack']),
      inStack (item) {
        let isHere = false

        if (this.stack.includes(item)) {
          isHere = true
        }
        return isHere
      },
      checkSteam (steamNumber) {
        const removeFromStack = this.removeFromStack
        fetch('https://tsp-appserver.na.pg.com/APIs/NPI/AuditTrail.php?steamId=' + steamNumber)
          .then(
            function (response) {
              if (response.status !== 200) {
                console.log('Looks like there was a problem. Status Code: ' +
                  response.status)
                return
              }
              // Examine the text in the response
              response.json().then(function (data) {
                removeFromStack(steamNumber, data)
              })
            },
          )
          .catch(function (err) {
            console.log('Fetch Error :-S', err)
          })
      },
      addToStack (item) {
        this.checkSteam(item)
        try {
          this.stack.push(item)
        } catch (error) {

        }
      },
      removeFromStack (item, data) {
        console.log(data)
        if (data.steamStatus) {
          this.text = data.steamStatus
        } else {
          this.text = 'Not Found'
        }

        this.snackbar = true
        const arr = this.stack
        try {
          for (var i = 0; i < arr.length; i++) {
            if (arr[i] === item) {
              arr.splice(i, 1)
            }
          }
        } catch (error) {

        }
      },
    },
  }
</script>
