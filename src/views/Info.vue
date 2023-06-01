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
                  <v-card-text class="xs6 textinfo" style="display:flex;margin-right: 5px;padding-bottom: 5px;">
                      <p class="" ><strong>OSCAR Endpoint: </strong> {{api}}</p>
                  </v-card-text>


                  <div style="display:flex;" >
                  <v-card-text class="xs6" style="width: 25%"> <strong>User: </strong> {{user}}</v-card-text>

                  <v-card-text style="display:flex;width: 50%" >
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
                  </div>

                  <div style="display:flex;" >
                    <v-card-text class="xs6"> <strong>useSSL: </strong> {{useSSL}}</v-card-text>
                    <v-card-text class="xs6"> <strong>GPU available: </strong> {{gpu_available}}</v-card-text>
                    <v-card-text class="xs6"> <strong>yunikorn_enable: </strong> {{yunikorn_enable}}</v-card-text>
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
                  <v-card-text class="xs6 textinfo" style="display:flex;margin-right: 5px;padding-bottom: 5px;">
                      <p class="" v-if="port=='NaN'" ><strong>MinIO Endpoint: </strong> {{endpoint}}</p>
                      <p class="" v-else><strong>MinIO Endpoint: </strong> {{endpoint}}:{{port}}</p>
                  </v-card-text>
                 
                  <div style="display:flex;" >
                    <v-card-text class="xs6" style="width: 25%"> <strong>Access Key: </strong> {{accessKey}}</v-card-text>
                    <v-card-text style="display:flex;width: 50%" >
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
                  </div>


                  
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
                    <h5>{{ service.service }}</h5>
                      <ul  >
                        <li ><strong>Image:</strong> {{ service.container }}</li>
                        <li ><strong>CPUs:</strong> {{ service.cpu }}</li>
                        <li ><strong>Memory:</strong> {{ service.memory }}</li>
                        <li ><strong>Log Level:</strong> {{ service.logLevel }}</li>
                        <li  v-show="service.inputs.length>0"><strong>Inputs:</strong></li>
                        <ul>
                          <li v-for="inputs in service.inputs">
                            {{inputs.storage_provider}}: {{inputs.path}} 
                          </li>
                        </ul>
                        <li v-show="service.outputs.length>0"><strong>Outputs:</strong></li>
                        <ul>
                          <li v-for="outputs in service.outputs">
                            {{outputs.storage_provider}}: {{outputs.path}} 
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
    user: localStorage["user"],
    accessKey:localStorage["accessKey"],
    api:localStorage["api"],
    endpoint:localStorage["endpoint"],
    gpu_available:localStorage["gpu_available"],
    password:localStorage["password"],
    port:localStorage["port"],
    useSSL:localStorage["useSSL"],
    yunikorn_enable:localStorage["yunikorn_enable"],
    secretKey:localStorage["secretKey"],
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
    submit () {
    
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
						enable_gpu: serv.enable_gpu
					}
				})
        
				this.loading = false;
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
</style>