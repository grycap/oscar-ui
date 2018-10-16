<template>
  <v-layout xs12 align-center row>
    <v-flex xs4 row>
      <v-btn
        color="primary"
        class="white--text"
        @click.native="addFiles()"
      >
        Select files
        <v-icon right dark>note_add</v-icon>
      </v-btn>
      <v-btn
        :loading="showUploading"
        :disabled="showUploading"
        color="teal"
        class="white--text"
        @click.native="submitFiles()"
      >
        Upload
        <v-icon right dark>cloud_upload</v-icon>
      </v-btn>
    </v-flex>
    <v-flex xs8 row v-show="showSelectedFiles" id="selectedList">
      <v-flex xs12>
        <input type="file" id="files" ref="files" multiple v-on:change="handleFilesUpload()"/>
        <v-list two-line subheader dense>
          <v-subheader inset>Files</v-subheader>
          <v-list-tile
            v-for="(file, key) in files"
            :key="key"
            avatar
            @click.stop=""
          >
              <!--v-icon :class="[file.iconClass]">{{ file.icon }}</v-icon-->
              <v-progress-circular
                indeterminate
                color="teal"
                v-show="file.showUploading"
              >
              </v-progress-circular>

            <v-list-tile-content>
              <v-list-tile-title>{{ file.name }}</v-list-tile-title>
              <v-list-tile-sub-title>{{ moment(file.lastModified).format("YYYY-MM-DD HH:mm") }}</v-list-tile-sub-title>
            </v-list-tile-content>

            <v-list-tile-action>
              <v-btn icon ripple @click="removeFile(key)">
                <v-icon color="red lighten-1">remove_circle_outline</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-flex>
    </v-flex>
  </v-layout>
</template>

<script>
import AWS from 'aws-sdk'
import axios from 'axios'
import moment from 'moment'
export default {
  name: 'InputFile',
  props: {
    accept: {
      type: String,
      default: '*'
    },
    label: {
      type: String,
      default: 'Please choose...'
    },
    required: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean, // not yet possible because of data
      default: false
    },
    uploading: {
      type: Boolean,
      default: false
    },
    minioClient: {
      type: Object
    },
    bucketName: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      moment : moment,
      files: [],
      showUploading: false
    }
  },
  methods: {
    /**
     * Adds a file
     */
    addFiles () {
      this.$refs.files.click()
    },

    /**
     * Submits files to the server
     */
    submitFiles () {
      /*
        Initialize the form data
      */
      
      /*
        Iteate over any file sent over appending the files
        to the form data.
      */
      for (let i = 0; i < this.files.length; i++) {
        let formData = new FormData()        
        formData.append('file', this.files[i], this.files[i].name)
        formData.append("bucketName",this.bucketName);
        formData.append("key",i);
        var _this = this;
        // this.files[i].showUploading = true;
        this.files.find((f) => {
            if (f.name === this.files[i].name) {
              f.showUploading = true
            }
          })
        axios({ 
          headers: {'Content-Type': 'multipart/form-data'},
          method: 'post', 
          url: 'http://$VUE_APP_BACKEND_HOST:31114/minioUpload', 
          data: formData
        })
        .then((response) => {   
          // console.log(response)  
          // _this.files[response.data.key].showUploading = false;
          _this.files.find((f) => {
            if (f.name === response.data.name) {
              f.showUploading = false
            }
            
          })
          for (var i in _this.files){
            if (_this.files[i].name == response.data.name){
              var file = _this.files.splice(i, 1) 
              break;              
            }            
          }         
          window.getApp.$emit('APP_SHOW_SNACKBAR', {
            text: `The ${file[0].name} file has been successfully uploaded`,
            color: 'success'
          })          
          file[0].etag = response.data.etag                   
          window.getApp.$emit('FILE_UPLOADED', file[0])           
          window.getApp.$emit('GET_BUCKET_LIST')           

        }).catch((response) => {                  
          window.getApp.$emit('APP_SHOW_SNACKBAR', {
            text: `Error uploading file ${response.data.name}. ${response.data.err.message}`,            
            color: 'error'
          })
        })
      }
        // this.minioUpload(formData).then((data) => {
        //   this.files.find((f) => {
        //     if (f.name === data.key) {
        //       f.showUploading = false
        //     }
        //   })
        //   this.files.splice(file.name, 1)
        //   window.getApp.$emit('APP_SHOW_SNACKBAR', {
        //     text: `The ${file.name} file has been successfully uploaded`,
        //     color: 'success'
        //   })
        //   window.getApp.$emit('FILE_UPLOADED', file)
        // }).catch((err) => {
        //   window.getApp.$emit('APP_SHOW_SNACKBAR', {
        //     text: `Error uploading file ${file.name}. ${err.message}`,
        //     color: 'error'
        //   })
        // })
      
      /*
       * Make the request to the POST /select-files URL
       */
    },

    /**
     * Handles the uploading of files
     */
    handleFilesUpload () {
      let uploadedFiles = this.$refs.files.files

      /*
        Adds the uploaded file to the files array
      */
      for (let i = 0; i < uploadedFiles.length; i++) {
        uploadedFiles[i]['showUploading'] = false
        this.files.push(uploadedFiles[i])
      }
    },
    /**
     * Removes a select file the user has uploaded
     * @param key
     */
    removeFile (key) {
      this.files.splice(key, 1)
    },
    /**
     * Upload file to minio server
     * @param file
     */
    
    successUploadCallback (data) {
      console.log(this.files)
    }
  },
  computed: {
    showSelectedFiles () {
      return this.files.length > 0
    }
  }
}
</script>

<style>
  input[type="file"]{
    position: absolute;
    top: -500px;
  }

  #selectedList {
    max-height: 200px;
    overflow-y: auto;
  }
</style>
<style lang="stylus" scoped>
  .v-progress-circular
    margin: 1rem
</style>
