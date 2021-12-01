import Vue from 'vue'
import App from './App.vue'

import firstFunction from './data_2'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')

firstFunction()