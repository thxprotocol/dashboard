<template>
    <div id="app" :class="{ 'is-alert-shown': isAlertShown }">
        <b-button class="btn-menu shadow-sm" variant="darker" v-b-toggle.sidebar-left>
            <i class="fas fa-bars"> </i>
        </b-button>
        <b-button v-if="profile" variant="darker" class="identicon shadow-sm" to="/account">
            <img
                :src="`https://avatars.dicebear.com/api/identicon/${profile.id}.svg`"
                width="20"
                alt="User identicon"
            />
        </b-button>
        <base-navbar />
        <div class="sidebar-sibling">
            <b-alert show dismissible @dismissed="isAlertShown = false" variant="info" class="alert-top">
                <b-link
                    target="_blank"
                    href="https://medium.com/thxprotocol/product-update-shipped-twitter-conditional-rewards-ed3d03cbd5ff"
                >
                    <strong>New:</strong> Twitter Conditional Rewards!🐦🏆✨
                </b-link>
            </b-alert>
            <router-view />
        </div>
    </div>
</template>
<script lang="ts">
import { BAlert, BButton, BLink } from 'bootstrap-vue';
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import BaseNavbar from './components/BaseNavbar.vue';
import { IAccount } from './store/modules/account';

@Component({
    components: {
        BLink,
        BAlert,
        BButton,
        BaseNavbar,
    },
    computed: mapGetters({
        profile: 'account/profile',
    }),
})
export default class App extends Vue {
    isAlertShown = true;
    profile!: IAccount;

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
