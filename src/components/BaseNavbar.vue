<template>
    <b-navbar toggleable="lg" class="sidebar">
        <router-link to="/" class="header-brand mb-5">
            <img :src="require('@/assets/logo.png')" width="65" alt="THX logo" />
        </router-link>
        <div class="flex-grow-1 w-100">
            <b-navbar-nav>
                <b-nav-item to="/" class="nav-link-plain">
                    <i class="fas fa-chart-pie mr-2"></i>
                    <span class="d-none d-lg-inline-block">Asset Pools</span>
                </b-nav-item>
                <b-nav-item :href="docsUrl" target="_blank" class="nav-link-plain">
                    <i class="far fa-file-alt mr-2"></i>
                    <span class="d-none d-lg-inline-block">Developer Docs</span>
                </b-nav-item>
                <b-nav-item :href="walletUrl" target="_blank" class="nav-link-plain">
                    <i class="fas fa-wallet mr-2"></i>
                    <span class="d-none d-lg-inline-block">Web Wallet</span>
                </b-nav-item>
            </b-navbar-nav>
        </div>
        <div class="d-flex justify-content-end flex-column flex-grow-0 w-100">
            <b-navbar-nav>
                <b-nav-item href="https://thx.page.link/slack" target="_blank" class="nav-link-plain">
                    <div class="rounded bg-white d-inline-flex p-3 mr-3">
                        <img :src="require('@/assets/thx_slack.png')" width="16" />
                    </div>
                    <span class="d-none d-lg-inline-block">Slack</span>
                </b-nav-item>
                <b-nav-item href="https://discord.com/invite/TzbbSmkE7Y" target="_blank" class="nav-link-plain">
                    <div class="rounded bg-white d-inline-flex p-3 mr-3">
                        <img :src="require('@/assets/thx_discord.png')" width="16" />
                    </div>
                    <span class="d-none d-lg-inline-block">Discord</span>
                </b-nav-item>
                <b-nav-item @click="logout()" class="nav-link-plain text-center border-top border-dark mt-3">
                    <i class="fas fa-sign-out-alt mr-3"></i>
                    <span class="d-none d-lg-inline-block">Logout</span>
                </b-nav-item>
            </b-navbar-nav>
        </div>
    </b-navbar>
</template>

<script lang="ts">
import {
    BButton,
    BCollapse,
    BDropdown,
    BDropdownItem,
    BNavbar,
    BNavbarNav,
    BNavbarToggle,
    BNavItem,
} from 'bootstrap-vue';
import { Component, Vue } from 'vue-property-decorator';

@Component({
    components: {
        'b-button': BButton,
        'b-navbar': BNavbar,
        'b-navbar-nav': BNavbarNav,
        'b-nav-item': BNavItem,
        'b-navbar-toggle': BNavbarToggle,
        'b-collapse': BCollapse,
        'b-dropdown': BDropdown,
        'b-dropdown-item': BDropdownItem,
    },
})
export default class BaseNavbar extends Vue {
    docsUrl = process.env.VUE_APP_DOCS_URL;
    walletUrl = process.env.VUE_APP_WALLET_URL;

    async logout() {
        try {
            await this.$store.dispatch('account/signoutRedirect');
        } catch (e) {
            return;
        }
    }
}
</script>

<style></style>
