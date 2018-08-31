<template>
  <div id="app">
    <template v-if="!$route.meta.public">
      <v-app id="inspire" class="app">
        <app-drawer class="app--drawer"></app-drawer>
        <app-toolbar class="app--toolbar"></app-toolbar>
        <v-content>
          <v-container fluid wrap grid-list-md align-start justify-space-between>
            <router-view/>
          </v-container>
        </v-content>
      </v-app>
    </template>
    <template v-else>
      <transition>
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </transition>
    </template>
    <v-snackbar @show-snackbar="onShowSnackbar" center top v-model="snackbar.showBucketContent" :color="snackbar.color" :timeout="snackbar.timeout">
      {{ snackbar.text }}
      <v-btn dark flat @click="snackbar.show = false" icon>
        <v-icon>close</v-icon>
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import AppDrawer from '@/components/AppDrawer'
import AppToolbar from '@/components/AppToolbar'
import AppEvents from './event'
export default {
  name: 'App',
  components: {
    AppDrawer,
    AppToolbar,
    AppEvents
  },
  data: () => ({
    expanded: true,
    rightDrawer: false,
    snackbar: {
      showBucketContent: false,
      text: '',
      color: '', // ['success', 'info', 'error', 'cyan darken-2']
      timeout: 5000
    },
    breadcrumbList: {}
  }),
  computed: {
  },
  created () {
    AppEvents.forEach(item => {
      this.$on(item.name, item.callback)
    })
    window.getApp = this
    window.getApp.$on('APP_SHOW_SNACKBAR', (data) => {
      this.onShowSnackbar(data)
    })
  },
  methods: {
    onShowSnackbar (data) {
      this.snackbar.text = data.text
      this.snackbar.color = data.color
      this.snackbar.showBucketContent = true
    }
  },
  watch: {
    '$route' () {
      this.breadcrumbList = this.$route.meta.breadcrumb
    }
  }
}
</script>
