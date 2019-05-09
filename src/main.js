import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import VueDragResize from 'vue-drag-resize'
import store from './store'

Vue.component('vue-drag-resize', VueDragResize)

localStorage.debug = '*##'

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
