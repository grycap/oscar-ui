import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router/index'
import './registerServiceWorker'
import env from './env.js'
import swal from 'sweetalert2';

// If you don't need the styles, do not connect
//import 'sweetalert2/dist/sweetalert2.min.css';


// Vue.use(VueMaterial)
Vue.config.productionTip = false


window.axios = require('axios');
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
window.Swal = swal;


window.axios.interceptors.request.use(function (config) {
  // Do something before request is sent
  var session = JSON.parse(localStorage.getItem("session"))
  if(session && session['user'] && session['user']['access_token']){
    const AUTH_TOKEN = session.user.access_token
    if(!config["url"]==localStorage.getItem("endpoint")){
      config.headers.common['Authorization'] = `Bearer ${AUTH_TOKEN}`
    } 

  }
  return config;
}, function (error) {
  // Do something with request error
  console.log(error);
  this.$router.replace(this.$route.query.redirect || "/logout");
  return Promise.reject(error.response);
});


window.axios.interceptors.response.use(
  res => {   
    // Do something with response data
    if (res) {
      if (res.status === 401) {
          setTimeout(() => {
            window.Swal.fire({
              title: 'Authentication error!',
              text: 'Your session expired.',
              icon: 'error',
              confirmButtonText: `OK`,
              confirmButtonColor: '#d33',
            }).then(result => {
              if (result.isConfirmed) {
                localStorage.clear();
                window.location = `${location.origin}/login`;
              }
            });
        }, 50);
      } 
    }
    return res;
  },
  error => {
    let status = 0;
    if (error.response) {
      status = error.response.status * 1;
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message);
    }
    if (status === 401) {
      setTimeout(() => {
        window.Swal.fire({
          title: 'Authentication error!',
          text: 'Your session expired.',
          icon: 'error',
          confirmButtonText: `OK`,
          confirmButtonColor: '#d33',
        }).then(result => {
          if (result.isConfirmed) {
            localStorage.clear();
            window.location = `${location.origin}/login`;
                        

        
          }
        });
      }, 50);
    } else{
      // Do something with response error
      return Promise.reject(error);
    }
  },
);


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
