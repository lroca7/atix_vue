import Vue from 'vue'
import App from '@/App.vue'
import vuetify from './plugins/vuetify'
import router from '@/routers'
import { dollarFilter, percentFilter } from '@/filters'

import EventBus from '@/plugins/event-bus'



Vue.use(EventBus)

Vue.filter('money', dollarFilter)
Vue.filter('percent', percentFilter)

Vue.config.productionTip = false

// global variable
Vue.prototype.$apiUrl = 'http://127.0.0.1:8000/'
//Vue.prototype.$apiUrl = 'http://35.188.116.1:8000/'

new Vue({
    router: router,
    vuetify,
    render: h => h(App)
}).$mount('#app')
