<template>
<v-layout row wrap>

  <v-layout align-center justify-center row wrap fill-height>
    <v-flex xs12>
      <v-card>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-layout row wrap>
            <v-flex xs12 sm12>
              <v-card flat>
                  <h2 style="padding: 16px;text-align: center;position:relative" >Juno</h2>
                <v-card-text >
                  <v-layout class="rounded rounded-md" v-show="show_spinner" style="position:relative;align-content: center;">
                    <intersecting-circles-spinner style="left: 49.5%;"   :animation-duration="1200" :size="50" :color="'#0066ff'" />
                  </v-layout>

                  <v-layout v-if="!show_spinner" class="rounded rounded-md">
                   
                    <v-flex  xs5 sm5 style="display: inline-block;"><pre  >{{printJuno()}}</pre></v-flex>
                    <v-flex xs6 sm6 style="display: inline-block;">
                    <v-flex  >
                      <v-text-field  
                        v-model="form.image"
                        :counter="200"
                        label="Image"
                        style="padding-right: 5px;"
                      ></v-text-field>   
                      <v-text-field
                        v-model="form.cpu"
                        :counter="10"
                        label="CPU"
                        style="padding-right: 5px;"
                      ></v-text-field>
                      <v-text-field 
                        v-model="form.memory"
                        :counter="10"
                        label="Memory RAM"
                        style="padding-right: 5px;"
                      ></v-text-field>
                      <textarea
                        v-model="form.script"
                        :counter="15"
                        label="Memory RAM"
                        rows="12"
                        style="padding-right: 5px;width: 100%;"
                      ></textarea>

                      <v-btn color="success" @click="submit" >Create Juno
                      </v-btn>


                      
                    </v-flex>
                  </v-flex>
                  </v-layout>


                  
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
import YAML from 'yaml'
import { IntersectingCirclesSpinner } from 'epic-spinners'
export default {
  mixins:[Services],
  components: {
		InfoService,
    IntersectingCirclesSpinner,
	},
  props: {
    minio: {},
    openFaaS: {}
  },
  data: () => ({
    user: (localStorage.getItem("user")?localStorage.getItem("user"): JSON.parse(localStorage.getItem("session")).user.info.name  ),
    show_spinner: true,
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
    form: {},
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
    this.getJuno()
   
  },
  methods: {
    async getJuno(){
      const url="https://raw.githubusercontent.com/SergioLangaritaBenitez/juno/main/juno.yaml"
      await $.ajax({
          url: url,
          type: 'GET',
          context: this,
          success: function (response) {
            const parse=YAML.parse(response)
            this.form=Object.assign({}, parse.functions.oscar[0]["oscar-cluster"]);
          }
      });
      const script="https://raw.githubusercontent.com/SergioLangaritaBenitez/juno/main/script.sh"
      await $.ajax({
          url: script,
          type: 'GET',
          context: this,
          success: function (response) {
            this.form.script=response
          }
      });
      this.show_spinner=false
    },
    printJuno(){
      const token=Math.random().toString(36).substring(2)+Math.random().toString(36).substring(2)  
      this.form.environment.Variables["OSCAR_ENDPOINT"]=this.api
      let user=""
      if (this.isMultiTenant()){
        user="juno"+this.accessKey.slice(0, 6)
      }else{
        user="junoroot"
      }
      this.form.name=user
      this.form.environment.Variables["JUPYTER_DIRECTORY"]= "/mnt/"+user
      this.form.environment.Variables["JHUB_BASE_URL"]= "/system/services/"+user+"/exposed" 
      this.form.mount.path="/"+user

      return this.form
    },
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
    isMultiTenant(){
      if(this.accessKey != 'minio')return true
      else return false
    },
    newFunction () {
			this.createServiceCall(this.form,this.createServiceCallBack)

		},
		createServiceCallBack(response){
			if(response.status == 201){
				window.getApp.$emit('APP_SHOW_SNACKBAR', { text: `Function ${this.form.name} was successfully created.`, color: 'success', timeout: 12000 })
				this.dialog = false;
				window.getApp.$emit('REFRESH_BUCKETS_LIST')
      }else if(response == "Error: Request failed with status code 409"){
        this.editServiceCall(this.form, this.editServiceCallBack)
			}else {
				window.getApp.$emit('APP_SHOW_SNACKBAR', { text: response, color: 'error' })

			}

		},
    submit(){
			this.newFunction()
    },
    editServiceCallBack(response){
			if(response.status == 204){
				window.getApp.$emit('APP_SHOW_SNACKBAR', { text: `Function ${this.form.name} has been updated`, color: 'success' })
			}else {
				window.getApp.$emit('APP_SHOW_SNACKBAR', { text: response, color: 'error' })
			}

		},
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