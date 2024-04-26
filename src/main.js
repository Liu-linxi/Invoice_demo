import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import router from './router'
import 'default-passive-events'

import $util from "./common/utils.js"
Vue.prototype.$util = $util

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
