<template>
	<div row wrap>
		<v-dialog id="vdiag" lazy v-model="dialog" persistent :fullscreen="$vuetify.breakpoint.xs" max-width="50%" @keydown.esc="closeWithoutSave()">
			<v-btn slot="activator" color="teal" dark class="mb-2" @click="show('fdl')">
				<v-icon left>add_box</v-icon>
				Deploy with FDL
			</v-btn>
			<v-card >
				<v-toolbar flat :color="formColor" class="white--text" style="margin-bottom:10px;">
					<span class="headline" style="width:100%;text-align:center">{{ formTitle }}</span>
				</v-toolbar>
					<v-form  ref="form" v-model="form.valid" lazy-validation>
						<div>

						<ul class="nav nav-pills nav-fill" id="myTab" role="tablist" style="padding-right:5px; padding-left:5px;">
							<li class="nav-item" style="margin-rigth:10px;margin-left:10px;">
								<a class="nav-link active" id="fdl-tab" @click="show('fdl')" role="tab" aria-controls="fdl" aria-selected="true">FDL</a>
							</li>
							<li class="nav-item" style="margin-rigth:10px;margin-left:10px;">
								<a class="nav-link" id="script-tab" @click="show('script')" role="tab" aria-controls="script" aria-selected="false">Script</a>
							</li>
						</ul>

						<v-progress-linear :active="progress.active" :indeterminate="true"></v-progress-linear>

						<div class="tab-content" id="myTabContent" >
							<div class="tab-pane tab-pane-content fade show active"  id="fdl" role="tabpanel" aria-labelledby="fdl-tab" >
								<v-flex xs12 sm12 md12 text-center >
									<h3 style="margin: 2%;" >Select your FDL file</h3>
									<v-btn style="margin-bottom: 2%;" color="primary" class="white--text" @click="addFileFDL()">
										Select the fdl file
										<v-icon right dark>note_add</v-icon>
									</v-btn>
									<v-flex  xs12 sm12 md6 v-show="false" id="selectedList">
										<input type="file" id="files" ref="files" @change="selectFileFDL"/>
									</v-flex>
							
								</v-flex>
								<!-- style="margin-left: auto;  margin-right: auto; margin-bottom: 10%;" -->
								<v-flex xs6 style="margin-left: auto;  margin-right: auto; margin-bottom: 5%;" >
									<textarea v-model="form.file_content" class="form-control" required rows="20">
									</textarea>
								</v-flex>
							</div>
						</div>
						<div class="tab-content" id="myTabContent"  >
							<div class="tab-pane tab-pane-content fade show" style="text-align: center" id="script" role="tabpanel" aria-labelledby="script-tab" >
								<v-flex xs12 sm12 md12 text-center  >
									<h3 style="margin: 2%;">Select your script files</h3>
									<v-btn  style="margin-bottom: 2%;"  
									color="primary"
									class="white--text"
									@click="addFileScript()">
									Select the script(s) file(s)
									<v-icon right dark>note_add</v-icon>
									</v-btn>
									<v-flex xs12 sm12 md6 v-show="false" id="selectedList">
										<input type="file" id="filescript" ref="filescript" @change="selectFileScript" multiple/>
									</v-flex>
							
								</v-flex>
								<v-flex xs12 style="margin-left: auto;  margin-right: auto; margin-bottom: 5%;">
									<textarea v-show="false" v-model="form.script" class="form-control" required rows="4" style="white-space: pre-wrap;"></textarea>
									<v-list  style="text-align: center; display: block;"
									v-for="(value,key) in allscript"
									:key="key"	avatar @click.stop="">
									
										<p style="display: inline;"> {{key}} </p>
										<v-list-tile-action style="display: inline;">
											<v-btn icon ripple @click="removeFile(key)">
											<v-icon color="red lighten-1">remove_circle_outline</v-icon>
											</v-btn>
										</v-list-tile-action>
									</v-list>

									
										<i v-show="form.loading" class="fa fa-circle-o-notch fa-spin fa-2x fa-fw"></i>
										<v-icon v-show="form.check" style="color: green;">done</v-icon>
										<v-icon v-show="form.wrong" style="color: red;">warning</v-icon>

								</v-flex>
							</div>
						</div>
						<v-card-actions style="background-color:white;">
							<v-btn @click="closeWithoutSave()" flat color="grey">Cancel</v-btn>
							<v-btn @click="clear()" flat color="red">Clear</v-btn>
							<v-spacer></v-spacer>  
							<div class="rightside">
								<div class="seconddiv">
									<v-btn @click="submit()" flat color="success">SUBMIT</v-btn>
								</div>
							</div>
						</v-card-actions>
					</div>
				</v-form>
			</v-card>
		</v-dialog>
	</div>
</template>

<script>
import Services from '../../components/services';
import YAML from 'yaml'
/* eslint-disable */
export default {
	mixins:[Services],
	name: 'FDLForm',
	data () {
		return {
			dialog: false,
			
			files: [],
			filescript: [],
			allscript:{},
			form: {
				file_content:"",
				scriptname:"",
				script:"",
				loading: false,
				check: false,
				wrong: false,
			},
			progress: {
				active: false
			},
			
		}
	},
	watch:{
		"select_tab"(val){
			if(val == 'input_output'){llscript[key]
			this.form.script="1"
					this.storages_all.push("minio.default")
			}

		}
	},
	
	methods: {
		show(id){
			$("#myTabContent .tab-pane-content").removeClass("show active")
			$("#myTab .nav-link").removeClass("show active")
			$("#"+id).addClass("show active")
			$("#"+id+"-tab").addClass("show active")
			this.select_tab = id
		},
		selectFileFDL(event) {
          this.fileinput=event.target.files
          let reader = new FileReader();
          reader.onload = e => { this.form.file_content= e.target.result; };
          reader.readAsBinaryString(this.fileinput[0]);
		  
        },
		selectFileScript(event) {
          var fileinput=event.target.files
		  for (let index = 0; index < fileinput.length; index++) {
			const element = fileinput[index];
			let reader = new FileReader();
          	reader.onload = e => { 
				this.form.scriptname= element.name
				this.form.script=e.target.result
				this.allscript[this.form.scriptname]=this.form.script
			}
          	reader.readAsBinaryString(element)
		  }
        },
		removeFile(key) {
			delete this.allscript[key]
			this.form.script="1"
			this.form.script=""			
		},

		addFileFDL () {
			this.$refs.files.click()
		},
		addFileScript() {
			this.$refs.filescript.click()
		},
		closeWithoutSave() {
			//this.progress.active = false
			this.dialog = false
			this.clear()
		},
		validate(){
			if(this.form.file_content != "" && this.form.script != ""){
				try {
					var obj = YAML.parse(this.form.file_content); 
				} catch (error) {
					return false
				}
				return true				
			}
			return false
		},
		createHeader(){
			var if_token = this.checkIfToken();
			let headers = new Headers();
			if(if_token){
				const egi_session = localStorage.getItem("session");
				const json_egi = JSON.parse(egi_session)
				headers.set('Authorization', 'Bearer ' + json_egi.user.access_token);
			}else{
				const username_auth = localStorage.getItem("user");
				const password_auth = localStorage.getItem("password");
				headers.set('Authorization', 'Basic ' + window.btoa(username_auth + ":" + password_auth));
			}
			return headers
		},
		async submit () {
			if (this.validate()){
				this.form.loading=true
				let headers = this.createHeader();
				var options={
						method: 'get',
						headers: headers,
					}
				var params=this.prepareFunction()
				const response = await fetch(this.api+'/system/services',options);
				let result =""
				try{
					const json = await response.json();
					result = json.map(service => service.name);
				}catch(err) {
					console.error("ERROR with list services "+err);
					result = null
					options.method="PUT"
					var typecall="created"
				}
				console.log(result)
				for (let index = 0; index < params.length; index++) {
					if(result != null){
						if(result.includes(params[index].name)){
						options.method="PUT"
						var typecall="created"
						}else{
							options.method="POST"
							var typecall="edited"
						}
					}
					options.body= JSON.stringify(params[index])
					const response = await fetch(this.api+'/system/services',options);
					if(response.status==204 || response.status==201 ){
						window.getApp.$emit('APP_SHOW_SNACKBAR', 
						{ text: `Service ${params[index].name} was successfully ${typecall}.`,
						color: 'success', timeout: 5000 })
						this.form.check=true
						setTimeout(() => {
							this.form.check=false
						}, 5000);
					}else{
						window.getApp.$emit('APP_SHOW_SNACKBAR', { text: response, color: 'error' })
						this.form.wrong=true
						setTimeout(() => {
							this.form.wrong=false
						}, 5000);
					}
				}
				this.form.loading=false
				this.closeWithoutSave()
				
			}
		},
	
	
		clear () {
			this.files = []
			this.filescript = []
			this.form.file_content=""
			this.form.script=""
			this.form.scriptname=""
			this.allscript={}

		},
		prepareFunction(){
			var obj = YAML.parse(this.form.file_content);
			var services=[]
			var scriptindex=0
			obj.functions.oscar.forEach(service => {
				var serviceparams= service[Object.keys(service)[0]] 
				if(obj.functions.oscar.length == 1){
					serviceparams.script=this.allscript[Object.keys(this.allscript)[0]]
				}else{
					serviceparams.script=this.allscript[serviceparams.script]
					scriptindex+=1
				}
				serviceparams.storage_providers=obj.storage_providers
				serviceparams.clusters=obj.clusters
				services.push(serviceparams)

			});

			return services
		},
		
	},
	computed: {

		formTitle () {
			return this.editionMode ? 'Edit Service' : 'New Service'
		},
		formColor () {
			return this.editionMode ? 'blue lighten-2' : 'teal lighten-3'
		}

	},
}
</script>

<style scoped>


.rightside{
  width: 100%;
}
.seconddiv{#dropzone{
	display: inline;
}
  float: right;
}


.active {
	color: black !important;
  	background-color: transparent !important;
  	border-bottom: yellowgreen solid 2px;
}
.list__tile {
  height: 6rem !important;
}
 #flip {
    /* padding: 5px; */
    /* text-align: center; */
    background-color: #e5eecc;
    border: solid 1px #c3c3c3;
}

#panel {
    /* padding: 50px; */
    display: none;
}

#test {
  text-align: left,
}
.v-btn.v-btn--outline {
    border: none;
    background: transparent !important;
    box-shadow: none;
}

	/* Small devices (landscape phones, 576px and up)*/
@media (min-width: 576px) {
		.custom-select{
		height: calc(2.25rem + 3px);
		width: 100%
	}
	}

/*Medium devices (tablets, 768px and up)*/
@media (min-width: 768px) {
	.custom-select{
		height: calc(2.25rem + 3px);
		width: 100%
	}
	}

/*Large devices (desktops, 992px and up)*/
@media (min-width: 992px) {
	.custom-select{
		height: calc(2.25rem + 3px);
		width: 100%
	}
	}

/* Extra large devices (large desktops, 1200px and up)*/
@media (min-width: 1200px) {
	.custom-select{
		height: calc(2.25rem + 3px);
		width: 75%
	}
	jajaj	.pad-down-def{
		padding-bottom:20px;
	}
}
</style>
