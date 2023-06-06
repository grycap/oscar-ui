import env from "./env.js";

export default{
  login_egi(endpoint){
    this.loading_egi = true;
    if(endpoint == ''){
      window.getApp.$emit('APP_SHOW_SNACKBAR', { text: "Endpoint is required", color: 'error' })
      this.loading_egi = false;
    }else{
      endpoint = endpoint.endsWith('/') ? endpoint.slice(0, -1) : endpoint;
      localStorage.setItem("api", endpoint);
      localStorage.setItem("client_id", env.client_id);
      localStorage.setItem("provider_url", env.provider_url);
      localStorage.setItem("url_authorize", env.url_authorize);
      localStorage.setItem("url_user_info", env.url_user_info);
      localStorage.setItem("token_endpoint", env.token_endpoint);
      window.location.replace(env.redirect_uri);
    }
  }
}