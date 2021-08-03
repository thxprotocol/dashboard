<template>
    <div class="shadow mb-5">
        <b-navbar toggleable="lg">
            <div class="container">
                <router-link to="/" class="header-brand mr-3">
                    <img :src="require('@/assets/logo.png')" alt="THX logo" />
                </router-link>
                <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
                <b-collapse id="nav-collapse" is-nav>
                    <b-navbar-nav>
                        <b-nav-item to="/" class="nav-link-plain">
                            <i class="fas fa-chart-pie mr-2"></i>
                            Your Pools
                        </b-nav-item>
                        <b-nav-item :href="docsUrl" target="_blank" class="nav-link-plain">
                            <i class="far fa-file-alt mr-2"></i>
                            Developer Docs
                        </b-nav-item>
                        <b-nav-item :href="walletUrl" target="_blank" class="nav-link-plain">
                            <i class="fas fa-wallet text-dark mr-2"></i>
                            Web Wallet
                        </b-nav-item>
                        <b-nav-item class="d-lg-none" @click="logout()">Logout</b-nav-item>
                    </b-navbar-nav>
                    <b-navbar-nav class="navbar-nav-right">
                        <b-nav-item href="https://thx.page.link/slack" target="_blank" class="nav-link-plain">
                            <img :src="require('@/assets/thx_slack.png')" height="15" class="mr-2" />
                            <span>Slack</span>
                        </b-nav-item>
                        <b-nav-item href="https://discord.gg/DNGtp3Xw" target="_blank" class="nav-link-plain">
                            <img :src="require('@/assets/thx_discord.png')" height="15" class="mr-2" />
                            <span>Discord</span>
                        </b-nav-item>

                        <b-dropdown variant="white" no-caret class="d-none d-lg-flex">
                            <template #button-content>
                                <i class="fas fa-user-circle text-primary" style="font-size: 1.5rem"></i>
                            </template>
                            <b-dropdown-item disabled>My account</b-dropdown-item>
                            <b-dropdown-item @click="logout()">Logout</b-dropdown-item>
                        </b-dropdown>
                    </b-navbar-nav>
                </b-collapse>
            </div>
        </b-navbar>
    </div>
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
