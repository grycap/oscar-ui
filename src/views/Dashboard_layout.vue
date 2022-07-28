<template>
    <div>
		<app-drawer class="app--drawer"></app-drawer>
        <app-toolbar class="app--toolbar"></app-toolbar>

        <div class="card-body" >
            <router-view></router-view>
        </div>

    <foot></foot>

    </div>

</template>
<script>
import AppDrawer from '@/components/AppDrawer'
import AppToolbar from '@/components/AppToolbar'
import env from '@/env'
import Foot from '@/views/Foot'
export default {
	components: {
		AppDrawer,
		AppToolbar,
    Foot,
    },
}
</script>
<style scoped>
h5{
    font-size:0.9rem !important
}
</style>
