<template>
  <div id="media" class="media">
    <v-toolbar flat color="white">
      <v-spacer></v-spacer>
      <v-dialog v-model="dialog" max-width="500px">
        <v-btn slot="activator" color="teal" dark class="mb-2">
          <v-icon left>add_box</v-icon>
          Deploy new function
        </v-btn>
      </v-dialog>
    </v-toolbar>
    <template>
      <v-data-table
        :headers="headers"
        :items="functions"
        :loading="loading"
        class="elevation-1"
      >
        <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
        <template slot="items" slot-scope="props">
          <td class="justify-center layout px-0">
            <v-icon medium class="mr-2">{{props.item.ready ? 'check_circle_outline' : 'highlight_off'}}</v-icon>
          </td>
          <td class="text-xs-left">{{ props.item.name }}</td>
          <td class="text-xs-center">{{ props.item.availableReplicas }}</td>
          <td class="text-xs-center">{{ props.item.replicas }}</td>
          <td class="text-xs-center">{{ props.item.invocationCount }}</td>
          <td class="justify-center layout px-0">
            <v-icon small @click="deleteItem(props.item)">delete</v-icon>
          </td>
        </template>
        <template slot="no-data">
          <v-alert :value="true" color="error" icon="warning">
            Sorry, there are no functions to display here :(
          </v-alert>
        </template>
      </v-data-table>
    </template>
  </div>
</template>
<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import axios from 'axios'

export default {
  components: {
    VuePerfectScrollbar
  },
  data: () => ({
    dialog: false,
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
    editedIndex: '',
    editedItem: {}
  }),
  methods: {
    showDetail (func) {
      this.selectedFunction = func
    },

    deleteItem (item) {
      const index = this.functions.indexOf(item)
      confirm('Are you sure you want to delete this item?') && this.functions.splice(index, 1)
    },
    close () {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },

    save () {
      if (this.editedIndex > -1) {
        Object.assign(this.desserts[this.editedIndex], this.editedItem)
      } else {
        this.desserts.push(this.editedItem)
      }
      this.close()
    }
  },
  mounted: function () {
    axios.get('/system/functions')
      .then((response) => {
        // handle success
        this.functions = response.data.map((func) => {
          return {
            name: func.name,
            availableReplicas: func.availableReplicas,
            replicas: func.replicas,
            invocationCount: func.invocationCount,
            ready: (Number(func.availableReplicas) > 0)
          }
        })
        this.loading = false
        console.log(this.functions)
      })
      .catch((error) => {
        // handle error
        console.log(error)
      })
      .then(function () {
        // always executed
      })
  },
  watch: {
    dialog (val) {
      val || this.close()
    }
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
