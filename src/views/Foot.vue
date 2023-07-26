<template>
    <div>
        <v-footer app v-bind:class="getClass()">
            <v-layout row wrap align-center>
            <v-flex xs10>
                <div class="white--text ml-4">
                    <h5>Powered by <a  target="_blank" href="https://oscar.grycap.net/" style="color:#ff9966;font-size:1rem">OSCAR</a> © 2023, 
                      <a style="color:#ff9966;font-size:1rem" href="https://www.grycap.upv.es"  target="_blank">GRyCAP-I3M-UPV</a>, Universitat Politècnica de València, Spain.</h5>
                </div>
            </v-flex>
            <v-flex xs2 >
                <h5 style="display: inline">
                <a  style="color:#ff9966;font-size:1rem;" @click="termofuse()">
                Terms of Use
              </a>
              </h5>
              &nbsp; &nbsp; &nbsp;
              <h5 style="display: inline">
                <a  dark style="color:#ff9966;font-size:1rem;" @click="privacy()">
                Privacy Policy
              </a>
              </h5>
          </v-flex>
        </v-layout>
      </v-footer>
</div>
</template>
<script>

import env from '@/env'
export default {
  data () {
    return {
    }

  },
  methods:{
    termofuse(){
      let routeData = this.$router.resolve({name: 'TermOfUse', });
      window.open(routeData.href, '_blank');
    },
    getClass(){
      console.log(this.$route.name)
    if(env.deploy_container=='true' && env.ai4eosc_servers.includes(window.location.origin) && this.$route.name==="Login"){
      return "ai4eosc"
    }else   return "teal darken-1"
    },
    privacy(){
      let routeData = this.$router.resolve({name: 'Privacy', });
      window.open(routeData.href, '_blank');
    }
  }
};

</script>
<style scoped>
h5{
    font-size:0.9rem !important
}
table, th, td {
  border: 1px solid black;
  border-collapse: collapse;
}
.ai4eosc{
    background-color: #09837e;
  }

</style>
