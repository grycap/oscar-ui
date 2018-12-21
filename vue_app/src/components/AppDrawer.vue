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
				<!-- <v-list dense >
					<template v-for="(item, i) in menus" > -->
						
						<!-- <v-list-group :id="item.title" v-if="item.items" :key="item.name" :group="item.group" 
									:prepend-icon="item.icon" no-action v-model="item.active">
						
							<v-list-tile slot="activator" >
								<v-list-tile-content>
								<v-list-tile-title>{{ item.title }}</v-list-tile-title>
								</v-list-tile-content>
							</v-list-tile>
						
							
							
								<v-list-tile v-for="(subItem, k) in item.items" :key="k" :to="{path:subItem.to}" v-model="subItem.active">
									<v-list-tile-action>
										<span>{{ subItem.title }}</span>
									</v-list-tile-action>  
								</v-list-tile>               
							
							
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
						</v-list-group> -->
						<!-- <v-subheader v-if="item.header" :key="i">{{ item.header }}</v-subheader>
						<v-divider v-else-if="item.divider" :key="i"></v-divider> -->
						<!--top-level link-->
						<!-- <v-list-tile v-else :to="!item.href ? { name: item.name } : null" :href="item.href" ripple="ripple"
									:disabled="item.disabled" :target="item.target" rel="noopener" :key="item.name">
						<v-list-tile-action v-if="item.icon">
							<v-icon>{{ item.icon }}</v-icon>
						</v-list-tile-action>
						<v-list-tile-content>
							<v-list-tile-title>{{ item.title }}</v-list-tile-title>
						</v-list-tile-content>
						</v-list-tile>

						
					</template>
				</v-list>	 -->


				<v-subheader>Apps</v-subheader>				  

				<v-flex row xs12 >				
					<v-btn id="btn_dash" style="justify-content:left"  depressed round flat block small @click.native="collapse('btn_dash')" >		
						<v-icon left style="padding-right:12px" >dashboard</v-icon>
						<span v-show="this.mini==false">Dashboard</span> 						
					</v-btn>                    
				</v-flex>				  
				
						
				<v-flex row xs12 >				
					<v-btn id="btn_storage"	 depressed round flat block small @click.native="collapse('btn_storage')" >		
						<v-icon id="icloud" left style="padding-right:12px" >cloud</v-icon>
						<span v-show="this.mini==false">Storage</span> 
						<v-spacer></v-spacer>
						<v-icon v-show="this.mini==false" id="expand_sto" right >{{expand_sto}}</v-icon>
					</v-btn>                    
				</v-flex>	
								
				<v-flex xs10 offset-xs2 id="name_buckets" > 
				

					<template v-for="(item) in menus" >
					
						<v-list :id="item.title" v-if="item.items" :key="item.name" :group="item.group" 
									:prepend-icon="item.icon" no-action >
						
							<v-list-tile slot="activator" >
								<v-list-tile-content>
								<v-list-tile-title>{{ item.title }}</v-list-tile-title>
								</v-list-tile-content>
							</v-list-tile>							
							
							
								<v-list-tile v-for="(subItem, k) in item.items" :key="k" :to="{path:subItem.to}" v-model="subItem.active">
									<v-list-tile-action style="font-size:13px;">
										<span>{{ subItem.title }}</span>
									</v-list-tile-action>  
								</v-list-tile>               
							
							
								<v-btn id="menu_create" v-show="!menucreate" flat color="blue-grey" class="white--text" @click="menucreate = true"><v-icon left ligth color="blue">add_circle</v-icon>Create Bucket</v-btn>                                             
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
						</v-list>	
										
					</template>
				</v-flex>

				<v-flex row xs12 >				
					<v-btn id="btn_funct"  depressed round flat block small @click.native="collapse('btn_funct')" >		
						<v-icon left style="padding-right:12px">functions</v-icon>
						<span v-show="this.mini==false">Functions</span>						
					</v-btn>                    
				</v-flex>

				<v-flex row xs12 >				
					<v-btn id="btn_sett"  depressed round flat block small @click.native="collapse('btn_sett')" >		
						<v-icon left style="padding-right:12px">settings</v-icon>
						<span v-show="this.mini==false">Settings</span>						
					</v-btn>                    
				</v-flex>

				<v-flex row xs12 >				
					<v-btn id="btn_logout" depressed round flat block small @click.native="collapse('btn_logout')" >		
						<v-icon  left style="padding-right:12px">exit_to_app</v-icon>
						<span v-show="this.mini==false">Log Out</span>						
					</v-btn>                    
				</v-flex>

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
    test: true,
    mini: false,
	drawer: true,
	drawer2: false,
	expand_sto: "expand_more",
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
			console.log(this.mini)
      this.drawer = (!this.drawer)
      this.menucreate = false;

    })
    window.getApp.$on('APP_DRAWER_MINI', () => {
			console.log(this.mini)
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
	var _this = this;
	this.$nextTick(function(){
		if(_this.$route.name  == 'Dashboard'){
			$("#btn_dash").css("color","#0056b3")
		}else if(_this.$route.name  == 'Functions'){
			$("#btn_funct").css("color","#0056b3")
		}else if(_this.$route.name  == 'Settings'){
			$("#btn_sett").css("color","#0056b3")
		}else if(_this.$route.name  == 'BucketContent'){
			$("#btn_storage").css("color","#0056b3")
			$("#name_buckets").css("display", "block")
			
		}
		})
		
			
  },
//   watch: {
// 	  $route(route){		  
// 		  for(var i in this.menus){	
// 			  console.log(route)
// 			  if(this.menus[i].title == "Storage"){
// 				//   console.log(this.menus[i].title)		  
// 				//   console.log(this.menus[i].active)		  
// 				//   this.menus[i].active = false
// 					//   console.log(route)
// 				  for(var k in this.menus[i].items){
// 					  if(this.menus[i].items[k].to == route.path){
// 						  var _this = this
// 						  var i2 = i
// 						  var k2 = k
// 						  this.$nextTick(function(){
// 							//   console.log(_this.menus[i2].items,k2,i2)
// 							_this.menus[i2].items[k2].active = true
// 						  	_this.menus[i2].active = true
// 							})
						  
// 					  }else{
// 						  this.menus[i].items[k].active = false
// 					  }
// 				  }
// 			  }
// 		  }
// 	  }
//   },
	
  methods: {
	collapse(id){
		$("#btn_dash").css("color","#000!important")
		$("#btn_funct").css("color","#000!important")
		$("#btn_sett").css("color","#000!important")
		$("#btn_logout").css("color","#000!important")
		$("#btn_storage").css("color","#000!important")
		
		
		if(id == "btn_dash"){
			// $("#btn_dash").css("color","#0056b3")
			this.$router.push({name: "Dashboard"}) 
		}else if (id == "btn_funct"){
			// $("#btn_funct").css("color","#0056b3")
			this.$router.push({name: "Functions"}) 
		}else if (id == "btn_sett"){
			// $("#btn_sett").css("color","#0056b3")
			this.$router.push({name: "Settings"})  
		}else if (id == "btn_logout"){
			// $("#btn_logout").css("color","#0056b3")
			this.$router.push({name: "Login"})
		}else if (id == "btn_storage"){
			$("#name_buckets").slideToggle("slow");					
			this.drawer2 = (!this.drawer2)
			if($("#name_buckets").css("display") == "block"){
				$("#btn_storage").css("color","#0056b3")				
			}else{
				$("#btn_storage").css("color","#ccc")				
			}			
			if (this.drawer2 == true){
				this.expand_sto = "expand_less"	
			}else if (this.drawer2 == false){
				this.expand_sto = "expand_more"				
			}
		}			
		},
	
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
        axios({ method: 'post', url: 'https://$VUE_APP_BACKEND_HOST:31114/makeBucket', data: params})
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
		this.test = true
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
	// goto(subItem, item){
		
	// 	for (var i in this.menus[item]["items"]){
	// 		console.log(this.menus[item]["items"][i])
	// 		if(i == subItem){
	// 			this.menus[item]["items"][i].active = true
	// 			// this.$router.push({path:this.menus[item]["items"][i].to})
	// 			this.$router.push({name:this.menus[item]["items"][i].to})
	// 			console.log(this.menus[item]["items"][i].to)
	// 		}else{
	// 			this.menus[item]["items"][i].active = false				
	// 		}
	// 	}	
	// 	this.menus[item].active = true
	// },
    getBucketsList () {
       axios({ method: 'post', url: 'https://$VUE_APP_BACKEND_HOST:31114/listbuckets'})
        .then((response) => {
          // handle success          
          this.buckets = response.data.map((bucket) => {
          return {
            title: bucket.name,
			      to: `/buckets/${bucket.name}`,
		      	active: false
          }
        })
        this.menus.find((obj) => {
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


#btn_storage,#btn_dash,#btn_funct,#btn_sett,#btn_logout {
	text-transform:capitalize;
	font-size:13px;	
	padding-left:30px;
	justify-content:left;
	color:#2b2b32;
	font-weight:400;
}

#btn_storage:hover,#btn_dash:hover,#btn_funct:hover,#btn_sett:hover,#btn_logout:hover {
    color: #0056b3;    
}

#btn_dash .v-btn__content,  #btn_funct .v-btn__content, #btn_sett .v-btn__content,#btn_logout .v-btn__content{
    justify-content: left!important;
	
}



#name_buckets {
    /* padding: 50px; */
    display: none;
}

#menu_create {
	padding-left: 0px;
}






</style>
