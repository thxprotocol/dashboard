<template>
    <b-sidebar
        class="d-none d-md-flex"
        bg-variant="darker"
        id="sidebar-left"
        no-header
        no-header-close
        no-close-on-route-change
        no-slide
        :visible="true"
        shadow
    >
        <b-navbar toggleable="lg" class="sidebar">
            <div class="w-100 p-3 pb-5">
                <router-link to="/">
                    <img :src="require('@/assets/logo.png')" width="40" alt="THX logo" />
                </router-link>
            </div>
            <div class="flex-grow-1 w-100">
                <b-navbar-nav>
                    <b-nav-item to="/tokens" class="nav-link-plain">
                        <div class="nav-link-wrapper">
                            <div class="nav-link-icon">
                                <i class="fas fa-coins"></i>
                            </div>
                            <div class="flex-grow-1">
                                <span>Tokens</span>
                            </div>
                        </div>
                    </b-nav-item>
                    <b-nav-item to="/pools" class="nav-link-plain">
                        <div class="nav-link-wrapper">
                            <div class="nav-link-icon">
                                <i class="fas fa-chart-pie"></i>
                            </div>
                            <div class="flex-grow-1">
                                <span>Pools</span>
                            </div>
                        </div>

                        <div v-if="poolAddress" class="bg-dark p-0">
                            <b-nav-item :to="`/pool/${poolAddress}/rewards`" class="nav-link-plain">
                                <span>Rewards</span>
                            </b-nav-item>
                            <b-nav-item :to="`/pool/${poolAddress}/promocodes`" class="nav-link-plain">
                                <span>Promotions</span>
                            </b-nav-item>
                            <b-nav-item :to="`/pool/${poolAddress}/widgets`" class="nav-link-plain">
                                <span>Widgets</span>
                            </b-nav-item>
                            <b-nav-item :to="`/pool/${poolAddress}/info`" class="nav-link-plain">
                                <span>Details</span>
                            </b-nav-item>
                        </div>
                    </b-nav-item>
                    <b-nav-item to="/integrations" class="nav-link-plain">
                        <div class="nav-link-wrapper">
                            <div class="nav-link-icon">
                                <i class="fas fa-cogs"></i>
                            </div>
                            <div class="flex-grow-1">
                                <span>Integrations</span>
                            </div>
                        </div>
                    </b-nav-item>
                    <b-nav-item :href="docsUrl" target="_blank" class="nav-link-plain">
                        <div class="nav-link-wrapper">
                            <div class="nav-link-icon">
                                <i class="far fa-file-alt"></i>
                            </div>
                            <div class="flex-grow-1">
                                <span>Developer Docs</span>
                            </div>
                        </div>
                    </b-nav-item>
                </b-navbar-nav>
            </div>
            <div class="d-flex justify-content-end flex-column flex-grow-0 w-100">
                <b-navbar-nav>
                    <b-nav-item to="/account" class="nav-link-plain border-top border-dark">
                        <div class="nav-link-wrapper">
                            <div class="nav-link-icon">
                                <i class="fa fa-gear"></i>
                            </div>
                            <div class="flex-grow-1">
                                <span>Account</span>
                            </div>
                        </div>
                    </b-nav-item>
                    <b-nav-item to="/signout" class="nav-link-plain border-top border-dark">
                        <div class="nav-link-wrapper">
                            <div class="nav-link-icon">
                                <i class="fas fa-sign-out-alt"></i>
                            </div>
                            <div class="flex-grow-1">
                                <span>Logout</span>
                            </div>
                        </div>
                    </b-nav-item>
                </b-navbar-nav>
            </div>
        </b-navbar>
    </b-sidebar>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';

@Component({
    computed: mapGetters({
        profile: 'account/profile',
    }),
})
export default class BaseNavbar extends Vue {
    docsUrl = process.env.VUE_APP_DOCS_URL;
    walletUrl = process.env.VUE_APP_WALLET_URL;

    get poolAddress() {
        return this.$route.params.address;
    }
}
</script>

<style scoped lang="scss">
.sidebar .nav-link-plain {
    .nav-link {
        padding: 0rem;
        margin: 0;
    }

    .nav-link-wrapper {
        padding: 1rem;
        display: flex;
    }

    .nav-link-icon {
        width: 30px;
        flex: 0 0 30px;

        ~ div {
            flex-grow: 1;
        }
    }

    .nav-link-plain {
        .nav-link {
            padding: 1rem;
        }
        border-bottom: 1px solid black;
    }
}
</style>
