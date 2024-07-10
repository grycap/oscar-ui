<template>
<v-layout row wrap>

  <v-layout align-center justify-center row wrap fill-height>
    <v-flex xs12>
      <v-card>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-layout row wrap>
            <v-flex xs12 sm12>
              <v-card flat>
                  <h2 style="padding: 16px;text-align: center;" >Juno</h2>
                <v-card-text>
                  <v-card-text class="xs6 textinfo styleflex" style="margin-right: 5px;padding-bottom: 5px;">
                      <p class="" ><strong>OSCAR Endpoint: </strong> {{api}}</p>
                  </v-card-text>


                  <v-card-text class="xs6" style="width: 25%"> <strong>User: </strong> {{user}}</v-card-text>
                  <v-card-text v-if="isMultiTenant()" class="xs6" style="width: 25%"> <strong>Id: </strong> {{accessKey.split('@')[0]}}</v-card-text>

                  <v-card-text class="styleflex"  style="width: 50%" >
                    <strong style="margin-right: 5px">Password: </strong>
                    <v-text-field  style="width: 10%!important;padding-top: 0px!important;margin-top: -12px!important;"
                    :value="password"
                    :append-icon="showpassword ?  'visibility' : 'visibility_off'"
                    :type="showpassword ? 'text' : 'password'"
                    name="input-10-1"
                    @click:append="showpassword = !showpassword"
                    readonly
                    ></v-text-field>
                  </v-card-text>

                  <div class="styleflex"  >
                    <!--
                    <v-card-text v-show=" getYunikorn_option == 'true'"  class="custom-padding"> <strong>Yunikorn resources</strong>
											<ul>
												<li><strong>CPU: </strong> {{props.item.total_cpu}}</li> 
												<li><strong> Memory: </strong> {{props.item.total_memory}}</li> 
											</ul>
										</v-card-text>
                    -->
                    <v-card-text class="xs6"> <strong>useSSL: </strong>
											<p style="display:inline" v-if="use(useSSL)" >Yes</p> 
											<p style="display:inline" v-if="!use(useSSL)" >No</p> 
                    </v-card-text>
                    <v-card-text class="xs6"> <strong>GPU Available: </strong>
                      <p style="display:inline"  v-if="use(gpu_available)" >Yes</p> 
											<p style="display:inline" v-if="!use(gpu_available)" >No</p> 
                    </v-card-text>
                    <v-card-text class="xs6"> <strong>Yunikorn Enable: </strong>
                      <p style="display:inline"  v-if="use(yunikorn_enable)"  >Yes</p> 
											<p style="display:inline" v-if="!use(yunikorn_enable)" >No</p> 
                    </v-card-text>
                    <v-card-text class="xs6"> <strong>InterLink Available: </strong>
                      <p style="display:inline" v-if="use(interLink_available)"  >Yes</p> 
											<p style="display:inline" v-if="!use(interLink_available)" >No</p> 
                    </v-card-text>
                  </div>
                </v-card-text>
              </v-card>
            </v-flex>
 
          </v-layout>
        </v-form>
      </v-card>
    </v-flex>
  </v-layout>
</v-layout>
</template>

<script>
import Services from '@/components/services';
import InfoService from '@/views/InfoService';
export default {
  mixins:[Services],
  components: {
		InfoService,
	},
  props: {
    minio: {},
    openFaaS: {}
  },
  data: () => ({
    user: (localStorage.getItem("user")?localStorage.getItem("user"): JSON.parse(localStorage.getItem("session")).user.info.name  ),
    accessKey:localStorage.getItem("accessKey"),
    api:localStorage.getItem("api"),
    endpoint:localStorage.getItem("endpoint"),
    gpu_available:localStorage.getItem("gpu_available"),
    password:localStorage.getItem("password"),
    port:localStorage.getItem("port"),
    useSSL:localStorage.getItem("useSSL"),
    yunikorn_enable:localStorage.getItem("yunikorn_enable"),
    secretKey:localStorage.getItem("secretKey"),
    interLink_available:localStorage.getItem("interLink_available"),
    showpassword:false,
    showpasswordminio:false,
    buckets: [],
    services:[],
    menus:[],
    valid: true,
    rules: {
      required: value => !!value || 'Required.',
      endpoint: [
        v => !!v || 'Endpoint is required'
      ]
    },
    showMinioSecretKey: false,
    minioConfig: {},
    openFaaSConfig: {}
  }),
  created: function () {
    //this.getBucketsList()
    //this.listServicesCall(this.listServicesCallback)
    (async() => {
    const url1 = 'https://raw.githubusercontent.com/SergioLangaritaBenitez/juno/main/juno.yaml'
    const res = await axios.get(url1)
    console.log(res.data)
    })()
  },
  methods: {
    goLogs(service){
      this.$router.push({name: "Logs", params:{serviceName: service}})
    },
    goInvoke(service){
			this.$router.push({name: "Invoke", params:{serviceName: service}})
		},
    goBucket(bucket){
			this.$router.push({name: "BucketContent", params:{bucketName: bucket.split("/")[0] }})
		},
    changeview(index){
      this.showservices[index]=!this.showservices[index]
    },
    getBucketListCallBack(response){
      try{
        this.buckets = response.map((bucket) => {
              return {
                title: bucket.name,
                to: `/buckets/${bucket.name}`,
                active: false
              }
        })
      }catch(err) {
            console.error("ERROR with list buckets "+err);
      }
      this.menus.find((obj) => {
            if (obj.title === 'Storage') {
              obj.items = this.buckets
            }
      })
	  },
    getBucketsList () {
      this.getBucketListCall(this.getBucketListCallBack)
    },
    listServicesCallback(response) {
			if(response.status == 200){
				if (response.data !== null) {
					this.services = Object.assign(this.services, response.data);
					this.services = response.data.map((serv) => {
						return serv
					})
				}
				this.loading = false;
			}
		},
    use(value){
      if (value == "true") 
      return true
      else return false
    },
    useExpose(value){
       if (value != undefined && value != '0') return true
       else return false
    },
    isMultiTenant(){
      if(this.accessKey != 'minio')return true
      else return false
    }
  }
}
</script>
<style scoped lang="css">
  .password {
    display: inline;
  }
  .textinfo{
    margin-bottom: 0px;
    padding-top: 5px;
  }
  .iconclass{
    margin-right: 0px;
    padding: 5px;
    color: #0056b3;
  }
  .iconposition{
    position:relative;
    top: -7px;
  }
  .styleflex{
    display: flex;
  }
  .panel_info{
    margin-top: 0%;
  }
  .infoservice{
    border: 1px;
    border-style: solid;
    border-color: black;
    margin-bottom: 2.5%;
    padding-bottom: 2.5%;
    padding-top: 2.5%;
  }
</style>