module.exports = {
    "provider_url": "$EGI_CHECKIN_ISSUER/protocol/",
    "client_id": "$EGI_CHECKIN_CLIENT_ID",
    "redirect_uri" : `${location.origin}/callback.html`,
    "url_authorize": "https://aai.egi.eu/auth/realms/egi/protocol/openid-connect/auth",
    "url_user_info": "https://aai.egi.eu/auth/realms/egi/protocol/openid-connect/userinfo",
    "token_endpoint": "https://aai.egi.eu/auth/realms/egi/protocol/openid-connect/token",
    "api" : "",
    "deploy_container" : "false",
    "minio_local_endpoint" :"localhost",
    "minio_local_port": "30300",
    "minio_local_ssl": false ,
    "response_default_minio": "minio.minio"
}
