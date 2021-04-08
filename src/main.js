import Vue from 'vue'
import './plugins/base'
import './plugins/meta'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import VueApexCharts from 'vue-apexcharts'
import VueCookies from 'vue-cookies'
import VueMoment from 'vue-moment'
import daterangepicker from 'daterangepicker'
import SheetClip from 'sheetclip'

import XlsxWorkbook from 'vue-xlsx/dist/components/XlsxWorkbook'
import XlsxSheet from 'vue-xlsx/dist/components/XlsxSheet'
import XlsxDownload from 'vue-xlsx/dist/components/XlsxDownload'

// Added direct style import to fix style load error
import 'devextreme/dist/css/dx.common.css'
import 'devextreme/dist/css/dx.material.blue.light.compact.css'
import VueObserveVisibility from 'vue-observe-visibility'

import VueFileAgent from 'vue-file-agent'
import VueFileAgentStyles from 'vue-file-agent/dist/vue-file-agent.css'

import {
  DxDataGrid,
  DxColumn,
  DxHeaderFilter,
  DxFilterRow,
  DxFilterPanel,
  DxFilterBuilderPopup,
  DxScrolling,
} from 'devextreme-vue/data-grid'
Vue.config.productionTip = false
new Vue({
  XlsxWorkbook,
  XlsxSheet,
  XlsxDownload,
  DxDataGrid,
  DxColumn,
  DxHeaderFilter,
  DxFilterRow,
  DxFilterPanel,
  DxFilterBuilderPopup,
  DxScrolling,
  router,
  VueCookies,
  store,
  vuetify,
  VueApexCharts,
  VueMoment,
  daterangepicker,
  SheetClip,
  render: h => h(App),
}).$mount('#app')

Vue.use(VueCookies)
Vue.use(VueMoment)
Vue.use(VueObserveVisibility)

Vue.use(VueFileAgent)
Vue.use(VueFileAgentStyles)
