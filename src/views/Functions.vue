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
				:rows-per-page-items="item_per_page"
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
							<v-icon  medium v-show="!props.expanded" @click="props.expanded = !props.expanded">expand_more</v-icon>
						</td>
					</tr>
				</template>

				<template v-slot:expand="props" style="margin-top:1rem">

					<div class=" div-list-content" >
						<v-card style="padding:0 2rem 2rem 2rem;">
							<InfoService :data="props.item" ></InfoService>

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
import InfoService from '@/views/InfoService';

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
		InfoService,
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
		index: '',
		expand: false,
		expand_icon: 'expand_more',
		model: 'tab-service',
		disable_form: true,
		disable_storage: true,
		params_delete: '',
		item_per_page: [10,25,50,{"text":"$vuetify.dataIterator.rowsPerPageAll","value":-1}],
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
			if(portValue !== 0){
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
		this.api = localStorage.getItem("api");
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
	max-height: 1000px;
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
