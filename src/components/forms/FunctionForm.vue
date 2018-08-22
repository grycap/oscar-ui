<template>
  <v-layout row justify-end>
    <v-dialog v-model="dialog" persistent max-width="80%">
      <v-btn slot="activator" color="teal" dark class="mb-2">
        <v-icon left>add_box</v-icon>
        Deploy new function
      </v-btn>
      <v-card>
        <v-card-title>
          <span class="headline">{{title}}</span>
        </v-card-title>
        <v-subheader>
          Use this form to test a function or the &nbsp;<strong>faas-cli</strong>&nbsp; for more options. Define the function below:
        </v-subheader>
        <v-divider></v-divider>
        <v-progress-linear :active="progress.active" :indeterminate="true"></v-progress-linear>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field
                  label="Docker image"
                  hint="Insert Docker image from a public repository"
                  persistent-hint
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field label="Function name" required></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field label="Function process (optional)"></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field label="Network"
                              hint="Only for Docker swarm"
                              persistent-hint></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
          <small>* indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" flat @click.native="closeWithoutSave">Close</v-btn>
          <v-btn color="success" flat @click.native="saveFunction">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
export default {
  name: 'FunctionForm',
  data () {
    return {
      title: 'New Function',
      dialog: false,
      progress: {
        active: false
      }
    }
  },
  methods: {
    saveFunction () {
      console.log('Save function')
      this.dialog = false
    },
    closeWithoutSave () {
      console.log('Close without save')
      this.dialog = false
    }
  }
}
</script>

<style scoped>

</style>
