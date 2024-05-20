<template style="margin-top:1rem">
	<div>
	<h4 class="text-xs-center" >
			Service {{service.name}} Info
	</h4>
	<v-card flat>
		<v-card-text class="custom-padding xs6"> <strong>Name: </strong> {{service.name}}</v-card-text>
		<v-card-text class="custom-padding"><strong>Image: </strong> {{service.image}}</v-card-text>
		<v-card-text style="display:flex;margin-right: 5px;" class="custom-padding">
			<strong style="padding-top: 12px;margin-right: 5px;">Token: </strong>
			<v-text-field style="width: 80%!important;padding-top: 0px!important;margin-top: 0px!important;"
				:value="service.token"
				:append-icon="show1 ? 'visibility' : 'visibility_off'"
				:type="show1 ? 'text' : 'password'"
				name="input-10-1"
				@click:append="show1 = !show1"
				readonly
			></v-text-field>
		</v-card-text>
		<v-card-text class="custom-padding"> <strong>Resources</strong>
			<ul>
				<li><strong>CPU: </strong> {{service.cpu}}</li> 
				<li><strong> Memory: </strong> {{service.memory}}</li> 
			</ul>
		</v-card-text>
		<v-card-text v-show=" getYunikorn_option == 'true'"  class="custom-padding"> <strong>Yunikorn resources</strong>
			<ul>
				<li><strong>CPU: </strong> {{service.total_cpu}}</li> 
				<li><strong> Memory: </strong> {{service.total_memory}}</li> 
			</ul>
		</v-card-text>
		<v-card-text  v-show=" getGpu_available == 'true'" class="custom-padding"><strong>Does this service use GPU? </strong>
			<p style="display:inline" v-if=" useGPU(service.enable_gpu)">Yes</p> 
			<p style="display:inline" v-if=" !useGPU(service.enable_gpu)">No</p> 
		</v-card-text>
		<v-card-text  class="custom-padding"><strong>Is your image base on Alpine? </strong>
			<p style="display:inline" v-if=" alpineImage(service.alpine)">Yes</p> 
			<p style="display:inline" v-if=" !alpineImage(service.alpine)">No</p> 
		</v-card-text>
		<v-card-text  class="custom-padding"><strong>Is this service exposed? </strong>
			<p style="display:inline" v-if=" isServiceExpose(service?.expose?.api_port)">Yes</p> 
			<p style="display:inline" v-if=" !isServiceExpose(service?.expose?.api_port)">No</p>
			<ul v-if="isServiceExpose(service?.expose?.api_port)">
				<li v-if="service?.expose?.nodePort == 0"><strong>url: </strong> <a target="_blank"  :href="api+'/system/services/'+service.name+'/exposed/'">
					{{api}}/system/services/{{service.name}}/exposed/ </a> </li> 
				<li><strong>min_scale: </strong> {{service?.expose?.min_scale}}</li> 
				<li><strong> max_scale: </strong> {{service?.expose?.max_scale}}</li> 
				<li><strong> api_port: </strong> {{service?.expose?.api_port}}</li> 	
				<li><strong> cpu_threshold: </strong> {{service?.expose?.cpu_threshold}}</li> 
				<li><strong> rewrite_target: </strong> {{service?.expose?.rewrite_target}}</li> 
				<li v-if="service?.expose?.nodePort != 0"><strong> nodePort: </strong> {{service?.expose?.nodePort}}</li> 
				<li><strong> default_command: </strong> {{service?.expose?.default_command}}</li> 
			</ul>
		</v-card-text>
		<v-card-text v-show="getInterLink_available"   class="custom-padding"><strong>Is this service using InterLink? </strong>
			<p style="display:inline" v-if=" useInterLink(service.enable_InterLink)">Yes</p> 
			<p style="display:inline" v-if=" !useInterLink(service.enable_InterLink)">No</p> 
		</v-card-text>
		
		<v-card-text v-show="Object.keys(service.environment.Variables).length!==0"  class="custom-padding"><strong>Environment variables: </strong>
			<pre >{{service.environment.Variables}}</pre>
		</v-card-text>

		<v-card-text v-show="service.allowed_users.length!==0"  class="custom-padding"><strong>Allowed users: </strong>
			<div v-for="user in service.allowed_users">
				<ul>
					<li>
						{{ user }}
					</li>
				</ul>
			</div>
		</v-card-text>
		<v-card-actions>
			<span class="custom-padding" style="padding:10px;"><strong>Inputs:</strong></span>
		</v-card-actions>

		<div class="row" style="margin:15px 30px 0px 30px;">
			<div class="col-3 col-md-3 text-left d-md-inline" style="background-color:#eee;">
				<b>Path</b>
			</div>
			<div class="col-3 col-md-3 text-left d-md-inline" style="background-color:#eee;">
				<b>Storage Provider</b>
			</div>
			<div class="col-3 col-md-3 text-left d-md-inline" style="background-color:#eee;">
				<b>Prefix</b>
			</div>
			<div class="col-3 col-md-3 text-left d-md-inline" style="background-color:#eee;">
				<b>Suffix</b>
			</div>
		</div>
		<div v-for="(val, i) in service.input" :key="'A'+ i"  class="row" style="margin:10px 30px 20px 30px;border-bottom:1px solid #eee;padding-bottom:10px;">
			<div class="col-3 col-md-3 text-left">
				<span class="d-inline d-md-none">{{val.path}}</span>
			</div>
			<div class="col-3 col-md-3 text-left">
				<span class="d-inline d-md-none">{{val.storage_provider}}</span>
			</div>
			<div class="col-3 col-md-3 text-left">
				<div v-for="(val,i) in val.prefix" :key="'B'+ i">
					<span class="d-inline d-md-none">{{val}}</span>
				</div>
			</div>
			<div class="col-3 col-md-3 text-left">
				<div v-for="(val,i) in val.suffix" :key="'C'+ i">
					<span class="d-inline d-md-none">{{val}}</span>
				</div>
			</div>
		</div>

		<v-card-actions>
			<span class="custom-padding" style="padding:10px;"><strong>Outputs:</strong></span>
		</v-card-actions>
		<div class="row" style="margin:15px 30px 0px 30px;">
			<div class="col-3 col-md-3 text-left d-md-inline" style="background-color:#eee;">
				<b>Path</b>
			</div>
			<div class="col-3 col-md-3 text-left d-md-inline" style="background-color:#eee;">
				<b>Storage Provider</b>
			</div>
			<div class="col-3 col-md-3 text-left d-md-inline" style="background-color:#eee;">
				<b>Prefix</b>
			</div>
			<div class="col-3 col-md-3 text-left d-md-inline" style="background-color:#eee;">
				<b>Suffix</b>
			</div>
		</div>
		<div v-for="(val, i) in service.output" :key="'D'+ i"  class="row" style="margin:10px 30px 20px 30px;border-bottom:1px solid #eee;padding-bottom:10px;">
			<div class="col-3 col-md-3 text-left">
				<span class="d-inline d-md-none">{{val.path}}</span>
			</div>
			<div class="col-3 col-md-3 text-left">
				<span class="d-inline d-md-none">{{val.storage_provider}}</span>
			</div>
			<div class="col-3 col-md-3 text-left">
				<div v-for="(val,i) in val.prefix" :key="'E'+ i">
					<span class="d-inline d-md-none">{{val}}</span>
				</div>
			</div>
			<div class="col-3 col-md-3 text-left">
				<div v-for="(val,i) in val.suffix" :key="'F'+ i">
					<span class="d-inline d-md-none">{{val}}</span>
				</div>
			</div>
		</div>
	</v-card>

</div>
</template>
<script>

import Services from '../components/services';

/* eslint-disable */
export default {
	mixins:[Services],
	components: {
	},
	props: {
	},
	data: () => ({
		service:"",
		show1:false,
	}),
  	methods: {
		showEnvVars(value){		
			$('#json-renderer').jsonViewer(value);
		},
		show(id){
			$(".tab-pane").removeClass("show active")
			$(".nav-link").removeClass("show active")
			$("#"+id).addClass("show active")
			$("#"+id+"-tab").addClass("show active")
		},
		handleSHOW(){
		  this.show_spinner = true
		},
		handleFDLSHOW(){
		  this.show_spinner = true
		},
		edit_service(){
			this.disable_form = false;
		},
		edit_storage(){
			this.disable_storage = false;
		},
		editFunction (func) {
			const index = this.services.indexOf(func)
			let servInfo = this.services[index];
			servInfo.editionMode=true
			window.getApp.$emit('FUNC_OPEN_MANAGEMENT_DIALOG', servInfo)
		},
		deleteFunction(serv, servName) {
			this.index = this.services.indexOf(serv);
			this.params_delete = {deleteService: servName};
			if (confirm('Are you sure you want to delete "'+servName+'" service?')) {
				this.deleteServiceCall(servName,this.deleteServiceCallBack);
				this.show_spinner = true
			}
		},
		deleteServiceCallBack(response){
			this.show_spinner == false
			if (response.status == 204) {
				this.services.splice(this.index, 1)
				window.getApp.$emit('APP_SHOW_SNACKBAR', { text: `Function ${this.params_delete.deleteService} was deleted`, color: 'success' })
				window.getApp.$emit('FUNC_GET_FUNCTIONS_LIST')
			}else{
				window.getApp.$emit('APP_SHOW_SNACKBAR', { text: response, color: 'error' })
			}
		},
		listServicesCallback(response) {
			if(response.status == 200){
				
				this.show_spinner = false;
				if (response.data !== null) {
					this.services = Object.assign(this.services, response.data);
					console.log(response.data)
					this.services = response.data.map((serv) => {
						return serv
					})
				}
				this.loading = false;
			}else{
				this.show_alert = true;
				window.getApp.$emit('APP_SHOW_SNACKBAR', { text: response.data, color: 'error' })
			}
		},
		goLogs(service_name){
			this.$router.push({name: "Logs", params:{serviceName: service_name}})
		},
		goInvoke(service_name){
			this.$router.push({name: "Invoke", params:{serviceName: service_name}})
		},
		bottomVisible() {
			const scrollY = window.scrollY
			const visible = document.documentElement.clientHeight
			const pageHeight = document.documentElement.scrollHeight
			const bottomOfPage = visible + scrollY >= pageHeight
			return bottomOfPage || pageHeight < visible
        },
		alpineImage (isAlpine) {
			return isAlpine
		},
		useInterLink(useInterLink){
			return useInterLink
		},
		useGPU(value){
			return value
		},
		isServiceExpose(portValue){
			if(portValue !== 0 && portValue != undefined){
				return true
			}
			return false
		},
		getInterLink_available(){
			return localStorage.getItem('interLink_available')
		}

  	},
	  computed: {
			getYunikorn_option () {
				return localStorage.getItem('yunikorn_enable')
			},
			getGpu_available() {
				return localStorage.getItem('gpu_available')
			},
		},
	created: function () {
		this.service = this.$attrs.data
		console.log(this.service)
		
	},
	mounted: function () {
		/*window.getApp.$on('FUNC_OPEN_MANAGEMENT_DIALOG', (data) => {
			console.log(data)
			
			this.props=Object.assign({}, data);
			console.log(props)

		})
		/*$('.div-list-content').scroll(function () {
                // this.bottom = this.bottomVisible()
            }.bind(this));
		//this.service=service
		this.api = localStorage.getItem("api");*/
	}
}
</script>
<style lang="stylus" scoped>
.openFaas {
    background-color: #e6e7e8 !important;
  }
.custom-padding{
	padding-bottom: 0px;
}

.div-list-content{
	max-height: 350px;
	background-color: #ffffff;
	overflow-y: auto;
}

.buttom-options{
	width:85%;
	color:indigo;
}
.btn-circle {
    width: 30px;
    height: 30px;
    padding: 6px 0px;
    border-radius: 15px;
    text-align: center;
    font-size: 12px;
    line-height: 1.42857;
}


  .media
    &-cotent--wrap
    &-menu
      min-width: 260px
      border-right: 1px solid #eee
      min-height: calc(100vh - 50px - 64px);
    &-detail
      min-width: 300px
      border-left: 1px solid #eee
</style>
