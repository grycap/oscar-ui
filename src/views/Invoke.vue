<template>
    <div class="mb-1">		
      <v-toolbar flat color="white">
          <v-btn color="primary" icon  @click="goBack()"><v-icon>arrow_back</v-icon> </v-btn>
          <v-toolbar-title>Invoke: Service {{serviceName}} </v-toolbar-title>
      </v-toolbar>    
      <div v-show="!show_spinner" > 
        <div class="inputclass">
          <h3>Input</h3>
          <v-flex xs12 sm12 md6 justify-center>
            <v-btn 
              color="primary"
              class="white--text"
              @click="addFiles()"
            >
              Select file
              <v-icon right dark>note_add</v-icon>
            </v-btn>
            <v-flex xs12 sm12 md6 v-show="false" id="selectedList">
                <input type="file" id="files" ref="files" @change="selectFile"/>
            </v-flex>
            <v-btn  color="green lighten-2" dark @click="invokeSynchronous()" >
              Run
            </v-btn>
          </v-flex>
          <v-divider > </v-divider>
          <textarea id="input-text" v-show="inputType=='Text'"   ref="inputtext" class='textbox' v-model="inputData"  rows="15" placeholder="Introduce here your input as a text"></textarea> 
          <v-img    id="input-image" v-show="inputType=='Image'"   ref="inputimage"  class='textbox'  v-model="inputData" />  
          <div v-show="inputType=='CantRender'"> <v-alert
            :value="true"
            type="success"
          >
            Your file has been upload successfully, but it won't be render.
          </v-alert></div>
        </div>
          <v-divider  vertical class="vertical-line" />
        <div class="outputclass">
          <h3>Output</h3>
          <v-select class="outputbox" :items="outputType" v-model="outputTypeSelected"  label="Ouput type" ></v-select>
        </div>
        <div>
          <v-dialog v-model="dialog" >
            <template v-slot:activator="{ on, attrs }">
            </template>
            <v-card>
              <v-card-title class="text-h5 grey lighten-2">
                Result obtained
              </v-card-title>
              <v-card-actions>
                <v-img :src="output"></v-img>
              </v-card-actions>
              <div >
                <textarea  v-if="outputTypeSelected=='Text' || outputTypeSelected=='Other'" class='result' v-model="outputData" rows="30" placeholder="Output"></textarea>
                <vue-json-pretty  v-if="outputTypeSelected=='JSON'"  v-model="outputData" />
                <v-img  v-if="outputTypeSelected=='Image'" ref="output" ></v-img>
              </div>
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  text
                  @click="dialog = false"
                >
                  Accept 
                </v-btn>
              </v-card-actions>
              
            </v-card>

          </v-dialog>
        </div>
      </div> 
      <div v-show="show_spinner" style="position:fixed; left:50%;">
				<intersecting-circles-spinner :animation-duration="1200" :size="50" :color="'#0066ff'" />
			</div>
    </div>
</template>

<script>
import Services from '../components/services';
import { IntersectingCirclesSpinner } from 'epic-spinners';
import moment from 'moment';
import Editor from './AceEditor';
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';
import { select } from 'async';
/* eslint-disable */
export default {
    mixins:[Services],
    components: {
		IntersectingCirclesSpinner,
        'editor': Editor,
        VueJsonPretty,
	},
	name: 'Logs',
	data () {
    return {
        dialog: false,
        serviceName: '',
        fileinput:"",
        inputData:"",
        output:"",
        outputType:["Text","Image","Other"],
        outputTypeSelected:"Text",
        inputType:"Text",
        outputData:"",
        token:"",
        show_spinner: false,
        show_alert: false,
        moment : moment,
        search:'',
        loading:true,
        
    }
  },
	methods: {
        goBack(){
            this.$router.push(this.$router.prevRoute)
        },
        checkEnd(end) {
          if(this.fileinput[0].name.endsWith(end)){
            return true
          }else{
            return false
          }
        },
        selectFile(event) {
          this.fileinput=event.target.files
          let reader = new FileReader();
          reader.onload = e => { 
            this.inputData= e.target.result; 
            const image=["jpg","png","jpeg"]
            const video=["mp4","mkv"]
            const audio = ["mp3"]
            if( image.map(this.checkEnd).includes(true) ){
              this.inputType="Image" 
              this.$refs.inputimage.src = "data:image/png;base64,"+ btoa(this.inputData);
            }else if( video.map(this.checkEnd).includes(true) || audio.map(this.checkEnd).includes(true) ){
              this.inputType="CantRender" 
            }else{
              this.inputType="Text"
              this.$refs.inputtext.src = this.inputData;
            }
          };
          reader.readAsBinaryString(this.fileinput[0]);

        },

        invokeSynchronous(){
          this.show_spinner=true
          let inputDataaux=window.btoa(this.inputData)
          var params = {
            serviceName: this.serviceName,
            token:this.token,
            data:inputDataaux,
          }
          this.synchronousCall(params, this.invokeSynchronousCallback);
        },
        getTokenCallback(response){
            if (response.status==200) {   //check response
                this.token="Bearer "+response.data.token
              }
        },
        invokeSynchronousCallback(response){
          this.show_spinner=false
          if (response.status==200) {   //check response
            if(this.outputTypeSelected=='Image'){
              this.$refs.output.src = "data:image/png;base64,"+ response.data;
              this.dialog=true
            }else if(this.outputTypeSelected=='Text'){
              try {
                var auxiliaryData = window.atob(response.data);
              } catch(e) {
                var auxiliaryData = response.data;
              }
              try {
                this.outputData = JSON.parse(auxiliaryData.replaceAll("'", '"'))
                this.outputTypeSelected='JSON'
              } catch(e) {
                this.outputData = auxiliaryData
              }
              this.dialog=true
            }else if(this.outputTypeSelected=='Other'){
              console.log(response)
              var element = document.createElement('a');
              element.setAttribute('href', 'data:text/zip;base64,' + response.data);
              element.setAttribute('download', "result");
              element.style.display = 'none';
              document.body.appendChild(element);
              element.click();
              document.body.removeChild(element);
              this.dialog = false
            }
            
          }else{
            this.show_alert = true;
            if(response?.message == 'Request failed with status code 429'){
              window.getApp.$emit('APP_SHOW_SNACKBAR', { text: " Error 429: Too many request, try later", color: 'error' })
            }else if(response?.message == "Request failed with status code 502"){
              window.getApp.$emit('APP_SHOW_SNACKBAR', { text: " Request failed 'Error 502', try later", color: 'error' })
            }else if(response?.message == "Request failed with status code 504"){
              window.getApp.$emit('APP_SHOW_SNACKBAR', { text: " Request failed 'Time out', try later", color: 'error' })
            }else{
				    window.getApp.$emit('APP_SHOW_SNACKBAR', { text: response.status+ " An error had occurred", color: 'error' })

            }
			
          }
        },
        addFiles() {     
          this.$refs.files.click()
        }, 
	},
    created: function () {
      if(this.$route.params.serviceName){
          this.serviceName = this.$route.params.serviceName
          this.getTokenService(this.serviceName, this.getTokenCallback);
        }
      }	
	
}
</script>

<style scoped>
  h1, h2 {
    font-weight: normal;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
    margin: 0 10px;
  }
  a {
    color: #42b983;
  }
  .center{
    display: flex;
    align-items: center;
  }
  
  .inputclass{
    width: 45%;
    display: inline-block;
    vertical-align: top;
    text-align: center;
    margin-top:2%;
  }
  .outputclass{
    width: 45%;
    display: inline-block;
    vertical-align: top;
    text-align: center;
    margin-top: 2%;

  }
  input[type="file"].slotted {
  border: 1px solid rebeccapurple;
  }
  .textbox{
    display: inline-block;
    width: 90%;
    border: 1px solid #000;;
  }
  .outputbox{
    display: inline-block;
    width: 90%;
  }
  .result{
    width: 100%;
  }

  .vertical-line{ 
    color: black !important;
    height: 300px;
    margin: 1%;
  }
  .audio {
    text-align: center ;
  }
  .video {
    text-align: center ;
  }
</style>
