import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router/index'
import './registerServiceWorker'
import env from './env.js'
// import VueMaterial from 'vue-material'
// import 'vue-material/dist/vue-material.min.css'

// Vue.use(VueMaterial)
Vue.config.productionTip = false

window.axios = require('axios');
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

Vue.mixin({
  data: function(){
    return {
      env:env,
    }
  }
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
