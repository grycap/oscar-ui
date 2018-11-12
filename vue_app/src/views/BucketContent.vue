<template>
    <v-layout wrap v-if="showBucketContent" id="bucketContent">      
    	<app-drawer class="app--drawer"></app-drawer>
    	<app-toolbar class="app--toolbar"></app-toolbar>
		<v-flex xs12>
			<v-card>
			<v-card-title primary-title>
				<v-flex xs4>
				<span class="headline">Bucket <b>{{bucketName}}</b>: </span>
				</v-flex>
				<v-flex xs8 row>
				<v-text-field
					v-model="search"
					append-icon="search"
					label="Search"
					single-line
					hide-details
				></v-text-field>
				</v-flex>
			</v-card-title>
			<input-file :bucketName="bucketName"></input-file>
			</v-card>
		</v-flex>
		<v-flex row xs12>
			<v-slide-y-transition>
				<v-toolbar class="v-toolbar v-toolbar--fixed" id="actionBar"
							v-show="selectedItemsToolbar" color="primary" text-color="white"
							height="90px">
					<v-card flat color="primary" class="white--text">
					<v-card-title>
						<v-icon color="white" left>check_circle</v-icon>
						<span> &nbsp; {{selectedItems}} selected items</span>
					</v-card-title>
					</v-card>
					<v-spacer></v-spacer>
					<v-dialog v-model="dialog.visible" persistent max-width="290">
					<v-btn slot="activator" outline color="white">Delete selected</v-btn>
					<v-card>
						<v-card-title class="headline">
						<v-flex>
							<v-icon color="warning">warning</v-icon>{name: "Dashboard"}
							Are you sure you want to delete?
						</v-flex>
						</v-card-title>
						<v-card-text>This cannot be undone!</v-card-text>
						<v-card-text v-show="dialog.deleting">
						Deleting files
						<v-progress-linear
							indeterminate
							color="primary"
							class="mb-0"
						></v-progress-linear>
						</v-card-text>
						<v-divider></v-divider>
						<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="error" flat @click.native="dialog.visible = false">No</v-btn>
						<v-btn color="success" flat @click.native="removeSelectedFiles">Yes</v-btn>
						</v-card-actions>
					</v-card>
					</v-dialog>
					<v-btn outline color="white" @click.native="downloadFile">{{ downloadTitle }}</v-btn>
					<v-btn fab icon>
					<v-icon color="white" @click="closeActionsBar">cancel</v-icon>
					</v-btn>
				</v-toolbar>
			</v-slide-y-transition>
		</v-flex>
		<v-flex xs12>
			<v-data-table
			v-model="selected"
			:headers="headers"
			:items="files"
			class="elevation-1"
			item-key="name"
			:search="search"
			:pagination.sync="pagination"
			select-all
			>
				<template slot="items" slot-scope="props">
					<tr>
					<th>
						<v-checkbox
						:input-value="props.all"
						:indeterminate="props.indeterminate"
						primary
						hide-details
						@click.native="toggleAll"
						></v-checkbox>
					</th>
					<th
						v-for="header in props.headers"
						:key="header.text"
						:class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
						@click="changeSort(header.value)"
					>
						<v-icon small>arrow_upward</v-icon>
						{{ header.text }}
					</th>
					</tr>
				</template>
				<template slot="items" slot-scope="props" expand="true">
					<tr :active="props.selected">
					<td class="justify-center" @click="props.selected = !props.selected" >
						<v-checkbox
						:input-value="props.selected"
						primary
						hide-details
						></v-checkbox>
					</td>
					<td class="text-xs-center">{{ props.item.name }}</td>
					<td class="text-xs-center">{{ filesize(props.item.size) }}</td>
					<td class="text-xs-center">{{ moment(props.item.lastModified).format("YYYY-MM-DD HH:mm") }}</td>
					<td class="justify-center layout px-0">
						<v-icon small @click="removeFile(props.item)" color="red darken-2">delete_forever</v-icon>
					</td>
					</tr>
				</template>
				<template slot="no-data">
					<div v-show="show_spinner" style="position:fixed; left:50%;">	
						<intersecting-circles-spinner :animation-duration="1200" :size="50" :color="'#0066ff'" />              		
					</div>
					<v-alert v-show="!show_spinner" :value="true" color="error" icon="warning">
						Sorry, there are no files to display in this bucket :(
					</v-alert>
					<!-- <v-alert  color="error" icon="warning" v-show >
					Sorry, there are no files to display in this bucket :(
					</v-alert> -->
				</template>
				<v-alert slot="no-results" :value="true" color="error" icon="warning">
					Your search for "{{ search }}" found no results.
				</v-alert>
			</v-data-table>
		</v-flex>
		<v-layout xs12 align-end justify-end row id="create">
			<v-speed-dial
			v-model="speedDial.fab"
			:top="false"
			:bottom="true"
			:right="true"
			:left="false"
			direction="top"
			:open-on-hover="false"
			transition="scale-transition"
			:absolute="false"
			>
				<v-btn
					slot="activator"
					v-model="speedDial.fab"
					color="blue darken-2"
					dark
					fab
				>
					<v-icon>cloud_queue</v-icon>
					<v-icon>close</v-icon>
				</v-btn>
				<v-btn
					fab
					dark
					small
					color="green"
					@click="menu = true"
				>
					<v-icon>add</v-icon>
				</v-btn>
				<v-btn
					fab
					dark
					small
					color="red"
					@click="removeBucket(bucketName)"
				>
					<v-icon>delete</v-icon>
				</v-btn>
			</v-speed-dial>
		</v-layout>
		<v-container xs12 grid-list-xl id="createMenu">
			<v-layout row justify-space-between>
				<v-flex xs3 offset-xs8>
					<v-card v-show="menu">
						<v-flex xs12>
							<v-text-field
								label="Bucket name"
								v-model="newBucketName"
							></v-text-field>
							<span v-show="error" style="color: #cc3300; font-size: 12px;"><b>Bucket name is required</b></span>
						</v-flex>
						<v-card-actions>
							<v-spacer></v-spacer>
							<v-btn color="error" flat @click="menu = false">Cancel</v-btn>
							<v-btn color="success" flat @click="createBucket(newBucketName)">Save</v-btn>
						</v-card-actions>
					</v-card>
				</v-flex>
			</v-layout>
		</v-container>
    </v-layout>
</template>
<script>
import InputFile from '@/components/widgets/InputFile'
import axios from 'axios'
import moment from 'moment'
import filesize from 'filesize'
import { IntersectingCirclesSpinner } from 'epic-spinners'
import AppDrawer from '@/components/AppDrawer'
import AppToolbar from '@/components/AppToolbar'
export default {
  components: {
    InputFile,
    IntersectingCirclesSpinner,
    AppDrawer,
    AppToolbar,
  },
  props: {
    bucketName: {
      type: String,
      default: '',
    },
    minioClient: {}
  },
  data: function () {
    return {
      error: false,
      moment : moment,
      filesize : filesize,
      showBucketContent: false,
      show_spinner: true,
      search: '',
      pagination: {
        sortBy: 'name'
      },
      selected: [],
      headers: [
        {
          text: 'Name',
          align: 'left',
          align: 'center',
          value: 'name'
        },
        { text: 'Size', align: 'center',value: 'size' },
        { text: 'Last Modified', align: 'center', value: 'lastModified' },
        { text: 'Actions', align: 'center',value: 'actions' }
      ],
      files: [],
      stream: '',
      speedDial: {
        fab: false
      },
      uploadingFile: {
        loading: false
      },
      dialog: {
        visible: false,
        deleting: false
      },
      menu: false,
      newBucketName: ''
    }
  },
  created: function () {
    /**
     *  Add the new file uploaded to list
     */   
    
    window.getApp.$on('FILE_UPLOADED', (file) => {
      this.addFileToList(file)
    })
     window.getApp.$on('GET_BUCKET_LIST', () => {      
      this.fetchData()
    })  
    
  },
  mounted: function () {
    this.bucketExists(this.bucketName)
      .then(exists => {
        if (exists) {
          this.showBucketContent = true
          this.fetchData()
        } else {
          let err = {
            message: `The ${this.bucketName} bucket does not exist`
          }
          throw err
        }
      })
      .catch(err => {
        window.getApp.$emit('APP_SHOW_SNACKBAR', {
          text: err.message,
          color: 'error'
        })
      })
  },
  watch: {
    $route: 'fetchData'
  },
  methods: {
    /**
     * Add file received from inputFile component
     * @param file
     */
       
    
    addFileToList (file) {
      var fileExist = false;      
      
      
      for (var i=0; i < this.files.length; i++){
        if (this.files[i].etag == file.etag){          
          fileExist = true;
        }        
      }       
      if (!fileExist) {
        this.files.push(file);
      }
    },
    toggleAll () {
      if (this.selected.length) this.selected = []
      else this.selected = this.files.slice()
    },
    changeSort (column) {
      if (this.pagination.sortBy === column) {
        this.pagination.descending = !this.pagination.descending
      } else {
        this.pagination.sortBy = column
        this.pagination.descending = false
      }
    },
    fetchData () {
      this.getBucketFiles(this.bucketName)
        .then(fileList => {
          this.files = fileList
        })
        .catch(err => {
          window.getApp.$emit('APP_SHOW_SNACKBAR', {
            text: err.message,
            color: 'error'
          })
        })
    },
    getBucketFiles (name) {
      return new Promise((resolve, reject) => {
        let files = []       
        var params = {'name': name }
        axios({ method: 'post', url: 'https://$VUE_APP_BACKEND_HOST:31114/listObjects', data: params})
        .then((response) => {         
          if (response.data.files.length == 0){
            this.show_spinner = false;
          }        
          if(response.data.err != ""){
            reject(err)   
          }
          if(response.data.files != ""){
            files=response.data.files          
          }
          resolve(files)
        })                     
      })      
    },
    bucketExists (name) {
      return new Promise((resolve, reject) => {
        var params = {'name': name }
        axios({ method: 'post', url: 'https://$VUE_APP_BACKEND_HOST:31114/bucketExists', data: params})
        .then((response) => {
          resolve(response) 
        })
        .catch((error) => {
          // handle error
          reject(error)
        })       
      })
    },
    closeActionsBar () {
      this.selected = []
    },
    downloadFile(){
      let toDownload = []
      this.selected.map((sel) => {
        return toDownload.push(sel.name)
      })      
       var params = {'bucketName': this.bucketName, "fileName": toDownload, "select": this.selected.length }
       if (this.selected.length == 1){
         axios({ 
         method: 'post', 
         url: 'https://$VUE_APP_BACKEND_HOST:31114/downloadFile', 
         data: params,
         responseType: 'blob', // important
         })
        .then((response) => {     
          
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', toDownload[0]);
            document.body.appendChild(link);
            link.click();              
        
        })
        .catch((error) => {                   
          window.getApp.$emit('APP_SHOW_SNACKBAR', {
          text: error.message,
          color: 'error'
        })
        })   
       }else {
        axios({ 
         method: 'post', 
         url: 'https://$VUE_APP_BACKEND_HOST:31114/downloadFile', 
         data: params,
         responseType: 'arraybuffer', // important
        
         })
        .then((response) => {          
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', this.bucketName + '.zip');
            document.body.appendChild(link);
            link.click();          
         })
        .catch((error) => {          
          window.getApp.$emit('APP_SHOW_SNACKBAR', {
          text: error.message,
          color: 'error'
        })
        })   
       }
           
    },
    removeSelectedFiles () {
      this.show_spinner = false
      this.dialog.deleting = true
      let toRemove = []
      this.selected.map((sel) => {
        return toRemove.push(sel.name)
      })
      this.minioRemoveFile(toRemove).then(() => {
        window.getApp.$emit('APP_SHOW_SNACKBAR', {
          text: `Files deleted correctly`,
          color: 'success'
        })        
        this.selected.map((sel) => {
          return this.files.splice(this.files.indexOf(sel), 1)
        })
        
        this.dialog.deleting = false
        this.dialog.visible = false
        this.closeActionsBar()
      }).catch((err) => {
        window.getApp.$emit('APP_SHOW_SNACKBAR', {
          text: err.message,
          color: 'error'
        })
        this.getBucketFiles(this.bucketName)
      })
    },
    removeFile (file) {
      const index = this.files.indexOf(file)
      if (confirm('Are you sure you want to remove this file?')) {
        this.minioRemoveFile([file.name]).then(() => {
          this.files.splice(index, 1)
          window.getApp.$emit('APP_SHOW_SNACKBAR', {
            text: `File ${file.name} deleted correctly`,
            color: 'success'
          })          
        }).catch((err) => {
          window.getApp.$emit('APP_SHOW_SNACKBAR', {
            text: err.message,
            color: 'error'
          })
          this.getBucketFiles(this.bucketName)
        })
      }
    },
    minioRemoveFile (fileName) {      
      return new Promise((resolve, reject) => {
        var params = {'bucketName': this.bucketName, "fileName": fileName }
        axios({ method: 'post', url: 'https://$VUE_APP_BACKEND_HOST:31114/removeFile', data: params})
        .then((response) => {
          resolve(response)
        })
        .catch((error) => {
          // handle error
          reject(error)
        })         
        
      })
    },
    createBucket (name) {
      this.error = false;
      if(this.newBucketName.length > 0){
      this.minioCreateBucket(name).then(() => {
        window.getApp.$emit('APP_SHOW_SNACKBAR', {
          text: `Bucket ${name} has been successfully created`,
          color: 'success'
        })
        window.getApp.$emit('REFRESH_BUCKETS_LIST')
      }).catch((err) => {
        if(err.response.data.code == "BucketAlreadyOwnedByYou"){
          window.getApp.$emit('APP_SHOW_SNACKBAR', {
          text: "The bucket already exists",
          color: 'error'
        })
        }else{
        window.getApp.$emit('APP_SHOW_SNACKBAR', {
          text: err.message,
          color: 'error'
        })
        }
      }).finally(() => {
        this.menu = false
        this.newBucketName = ''
      })
      }else {
        this.error = true;
      }
    },
    minioCreateBucket (name) {
      return new Promise((resolve, reject) => {
        var params = {'name': name.replace(/[^A-Z0-9]+/ig, "")};
        axios({ method: 'post', url: 'https://$VUE_APP_BACKEND_HOST:31114/makeBucket', data: params})
        .then((response) => {
          resolve(response)
        })
        .catch((err) => {
          // handle error
          reject(err)
           
        })           
      })
    },
    
    removeBucket (name) {
      return new Promise((resolve, reject) => {
        var params = {'name': name}
        axios({ method: 'post', url: 'https://$VUE_APP_BACKEND_HOST:31114/removeBucket', data: params})
        .then((response) => {
          window.getApp.$emit('APP_SHOW_SNACKBAR', {
          text: `Bucket ${name} has been successfully deleted`,
          color: 'success'
        })
        window.getApp.$emit('REFRESH_BUCKETS_LIST')      
        // window.location.href = "/dashboard"; 
        this.$router.push({name: "Dashboard"})   
        })
        .catch((err) => {
          // handle error          
          if (err.response.data.code == "BucketNotEmpty"){
            window.getApp.$emit('APP_SHOW_SNACKBAR', {
            text: "The bucket is not empty",
            color: 'error'
            })
          }else {
            window.getApp.$emit('APP_SHOW_SNACKBAR', {
            text: err.message,
            color: 'error'
            })
          }
        }) 
        
      })
    }
  },
  computed: {
    selectedItems () {
      return this.selected.length
    },
    selectedItemsToolbar () {
      return this.selected.length > 0
    },
    downloadTitle () {
      return this.selected.length === 0 || this.selected.length === 1 ? 'Download object' : 'Download all as zip'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  /* This is for documentation purposes and will not be needed in your application */
  #create .v-speed-dial {
    position: absolute;
  }

  #create .v-btn--floating {
    position: relative;
  }
  #actionBar {
    z-index: 4;
  }
</style>
