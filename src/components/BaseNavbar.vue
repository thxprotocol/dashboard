<template>
    <b-navbar>
        <div class="container">
            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
            <b-collapse id="nav-collapse" is-nav>
                <router-link to="/" class="header-brand">
                    <img :src="require('@/assets/logo.png')" alt="THX logo" />
                </router-link>
                <b-navbar-nav>
                    <b-nav-item to="/">Dashboard</b-nav-item>
                    <!-- <b-nav-item to="/faq">FAQ</b-nav-item> -->
                </b-navbar-nav>
                <div class="navbar-nav-right">
                    <b-navbar-nav>
                        <b-nav-item href="https://github.com/thxprotocol" target="_blank">
                            <i class="fab fa-github"></i>
                        </b-nav-item>
                        <b-nav-item href="https://thx.page.link/slack" target="_blank">
                            <i class="fab fa-slack"></i>
                        </b-nav-item>
                        <b-nav-item href="https://twitter.com/thxprotocol" target="_blank">
                            <i class="fab fa-twitter"></i>
                        </b-nav-item>
                    </b-navbar-nav>
                    <b-button class="btn-rounded ml-3" size="sm" variant="dark" @click="logout()">
                        Logout
                        <i class="fas fa-sign-out-alt ml-1"></i>
                    </b-button>
                </div>
            </b-collapse>
        </div>
    </b-navbar>
</template>

<script lang="ts">
import { BButton, BCollapse, BNavbar, BNavbarNav, BNavbarToggle, BNavItem } from 'bootstrap-vue';
import { Component, Vue } from 'vue-property-decorator';

@Component({
    components: {
        'b-button': BButton,
        'b-navbar': BNavbar,
        'b-navbar-nav': BNavbarNav,
        'b-nav-item': BNavItem,
        'b-navbar-toggle': BNavbarToggle,
        'b-collapse': BCollapse,
    },
})
export default class BaseNavbar extends Vue {
    async logout() {
        try {
            await this.$store.dispatch('account/signoutRedirect');
        } catch (e) {
            return;
        }
    }
}
</script>
