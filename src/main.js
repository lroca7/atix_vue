import Vue from 'vue'
import App from '@/App.vue'
import vuetify from './plugins/vuetify'
import router from '@/routers'
import { dollarFilter, percentFilter, formatDate } from '@/filters'

import EventBus from '@/plugins/event-bus'
import "@/plugins/vuetify-money.js";


import VueNotifications from 'vue-notifications'
// import miniToastr from 'mini-toastr'

import 'jquery'
import toastr from 'toastr'// https://github.com/CodeSeven/toastr
import 'toastr/build/toastr.min.css'

Vue.use(EventBus)

Vue.filter('money', dollarFilter)
Vue.filter('percent', percentFilter)
Vue.filter('formatDate', formatDate)

Vue.config.productionTip = false

// global variable
Vue.prototype.$apiUrl = 'http://127.0.0.1:8000/'
// Vue.prototype.$apiUrl = 'http://35.188.116.1:8000/'
// Vue.prototype.$apiUrl = process.env.VUE_URL_SERVER


// miniToastr.init()

// function toast ({title, message, type, timeout, cb}) {
//   return miniToastr[type](message, title, timeout, cb)
// }

// const options = {
//   success: toast,
//   error: toast,
//   info: toast,
//   warn: toast
// }

// Vue.use(VueNotifications, options)



function toast ({title, message, type, timeout }) {
  if (type === VueNotifications.types.warn) type = 'warning'
  if (type === VueNotifications.types.error) title = 'Error'
  return toastr[type](message, title, {timeOut: timeout})
}

const options = {
  success: toast,
  error: toast,
  info: toast,
  warn: toast
}

Vue.use(VueNotifications, options)

new Vue({
  router: router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
