<template>
    <div>
        <v-footer app color="teal darken-2">
            <v-layout row wrap align-center>
            <v-flex xs10>
                <div class="white--text ml-4">
                    <h5>© 2022, <a style="color:#ff9966;font-size:1rem" href="https://www.grycap.upv.es">GRyCAP-I3M-UPV</a>, Universitat Politècnica de València, Spain.</h5>
                </div>
            </v-flex>
            <v-flex xs2 v-show="env.deploy_container === 'false'">
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


</style>
