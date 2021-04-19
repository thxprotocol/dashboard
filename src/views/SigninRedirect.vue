<template>
    <div class="center-center h-100">
        <b-spinner variant="primary"></b-spinner>
    </div>
</template>

<script lang="ts">
import { UserProfile } from '@/store/modules/account';
import { User } from 'oidc-client';
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import { BSpinner } from 'bootstrap-vue';

@Component({
    components: { 'b-spinner': BSpinner },
    computed: mapGetters({
        privateKey: 'account/privateKey',
        profile: 'account/profile',
        user: 'account/user',
    }),
})
export default class Redirect extends Vue {
    busy = false;
    error = '';

    // getters
    user!: User;
    profile!: UserProfile;
    privateKey!: string;

    async mounted() {
        try {
            await this.$store.dispatch('account/signinRedirectCallback');
            await this.$store.dispatch('account/getProfile');

            this.$router.push('/');
        } catch (e) {
            this.error = e.toString();
        }
    }
}
</script>
