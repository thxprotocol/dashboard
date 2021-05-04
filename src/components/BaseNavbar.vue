<template>
    <b-navbar toggleable="lg">
        <div class="container">
            <router-link to="/" class="header-brand mr-3">
                <img :src="require('@/assets/logo.png')" alt="THX logo" />
            </router-link>
            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
            <b-collapse id="nav-collapse" is-nav>
                <b-navbar-nav>
                    <b-nav-item to="/">Dashboard</b-nav-item>
                    <li class="nav-item">
                        <a :href="docsUrl" class="nav-link" target="_blank">Developer Docs</a>
                    </li>
                    <b-nav-item class="d-lg-none" @click="logout()">Logout</b-nav-item>
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
                    <b-dropdown size="lg" variant="white" no-caret class="d-none d-lg-flex">
                        <template #button-content>
                            <i class="fas fa-user-circle"></i>
                        </template>
                        <b-dropdown-item @click="logout()">Logout</b-dropdown-item>
                    </b-dropdown>
                </div>
            </b-collapse>
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

    async logout() {
        try {
            await this.$store.dispatch('account/signoutRedirect');
        } catch (e) {
            return;
        }
    }
}
</script>
