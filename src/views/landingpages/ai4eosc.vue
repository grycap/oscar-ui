<template>
  <v-app id="login" class="light-blue">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4 lg4>
            <v-card class="elevation-1 pa-3">
              <v-card-text>
                <div class="layout column align-center">
                  <img src="@/assets/logo.png" alt="Vue Material Admin" width="120" height="120">
                  <img src="https://ai4eosc.eu/wp-content/uploads/sites/10/2022/09/horizontal-transparent.png" alt="Vue Material Admin" width="248" height="88">
                </div>

                <v-form v-if= "env.deploy_container == 'false'" >
                  <v-select 
                    v-model="select"
                    :items="env.ai4eosc_servers"
                    label="Select a server:"
                  ></v-select>
                  <v-text-field  name="password" label="Insert other server endpoint" id="password" type="text"
                                        v-model="model.endpoint" :hide-details=true></v-text-field>

                <v-divider v-if= "env.deploy_container == 'false'" class='mt-5 mb-5'></v-divider>
                
                  <div   class="text-center">
                    <v-btn color="indigo" dark @click.native="login_egi()" :loading="loading_egi">EGI Check-in</v-btn>
                  </div>
                </v-form>
                <div v-if= "env.deploy_container == 'true'" class="text-center">
                  <h1>Sorry this options is not available in a container</h1>
                  <div   class="text-center">
                    <v-btn color="indigo" dark @click.native="use_ui()" :loading="loading_egi">ai4eosc oscar ui</v-btn>
                  </div>
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
  },

  methods: {
    login_egi(){
      if(this.model.endpoint == ""){
        loginEGI.login_egi(this.select)
      }else{
        loginEGI.login_egi(this.model.endpoint)
      }
    },
    use_ui(){
      if(this.model.endpoint == ""){
        window.location.href = this.env.external_ui+this.select+"#/ai4eosc" 
      }else{
        window.location.href = this.env.external_ui+this.model.endpoint+"/ai4eosc"
      }
     
    },
    autoLogin(){
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const endpoint = urlParams.get('endpoint')
      if(endpoint !== null && !env.ai4eosc_servers.includes(endpoint) ) {
        this.model.endpoint= this.validateURL(endpoint)?endpoint:'https://'+endpoint;
      }else if(env.ai4eosc_servers.includes(endpoint)){
        this.select=endpoint
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
    height: 40%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    content: "";
    z-index: 0;
  }
</style>
