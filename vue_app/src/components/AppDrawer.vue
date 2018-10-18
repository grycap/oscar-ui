<template>
    <v-navigation-drawer id="appDrawer" :clipped="clipped" :mini-variant.sync="mini" fixed :dark="$vuetify.dark" app
                        v-model="drawer" width="260">
      <v-toolbar color="primary darken-1" dark>
        <img src="@/assets/logo.png" height="36" alt="OSCAR">
        <v-toolbar-title class="ml-0 pl-3">
          <!-- <span class="hidden-sm-and-down">OSCAR</span> -->
          <span >OSCAR</span>
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
                <!-- addings button -->
                <v-btn v-show="!menucreate" flat color="blue-grey" class="white--text" @click="menucreate = true"><v-icon left ligth color="blue">add_circle</v-icon>Create Bucket</v-btn>                                             
                  <div v-show = "menucreate" style="margin:10px" class="form-group">                     
                     <div class="input-group">
                      <input type="text" class="form-control" id="bucketname"  v-model="newBucketName" placeholder="Bucket name" autofocus  style="border-right: none; border-left:none; border-top:none; hover: "/>                     
                      
                      <div class="input-group-append mr-2">                        
                        <button class="" type="button" @click="createBucket(newBucketName)"><v-icon left color="green">check_circle</v-icon></button>
                        <button class="" type="button" @click="cleanfield()"><v-icon left color="red">cancel</v-icon></button>                        
                      </div>
                      <span v-show="error" style="color: #cc3300; font-size: 12px;"><b>Bucket name is required</b></span>                   
                  </div>            
                  </div>                 
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
import axios from 'axios'
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
    error: false,        
    clipped: false,
    mini: false,
    drawer: true,
    menus: menu,
    scrollSettings: {
      maxScrollbarLength: 160
    },
    buckets: [],
    menucreate: false,
    menuname: false,
    deleteBucketName: '',
    newBucketName: ''
  }),
  computed: {
    computeLogo () {
      return '@/assets/logo.png'
    }
  },
  created () {
    window.getApp.$on('APP_DRAWER_TOGGLED', () => {
      this.drawer = (!this.drawer)
      this.menucreate = false;

    })
    window.getApp.$on('APP_DRAWER_MINI', () => {
      this.mini = (!this.mini)
      this.menucreate = false;
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
    cleanfield(){
      this.menucreate = false;
      this.newBucketName = " ";
    },
    createBucket (name) {
      if (this.newBucketName.length > 0){
        this.error = false
      this.minioCreateBucket(name).then(() => {
        window.getApp.$emit('APP_SHOW_SNACKBAR', {
          text: `Bucket ${name} has been successfully created`,
          color: 'success'
        })
        window.getApp.$emit('REFRESH_BUCKETS_LIST')
        window.getApp.$emit('BUCKETS_REFRESH_DASHBOARD')
        
      }).catch((err) => {
        if(err.response.data.code == "BucketAlreadyOwnedByYou"){
          window.getApp.$emit('APP_SHOW_SNACKBAR', {
          text: "The bucket already exists",
          color: 'error'
        })
        }else{
        window.getApp.$emit('APP_SHOW_SNACKBAR', {
          text: err.message,
          color: 'error'
        })
        }
      }).finally(() => {
        this.menu = false
        this.newBucketName = ''
      })
      }else{
        this.error =true
        this.error_message_text = "Error"
      }
    },
    minioCreateBucket (name) {
      return new Promise((resolve, reject) => {
        var params = {'name': name.replace(/[^A-Z0-9]+/ig, "")};
        axios({ method: 'post', url: 'http://$VUE_APP_BACKEND_HOST:31114/makeBucket', data: params})
        .then((response) => {
          this.menucreate = false;
          this.newBucketName = " ";
          resolve(response)
        })
        .catch((err) => {
          // handle error
          reject(err)
           
        })           
      })
    },
    
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
       axios({ method: 'post', url: 'http://$VUE_APP_BACKEND_HOST:31114/listbuckets'})
        .then((response) => {
          // handle success          
          this.buckets = response.data.map((bucket) => {
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
        .catch((error) => {
          // handle error
          window.getApp.$emit('APP_SHOW_SNACKBAR', { text: error.response.data, color: 'error' })
        })     
    },    
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

.form-control:focus {
    color: #495057;
    background-color: #fff;
    border-color: #80bdff;
    outline: 0;
    box-shadow: none
}

</style>
