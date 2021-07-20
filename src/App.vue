<template>
    <div id="app" class="bg-light h-100">
        <base-navbar v-if="$route.path !== '/signup'" />
        <router-view />
        <a
            target="_blank"
            class="btn btn-dark btn-chat d-flex align-items-center shadow"
            href="https://thx.page.link/slack"
        >
            <img :src="require('@/assets/thx_slack.png')" height="24" class="mr-2" />
            <span>Contact us in Slack</span>
        </a>
    </div>
</template>
<script lang="ts">
import { BButton } from 'bootstrap-vue';
import { Component, Vue } from 'vue-property-decorator';
import BaseNavbar from './components/BaseNavbar.vue';

@Component({
    components: {
        'base-navbar': BaseNavbar,
        'b-button': BButton,
    },
})
export default class App extends Vue {
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
