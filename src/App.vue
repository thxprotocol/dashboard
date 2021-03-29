<template>
    <div id="app" class="bg-light h-100">
        <base-navbar />
        <router-view />
    </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import BaseNavbar from './components/BaseNavbar.vue';

@Component({
    components: { 'base-navbar': BaseNavbar },
})
export default class Redirect extends Vue {}
</script>
