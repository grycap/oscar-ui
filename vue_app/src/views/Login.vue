<template>
  <v-app id="login" class="teal darken-1">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4 lg4>
            <v-card class="elevation-1 pa-3">
              <v-card-text>
                <div class="layout column align-center">
                  <img src="@/assets/logo.png" alt="Vue Material Admin" width="120" height="120">
                  <h1 class="flex my-4 teal--text">OSCAR ADMIN</h1>
                </div>
                <v-form>
                  <v-text-field append-icon="person" name="login" label="Login" type="text"
                                v-model="model.username"></v-text-field>
                  <v-text-field append-icon="lock" name="password" label="Password" id="password" type="password"
                                v-model="model.password" v-on:keyup="bindLogin()"></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-btn icon>
                  <v-icon color="blue">fa fa-facebook-square fa-lg</v-icon>
                </v-btn>
                <v-btn icon>
                  <v-icon color="red">fa fa-google fa-lg</v-icon>
                </v-btn>
                <v-btn icon>
                  <v-icon color="light-blue">fa fa-twitter fa-lg</v-icon>
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn block color="teal" dark @click.native="login()" :loading="loading">Login</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    loading: false,
    model: {
      username: '',
      password: ''
    }, 
    user: "admin",
    pass: "admin",
    
  }),
  created(){
    localStorage.setItem("authenticated", false);
  },

  methods: {
    bindLogin(){
      event.preventDefault();
      if (event.keyCode === 13) {
        this.login()
      } 
    },
    login () {
      this.loading = true
      if (this.model.username == this.user && this.model.password == this.pass ){
        var _this = this
        localStorage.setItem("authenticated", true);
        // window.location.href = "/dashboard"
        this.$router.push({name: "Functions"})        
      }else{
        this.loading = false
         window.getApp.$emit('APP_SHOW_SNACKBAR', { text: "Username or password is incorrect", color: 'error' })
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
</style>
