import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from '@/routers'

Vue.config.productionTip = false

// global variable
Vue.prototype.$apiUrl = 'http://127.0.0.1:8000/'

new Vue({
    router: router,
    vuetify,
    render: h => h(App)
}).$mount('#app')
