<template>
  <v-toolbar color="teal darken-1" fixed dark app>
    <v-toolbar-side-icon @click.stop="handleDrawerToggle"></v-toolbar-side-icon>
    <v-btn icon @click.stop="handleDrawerMini">
      <v-icon v-html="mini ? 'chevron_right' : 'chevron_left'"></v-icon>
    </v-btn>
    
    <div class="rightside">
      <div class="seconddiv">
        <div class="identifieruser">
          <strong >{{showinfo}}</strong>
        </div>
        <v-btn class="fullscreen" icon @click="handleFullScreen()">
          <v-icon>fullscreen</v-icon>
        </v-btn>
      </div>
    </div>
  </v-toolbar>
</template>
<script>
import NotificationList from '@/components/widgets/list/NotificationList'
import Util from '@/util'
/* eslint-disable */
export default {
  name: 'app-toolbar',
  components: {
    NotificationList
  },
  data: () => ({
    showinfo:  (localStorage.getItem("user")?localStorage.getItem("user"):"EGI Authentication")+" - " + localStorage.getItem("api") ,
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
<style>

.rightside{
  width: 100%;
}
.seconddiv{
  float: right;
}
.identifieruser{
  display: inline;
  
}
.identifieruser strong{
  font-family:  Roboto;
  display: inline;
  font-size: 15px;
  vertical-align: middle;
}

</style>