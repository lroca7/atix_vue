import Vue from 'vue'
import Vuetify from 'vuetify/lib'

Vue.use(Vuetify)

export default new Vuetify({
    theme: {
        themes: {
            light: {
                primary: '#017BFF',
                secondary: '#a7abad',
                accent: '#2196f3',
                error: '#f44336',
                warning: '#ffc107',
                // info: '#009688',
                info: '#00BFA5',
                success: '#4caf50',
                orange: '#FF9800',
                green: '#64DD17',
                gray: '#BDBDBD'
            }
        }
    }
})
