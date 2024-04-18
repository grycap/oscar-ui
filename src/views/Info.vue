<template>
<v-layout row wrap>

  <v-layout align-center justify-center row wrap fill-height>
    <v-flex xs12>
      <v-card>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-layout row wrap>
            <v-flex xs12 sm6>
              <v-card flat>
                <v-card-title>
                  <span class="headline">OSCAR cluster Info</span>
                </v-card-title>
                <v-card-text>
                  <v-card-text class="xs6 textinfo styleflex" style="margin-right: 5px;padding-bottom: 5px;">
                      <p class="" ><strong>OSCAR Endpoint: </strong> {{api}}</p>
                  </v-card-text>


                  <v-card-text class="xs6" style="width: 25%"> <strong>User: </strong> {{user}}</v-card-text>

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

            <v-flex xs12 sm6>
              <v-card flat>
                <v-card-title>
                  <span class="headline">Minio Buckets</span>
                </v-card-title>
                <v-card-text>
                  <v-card-text class="xs6 textinfo styleflex" style="margin-right: 5px;padding-bottom: 5px;">
                      <p class="" v-if="port=='NaN'" ><strong>MinIO Endpoint: </strong> {{endpoint}}</p>
                      <p class="" v-else><strong>MinIO Endpoint: </strong> {{endpoint}}:{{port}}</p>
                  </v-card-text>
                 
                    <v-card-text class="xs6" style="width: 25%"> <strong>Access Key: </strong> {{accessKey}}</v-card-text>
                    <v-card-text class="styleflex"  style="width: 50%" >
                      <strong style="margin-right: 5px">Secret Key: </strong>
                      <v-text-field  style="width: 10%!important;padding-top: 0px!important;margin-top: -12px!important;"
                      :value="secretKey"
                      :append-icon="showpasswordminio ?  'visibility' : 'visibility_off'"
                      :type="showpasswordminio ? 'text' : 'password'"
                      name="input-10-1"
                      @click:append="showpasswordminio = !showpasswordminio"
                      readonly
                      ></v-text-field>
                    </v-card-text>
                </v-card-text>
              </v-card>
            </v-flex>
            <v-flex xs6>
              <v-layout row>
                <v-card-title>
                  <v-card-title>
                  <span class="headline">OSCAR services</span>
                  </v-card-title>
                  <v-card-text>
                  <ul >
                    <li v-for="service in services">
                      <div style="display: inline-flex;">
                        <h5 >{{ service.service }}</h5>
                        <v-menu>
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon   v-bind="attrs" v-on="on"  class="iconclass iconposition" >more_vert</v-icon>
                        </template>
                        <v-list style="padding-left: 10px;padding-right: 10px;" >
                            <v-icon  class="iconclass" @click="goLogs(service.service)" >visibility</v-icon>
                            <v-icon  class="iconclass" @click="goInvoke(service.service)"> sync_alt</v-icon>
                        </v-list>
                        </v-menu>
                      </div>
                      <ul style="padding-bottom: 30px;" >
                        <li ><strong>Image:</strong> {{ service.container }}</li>
                        <li ><strong>CPUs:</strong> {{ service.cpu }}</li>
                        <li ><strong>Memory:</strong> {{ service.memory }}</li>
                        <li ><strong>Log Level:</strong> {{ service.logLevel }}</li>
                        <li v-show="gpu_available =='true'" ><strong>Does this service use GPU? </strong>
                          <p style="display:inline" v-show="service.enable_gpu =='true'" >Yes</p> 
											    <p style="display:inline" v-show="service.enable_gpu !='true'" >No</p> 
                        </li>
                        <li v-show="yunikorn_enable =='true'" ><strong>Yunikorn Total CPUs: </strong> 
                          {{ service.total_cpu }}
                        </li>
                        <li v-show="yunikorn_enable =='true'" ><strong>Yunikorn Total Memory: </strong> 
                          {{ service.total_memory }}
                        </li>
                        <li v-show="interLink_available =='true'" ><strong>Does this service use Interlink? </strong> 
                          <p style="display:inline" v-show="service.enable_InterLink == true" >Yes</p> 
											    <p style="display:inline" v-show="service.enable_InterLink != true" >No</p> 
                        </li>
                        <li ><strong>Does this service use Alpine? </strong>
                          <p style="display:inline" v-show="service.alpine == true" >Yes</p> 
											    <p style="display:inline" v-show="service.alpine != true " >No</p> 
                        </li>
                        <li ><strong>Is this service exposed? </strong> 
                          <p style="display:inline" v-show="service.expose.port != '0'" >Yes</p> 
											    <p style="display:inline" v-show="service.expose.port == '0'" >No</p> 
                        </li>
                        <li  v-show="service.inputs.length>0"><strong>Inputs:</strong></li>
                        <ul>
                          <li v-for="inputs in service.inputs">
                            <div class="styleflex" >
                              <p> {{inputs.storage_provider}}: {{inputs.path}} </p>
                              <v-icon v-if="inputs.storage_provider == 'minio' " @click="goBucket(inputs.path)"  class="iconclass iconposition"> forward</v-icon>
                            </div>
                          </li>
                        </ul>
                        <li v-show="service.outputs.length>0"><strong>Outputs:</strong></li>
                        <ul>
                          <li v-for="outputs in service.outputs">
                            <div class="styleflex" >
                              <p> {{outputs.storage_provider}}: {{outputs.path}}  </p> 
                              <v-icon  v-if="outputs.storage_provider == 'minio' " @click="goBucket(outputs.path)"  class="iconclass iconposition"> forward</v-icon>
                            </div> 
                          </li>
                        </ul>
                      </ul>
                    </li>
                  </ul>
                  </v-card-text>
                </v-card-title>
              </v-layout>
            </v-flex>
            <v-flex xs6>
              <v-layout row>
                <v-card-title>
                  <v-card-title>
                    <span class="headline">Buckets</span>
                  </v-card-title>
                    <v-card-text>
                        <ul >
                          <li v-for="bucket in buckets">
                            {{ bucket.title }}
                          </li>
                        </ul> 
                    </v-card-text>
                </v-card-title>
              </v-layout >
            </v-flex >
          </v-layout>
        </v-form>
      </v-card>
    </v-flex>
  </v-layout>
</v-layout>
</template>

<script>
import Services from '@/components/services';
export default {
  mixins:[Services],
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
    this.getBucketsList()
    this.listServicesCall(this.listServicesCallback)
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
				this.show_spinner = false;
				this.services = Object.assign(this.services, response.data);
				this.services = response.data.map((serv) => {
					return {
						service: serv.name,
						container: serv.image,
						token: serv.token,
						cpu: serv.cpu,
						logLevel: serv.log_level,
						envVars: serv.environment,
						image_pull_secrets:serv.image_pull_secrets,
						annotations: serv.annotations,
						labels: serv.labels,
						memory: serv.memory,
						inputs: serv.input,
						outputs: serv.output,
						storage: serv.storage_providers,
						script: serv.script,
						total_cpu: serv.total_cpu,
						total_memory: serv.total_memory,
						alpine: serv.alpine,
						enable_gpu: serv.enable_gpu,
						enable_InterLink: serv.enable_InterLink,
						expose: serv.expose
					}
				})
        console.log(this.services)
				this.loading = false;
			}
		},
    use(value){
      console.log(value)
      return value
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
</style>