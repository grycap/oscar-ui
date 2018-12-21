<template>
	<v-layout row justify-end>    
		<v-btn flat icon color="blue" @click="handleUpdate()">
      		<v-icon>autorenew</v-icon>
    	</v-btn>
		<v-dialog v-model="dialog" persistent max-width="80%">
			<v-btn slot="activator" color="teal" dark class="mb-2">
				<v-icon left>add_box</v-icon>
				Deploy new function
			</v-btn>
			<v-card >
				<v-form ref="form" v-model="form.valid" lazy-validation>
					<v-toolbar flat :color="formColor" class="white--text">
						<span class="headline">{{ formTitle }}</span>
					</v-toolbar>
				
					<v-progress-linear :active="progress.active" :indeterminate="true"></v-progress-linear>
					<v-card-text>
						<v-container grid-list-md>
							<v-layout wrap>
								<v-flex xs12>
									<v-text-field
										v-model="form.image"
										:rules="form.imageRules"
										:counter="200"
										label="Docker image:"
										required
									></v-text-field>
								</v-flex>

								<v-flex xs12>
									<v-text-field
										v-model="form.name"
										:rules="form.nameRules"
										:counter="200"
										label="Function name"
										required
										:disabled="this.editionMode"
									></v-text-field>
								</v-flex>               
								
								<v-flex xs12 sm12 md5 text-xs-center>
									<v-btn color="primary" class="white--text" @click.native="addFiles()"> Select a file<v-icon right dark>note_add</v-icon></v-btn>
								</v-flex>

								<v-flex xs12 sm12 md2 class="text-xs-center">
									<v-chip>or</v-chip>
								</v-flex>

								<v-flex xs12 sm12 md5>
									<div style="margin:10px" class="form-group">                     
									<div class="input-group">
										<input type="text" class="form-control" id="bucketname" v-model="url"   placeholder="URL" autofocus  style="border-right: none; border-left:none; border-top:none; hover: "/>                     
										
										<div class="input-group-append mr-2">                        
										<button class="" @click="readurl()" type="button"><v-icon left color="green">check_circle</v-icon></button>
										<button class="" @click="cleanfield()" type="button" ><v-icon left color="red">cancel</v-icon></button>                        
										</div>
									</div>            
									</div> 
								</v-flex>

								<v-flex xs12 text-xs-center>
									<span v-show="filerequire" style="color: #cc3300; font-size: 12px;"><b>Select a file or enter a URL</b></span>                   									
								</v-flex>
								
								<v-flex xs12 sm6 offset-sm3 v-show="showSelectedFiles"  id="selectedList" class="text-xs-center">
									<!-- <v-flex xs12> -->
										<input type="file" id="files" ref="files" hidden=true  v-on:change="handleFilesUpload()"/>								                  									
									
										<v-list subheader dense >
											<v-subheader inset>File</v-subheader>
											<v-list-tile
											v-for="(file, key) in files"
											:key="key"
											avatar
											@click.stop=""
											>                                    
													<v-progress-circular
													indeterminate
													color="teal"
													v-show="showUploading"
													>
													</v-progress-circular>

													<v-list-tile-content>
														<v-list-tile-title>{{ filename }}</v-list-tile-title>														
													</v-list-tile-content>

													<v-list-tile-action>
														<v-btn icon ripple @click="removeFile(key)">
														<v-icon color="red lighten-1">remove_circle_outline</v-icon>
														</v-btn>
													</v-list-tile-action>
											</v-list-tile>
										</v-list>
										
									<!-- </v-flex> -->
								</v-flex>					
							
							
								<v-flex xs12>
										<v-btn
										outline color="indigo"
										round
										small
										@click.native="collapse()"
									>
										More Options
										<v-icon right dark>{{expand}}</v-icon>
									</v-btn>                    
								</v-flex>
							
								<v-flex xs12 id="panel">  								
									<v-container>
										<v-layout row wrap>
											<!-- <v-flex xs12 >
												<v-text-field
													v-model="form.process"
													:counter="200"
													label="Function process (Optional)"
												></v-text-field>
											</v-flex> -->																	

											<v-flex xs12 >
												<div style="margin:10px" class="form-group">                     
												<div class="input-group">
													<!-- <input type="text" class="form-control" id="bucketname" v-model="url"   placeholder="URL" autofocus  style="border-right: none; border-left:none; border-top:none; hover: "/>                      -->
													<v-flex xs12 sm5 >
														<v-text-field
															v-model="form.annkey"
															:counter="200"
															label="Annotations (key)"											
														></v-text-field>
													</v-flex>	
													<v-flex xs12 sm5>
														<v-text-field
															v-model="form.annvalue"
															:counter="200"
															label="Annotations (value)"											
														></v-text-field>
													</v-flex>	
													 
													<div  class="input-group-append mr-2">  														                    
														<button class="" @click="includeAnn()" type="button"><v-icon left color="green">check_circle</v-icon></button>
														<button class="" @click="cleanfieldann()" type="button" ><v-icon left color="red">cancel</v-icon></button>                        
													</div>
													
													<!-- <span style="color: #cc3300; font-size: 12px;"><b>Bucket name is required</b></span>                    -->
												</div>            
												</div> 
											</v-flex>

											<v-flex xs12 sm6 offset-sm3 v-show="showselectAnn">
												<!-- <v-flex xs12> -->
													<input type="file" id="envs" hidden="true" multiple />
													<v-list subheader dense>
														<v-subheader inset>Annotations</v-subheader>
														<v-list-tile
														v-for="(ann,key) in anns"
														:key="key"
														avatar
														@click.stop=""
														>                                    
																<!-- <v-progress-circular
																indeterminate
																color="teal"
																v-show="showUploading"
																>
																</v-progress-circular> -->

																<v-list-tile-content>
																	<v-list-tile-title>{{key}}:{{anns[key]}}</v-list-tile-title>
																	<!-- <v-list-tile-sub-title>{{ moment(file.lastModified).format("YYYY-MM-DD HH:mm") }}</v-list-tile-sub-title> -->
																</v-list-tile-content>

																<v-list-tile-action>
																	<v-btn icon ripple @click="removeAnn(key)">
																	<v-icon color="red lighten-1">remove_circle_outline</v-icon>
																	</v-btn>
																</v-list-tile-action>
														</v-list-tile>
													</v-list>
												<!-- </v-flex> -->
											</v-flex>										
											
											<v-flex xs12 >
												<div style="margin:10px" class="form-group">                     
												<div class="input-group">
													<!-- <input type="text" class="form-control" id="bucketname" v-model="url"   placeholder="URL" autofocus  style="border-right: none; border-left:none; border-top:none; hover: "/>                      -->
													<v-flex xs12 sm5 >
														<v-text-field
															v-model="form.envVarskey"
															:counter="200"
															label="Environment variables (key)"											
														></v-text-field>
													</v-flex>	
													<v-flex xs12 sm5>
														<v-text-field
															v-model="form.envVarsValue"
															:counter="200"
															label="Environment variables (value)"											
														></v-text-field>
													</v-flex>	
													 
													<div  class="input-group-append mr-2">  														                    
														<button class="" @click="includeEnv()" type="button"><v-icon left color="green">check_circle</v-icon></button>
														<button class="" @click="cleanfieldenv()" type="button" ><v-icon left color="red">cancel</v-icon></button>                        
													</div>
													
													<!-- <span style="color: #cc3300; font-size: 12px;"><b>Bucket name is required</b></span>                    -->
												</div>            
												</div> 
											</v-flex>

											<v-flex xs12 sm6 offset-sm3 v-show="showselectEnv">
												<!-- <v-flex xs12> -->
													<input type="file" id="envs" hidden="true" multiple />
													<v-list subheader dense>
														<v-subheader inset>Env Vars</v-subheader>
														<v-list-tile
														v-for="(enVar,key) in envVars"
														:key="key"
														avatar
														@click.stop=""
														>                                    
																<!-- <v-progress-circular
																indeterminate
																color="teal"
																v-show="showUploading"
																>
																</v-progress-circular> -->

																<v-list-tile-content>
																	<v-list-tile-title>{{key}}:{{envVars[key]}}</v-list-tile-title>
																	<!-- <v-list-tile-sub-title>{{ moment(file.lastModified).format("YYYY-MM-DD HH:mm") }}</v-list-tile-sub-title> -->
																</v-list-tile-content>

																<v-list-tile-action>
																	<v-btn icon ripple @click="removeEnv(key)">
																	<v-icon color="red lighten-1">remove_circle_outline</v-icon>
																	</v-btn>
																</v-list-tile-action>
														</v-list-tile>
													</v-list>
												<!-- </v-flex> -->
											</v-flex>
											
											<v-flex xs12 >
												<div style="margin:10px" class="form-group">                     
												<div class="input-group">
													<!-- <input type="text" class="form-control" id="bucketname" v-model="url"   placeholder="URL" autofocus  style="border-right: none; border-left:none; border-top:none; hover: "/>                      -->
													<v-flex xs12 sm5 >
														<v-text-field
															v-model="form.labelkey"
															:counter="200"
															label="Labels (key)"											
														></v-text-field>
													</v-flex>	
													<v-flex xs12 sm5>
														<v-text-field
															v-model="form.labelvalue"
															:counter="200"
															label="Labels (value)"											
														></v-text-field>
													</v-flex>	
													 
													<div  class="input-group-append mr-2">  														                    
														<button class="" @click="includeLab()" type="button"><v-icon left color="green">check_circle</v-icon></button>
														<button class="" @click="cleanfieldLab()" type="button" ><v-icon left color="red">cancel</v-icon></button>                        
													</div>
													
													<!-- <span style="color: #cc3300; font-size: 12px;"><b>Bucket name is required</b></span>                    -->
												</div>            
												</div> 
											</v-flex>

											<v-flex xs12 sm6 offset-sm3 v-show="showselectLab">
												<!-- <v-flex xs12> -->
													<input type="file" id="envs" hidden="true" multiple />
													<v-list subheader dense>
														<v-subheader inset>Labels</v-subheader>
														<v-list-tile
														v-for="(lab,key) in labels"
														:key="key"
														avatar
														@click.stop=""
														>                                    
																<!-- <v-progress-circular
																indeterminate
																color="teal"
																v-show="showUploading"
																>
																</v-progress-circular> -->

																<v-list-tile-content>
																	<v-list-tile-title>{{key}}:{{labels[key]}}</v-list-tile-title>
																	<!-- <v-list-tile-sub-title>{{ moment(file.lastModified).format("YYYY-MM-DD HH:mm") }}</v-list-tile-sub-title> -->
																</v-list-tile-content>

																<v-list-tile-action>
																	<v-btn icon ripple @click="removeLab(key)">
																	<v-icon color="red lighten-1">remove_circle_outline</v-icon>
																	</v-btn>
																</v-list-tile-action>
														</v-list-tile>
													</v-list>
												<!-- </v-flex> -->
											</v-flex>
											<v-flex xs12 >
												<div style="margin:10px" class="form-group">                     
												<div class="input-group">
													<!-- <input type="text" class="form-control" id="bucketname" v-model="url"   placeholder="URL" autofocus  style="border-right: none; border-left:none; border-top:none; hover: "/>                      -->
													<v-flex xs10>
														<v-text-field
															v-model="form.constraints"
															:counter="200"
															label="Constraints"											
														></v-text-field>
													</v-flex>	
													
													 
													<div  class="input-group-append mr-2">  														                    
														<button class="" @click="includeConst()" type="button"><v-icon left color="green">check_circle</v-icon></button>
														<button class="" @click="cleanfieldConst()" type="button" ><v-icon left color="red">cancel</v-icon></button>                        
													</div>
													
													<!-- <span style="color: #cc3300; font-size: 12px;"><b>Bucket name is required</b></span>                    -->
												</div>            
												</div> 
											</v-flex>

											<v-flex xs12 sm6 offset-sm3 v-show="showselectConsts">
												<!-- <v-flex xs12> -->
													<input type="file" hidden="true" multiple />
													<v-list subheader dense>
														<v-subheader inset>Constraints</v-subheader>
														<v-list-tile
														v-for="(constra, key) in consts"
														:key="key"
														avatar
														@click.stop=""
														>                                    
																<!-- <v-progress-circular
																indeterminate
																color="teal"
																v-show="showUploading"
																>
																</v-progress-circular> -->

																<v-list-tile-content>
																	<v-list-tile-title>{{constra}}</v-list-tile-title>
																	<!-- <v-list-tile-sub-title>{{ moment(file.lastModified).format("YYYY-MM-DD HH:mm") }}</v-list-tile-sub-title> -->
																</v-list-tile-content>

																<v-list-tile-action>
																	<v-btn icon ripple @click="removeConst(key)">
																	<v-icon color="red lighten-1">remove_circle_outline</v-icon>
																	</v-btn>
																</v-list-tile-action>
														</v-list-tile>
													</v-list>
												<!-- </v-flex> -->
											</v-flex>


											<v-flex xs12 >
												<div style="margin:10px" class="form-group">                     
												<div class="input-group">
													<!-- <input type="text" class="form-control" id="bucketname" v-model="url"   placeholder="URL" autofocus  style="border-right: none; border-left:none; border-top:none; hover: "/>                      -->
																											
													<v-flex xs10 >
														<v-text-field
															v-model="form.secrets"
															:counter="200"
															label="Secrets"											
														></v-text-field>
													</v-flex>	
													 
													<div  class="input-group-append mr-2">  														                    
														<button class="" @click="includeSec()" type="button"><v-icon left color="green">check_circle</v-icon></button>
														<button class="" @click="cleanfieldSec()" type="button" ><v-icon left color="red">cancel</v-icon></button>                        
													</div>
													
													<!-- <span style="color: #cc3300; font-size: 12px;"><b>Bucket name is required</b></span>                    -->
												</div>            
												</div> 
											</v-flex>

											<v-flex xs12 sm6 offset-sm3 v-show="showselectSec">
												<!-- <v-flex xs12> -->
													<input type="file" hidden="true" multiple />
													<v-list subheader dense>
														<v-subheader inset>Secrets</v-subheader>
														<v-list-tile
														v-for="(sec, key) in secrets"
														:key="key"
														avatar
														@click.stop=""
														>                                    
																<!-- <v-progress-circular
																indeterminate
																color="teal"
																v-show="showUploading"
																>
																</v-progress-circular> -->

																<v-list-tile-content>
																	<v-list-tile-title>{{sec}}</v-list-tile-title>
																	<!-- <v-list-tile-sub-title>{{ moment(file.lastModified).format("YYYY-MM-DD HH:mm") }}</v-list-tile-sub-title> -->
																</v-list-tile-content>

																<v-list-tile-action>
																	<v-btn icon ripple @click="removeSec(key)">
																	<v-icon color="red lighten-1">remove_circle_outline</v-icon>
																	</v-btn>
																</v-list-tile-action>
														</v-list-tile>
													</v-list>
												<!-- </v-flex> -->
											</v-flex>
											<!-- <v-flex xs12 sm6 md6>
												<v-text-field
													v-model="form.secrets"
													:counter="200"
													label="Secrets"											
												></v-text-field>											
											</v-flex>  -->

											<v-flex xs12>
												<v-text-field
													v-model="form.network"
													:counter="200"
													label="Network (Swarm)"
													required
												></v-text-field>
											</v-flex>

											<v-flex xs12 sm6 md6>
												<v-text-field
													v-model="form.limits_cpu"
													:counter="200"
													label="Limits CPU"											
												></v-text-field>											
											</v-flex>

											<v-flex xs12 sm6 md6>
												<v-text-field
													v-model="form.limits_memory"
													:counter="200"
													label="Limits Memory"											
												></v-text-field>											
											</v-flex>  

											<v-flex xs12>
												<v-text-field
													v-model="form.regAuth"
													:counter="200"
													label="Registry Authentication"											
												></v-text-field>
											</v-flex>

											<v-flex xs12 sm6 md6>
												<v-text-field
													v-model="form.request_cpu"
													:counter="200"
													label="Request CPU"											
												></v-text-field>
											</v-flex>

											<v-flex xs12 sm6 md6>
												<v-text-field
													v-model="form.request_memory"
													:counter="200"
													label="Request Memory"											
												></v-text-field>											
											</v-flex>  

											 
										</v-layout>
									</v-container>								
								</v-flex> 						
							</v-layout>
						</v-container>
					</v-card-text>				
					<v-card-actions >
						<v-btn @click="closeWithoutSave" flat color="error">Cancel</v-btn>
						<v-btn @click="clear" flat color="warning">Clear</v-btn>
						<v-spacer></v-spacer>
						<v-btn :disabled="!form.valid" @click="submit" flat color="success">submit</v-btn>
					</v-card-actions>
				</v-form>			
			</v-card>			
		</v-dialog>    
	</v-layout>
</template>

<script>
import axios from 'axios'

/* eslint-disable */
export default {   
	name: 'FunctionForm',
	props: {
		openFaaS: {}
	},
   
	data () {
		return {
			dialog: false,        
			drawer: false,    
			url: "", 
			allText: "", 
			expand: "expand_more",
			editionMode: false,
			base64String : "",    
			filename: "",  
			files: [],      
			showUploading: false,
			showselectEnv: false,
			showselectAnn: false,
			showselectLab: false,
			showselectConsts: false,
			showselectSec: false,
			filerequire : false,
			envVars:{},
			anns:{},
			labels:{},
			consts: [],
			secrets: [],

			form: {
				valid: false,
				image: '',
				imageRules: [
				v => !!v || 'Docker image is required',
				// v => (v && v.includes('/')) || 'The Docker image must comply with the nomenclature of Docker Hub images'
				// && /.+:.+/.test(v)
				],
				name: '',
				nameRules: [
				v => !!v || 'Function name is required'
				],
				process: '',
				network: '',
				annkey: '',
				annvalue: '',
				constraints: '',
				envVarskey: "",
				envVarsValue: "",					
				labelkey: '',
				labelvalue: '',
				limits_cpu: '',
				limits_memory: '',
				regAuth: '',
				request_cpu: '',
				request_memory: '',
				secrets: ''
				
			},
			progress: {
				active: false
			}
		}
	},
	methods: {
		handleUpdate(){
			this.$emit("SHOWSPINNER",true)			 
      		window.getApp.$emit('REFRESH_BUCKETS_LIST')
      		window.getApp.$emit('BUCKETS_REFRESH_DASHBOARD')
      		window.getApp.$emit('FUNC_GET_FUNCTIONS_LIST')
    	},
		cleanfield(){
			this.url=""
		},
		cleanfieldenv(){
			this.form.envVarskey=""
			this.form.envVarsValue=""
		},
		cleanfieldann(){
			this.form.annkey=""
			this.form.annvalue=""
		},
		cleanfieldlab(){
			this.form.labelkey=""
			this.form.labelvalue=""
		},
		cleanfieldConst(){
			this.form.constraints=""		
		},
		cleanfieldSec(){
			this.form.secrets=""		
		},
		includeEnv(){
			this.showselectEnv=true
			var key= this.form.envVarskey.replace(" ", "")
			var value = this.form.envVarsValue.replace(" ", "")
			this.envVars[key]=value
			this.cleanfieldenv()						
		},
		includeAnn(){
			this.showselectAnn=true
			var key= this.form.annkey.replace(" ", "")
			var value = this.form.annvalue.replace(" ", "")
			this.anns[key]=value
			this.cleanfieldann()			
		},
		includeLab(){
			this.showselectLab=true
			var key= this.form.labelkey.replace(" ", "")
			var value = this.form.labelvalue.replace(" ", "")
			this.labels[key]=value
			this.cleanfieldlab()	
				
		},
		includeConst(){
			this.showselectConsts=true
			this.consts.push(this.form.constraints)			
			this.cleanfieldConst()						
		},
		includeSec(){
			this.showselectSec=true
			this.secrets.push(this.form.secrets)			
			this.cleanfieldSec()						
		},
		isEmpty(obj) {
			for(var key in obj) {
				if(obj.hasOwnProperty(key))
					return false;
			}
			return true;
		},
		removeAnn (key) {     
			this.$delete(this.anns,key)			
			if (this.isEmpty(this.anns)) {
				this.showselectAnn = false
			}
		},		
		removeEnv (key) {     
			this.$delete(this.envVars,key)			
			if (this.isEmpty(this.envVars)) {
				this.showselectEnv = false
			}		
		},
		removeLab(key) {     
			this.$delete(this.labels,key)				
			if (this.isEmpty(this.labels)) {
				this.showselectLab = false
			}				
		},
		removeConst(key) {     
			this.consts.splice(key, 1)							
			if (this.consts.length == 0) {				
				this.showselectConsts = false
			}				
		},
		removeSec(key) {     
			this.secrets.splice(key, 1)			
			if (this.secrets.length == 0) {
				this.showselectSec = false
			}				
		},
		collapse(){			
			this.drawer = (!this.drawer)			
			if (this.drawer == true){
				this.expand = "expand_less"
				$("#panel").slideDown("slow");

			}else{
				this.expand = "expand_more"
				$("#panel").slideUp("slow");
			}			
		},
		addFiles () {      		
			this.$refs.files.click()		
		},
		removeFile (key) {     
			this.files.splice(key, 1)
			this.$refs.files.value = null
		},		
		handleFilesUpload () {
			this.files = []      
			let uploadedFiles = this.$refs.files.files			
			this.filerequire = false
			/*
				Adds the uploaded file to the files array
			*/
			for (let i = 0; i < uploadedFiles.length; i++) {
				// uploadedFiles[i]['showUploading'] = false
				this.showUploading = false
				this.filename = uploadedFiles[i].name
				this.files.push(uploadedFiles[i])
			}			
			if (window.File && window.FileReader && window.FileList && window.Blob) {
				var f = this.files[0]; // FileList object
				
				var reader = new FileReader();
				// Closure to capture the file information.
				var _this = this;
				reader.onload = (function(theFile) {
				return function(e) {
					var binaryData = e.target.result;
					//Converting Binary Data to base 64
					_this.base64String = window.btoa(binaryData);
					//showing file converted to base64
					// document.getElementById('base64').value = base64String;
					// console.log(_this.base64String)
					// alert('File converted to base64 successfuly!\nCheck in Textarea');
				};
				})(f);
				// Read in the image file as a data URL.
				reader.readAsBinaryString(f);
			} else {
				alert('The File APIs are not fully supported in this browser.');
			}      
		
		},
		readurl(){     
			this.files = [] 		
			let uploadedFiles = this.url						
			this.showUploading = false
			this.filename = this.url
			this.files.push(uploadedFiles)
			
			var params = {
				'url': this.url				
			}
			var _this = this;
			axios({ method: 'post', url: 'https://$VUE_APP_BACKEND_HOST:31114/chargeurl', data: params})
				.then((response) => {
				// handle success          
				_this.base64String = window.btoa(response.data);          
				}).catch((error,data) => {
				// handle error
				window.getApp.$emit('APP_SHOW_SNACKBAR', { text: error.response.data, color: 'error' })
			})   
			
		},
		closeWithoutSave () {      
			this.progress.active = false
			this.dialog = false            
			this.clear()      
		},
		submit () {
			if (this.$refs.form.validate()) {
				// Native form submission is not yet supported
				this.progress.active = true
				this.editionMode ? this.editFunction() : this.newFunction()
			}
			if (this.files.length == 0){
				this.filerequire = true
			}else{
				this.filerequire = false
			}			
			if(this.editionMode == true ){				
				this.filerequire = false
			}			
		},
		clear () {
			this.files = []
			this.consts = []
			this.secrets = []
			this.url = ""
			this.$refs.files.value = null
			this.$refs.form.reset()
			this.editionMode = false
			this.showUploading = false
			this.showselectEnv = false
			this.showselectLab = false
			this.showselectAnn = false			
			this.showselectConsts = false
			this.showselectSec = false
			this.envVars = {}
			this.anns = {}
			this.labels = {}
			this.expand = "expand_more"
			$("#panel").slideUp("slow");
		},
		newFunction () {			
			var params = {
				'url': this.openFaaS.endpoint, 
				'service': this.form.name, 
				'network': this.form.network, 
				'image': this.form.image, 
				// 'envProcess': this.form.process, 
				'script': this.base64String,
				'annotations': this.anns,
				'constraints': this.consts,
				'envVars':this.envVars,
				'labels': this.labels,
				'limits': 
				{'cpu': this.form.limits_cpu,
				'memory': this.form.limits_memory}
				,
				'registryAuth': this.form.regAuth,
				'requests': 
				{'cpu': this.form.request_cpu,
				'memory': this.form.request_memory}
				,
				'secrets': this.secrets }			
			
			axios({ method: 'post', url: 'https://$VUE_APP_BACKEND_HOST:31114/newfaas', data: params })
				.then((response) => {
				// handle success
				window.getApp.$emit('APP_SHOW_SNACKBAR', { text: `Function ${this.form.name} is in process of being deployed, wait until it is displayed.`, color: 'success', timeout: 12000 })
				this.dialog = false
				this.clear()
				this.updateFunctionsGrid()
				}).catch((error) => {
				// handle error
				console.log(error.response.data)
				window.getApp.$emit('APP_SHOW_SNACKBAR', { text: error.response.data, color: 'error' })
				}).then(() => {
				this.progress.active = false
				})
		},
		editFunction () {
			var params = {
				'url': this.openFaaS.endpoint, 
				'service': this.form.name, 
				'network': this.form.network, 
				'image': this.form.image, 
				// 'envProcess': this.form.process, 
				'script': this.base64String,
				'annotations': this.anns,
				'constraints': this.consts,
				'envVars':this.envVars,
				'labels': this.labels,
				'limits': 
				{'cpu': this.form.limits_cpu,
				'memory': this.form.limits_memory}
				,
				'registryAuth': this.form.regAuth,
				'requests': 
				{'cpu': this.form.request_cpu,
				'memory': this.form.request_memory}
				,
				'secrets': this.secrets }	
			axios({ method: 'put', url: 'https://$VUE_APP_BACKEND_HOST:31114/editfaas', data: params })
				.then((response) => {
				// handle success
				window.getApp.$emit('APP_SHOW_SNACKBAR', { text: `Function ${this.form.name} has been updated`, color: 'success' })
				this.dialog = false
				this.clear()
				this.updateFunctionsGrid()
				}).catch((error, data) => {
				// handle error
				window.getApp.$emit('APP_SHOW_SNACKBAR', { text: error.response.data, color: 'error' })
				}).then(() => {
				this.progress.active = false
				})
		},
		updateFunctionsGrid () {
			window.getApp.$emit('FUNC_GET_FUNCTIONS_LIST')
		}
	},
	computed: {
		formTitle () {
		return this.editionMode ? 'Edit Function' : 'New Function'
		},
		formColor () {
		return this.editionMode ? 'pink' : 'primary'
		},
		showSelectedFiles () {
		return this.files.length > 0
		},
		
	},
  
	created: function () {
		window.getApp.$on('FUNC_OPEN_MANAGEMENT_DIALOG', (data) => {
		this.editionMode = data.editionMode
		this.form.name = data.name
		this.form.image = data.image
		this.form.process = data.process
		this.form.network = data.network
		this.dialog = true
		})
	}
}
</script>

<style scoped>
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
</style>
