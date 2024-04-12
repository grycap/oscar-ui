<template>
  <v-app id="login"  v-bind:class="getClass()">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4 lg4>
            <v-card class="elevation-1 pa-3">
              <v-card-text>
                <div class="layout column align-center" >
                    <img src="@/assets/logo.png" alt="Vue Material Admin" width="120" height="120">
                    <img v-if="ai4eoscServer()"  src="@/assets/logo/ai4eosc-logo.png" alt="Vue Material Admin" width="50%" height="50%">
                    <img v-if="imagineServer()"  src="@/assets/logo/imagine-logo.png" alt="Vue Material Admin" width="25%"  style="margin-top: 30px;">
                  <h1 class="flex my-4 teal--text">OSCAR</h1>
                </div>


                <v-form v-if= "env.deploy_container == 'false'" >
                  <v-text-field  append-icon="language" name="endpoint" label="Endpoint" id="endpoint" type="text"
                                v-model="model.endpoint" :hide-details=true></v-text-field>
                  <div class="text-right">
                    <span style="color:red; font-size:10px;">Required</span>

                  </div>

                </v-form>
                <v-divider v-if= "env.deploy_container == 'false'" class='mt-5 mb-5'></v-divider>
                
                <v-form>
                   <v-text-field  append-icon="person" name="user" label="User" type="text"
                                v-model="model.username"></v-text-field>
                  <v-text-field  append-icon="lock" name="password" label="Password" id="password" type="password"
                                v-model="model.password"></v-text-field>
                  <div class="text-center">
                    <v-btn color="teal" dark @click.native="login()" :loading="loading">Basic auth</v-btn>
                  </div>
                </v-form>
                <v-divider class='mt-5 mb-5'></v-divider>

                  <div   class="text-center">
                  <v-btn color="indigo" dark @click.native="oscar_ui_egi()" :loading="loading_egi">EGI Check-in</v-btn>
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
import Services from '../components/services.js';
import env from '../env';
import Foot from '@/views/Foot'
export default {
  components: {
    Foot,
    },
  mixins:[Services],
  data: () => ({
    loading: false,
    loading_egi: false,
    model: {
      username: '',
      password: '',
      endpoint: ''
    },
    user: "admin",
    pass: "admin",

  }),
  created(){
    localStorage.clear();
    localStorage.setItem("authenticated", false);
    if(env.deploy_container == 'true'){
      this.endpoint = env.api
    }
    this.autoLogin();   
    if(env.deploy_container == "true"){
        this.model.endpoint = env.api
      }

  },

  methods: {
    login() {
      if(env.deploy_container == "true"){
        this.model.endpoint = env.api
      }
      this.loading = true
      var params = {
        'user': this.model.username,
        'password': this.model.password,
        'api': this.model.endpoint
      }
      this.model.endpoint = this.model.endpoint.endsWith('/') ? this.model.endpoint.slice(0, -1) : this.model.endpoint;
      if(env.deploy_container == "true"){
        localStorage.setItem("api", window.location.origin);
      }else{
        localStorage.setItem("api", this.model.endpoint);
      }
      this.checkLoginCall(params,this.checkLoginCallback);

    },
    ai4eoscServer(){
      if(env.deploy_container=='true' && env.ai4eosc_servers.includes(window.location.origin)) return true
      else return false
    },
    imagineServer(){
      if(env.deploy_container=='true' && env.imagine_servers.includes(window.location.origin)) return true
      else return false
    },
    getClass(){
      if(this.ai4eoscServer()){
        return "ai4eosc"
      }else if(this.imagineServer()){
        return "imagine"
      }else return "teal darken-1"
    },
    oscar_ui_egi(){
      if(env.deploy_container == "true"){
        const theurl=window.location.origin
        window.location.href = this.env.external_ui+ theurl+"#/egi"  
      }else{
        window.location.href = this.env.external_ui+this.model.endpoint+"#/egi"   
      }
    },
    getPort(url) {
        url = url.match(/^(([a-z]+:)?(\/\/)?[^\/]+).*$/)[1] || url;
        var parts = url.split(':'),
            port = parseInt(parts[parts.length - 1], 10);
        return port;
    },
    getHost(url) {
       var hostname;
        //find & remove protocol (http, ftp, etc.) and get hostname

        if (url.indexOf("//") > -1) {
            hostname = url.split('/')[2];
        }
        else {
            hostname = url.split('/')[0];
        }

        //find & remove port number
        hostname = hostname.split(':')[0];
        //find & remove "?"
        hostname = hostname.split('?')[0];

        return hostname;
    },
    getloginResponse(response){
      var port=this.getPort(response.data.minio_provider.endpoint)
      var endpoint_host = this.getHost(response.data.minio_provider.endpoint)
      if(endpoint_host ==env.response_default_minio){
        localStorage.setItem("endpoint",env.minio_local_endpoint)
        localStorage.setItem("port",env.minio_local_port)
      }else{
        localStorage.setItem("endpoint",endpoint_host)
        localStorage.setItem("port",port)
      }
      if(endpoint_host !=env.response_default_minio){
        if (response.data.minio_provider.endpoint.indexOf("http://") == 0) {
          localStorage.setItem("useSSL",false)
        } else {
          localStorage.setItem("useSSL",true)
        }
      }else{
        localStorage.setItem("useSSL",env.minio_local_ssl)
      }
      localStorage.setItem("accessKey",response.data.minio_provider.access_key)
      localStorage.setItem("secretKey",response.data.minio_provider.secret_key)
      localStorage.setItem("authenticated", true);
      localStorage.setItem("user", this.model.username);
      localStorage.setItem("password", this.model.password);
      localStorage.setItem("yunikorn_enable",response.data.config?.yunikorn_enable);
      localStorage.setItem("gpu_available",response.data.config?.gpu_available);
      localStorage.setItem("interLink_available",response.data.config?.interLink_available);
    },
    checkLoginCallback(response){
      if(response == 200){
        var _this = this
         var if_token = this.checkIfToken();
            if(if_token){
                axios({
                method: 'get',
                url: this.model.endpoint+'/system/config',
              }).then(function (response) {
                  _this.getloginResponse(response)
                  _this.$router.push({name: "Functions"})
              }).catch(function (error) {
                  console.log(error)
              })
            }else{
              axios({
                method: 'get',
                url: this.model.endpoint+'/system/config',
                auth: {
                    username: this.model.username,
                    password: this.model.password
                }
              }).then(function (response) {
                  _this.getloginResponse(response)
                  _this.$router.push({name: "Functions"})
              }).catch(function (error) {
                  console.log(error)
              })

            }
      }else if (response == 401){
        this.loading = false
      }else{
        this.loading = false
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
    },
    autoLogin(){
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const username = urlParams.get('username')
      const endpoint = urlParams.get('endpoint')
      if (username !== null){
        this.model.username = username;
      }

      if(endpoint !== null) {
        this.model.endpoint= this.validateURL(endpoint)?endpoint:'https://'+endpoint;
      }
    }
  }

}
</script>
<style scoped lang="css">
  #login {
    height: 50%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    content: "";
    z-index: 0;
  }
  .ai4eosc{
    background-color: #09837e;
    
  }
  .imagine{
    background-color: #1561aa;
  }
</style>
