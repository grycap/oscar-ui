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
              <v-list-tile-sub-title>{{ file.lastModified }}</v-list-tile-sub-title>
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
      let formData = new FormData()

      /*
        Iteate over any file sent over appending the files
        to the form data.
      */
      for (let i = 0; i < this.files.length; i++) {
        let file = this.files[i]
        formData.append('files[' + i + ']', file, file.name)
        this.minioUpload(file).then((data) => {
          this.files.find((f) => {
            if (f.name === data.key) {
              f.showUploading = false
            }
          })
          this.files.splice(file.name, 1)
          window.getApp.$emit('APP_SHOW_SNACKBAR', {
            text: `The ${file.name} file has been successfully uploaded`,
            color: 'success'
          })
          window.getApp.$emit('FILE_UPLOADED', file)
        }).catch((err) => {
          window.getApp.$emit('APP_SHOW_SNACKBAR', {
            text: `Error uploading file ${file.name}. ${err.message}`,
            color: 'error'
          })
        })
      }
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
    minioUpload (file) {
      AWS.config.s3 = { s3BucketEndpoint: false }
      let s3Client = new AWS.S3({
        apiVersion: '2006-03-01',
        params: {Bucket: this.bucketName},
        endpoint: 'http://192.168.99.100:30001/',
        accessKeyId: 'minio',
        secretAccessKey: 'minio123',
        s3ForcePathStyle: true,
        signatureVersion: 'v4',
        logger: window.console
      })

      /* s3Client.upload({
        Bucket: this.bucketName,
        Key: file.name,
        Body: file
      }, function (err, data) {
        if (err) {
          console.error(err)
          return alert(err.message)
        }
        alert('Successfully uploaded photo.')
      }) */
      let params = {
        Bucket: this.bucketName,
        Key: file.name,
        Body: file
      }
      this.files.find((f) => {
        if (f.name === file.name) {
          f.showUploading = true
        }
      })
      return s3Client.putObject(params).promise()
    },
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
