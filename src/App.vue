<template>
    <div id="app" :class="{ 'is-alert-shown': isAlertShown }">
        <div class="d-flex position-fixed w-100 justify-content-end p-3">
            <base-dropdown-account class="mr-3" />
            <b-dropdown size="sm" variant="darker" no-caret toggle-class="d-flex align-items-center">
                <template #button-content>
                    <i
                        class="fas fa-ellipsis-v m-0 p-1 px-2 text-muted"
                        aria-hidden="true"
                        style="font-size: 1.5rem"
                    ></i>
                </template>
                <b-dropdown-item to="/tokens"> Tokens </b-dropdown-item>
                <b-dropdown-item to="/pools"> Pools </b-dropdown-item>
                <b-dropdown-item to="/integrations"> Integrations </b-dropdown-item>
                <b-dropdown-item to="/account"> Account </b-dropdown-item>
                <b-dropdown-divider />
                <b-dropdown-item to="/signout"> Logout </b-dropdown-item>
            </b-dropdown>
        </div>
        <base-navbar />
        <div class="sidebar-sibling">
            <router-view />
        </div>
    </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import BaseDropdownAccount from './components/BaseDropdownAccount.vue';
import BaseNavbar from './components/BaseNavbar.vue';
import { IAccount } from './types/account';
import { initGTM } from '@/utils/ga';

@Component({
    components: {
        BaseDropdownAccount,
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
        initGTM;
    }
}
</script>
