<template>
    <div id="app" class="bg-light">
        <b-button class="btn-menu shadow-sm" variant="link" v-b-toggle.sidebar-left>
            <i class="fas fa-bars"> </i
        ></b-button>
        <base-navbar />
        <div class="sidebar-sibling">
            <router-view />
        </div>
    </div>
</template>
<script lang="ts">
import { BButton } from 'bootstrap-vue';
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import BaseNavbar from './components/BaseNavbar.vue';
import { UserProfile } from './store/modules/account';

@Component({
    components: {
        'b-button': BButton,
        'base-navbar': BaseNavbar,
    },
    computed: mapGetters({
        profile: 'account/profile',
    }),
})
export default class App extends Vue {
    profile!: UserProfile;

    created() {
        (function (w: any, d, s, l: any, i) {
            w[l] = w[l] || [];
            w[l].push({
                'gtm.start': new Date().getTime(),
                'event': 'gtm.js',
            });
            const f: any = d.getElementsByTagName(s)[0],
                j: any = d.createElement(s),
                dl = l != 'dataLayer' ? '&l=' + l : '';
            j.async = true;
            j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
            f.parentNode.insertBefore(j, f);
        })(window, document, 'script', 'dataLayer', process.env.VUE_APP_GTM);
    }
}
</script>
