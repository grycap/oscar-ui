<template>
  <v-app id="login" >
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4 lg4>
            <v-card class="elevation-1 pa-3">
              <v-card-text>
                <div class="layout column align-center">
                  <img src="@/assets/logo.png" alt="Vue Material Admin" width="120" height="120">
                </div>


              </v-card-text>
              <v-card-actions>
              </v-card-actions>
              <foot ></foot>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import Services from '../../components/services.js';
import env from '../../env';
import Foot from '@/views/Foot'
import loginEGI from '../../loginEGI.js';

export default {
  components: {
    Foot,
    },
  mixins:[Services],
  data: () => ({
    loading: false,
    loading_egi: false,
    model: {
      endpoint:""
    },
    select: env.ai4eosc_servers[0],    
  }),
  created(){
    localStorage.clear();
    localStorage.setItem("authenticated", false);
    if(env.deploy_container == 'true'){
      this.endpoint = env.api
    }
    this.autoLogin();
    this.login_egi()
  },

  methods: {
    login_egi(){
      if(this.model.endpoint == ""){
        loginEGI.login_egi(this.select)
      }else{
        loginEGI.login_egi(this.model.endpoint)
      }
    },
    autoLogin(){
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const endpoint = urlParams.get('endpoint')
      if(endpoint !== null && !env.ai4eosc_servers.includes(endpoint) ) {
        this.model.endpoint= this.validateURL(endpoint)?endpoint:'https://'+endpoint;
        this.validateURL(this.model.endpoint)
      }else if(env.ai4eosc_servers.includes(endpoint)){
        this.select=endpoint
        this.validateURL(this.select)
      }
    },
    validateURL(link)
    {
        if (link.indexOf("https://") == 0) {
            console.log("The link has http or https.");
            return true;
        }
        else if(link.indexOf("http://") == 0){
            console.log("The link doesn't have http or https.");
            return false;
        }
    }
  }

}
</script>
<style scoped lang="css">
  #login {
    
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    content: "";
    z-index: 0;
  }
</style>
