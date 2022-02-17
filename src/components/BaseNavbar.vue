<template>
    <b-sidebar
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
                    <b-nav-item to="/pools" class="nav-link-plain">
                        <div class="nav-link-wrapper">
                            <div class="nav-link-icon">
                                <i class="fas fa-chart-pie"></i>
                            </div>
                            <div class="flex-grow-1">
                                <span>Token Pools</span>
                            </div>
                        </div>

                        <div v-if="poolAddress" class="bg-dark p-0">
                            <b-nav-item :to="`/pool/${poolAddress}/rewards`" class="nav-link-plain">
                                <span>Rewards</span>
                            </b-nav-item>
                            <b-nav-item :to="`/pool/${poolAddress}/promocodes`" class="nav-link-plain">
                                <span>Redeem</span>
                            </b-nav-item>
                            <b-nav-item :to="`/pool/${poolAddress}/widgets`" class="nav-link-plain">
                                <span>Widgets</span>
                            </b-nav-item>
                            <b-nav-item :to="`/pool/${poolAddress}/info`" class="nav-link-plain">
                                <span>Details</span>
                            </b-nav-item>
                            <!-- <b-nav-item :to="`/pool/${poolAddress}/governance`" class="nav-link-plain">
                                <span>Governance</span>
                            </b-nav-item> -->
                            <!-- <b-nav-item :to="`/pool/${poolAddress}/governance`" class="nav-link-plain">
                                <span>Analytics</span>
                            </b-nav-item> -->
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
                    <b-nav-item :href="walletUrl" target="_blank" class="nav-link-plain">
                        <div class="nav-link-wrapper">
                            <div class="nav-link-icon">
                                <i class="fas fa-wallet"></i>
                            </div>
                            <div class="flex-grow-1">
                                <span>Web Wallet</span><br />
                                <small v-if="profile && profile.address" class="text-muted text-truncate">
                                    {{ profile.address }}
                                </small>
                            </div>
                        </div>
                    </b-nav-item>
                </b-navbar-nav>
            </div>
            <div class="d-flex justify-content-end flex-column flex-grow-0 w-100">
                <b-navbar-nav>
                    <b-nav-item href="https://discord.com/invite/TzbbSmkE7Y" target="_blank" class="nav-link-plain">
                        <div class="nav-link-wrapper align-items-center">
                            <div class="rounded d-inline-flex p-3 mr-3" style="width: 48px; background-color: #4d66ff">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="25"
                                    height="15"
                                    viewBox="0 0 71 55"
                                    fill="none"
                                >
                                    <g clip-path="url(#clip0)">
                                        <path
                                            d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z"
                                            fill="#ffffff"
                                        />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0">
                                            <rect width="71" height="55" fill="white" />
                                        </clipPath>
                                    </defs>
                                </svg>
                            </div>
                            <div class="flex-grow-1">
                                <span>Discord</span>
                            </div>
                        </div>
                    </b-nav-item>
                    <!-- <b-nav-item class="nav-link-plain border-top border-dark mt-3 cursor-not-allowed" disabled>
                        <div class="nav-link-wrapper">
                            <div class="nav-link-icon">
                                <i class="fas fa-user"></i>
                            </div>
                            <div class="flex-grow-1">
                                <span>My Account</span>
                            </div>
                        </div>
                    </b-nav-item> -->
                    <div class="p-3 border-top border-dark">
                        <base-gas-admin v-if="profile" />
                    </div>
                    <b-nav-item class="nav-link-plain">
                        <b-button v-if="profile" variant="darker" class="identicon shadow-sm" to="/account">
                            <img
                                :src="`https://avatars.dicebear.com/api/identicon/${profile.id}.svg`"
                                width="20"
                                alt="User identicon"
                            />
                        </b-button>
                    </b-nav-item>
                    <b-nav-item @click="logout()" class="nav-link-plain border-top border-dark">
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
import BaseGasAdmin from './BaseGasAdmin.vue';

@Component({
    components: {
        BaseGasAdmin,
    },
    computed: mapGetters({
        profile: 'account/profile',
    }),
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

        &:hover {
            // background: red;
        }
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
