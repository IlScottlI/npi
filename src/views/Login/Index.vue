<template>
  <div>
    <v-container
      fluid
      class="loginOverlay fill-height"
    >
      <v-row
        class="flex"
        align="center"
        justify="center"
      >
        <v-progress-circular
          v-if="loading"
          :size="400"
          color="blue"
          indeterminate
        />
        <v-col
          v-else
          class="elevation-6"
          cols="12"
          sm="4"
        >
          <v-toolbar class="pt-5 primary ">
            <v-toolbar-title class="white--text">
              <h4>Welcome Back</h4>
            </v-toolbar-title>
          </v-toolbar>
          <v-card>
            <v-card-text class="pt-4">
              <div>
                <v-form
                  ref="form"
                  v-model="valid"
                >
                  <v-text-field
                    v-model="username"
                    :rules="userRules"
                    required
                    label="Username"
                    placeholder="Username"
                    outlined
                  />
                  <v-text-field
                    v-model="password"
                    label="Password"
                    placeholder="Password"
                    min="8"
                    :append-icon="e1 ? 'mdi-eye' : 'mdi-eye-off'"
                    :append-icon-cb="() => (e1 = !e1)"
                    :type="e1 ? 'password' : 'text'"
                    :rules="passwordRules"
                    required
                    outlined
                  />
                  <v-row>
                    <v-col class="d-flex justify-end mb-6">
                      <v-btn
                        :class=" { 'primary white--text' : valid, disabled: !valid }"
                        @click="submit"
                      >
                        Login
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-form>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
 <script>
  import { mapMutations, mapState } from 'vuex'
  export default {
    data () {
      return {
        valid: false,
        e1: true,
        password: '',
        passwordRules: [
          (v) => !!v || 'Password is required',
        ],
        userRules: [
          (v) => !!v || 'Username is required',
        ],
        username: '',
        emailRules: [
          (v) => !!v || 'E-mail is required',
          (v) => /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid',
        ],
      }
    },

    computed: {
      ...mapState('npi', ['loading']),
    },

    created () {
      this.setNPIData()
      this.setNPIConfigData()
      this.setNPIBUs()
      this.$cookies.remove('token')
      setTimeout(() => {
        this.setLoading(false)
      }, 300)
    },

    methods: {
      ...mapMutations('npi', ['setNPIBUs', 'setNPIConfigData', 'setNPIData', 'setLoading']),
      submit () {
        this.setLoading(true)
        if (this.$refs.form.validate()) {
          var raw = JSON.stringify({ userName: this.username, userPassword: this.password })

          var requestOptions = {
            method: 'POST',
            body: raw,
            redirect: 'follow',
          }

          fetch('https://tsp-appserver.na.pg.com/APIs/NPI/auth.php', requestOptions)
            .then(response => response.text())
            .then(result => {
              console.log(JSON.parse(result).statusCode)
              this.setLoading(false)
              if (JSON.parse(result).statusCode === 200) {
                this.$cookies.set('token', JSON.parse(result).Cookie, '30MIN')
              }
              this.$router.push('/')
            })
            .catch(error => console.log('error', error))
        }
      },
      clear () {
        this.$refs.form.reset()
      },
    },
  }

 </script>
