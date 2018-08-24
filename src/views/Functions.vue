<template>
    <v-card id="functions">
      <v-card-title>
        <v-text-field
          v-model="search"
          append-icon="search"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
        <v-spacer></v-spacer>
        <FunctionForm></FunctionForm>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="functions"
        :loading="loading"
        class="elevation-1"
        item-key="name"
        :search="search"
      >
        <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
        <template slot="items" slot-scope="props">
          <tr>
            <td class="justify-center layout px-0">
              <v-icon medium class="mr-2">{{props.item.ready ? 'check_circle_outline' : 'highlight_off'}}</v-icon>
            </td>
            <td class="text-xs-left">{{ props.item.name }}</td>
            <td class="text-xs-center">{{ props.item.availableReplicas }}</td>
            <td class="text-xs-center">{{ props.item.replicas }}</td>
            <td class="text-xs-center">{{ props.item.invocationCount }}</td>
            <td class="justify-center layout px-0">
              <v-icon small class="mr-2" @click="editFunction(props.item)">edit</v-icon>
              <v-icon small @click="deleteFunction(props.item)">delete</v-icon>
            </td>
          </tr>
        </template>
        <template slot="no-data">
          <v-alert :value="true" color="error" icon="warning">
            Sorry, there are no functions to display here :(
          </v-alert>
        </template>
        <v-alert slot="no-results" :value="true" color="error" icon="warning">
          Your search for "{{ search }}" found no results.
        </v-alert>
      </v-data-table>
    </v-card>
</template>
<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import axios from 'axios'
import FunctionForm from '@/components/forms/FunctionForm'

export default {
  components: {
    FunctionForm,
    VuePerfectScrollbar
  },
  data: () => ({
    size: 'lg',
    view: 'grid',
    selectedFunction: '',
    functions: [],
    headers: [
      {text: 'Ready', align: 'left', sortable: true, value: 'ready'},
      {text: 'Name', align: 'left', sortable: true, value: 'name'},
      {text: 'Available Replicas', value: 'availableReplicas'},
      {text: 'Replicas', value: 'replicas'},
      {text: 'Invocation Count', value: 'invocationCount'},
      {text: 'Actions', value: 'actions'}
    ],
    loading: true,
    search: ''
  }),
  methods: {
    editFunction (func) {
      const index = this.functions.indexOf(func)
      let funcInfo = {
        editionMode: true,
        name: this.functions[index].name,
        image: this.functions[index].image,
        process: this.functions[index].process,
        network: this.functions[index].network
      }
      window.getApp.$emit('FUNC_OPEN_MANAGEMENT_DIALOG', funcInfo)
    },
    deleteFunction (func) {
      const index = this.functions.indexOf(func)
      if (confirm('Are you sure you want to delete this function?')) {
        axios.delete('/system/functions', {
          data: {
            functionName: func.name
          }
        })
          .then((response) => {
            // handle success
            this.functions.splice(index, 1)
            window.getApp.$emit('APP_SHOW_SNACKBAR', { text: `Function ${func.name} was deleted`, color: 'success' })
          })
          .catch((error) => {
            // handle error
            window.getApp.$emit('APP_SHOW_SNACKBAR', { text: error.response.data, color: 'error' })
          })
          .then(function () {
            // always executed
          })
      }
    },
    loadFunctions () {
      axios.get('/system/functions')
        .then((response) => {
          // handle success
          this.functions = response.data.map((func) => {
            return {
              name: func.name,
              envProcess: func.envProcess,
              image: func.image,
              availableReplicas: func.availableReplicas,
              replicas: func.replicas,
              invocationCount: func.invocationCount,
              ready: (Number(func.availableReplicas) > 0)
            }
          })
          this.loading = false
        })
        .catch((error) => {
          // handle error
          console.log(error)
        })
        .then(function () {
          // always executed
        })
    }
  },
  created: function () {
    window.getApp.$on('FUNC_GET_FUNCTIONS_LIST', () => {
      this.loadFunctions()
    })
  },
  mounted: function () {
    this.loadFunctions()
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
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
