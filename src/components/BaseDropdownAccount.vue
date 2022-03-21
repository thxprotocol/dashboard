<template>
    <b-dropdown size="sm" variant="darker" no-caret toggle-class="d-flex align-items-center" v-if="profile">
        <template #button-content>
            <img
                class="p-1 mr-md-2"
                :src="`https://avatars.dicebear.com/api/identicon/${profile.id}.svg`"
                height="32"
                alt="User identicon"
            />

            <span class="d-none d-md-block text-muted text-overflow-75">
                {{ profile.address }}
            </span>
        </template>
        <b-dropdown-item class="small" v-clipboard:copy="profile.address">
            <i class="fas fa-clipboard mr-3 text-muted"></i>Copy address
        </b-dropdown-item>
        <b-dropdown-item class="small" :href="walletUrl" target="_blank">
            <i class="fas fa-wallet mr-3 text-muted"></i>Visit wallet
        </b-dropdown-item>
    </b-dropdown>
</template>

<script lang="ts">
import { IAccount } from '@/types/account';
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';

@Component({
    name: 'BaseDropdownAccount',
    computed: mapGetters({
        profile: 'account/profile',
    }),
})
export default class BaseDropdownAccount extends Vue {
    profile!: IAccount;
    walletUrl = process.env.VUE_APP_WALLET_URL;
}
</script>
