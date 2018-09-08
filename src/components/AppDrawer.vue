<template>
  <v-navigation-drawer id="appDrawer" :clipped="clipped" :mini-variant.sync="mini" fixed :dark="$vuetify.dark" app
                       v-model="drawer" width="260">
    <v-toolbar color="primary darken-1" dark>
      <img src="@/assets/logo.png" height="36" alt="OSCAR">
      <v-toolbar-title class="ml-0 pl-3">
        <span class="hidden-sm-and-down">OSCAR</span>
      </v-toolbar-title>
    </v-toolbar>
    <vue-perfect-scrollbar class="drawer-menu--scroll" :settings="scrollSettings">
      <v-list dense expand>
        <template v-for="(item, i) in menus">
          <!--group with subitems-->
          <v-list-group v-if="item.items" :key="item.name" :group="item.group"
                        :prepend-icon="item.icon" no-action>
            <!-- group header -->
            <v-list-tile slot="activator" ripple>
              <v-list-tile-content>
                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <!--child item-->
            <template v-for="(subItem, i) in item.items">
              <v-list-tile :key="i" :to="genChildTarget(item, subItem)" :href="subItem.href"
                           :disabled="subItem.disabled" :target="subItem.target" ripple>
                <v-list-tile-action>
                  <span>{{ subItem.title }}</span>
                </v-list-tile-action>
              </v-list-tile>
            </template>
          </v-list-group>
          <v-subheader v-else-if="item.header" :key="i">{{ item.header }}</v-subheader>
          <v-divider v-else-if="item.divider" :key="i"></v-divider>
          <!--top-level link-->
          <v-list-tile v-else :to="!item.href ? { name: item.name } : null" :href="item.href" ripple="ripple"
                       :disabled="item.disabled" :target="item.target" rel="noopener" :key="item.name">
            <v-list-tile-action v-if="item.icon">
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>
    </vue-perfect-scrollbar>
  </v-navigation-drawer>
</template>
<script>
import menu from '@/api/menu'
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
export default {
  name: 'app-drawer',
  components: {
    VuePerfectScrollbar
  },
  props: {
    expanded: {
      type: Boolean,
      default: true
    },
    minio: {},
    openFaaS: {},
    minioClient: {}
  },
  data: () => ({
    clipped: false,
    mini: false,
    drawer: true,
    menus: menu,
    scrollSettings: {
      maxScrollbarLength: 160
    },
    buckets: []
  }),
  computed: {
    computeLogo () {
      return '@/assets/logo.png'
    }
  },
  created () {
    window.getApp.$on('APP_DRAWER_TOGGLED', () => {
      this.drawer = (!this.drawer)
    })
    window.getApp.$on('APP_DRAWER_MINI', () => {
      this.mini = (!this.mini)
    })
    window.getApp.$on('REFRESH_BUCKETS_LIST', () => {
      this.getBucketsList()
    })
  },
  mounted: function () {
    this.getBucketsList()
    window.getApp.$emit('STORAGE_BUCKETS_COUNT', this.buckets.length)
  },
  methods: {
    genChildTarget (item, subItem) {
      if (subItem.href) return
      if (subItem.component) {
        return {
          name: subItem.component
        }
      }
      if (subItem.to) {
        return subItem.to
      }
      return {name: subItem.name}
    },
    getBucketsList () {
      this.minioClient.listBuckets((err, obtainedBuckets) => {
        if (err) return window.getApp.$emit('APP_SHOW_SNACKBAR', { text: err.message, color: 'error' })
        this.buckets = obtainedBuckets.map((bucket) => {
          return {
            title: bucket.name,
            to: `/buckets/${bucket.name}`
          }
        })
        menu.find((obj) => {
          if (obj.title === 'Storage') {
            obj.items = this.buckets
          }
        })
      })
    }
  }
}
</script>

<style lang="stylus">
  // @import '../../node_modules/vuetify/src/stylus/settings/_elevations.styl';

  #appDrawer
    overflow: hidden
    .drawer-menu--scroll
      height: calc(100vh - 48px)
      overflow: auto

</style>
