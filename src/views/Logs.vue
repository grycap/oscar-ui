<template>
    <div class="mb-1">		
        <v-toolbar flat color="white">
            <v-btn color="primary" icon  @click="goBack()"><v-icon>arrow_back</v-icon> </v-btn>
            <v-toolbar-title>LOGS: Service {{serviceName}} </v-toolbar-title>
        </v-toolbar>
        <v-card-title>
            <v-text-field
                v-model="search"
                append-icon="search"
                label="Search"
                single-line
            ></v-text-field>
            <v-spacer></v-spacer>  
            <v-btn flat icon color="blue" @click="handleUpdate()">
                <v-icon>autorenew</v-icon>
            </v-btn>
             <v-btn color="green lighten-2" dark @click="deleteSuccessJobs()">DELETE SUCCEEDED JOBS</v-btn>          
             <v-btn color="error" dark @click="deleteAllJobs()">DELETE ALL JOBS</v-btn>          
        </v-card-title>
        <v-data-table
            :headers="headers"
            :items="jobs"
            :loading="loading"
            :expand="expand"
            item-key="name"
            :search="search"
            :custom-sort="customSort"
            :must-sort = true
            :pagination.sync="pagination"
            v-show="!show_spinner"
        >
            <template v-slot:items="props">
            <tr >
                <td>{{ props.item.name }}</td>
                <td class="text-xs-center">{{ props.item.status }}</td>
                <td class="text-xs-center">{{ moment(props.item.creation).format("YYYY-MM-DD HH:mm:ss") }}</td>
                <td class="text-xs-center" v-if="props.item.status!='Pending'">{{ moment(props.item.start).format("YYYY-MM-DD HH:mm:ss") }}</td>
                <td class="text-xs-center" v-else></td>
                <td class="text-xs-center" v-if="props.item.status!='Pending' && props.item.status!='Running'">{{ moment(props.item.finish).format("YYYY-MM-DD HH:mm:ss") }}</td>
                <td class="text-xs-center" v-else></td>
                <td class="text-xs-center">
                    <v-icon small class="mr-2" @click="moreLogs(props.item.name);handleUpdate()">autorenew</v-icon>
                    <v-icon small class="mr-2" @click="deleteJob(props.item,props.item.name)">delete</v-icon>
                </td>
                <td class="justify-center layout px-0">
                        <v-icon  medium v-show="props.expanded && props.item.status!='Pending'" @click="props.expanded = !props.expanded">expand_less</v-icon>
                        <v-icon  medium v-show="!props.expanded && props.item.status!='Pending'" @click="props.expanded = !props.expanded;moreLogs(props.item.name)">expand_more</v-icon>
                </td>

            </tr>
            </template>
            <template v-slot:expand="props">
                <div v-if="job_logs != ''"  class="col-12" style="padding-top:2rem;height:40vh;overflow-y: auto;">
                    <editor editorId="editorB" lang="text" :content="job_logs" ></editor>
                </div>
                <div v-else class="text-center">
                    <i class="fa fa-3x fa-spinner fa-spin"></i>
                </div>
            </template>
             <template v-slot:no-data>
                <v-alert :value="true" type="info" color="#83C3FA"  style="color:black;">
					There are no logs. If you do not know how to run a service asynchronously, follow the 
					<a style="color:black; text-decoration: underline;" target="_blank" href="https://docs.oscar.grycap.net/usage/#minio-storage-tab">
						MinIO Storage Tab documentation.
					</a>
                    Alternatively, you can invoke it synchronously on the
                    <a style="color:black; text-decoration: underline;" @click="goInvoke">Invoke page</a>

				</v-alert>
            </template>
            <v-alert slot="no-results" :value="true" color="error" icon="warning">
                        Your search for "{{ search }}" found no results.
                    </v-alert>
        </v-data-table>
        <div v-show="show_spinner" style="position:fixed; left:50%;">	
            <intersecting-circles-spinner :animation-duration="1200" :size="50" :color="'#0066ff'" />              		
        </div>
    </div>
 
</template>

<script>
import Services from '../components/services';
import { IntersectingCirclesSpinner } from 'epic-spinners';
import moment from 'moment';
import Editor from './AceEditor';
/* eslint-disable */
export default {
    mixins:[Services],
    components: {
		IntersectingCirclesSpinner,
        'editor': Editor,
	},
	name: 'Logs',
	data () {
    return {
        expand: false,
        serviceName: '',
        show_spinner: true,
        show_alert: false,
        moment : moment,
        search:'',
        loading:true,
        headers: [
            {
            text: 'JOB NAME',
            align: 'start',
            
            value: 'name',
            },
            { text: 'STATUS',align: 'center', value: 'status' },
            { text: 'CREATION TIME', align: 'center', value: 'create_time' },
            { text: 'START TIME',align: 'center', value: 'start_time' },
            { text: 'FINISH TIME',align: 'center', value: 'finish_time' },       
            { text: '',align: 'center', value: 'actions' },
            { text: '',align: 'center', value: 'expand' },
        ],
        pagination: {
            descending: true,
            sortBy: 'create_time',
            rowsPerPage: 10
		},
        jobs: [],
        index:'',
        params_delete:'', 
        job_logs: ''
        
    }
  },
	methods: {
        customSort(items, index, isDesc) {
            items.sort((a, b) => {
                if (index === "create_time" || index === "start_time" || index === "finish_time") {
                    if (!isDesc) {
                        return a.creation - b.creation;
                    } else {
                        return b.creation - a.creation;
                    }
                } else {
                    if (!isDesc) {
                        return a[index] < b[index] ? -1 : 1;
                    } else {
                        return b[index] < a[index] ? -1 : 1;
                    }
                }
            });
            return items;
        },
        handleUpdate(){
             this.listJobsCall(this.serviceName, this.listJobsCallback);
        },
        moreLogs(val){
            var params_logs = {serviceName: this.serviceName, jobName: val}
            this.listJobNameCall(params_logs, this.listJobNameCallback);
        },
        listJobNameCallback(response){
                this.job_logs = ''
                if(response.status==200){
                    console.log(response.data)
                    this.job_logs = response.data  //remember to handle error
                }else {
                    this.job_logs = "There are no logs available."
                }
        },
        goBack(){
            this.$router.push({name: "Functions"})
        },
        deleteJob(job,job_name){
            this.index = this.jobs.indexOf(job)
            this.params_delete = {serviceName: this.serviceName, jobName: job_name}
            if (confirm('Are you sure you want to delete this job?')) {
                this.deleteJobCall(this.params_delete, this.deleteJobCallback);
			}
        },
        deleteJobCallback(response){
            if (response.status==204 ) {   //check response
                this.jobs.splice(this.index, 1)
				window.getApp.$emit('APP_SHOW_SNACKBAR', { text: `Job ${this.params_delete.jobName} was deleted`, color: 'success' })           
			}else{
				window.getApp.$emit('APP_SHOW_SNACKBAR', { text: response, color: 'error' })
            }
        },
        deleteAllJobs(){
            var params = {
                serviceName: this.serviceName,
                all:true
            }
            if (confirm('Are you sure you want to delete this jobs?')) {
                this.deleteAllJobCall(params, this.deleteAllJobCallback);
			}

        },
        deleteAllJobCallback(response){
            if (response.status==204) {   //check response
                window.getApp.$emit('APP_SHOW_SNACKBAR', { text: `All Jobs had been deleted`, color: 'success' })    
                this.jobs = []
			}else{
				window.getApp.$emit('APP_SHOW_SNACKBAR', { text: response, color: 'error' })
			}
            
        },
        deleteSuccessJobs(){
            var params = {
                serviceName: this.serviceName,
                all:false
            }
            if (confirm('Are you sure you want to delete the successful jobs?')) {
                this.deleteAllJobCall(params, this.deleteSuccessJobCallback);
			}

        },
        deleteSuccessJobCallback(response){
            var _this = this
            if (response.status==204) {   //check response
                setTimeout(function(){
                    _this.handleUpdate()
                },3000)
                window.getApp.$emit('APP_SHOW_SNACKBAR', { text: `Successful Jobs had been deleted`, color: 'success' })    
			}else{
				window.getApp.$emit('APP_SHOW_SNACKBAR', { text: response, color: 'error' })
			}
            
        },
        listJobsCallback(response){
            if(response.status == 200){
                if(Object.keys(response.data).length > 0){
                this.show_spinner = false;
				this.jobs =  Object.keys(response.data).map((key,index) => {
					return {
						name: key,
						status: response.data[key].status,
						creation: Date.parse(response.data[key].creation_time),
						start: response.data[key].start_time,
						finish: response.data[key].finish_time,
					}
				})
				this.loading = false;
                }else{
                    this.show_spinner=false
                    this.loading = false
                    this.jobs = []
                }
            }else{
                this.listJobsCall(this.serviceName, this.listJobsCallback);
            }

        },
        goInvoke(){
            this.$router.push({name: "Invoke", params:{serviceName:this.serviceName}}).catch(err => {})
        }
		
	},
	created: function () {
         if(this.$route.params.serviceName){
             this.serviceName = this.$route.params.serviceName
                this.listJobsCall(this.serviceName, this.listJobsCallback);
        }
  	}	
}
</script>

<style scoped>
  h1, h2 {
    font-weight: normal;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
    margin: 0 10px;
  }
  a {
    color: #42b983;
  }
  .openFaas {
    background-color: #e6e7e8 !important;
  }

  .clickable {
  cursor: pointer;
}
</style>
