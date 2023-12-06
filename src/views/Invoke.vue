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
          <textarea  class='textbox' v-model="inputData"  rows="15" placeholder="Introduce here your input as a text"></textarea>
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
                <textarea  v-if="outputTypeSelected=='Text'" class='result' v-model="outputData" rows="30" placeholder="Output"></textarea>
                <v-img  v-if="outputTypeSelected=='Image'" ref="output" ></v-img>
                <div class="audio" v-if="outputTypeSelected=='Audio'"  >
                  <audio  id="myAudio" ref="output" v-if="outputTypeSelected=='Audio'" controls >  </audio>
                </div>
                <div class="video" v-if="outputTypeSelected=='Video'"  >
                  <video  id="myVideo" ref="output" v-if="outputTypeSelected=='Video'" controls >  </video>
                </div>
                <textarea  v-if="outputTypeSelected=='Zip'" class='result' v-model="outputData" rows="30" placeholder="Output"></textarea>
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

import { select } from 'async';
/* eslint-disable */
export default {
    mixins:[Services],
    components: {
		IntersectingCirclesSpinner,
        'editor': Editor,
	},
	name: 'Logs',
	data () {
    return {
        dialog: false,
        serviceName: '',
        fileinput:"",
        inputData:"",
        output:"",
        outputType:["Text","Image","Audio","Video","Zip"],
        outputTypeSelected:"Text",
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
            this.$router.push({name: "Functions"})
        },
        selectFile(event) {
          this.fileinput=event.target.files
          let reader = new FileReader();
          reader.onload = e => { this.inputData= e.target.result; };
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
                this.outputData = window.atob(response.data);
              } catch(e) {
                this.outputData = response.data;
              }
              this.dialog=true
            }else if(this.outputTypeSelected=='Audio'){
              this.$refs.output.src = "data:audio/mp3;base64,"+ response.data;
              this.dialog=true
            }else if(this.outputTypeSelected=='Video'){
              this.$refs.output.src = "data:video/mp4;base64,"+ response.data;
              this.dialog=true

              //var x = document.createElement("SOURCE");
              //x.setAttribute("src", window.atob(response.data));
              //x.setAttribute("type", "audio/mp3");
              //document.getElementById("myAudio").appendChild(x);
              //this.$refs.output.src = window.atob(response.data);
            }else if(this.outputTypeSelected=='Zip'){
              var element = document.createElement('a');
              element.setAttribute('href', 'data:text/zip;base64,' + response.data);
              element.setAttribute('download', "result.zip");
              element.style.display = 'none';
              document.body.appendChild(element);
              element.click();
              document.body.removeChild(element);
              this.dialog = false
            }
            
          }else{
            this.show_alert = true;
				    window.getApp.$emit('APP_SHOW_SNACKBAR', { text: response.status+ " An error had occurred", color: 'error' })
			
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
