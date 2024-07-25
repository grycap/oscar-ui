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
        <strong >  <button ref="myinput"  @click="copy">{{api}}</button>  </strong>
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
    showinfo:  (localStorage.getItem("user")?localStorage.getItem("user"): JSON.parse(localStorage.getItem("session")).user.info.name  )+" - " ,
    api: localStorage.getItem("api"),
    mini: false,
    notificationCounter: 3
  }),
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
    },
    copy() {
      navigator.clipboard.writeText(this.api);
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
}
.identifieruser button{
  size: 500;
}
</style>