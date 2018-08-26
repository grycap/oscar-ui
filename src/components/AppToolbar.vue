<template>
  <v-toolbar color="primary" fixed dark app>
    <v-toolbar-side-icon @click.stop="handleDrawerToggle"></v-toolbar-side-icon>
    <v-btn icon @click.stop="handleDrawerMini">
      <v-icon v-html="mini ? 'chevron_right' : 'chevron_left'"></v-icon>
    </v-btn>
    <!--v-text-field flat solo-inverted prepend-icon="search" label="Search" class="hidden-sm-and-down">
    </v-text-field-->
    <v-spacer></v-spacer>
    <v-btn icon @click="handleFullScreen()">
      <v-icon>fullscreen</v-icon>
    </v-btn>
    <v-menu offset-y origin="center center" class="elelvation-1" :nudge-bottom="14" transition="scale-transition">
      <v-btn icon flat slot="activator">
        <v-badge color="pink" overlap v-model="notificationShow">
          <span slot="badge"> {{ notificationCounter }}</span>
          <v-icon medium>notifications</v-icon>
        </v-badge>
      </v-btn>
      <notification-list></notification-list>
    </v-menu>
    <!--v-menu offset-y origin="center center" :nudge-bottom="10" transition="scale-transition">
      <v-btn icon large flat slot="activator">
        <v-avatar size="30px">
          <img src="/static/avatar/man_4.jpg" alt="Michael Wang"/>
        </v-avatar>
      </v-btn>
      <v-list class="pa-0">
        <v-list-tile v-for="(item,index) in items" :to="!item.href ? { name: item.name } : null" :href="item.href" @click="item.click" ripple="ripple" :disabled="item.disabled" :target="item.target" rel="noopener" :key="index">
          <v-list-tile-action v-if="item.icon">
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-menu-->
  </v-toolbar>
</template>
<script>
import NotificationList from '@/components/widgets/list/NotificationList'
import Util from '@/util'

export default {
  name: 'app-toolbar',
  components: {
    NotificationList
  },
  data: () => ({
    mini: false,
    items: [
      {
        icon: 'account_circle',
        href: '#',
        title: 'Profile',
        click: (e) => {
          console.log(e)
        }
      },
      {
        icon: 'settings',
        href: '#',
        title: 'Settings',
        click: (e) => {
          console.log(e)
        }
      },
      {
        icon: 'fullscreen_exit',
        href: '#',
        title: 'Logout',
        click: (e) => {
          window.getApp.$emit('APP_LOGOUT')
        }
      }
    ],
    notificationCounter: 3
  }),
  computed: {
    notificationShow () {
      return (this.notificationCounter > 0)
    }
  },
  methods: {
    handleDrawerToggle () {
      window.getApp.$emit('APP_DRAWER_TOGGLED')
    },
    handleDrawerMini () {
      this.mini = !this.mini
      window.getApp.$emit('APP_DRAWER_MINI')
    },
    handleFullScreen () {
      Util.toggleFullScreen()
    }
  }
}
</script>
