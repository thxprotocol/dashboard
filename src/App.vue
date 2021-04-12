<template>
    <div id="app" class="bg-light h-100">
        <base-navbar v-if="$route.path !== '/signup'" />
        <router-view />
    </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
// import { mapGetters } from 'vuex';
import BaseNavbar from './components/BaseNavbar.vue';

@Component({
    components: { 'base-navbar': BaseNavbar },
    // computed: mapGetters({
    //     user: 'account/user',
    // }),
})
export default class Redirect extends Vue {}
</script>
