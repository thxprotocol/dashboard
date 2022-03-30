<template>
    <div id="app">
        <base-navbar />
        <div class="sidebar-sibling">
            <div v-if="profile" class="d-flex position-fixed justify-content-end p-3" style="right: 0">
                <base-dropdown-admin-balance class="mr-2" />
                <base-dropdown-account class="mr-2" />
                <base-dropdown-menu />
            </div>
            <router-view />
        </div>
    </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import { IAccount } from './types/account';
import { initGTM } from '@/utils/ga';
import BaseDropdownAccount from './components/dropdowns/BaseDropdownAccount.vue';
import BaseNavbar from './components/BaseNavbar.vue';
import BaseDropdownAdminBalance from './components/dropdowns/BaseDropdownAdminBalance.vue';
import BaseDropdownMenu from './components/dropdowns/BaseDropdownMenu.vue';

@Component({
    components: {
        BaseDropdownAdminBalance,
        BaseDropdownAccount,
        BaseDropdownMenu,
        BaseNavbar,
    },
    computed: mapGetters({
        profile: 'account/profile',
    }),
})
export default class App extends Vue {
    profile!: IAccount;

    created() {
        initGTM;
    }
}
</script>
