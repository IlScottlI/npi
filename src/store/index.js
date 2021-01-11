import Vue from 'vue'
import Vuex from 'vuex'

// Modules
import app from '@/store/modules/app'
import content from '@/store/modules/content'
import npi from '@/store/modules/npi'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    content,
    npi,
  },
})
