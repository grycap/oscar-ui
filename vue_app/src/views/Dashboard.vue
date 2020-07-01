<template>
	
    <div class="mt-5 mb-1">
      <v-toolbar flat color="white">
        <v-toolbar-title>Expandable Table</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn color="primary" dark @click="expand = !expand">
          {{ expand ? 'Close' : 'Keep' }} other rows
        </v-btn>
      </v-toolbar>
      <v-data-table
        :headers="headers"
        :items="desserts"
        :expand="expand"
        item-key="name"
      >
        <template v-slot:items="props">
          <tr @click="props.expanded = !props.expanded" >
            <td>{{ props.item.name }}</td>
            <td class="text-xs-right">{{ props.item.calories }}</td>
            <td class="text-xs-right">{{ props.item.fat }}</td>
            <td class="text-xs-right">{{ props.item.carbs }}</td>
            <td class="text-xs-right">{{ props.item.protein }}</td>
            <td class="text-xs-right">{{ props.item.iron }}</td>
          </tr>
        </template>
        <template v-slot:expand="props">
          <v-card flat>
            <v-card-text>Peek-a-boo!</v-card-text>
          </v-card>
        </template>
         <template v-slot:no-data>
          <v-alert :value="true" color="error" icon="warning">
            Sorry, nothing to display here :(
          </v-alert>
      </template>
      </v-data-table>
    </div>
 
</template>

<script>
import axios from 'axios'
import AppDrawer from '@/components/AppDrawer'
import AppToolbar from '@/components/AppToolbar'
import Services from '../components/services';
/* eslint-disable */
export default {
	mixins:[Services],
	name: 'dashboard',
	components: {
		AppDrawer,
		AppToolbar,    
	},
	props: {
		minioClient: {},
		openFaaS: {}
	},
	data () {
    return {
      expand: false,
      singleExpand: false,
      headers: [
        {
          text: 'Dessert (100g serving)',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        { text: 'Calories', value: 'calories' },
        { text: 'Fat (g)', value: 'fat' },
        { text: 'Carbs (g)', value: 'carbs' },
        { text: 'Protein (g)', value: 'protein' },
        { text: 'Iron (%)', value: 'iron' },
        { text: 'Actions', value: 'actions' },
      ],
      desserts: [
        // {
        //   name: 'Frozen Yogurt',
        //   calories: 159,
        //   fat: 6.0,
        //   carbs: 24,
        //   protein: 4.0,
        //   iron: '1%',
        // },
        // {
        //   name: 'Ice cream sandwich',
        //   calories: 237,
        //   fat: 9.0,
        //   carbs: 37,
        //   protein: 4.3,
        //   iron: '1%',
        // },
        // {
        //   name: 'Eclair',
        //   calories: 262,
        //   fat: 16.0,
        //   carbs: 23,
        //   protein: 6.0,
        //   iron: '7%',
        // },
        // {
        //   name: 'Cupcake',
        //   calories: 305,
        //   fat: 3.7,
        //   carbs: 67,
        //   protein: 4.3,
        //   iron: '8%',
        // },
        // {
        //   name: 'Gingerbread',
        //   calories: 356,
        //   fat: 16.0,
        //   carbs: 49,
        //   protein: 3.9,
        //   iron: '16%',
        // },
        // {
        //   name: 'Jelly bean',
        //   calories: 375,
        //   fat: 0.0,
        //   carbs: 94,
        //   protein: 0.0,
        //   iron: '0%',
        // },
        // {
        //   name: 'Lollipop',
        //   calories: 392,
        //   fat: 0.2,
        //   carbs: 98,
        //   protein: 0,
        //   iron: '2%',
        // },
        // {
        //   name: 'Honeycomb',
        //   calories: 408,
        //   fat: 3.2,
        //   carbs: 87,
        //   protein: 6.5,
        //   iron: '45%',
        // },
        // {
        //   name: 'Donut',
        //   calories: 452,
        //   fat: 25.0,
        //   carbs: 51,
        //   protein: 4.9,
        //   iron: '22%',
        // },
        // {
        //   name: 'KitKat',
        //   calories: 518,
        //   fat: 26.0,
        //   carbs: 65,
        //   protein: 7,
        //   iron: '6%',
        // },
      ],
    }
  },
	methods: {
		toDashboard(){      
		this.$router.push({name: "Functions"})   
		},
		// TODO: Refactor these methods to obtain the values of events between components
		functionsCount () {
		// var params = {'url': this.openFaaS.endpoint }
		// axios({ method: 'post', url: 'https://https://158.42.105.147//loadfaas', data: params })
		//   .then((response) => {
		//     // handle success
		//     this.functions.count = response.data.length
		//   })
		//   .catch((error) => {
		//     // handle error
		//     window.getApp.$emit('APP_SHOW_SNACKBAR', { text: error.response.data, color: 'error' })
		//   })
		},
		listServicesCallback(response) {
			console.log(response)
			// if(response.status > 0){
			// 		this.services = Object.assign(this.services, response.data.length);
			// 		console.log(this.services.length)
					
			// 	}else{

			// 	}
		}
		// this.minioClient.listBuckets((err, obtainedBuckets) => {
		//   if (err) return window.getApp.$emit('APP_SHOW_SNACKBAR', { text: err.message, color: 'error' })
		//   this.storage.bucketsCount = obtainedBuckets.length
		// })
		// var params = {'url': this.openFaaS.endpoint }
		//   const https = require('https');
		// const instance = axios.create({
			
		//   httpsAgent: new https.Agent({  
		//     rejectUnauthorized: false
		//   })
		// });
		// instance.get('https://158.42.105.147/system/services');

		// At request level
		//   const agent = new https.Agent({  
		//     rejectUnauthorized: false
		//   });
		//   axios({ method: 'get', url: 'https://158.42.105.147/system/services',auth: {
		//       username: 'admin',
		//       password: 'password'
		//     }, })
		//     .then((response) => {
		//       // handle success
		//       console.log(response)
		//       this.services = response.data.length
		//     })
		//     .catch((error) => {
		//       // handle error
		//       window.getApp.$emit('APP_SHOW_SNACKBAR', { text: error.response.data, color: 'error' })
		//     })
		// }
	},
	created: function () {
		// this.functionsCount()
		// this.bucketsCount()
		// this.listServicesCall(this.listServicesCallback)
		// window.getApp.$on('BUCKETS_REFRESH_DASHBOARD', () => {
		// 	this.listServicesCall(this.listServicesCallback)
		// })
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
  .openFaas {
    background-color: #e6e7e8 !important;
  }

  .clickable {
  cursor: pointer;
}
</style>
