import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import VueDragResize from 'vue-drag-resize'

Vue.component('vue-drag-resize', VueDragResize)

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
