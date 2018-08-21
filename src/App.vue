<template>
  <div id="appRoot">
    <template v-if="!$route.meta.public">
      <v-app id="inspire" class="app">
        <app-drawer class="app--drawer"></app-drawer>
        <app-toolbar class="app--toolbar"></app-toolbar>
        <v-content>
          <v-breadcrumbs fixed>
            <v-icon slot="divider">chevron_right</v-icon>
            <v-breadcrumbs-item
              v-for="item in breadcrumbList"
              :disabled="item.disabled"
              :key="item.name"
              :to="item.link"
            >
              {{ item.name }}
            </v-breadcrumbs-item>
          </v-breadcrumbs>
          <router-view/>
        </v-content>
        <!--v-footer app>
          <v-flex primary lighten-3 py-1 text-xs-center white--text xs12>
            &copy;2018 - <strong>OSCAR</strong>
          </v-flex>
        </v-footer-->
      </v-app>
    </template>
    <template v-else>
      <transition>
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </transition>
    </template>
    <v-snackbar :timeout="3000" bottom right :color="snackbar.color" v-model="snackbar.show">
      {{ snackbar.text }}
      <v-btn dark flat @click.native="snackbar.show = false" icon>
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
    AppToolbar
  },
  data: () => ({
    expanded: true,
    rightDrawer: false,
    snackbar: {
      show: false,
      text: '',
      color: ''
    },
    breadcrumbList: {}
  }),

  computed: {},

  created () {
    AppEvents.forEach(item => {
      this.$on(item.name, item.callback)
    })
    window.getApp = this
  },
  methods: {
    openThemeSettings () {
      this.$vuetify.goTo(0)
      this.rightDrawer = (!this.rightDrawer)
    }
  },
  watch: {
    '$route' () {
      this.breadcrumbList = this.$route.meta.breadcrumb
    }
  }
}
</script>
