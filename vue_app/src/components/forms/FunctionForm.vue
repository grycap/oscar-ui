<template>
  <v-layout row justify-end>
    <v-dialog v-model="dialog" persistent max-width="80%">
      <v-btn slot="activator" color="teal" dark class="mb-2">
        <v-icon left>add_box</v-icon>
        Deploy new function
      </v-btn>
      <v-card >
        <v-form ref="form" v-model="form.valid" lazy-validation>
            <v-toolbar flat :color="formColor" class="white--text">
              <span class="headline">{{ formTitle }}</span>
            </v-toolbar>
          <v-divider></v-divider>
          <v-progress-linear :active="progress.active" :indeterminate="true"></v-progress-linear>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field
                    v-model="form.image"
                    :rules="form.imageRules"
                    :counter="200"
                    label="Docker image:"
                    required
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    v-model="form.name"
                    :rules="form.nameRules"
                    :counter="200"
                    label="Function name"
                    required
                    :disabled="this.editionMode"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    v-model="form.process"
                    :counter="200"
                    label="Function process (Optional)"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    v-model="form.network"
                    :counter="200"
                    label="Network (Swarm)"
                    required
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions >
            <v-btn @click="closeWithoutSave" flat color="error">Cancel</v-btn>
            <v-btn @click="clear" flat color="warning">Clear</v-btn>
            <v-spacer></v-spacer>
            <v-btn :disabled="!form.valid" @click="submit" flat color="success">submit</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import axios from 'axios'
/* eslint-disable */
export default {
  name: 'FunctionForm',
  props: {
    openFaaS: {}
  },
  data () {
    return {
      dialog: false,
      editionMode: false,
      form: {
        valid: false,
        image: '',
        imageRules: [
          v => !!v || 'Docker image is required',
          v => (v && v.includes('/')) || 'The Docker image must comply with the nomenclature of Docker Hub images'
          // && /.+:.+/.test(v)
        ],
        name: '',
        nameRules: [
          v => !!v || 'Function name is required'
        ],
        process: '',
        network: ''
      },
      progress: {
        active: false
      }
    }
  },
  methods: {
    closeWithoutSave () {
      this.progress.active = false
      this.dialog = false
      this.clear()
    },
    submit () {
      if (this.$refs.form.validate()) {
        // Native form submission is not yet supported
        this.progress.active = true
        this.editionMode ? this.editFunction() : this.newFunction()
      }
    },
    clear () {
      this.$refs.form.reset()
      this.editionMode = false
    },
    newFunction () {
      var params = { 'type': 'new', 'url': this.openFaaS.endpoint, 'service': this.form.name, 'network': this.form.network, 'image': this.form.image, 'envProcess': this.form.process }
      axios({ method: 'post', url: 'http://localhost:3000', data: params })
      // {
      //   service: this.form.name,
      //   network: this.form.network,
      //   image: this.form.image,
      //   envProcess: this.form.process
      // })
        .then((response) => {
          // handle success
          window.getApp.$emit('APP_SHOW_SNACKBAR', { text: `Function ${this.form.name} has been deployed`, color: 'success' })
          this.dialog = false
          this.clear()
          this.updateFunctionsGrid()
        }).catch((error, data) => {
          // handle error
          window.getApp.$emit('APP_SHOW_SNACKBAR', { text: error.response.data, color: 'error' })
        }).then(() => {
          this.progress.active = false
        })
    },
    editFunction () {
      var params = { 'url': this.openFaaS.endpoint, 'service': this.form.name, 'network': this.form.network, 'image': this.form.image, 'envProcess': this.form.process }
      axios({ method: 'put', url: 'http://localhost:3000', data: params })
      // , {
      //   service: this.form.name,
      //   network: this.form.network,
      //   image: this.form.image,
      //   envProcess: this.form.process
      // })
        .then((response) => {
        // handle success
          window.getApp.$emit('APP_SHOW_SNACKBAR', { text: `Function ${this.form.name} has been updated`, color: 'success' })
          this.dialog = false
          this.clear()
          this.updateFunctionsGrid()
        }).catch((error, data) => {
          // handle error
          window.getApp.$emit('APP_SHOW_SNACKBAR', { text: error.response.data, color: 'error' })
        }).then(() => {
          this.progress.active = false
        })
    },
    updateFunctionsGrid () {
      window.getApp.$emit('FUNC_GET_FUNCTIONS_LIST')
    }
  },
  computed: {
    formTitle () {
      return this.editionMode ? 'Edit Item' : 'New Item'
    },
    formColor () {
      return this.editionMode ? 'pink' : 'primary'
    }
  },
  created: function () {
    window.getApp.$on('FUNC_OPEN_MANAGEMENT_DIALOG', (data) => {
      this.editionMode = data.editionMode
      this.form.name = data.name
      this.form.image = data.image
      this.form.process = data.process
      this.form.network = data.network
      this.dialog = true
    })
  }
}
</script>

<style scoped>

</style>
