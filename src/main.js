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

window.axios.interceptors.request.use(function (config) {
  // Do something before request is sent
  // const AUTH_TOKEN = document.getElementsByName("token")["0"].content;
  var session = JSON.parse(localStorage.getItem("session"))
  const AUTH_TOKEN = session.user.access_token

  if(AUTH_TOKEN){
      config.headers.common['Authorization'] = `Bearer ${AUTH_TOKEN}`
  }
  return config;
}, function (error) {
  // Do something with request error
  console.log(error);
  this.$router.replace(this.$route.query.redirect || "/logout");
  return Promise.reject(error.response);
});


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
