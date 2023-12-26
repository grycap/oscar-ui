<template>
    <v-layout row wrap class="mb-1">
    <v-flex xs12>
        <v-card id="functions">
			<v-card-title>
				<v-text-field
					v-model="search"
					append-icon="search"
					label="Search"
					single-line
				></v-text-field>
				<v-spacer></v-spacer>
				<FunctionForm :openFaaS="openFaaS" @SHOWSPINNER="handleSHOW()" style="display: inline;"></FunctionForm>
				<FDLForm :openFaaS="openFaaS" @SHOWSPINNER="handleFDLSHOW()" style="display: inline;"></FDLForm>
			</v-card-title>

			<v-data-table
				:headers="headers"
				:items="services"
				:loading="loading"
				class="elevation-1"
				item-key="name"
				:search="search"
				:expand="expand"
				v-show="!show_spinner"
			>
				<template v-slot:items="props">
					<tr >
						<td class="text-xs-center">{{ props.item.name }}</td>
						<td class="text-xs-center">{{ props.item.image }}</td>
						<td class="text-xs-center">{{ props.item.cpu }}</td>
						<td class="text-xs-center">{{ props.item.memory }}</td>
						<div class="text-xs-center">
							<v-menu>
							<template v-slot:activator="{ on, attrs }">
								<v-btn v-bind="attrs" v-on="on"
								outline color="indigo"
								>
								More Options
								</v-btn>
							</template>
							<v-list >
								
								<v-btn class="buttom-options" 	outline @click="editFunction(props.item)" >
									<v-icon small class="mr-2">edit</v-icon>
								Edit
								</v-btn>
								<br>
								
								<v-btn class="buttom-options" outline @click="goLogs(props.item.name)">
									<v-icon small class="mr-2" >visibility</v-icon>
								Logs
								</v-btn>

								<br>
								<v-btn class="buttom-options" outline @click="goInvoke(props.item.name)">
									<v-icon small class="mr-2" >sync_alt</v-icon>
								Invoke
								</v-btn>
								<br>
								<v-btn class="buttom-options" color="red" outline @click="deleteFunction(props.item,props.item.name)">
									<v-icon small class="mr-2" >delete</v-icon>
								Delete
								</v-btn>
								<br>
							</v-list>
							</v-menu>
						</div>

						<td class="text-xs-center">
							<v-icon  medium v-show="props.expanded" @click="props.expanded = !props.expanded">expand_less</v-icon>
							<v-icon  medium v-show="!props.expanded" @click="props.expanded = !props.expanded;showEnvVars(props.item.environment)">expand_more</v-icon>
						</td>
					</tr>
				</template>

				<template v-slot:expand="props" style="margin-top:1rem">

					<div class=" div-list-content" >
						<v-card style="padding:0 2rem 2rem 2rem;">

							<v-tabs
								v-model="model"
								centered
								slider-color="yellow"
							>
								<v-tab
								class="text-xs-center"
								:href="`#tab-service`"
								>
									Service Info
								</v-tab>

							</v-tabs>

							<v-tabs-items v-model="model" >
								<v-tab-item  :value="`tab-service`">
									<v-card flat>
										<v-card-text class="custom-padding xs6"> <strong>Name: </strong> {{props.item.name}}</v-card-text>
										<v-card-text class="custom-padding"><strong>Image: </strong> {{props.item.image}}</v-card-text>
										<v-card-text style="display:flex;margin-right: 5px;" class="custom-padding">
											<strong style="padding-top: 12px;margin-right: 5px;">Token: </strong>
											<v-text-field style="width: 80%!important;padding-top: 0px!important;margin-top: 0px!important;"
												:value="props.item.token"
												:append-icon="show1 ? 'visibility' : 'visibility_off'"
												:type="show1 ? 'text' : 'password'"
												name="input-10-1"
												@click:append="show1 = !show1"
												readonly
											></v-text-field>
										</v-card-text>
										<v-card-text class="custom-padding"> <strong>Resources</strong>
											<ul>
												<li><strong>CPU: </strong> {{props.item.cpu}}</li> 
												<li><strong> Memory: </strong> {{props.item.memory}}</li> 
											</ul>
										</v-card-text>
										<v-card-text v-show=" getYunikorn_option == 'true'"  class="custom-padding"> <strong>Yunikorn resources</strong>
											<ul>
												<li><strong>CPU: </strong> {{props.item.total_cpu}}</li> 
												<li><strong> Memory: </strong> {{props.item.total_memory}}</li> 
											</ul>
										</v-card-text>
										<v-card-text  v-show=" getGpu_available == 'true'" class="custom-padding"><strong>Does this service use GPU? </strong>
											<p style="display:inline" v-if=" useGPU(props.item.enable_gpu)">Yes</p> 
											<p style="display:inline" v-if=" !useGPU(props.item.enable_gpu)">No</p> 
										</v-card-text>
										<v-card-text  class="custom-padding"><strong>Is your image base on Alpine? </strong>
											<p style="display:inline" v-if=" alpineImage(props.item.alpine)">Yes</p> 
											<p style="display:inline" v-if=" !alpineImage(props.item.alpine)">No</p> 
										</v-card-text>
										<v-card-text  class="custom-padding"><strong>Is this service expose? </strong>
											<p style="display:inline" v-if=" isServiceExpose(props.item.expose.port)">Yes</p> 
											<p style="display:inline" v-if=" !isServiceExpose(props.item.expose.port)">No</p> 
											<ul v-if=" isServiceExpose(props.item.expose.port)">
												<li><strong>min_scale: </strong> {{props.item.expose.min_scale}}</li> 
												<li><strong> max_scale: </strong> {{props.item.expose.max_scale}}</li> 
												<li><strong> port: </strong> {{props.item.expose.port}}</li> 
												<li><strong> cpu_threshold: </strong> {{props.item.expose.cpu_threshold}}</li> 
											</ul>
										</v-card-text>
										<v-card-text v-show="getInterLink_available"   class="custom-padding"><strong>Does this service use InterLink? </strong>
											<p style="display:inline" v-if=" useInterLink(props.item.enable_InterLink)">Yes</p> 
											<p style="display:inline" v-if=" !useInterLink(props.item.enable_InterLink)">No</p> 
										</v-card-text>
										
										<v-card-text class="custom-padding"><strong>Environment variables: </strong>
											<pre v-show="Object.keys(props.item.environment.Variables).length!==0" id="json-renderer"></pre>
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
										<div v-for="(val, i) in props.item.inputs" :key="'A'+ i"  class="row" style="margin:10px 30px 20px 30px;border-bottom:1px solid #eee;padding-bottom:10px;">
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
										<div v-for="(val, i) in props.item.outputs" :key="'D'+ i"  class="row" style="margin:10px 30px 20px 30px;border-bottom:1px solid #eee;padding-bottom:10px;">
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
								</v-tab-item>
								<v-tab-item :value="`tab-storage`">
									<v-card flat>
										<v-card-text class="custom-padding xs6"> <strong>S3: </strong></v-card-text>
										<div class="row container">
											<input type="password" class="form-control" id="access_key" aria-describedby="emailHelp" :disabled="disable_storage" placeholder="Access Key" style="margin-bottom:5px;">
											<input type="password" class="form-control" id="secret" aria-describedby="emailHelp" :disabled="disable_storage" placeholder="Secret Key" style="margin-bottom:5px;">
											<input type="text" class="form-control" id="region_key" aria-describedby="emailHelp" :disabled="disable_storage" placeholder="Region" style="margin-bottom:5px;">

										</div>

										<v-card-text class="custom-padding xs6"> <strong>ONEDATA: </strong></v-card-text>
										<div class="row container">
											<input type="text" class="form-control" id="access_key" aria-describedby="emailHelp" :disabled="disable_storage" placeholder="ONE PROVIDER HOST" style="margin-bottom:5px;">
											<input type="password" class="form-control" id="secret" aria-describedby="emailHelp" :disabled="disable_storage" placeholder="TOKEN" style="margin-bottom:5px;">
											<input type="text" class="form-control" id="region_key" aria-describedby="emailHelp" :disabled="disable_storage" placeholder="SPACE" style="margin-bottom:5px;">

										</div>

										<div class="row col-12" style="margin-top:5rem;justify-content: flex-end;">
											<v-btn
												color="primary"
												@click="edit_storage()"
											>
												EDIT
											</v-btn>

											<v-btn
												color="error"
												@click="cancel_storage()"
												:disabled="disable_storage"
											>
												CANCEL
											</v-btn>

											<v-btn
												color="success"
												@click="done_storage()"
												:disabled="disable_storage"
											>
												DONE
											</v-btn>
										</div>

									</v-card>
								</v-tab-item>
							</v-tabs-items>
						</v-card>
					</div>


				</template>

				 <template v-slot:no-data>
					<v-alert :value="true" type="info" color="#83C3FA"  style="color:black;">
					There are no services deployed. 
					If you did not create a service, follow the 
					<a style="color:black; text-decoration: underline;" target="_blank" href="https://docs.oscar.grycap.net/usage/#deploying-services">
						deployment instructions 
					</a> to deploy an example service.
					</v-alert>
            	</template>

				<v-alert slot="no-results" :value="true" color="error" icon="warning">
					Your search for "{{ search }}" found no results.
				</v-alert>
			</v-data-table>
				<div v-show="show_spinner" style="position:fixed; left:50%;">
					<intersecting-circles-spinner :animation-duration="1200" :size="50" :color="'#0066ff'" />
				</div>
        </v-card>
      </v-flex>
    </v-layout>
</template>
<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import axios from 'axios'
import FunctionForm from '@/components/forms/FunctionForm'
import FDLForm from '@/components/forms/FDLForm'

import { IntersectingCirclesSpinner } from 'epic-spinners'
import Services from '../components/services';
/* eslint-disable */
export default {
	mixins:[Services],
	components: {
		FunctionForm,
		FDLForm,
		VuePerfectScrollbar,
		IntersectingCirclesSpinner,
	},
	props: {
		openFaaS: {}
	},
	data: () => ({
		size: 'lg',
		view: 'grid',
		show_spinner: true,
		show_alert: false,
		headers: [
			{ text: 'SERVICE', sortable: false, align: 'center', value: 'service' },
			{ text: 'CONTAINER', sortable: false, align: 'center', value: 'container' },
			{ text: 'CPU', sortable: false, align: 'center',value: 'cpu' },
			{ text: 'MEMORY', sortable: false, align: 'center', value: 'memory' },
			{ text: '', sortable: false, align: 'center', value: 'actions' },
			{ text: '', sortable: false, align: 'center', value: 'logs' },
			{ text: '', sortable: false, align: 'center', value: 'expand' },
		],
		loading: true,
		search: '',
		services:[],
		env_Vars: {},
		index: '',
		expand: false,
		expand_icon: 'expand_more',
		model: 'tab-service',
		disable_form: true,
		disable_storage: true,
		params_delete: '',
		show1:false
	}),
  	methods: {
		showEnvVars(value){
			setTimeout(function(){
				$('#json-renderer').jsonViewer(value);

			},100)
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
			/* {
				editionMode: true,
				name: this.services[index].service,
				image: this.services[index].container,
				token: this.services[index].token,
				input: this.services[index].inputs,
				output: this.services[index].outputs,
				log_Level: this.services[index].logLevel,
				environment: this.services[index].environment,
				image_pull_secrets: this.services[index].image_pull_secrets,
				annotations: this.services[index].annotations?this.services[index].annotations:{},
				labels: this.services[index].labels?this.services[index].labels:{},
				cpu: this.services[index].cpu,
				script: this.services[index].script,
				memory: this.services[index].memory,
				storage_provider: this.services[index].storage,
				total_memory:this.services[index].total_memory,
				total_cpu:this.services[index].total_cpu,
				alpine:this.services[index].alpine,
				expose:this.services[index].expose,
				image_prefetch:this.services[index].image_prefetch,
				enable_gpu:this.services[index].enable_gpu,
				enable_InterLink:this.services[index].enable_InterLink
			}*/
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
				this.services = Object.assign(this.services, response.data);
				console.log(response.data)
				this.services = response.data.map((serv) => {
					//console.log(serv)
					return serv/*{
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
						input: serv.input,
						output: serv.output,
						storage_providers: serv.storage_providers,
						script: serv.script,
						total_cpu: serv.total_cpu,
						total_memory: serv.total_memory,
						alpine: serv.alpine,
						image_prefetch: serv.image_prefetch,
						expose:serv.expose,
						enable_gpu: serv.enable_gpu,
						enable_InterLink: serv.enable_InterLink
					}*/
				})
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
			if(portValue != 0){
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
		window.getApp.$on('FUNC_GET_FUNCTIONS_LIST', () => {
			this.listServicesCall(this.listServicesCallback)
		})
	},
	mounted: function () {
		$('.div-list-content').scroll(function () {
                // this.bottom = this.bottomVisible()
            }.bind(this));
		this.listServicesCall(this.listServicesCallback)
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
