<template>
	<v-data-table
		v-model= "selected"
		:headers= "headers"
		:items="items"
		class="elevation-1"
		item-key="name"
		:search="search"
		:pagination.sync="pagination"
		select-all
		v-show="spinner"
		>
			<template slot="items" slot-scope="props">
				<tr >
				<th>
					<v-checkbox
					:input-value="props.all"
					:indeterminate="props.indeterminate"
					primary
					hide-details
					@click.native="toggleAll"
					></v-checkbox>
				</th>
				<th
					v-for="header in props.headers"
					:key="header.text"
					:class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
					@click="changeSort(header.value)"
				>
					<v-icon small>arrow_upward</v-icon>
					{{ header.text }}
				</th>
				</tr>
			</template>
			<template slot="items" slot-scope="props" expand="true">
				<tr :active="props.selected"  @mouseover="c_index=props.index" @mouseleave="c_index=-1" >
				<td class="justify-center" @click="props.selected = !props.selected" >
					<v-icon v-show="c_index!=props.index && props.selected != true" :color="props.item.color">{{props.item.icon}}</v-icon>
					<v-checkbox
						:input-value="props.selected"
						primary
						hide-details
						v-show ="props.index==c_index || props.selected == true"							
					></v-checkbox>
				</td>
				<td @click="fetchData(props.item.path, props.item.name)" class="text-xs-center pointer">{{ props.item.name }}</td>
				<td class="text-xs-center">{{ findFilesize(props.item.size) }}</td>
				<td class="text-xs-center">{{ findDate(props.item.lastModified) }}</td>
				<td class="justify-center layout px-0">
					<v-icon small @click="removeFile(props.item)" color="red darken-2">delete_forever</v-icon>
				</td>
				</tr>
			</template>
			<template slot="no-data">
				
				<v-alert v-show="show_alert" :value="true" color="error" icon="warning">
					Sorry, there are no files to display in this bucket :(
				</v-alert>
				
			</template>
			<v-alert slot="no-results" :value="true" color="error" icon="warning">
				Your search for "{{ search }}" found no results.
			</v-alert>
		</v-data-table>

</template>

<script>
import Services from "../components/services"
import filesize from 'filesize'
import moment from 'moment'
export default {
    props:['model','items', 'search','spinner'],
    data() {
        return{
            // search: ''
            pagination: {
			    sortBy: 'name'
			},
			c_index: -1,
			b: 1,
            filesize : filesize,
			moment : moment,
			show_alert: false,
			checkbox_checked: false,
			selected: [],
			headers: [
				{
				text: 'Name',
				align: 'left',
				align: 'center',
				value: 'name'
				},
				{ text: 'Size', align: 'center',value: 'size' },
				{ text: 'Last Modified', align: 'center', value: 'lastModified' },
				{ text: 'Actions', align: 'center',value: 'actions' }
			],
        }
	},
	methods: {
		changeIcon(item){
			// this.checkbox_checked = !this.checkbox_checked
			this.c_index == 1
			console.log(item)
		},

		changeSort (column) {
			if (this.pagination.sortBy === column) {
				this.pagination.descending = !this.pagination.descending
			} else {
				this.pagination.sortBy = column
				this.pagination.descending = false
			}
		},

		findFilesize(item){
			if(item == ""){
				return ""
			}else{
				return (this.filesize(item))
			}

		},
		findDate(item){
			if(item == ""){
				return ""
			}else{
				return ( this.moment(item).format("YYYY-MM-DD HH:mm") )
			}

		},
		fetchData(path,name){
			var value = {'path':path, 'name':name}
			this.$emit('optionSelected', value);

		},
		toggleAll () {
			console.log(this.selected)
		if (this.selected.length) this.selected = []
			else this.selected = this.files.slice()
		},
		
	},
}
</script>
<style scoped>

.pointer:hover{
	cursor: pointer;

}

</style>