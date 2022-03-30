<template>
    <b-skeleton-wrapper :loading="isLoading">
        <template #loading>
            <b-card class="mt-3 mb-3 shadow-sm cursor-pointer">
                <b-skeleton animation="fade" width="65%"></b-skeleton>
                <hr />
                <b-skeleton animation="fade" width="55%"></b-skeleton>
                <b-skeleton animation="fade" class="mb-3" width="70%"></b-skeleton>
                <b-skeleton type="button" animation="fade" class="rounded-pill" width="100%"></b-skeleton>
            </b-card>
        </template>
        <b-card class="mb-3">
            <b-alert variant="danger" show v-if="error">{{ error }}</b-alert>
            <div class="mb-3 d-flex align-items-center">
                <img height="30" class="mr-3" :src="require('@/assets/logo-spotify.png')" alt="" />
                <strong> Spotify </strong>
            </div>
            <hr />
            <p class="text-muted">Connect and reward track and playlist save and follows.</p>
            <b-button v-if="!spotify && !error" @click="connect()" variant="primary" block class="rounded-pill">
                Connect
            </b-button>
            <b-button v-if="spotify || error" variant="light" block @click="disconnect()" class="rounded-pill">
                <span class="text-danger">Disconnect</span>
            </b-button>
        </b-card>
    </b-skeleton-wrapper>
</template>

<script lang="ts">
import { IAccount, ISpotify } from '@/types/account';
import { ChannelType } from '@/store/modules/rewards';
import { BAlert, BButton, BCard, BSkeletonWrapper, BSkeleton } from 'bootstrap-vue';
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';

@Component({
    components: {
        BCard,
        BButton,
        BAlert,
        BSkeletonWrapper,
        BSkeleton,
    },
    computed: mapGetters({
        profile: 'account/profile',
        spotify: 'account/spotify',
    }),
})
export default class BaseIntegrationSpotify extends Vue {
    isLoading = false;
    spotify!: ISpotify;
    profile!: IAccount;
    error = '';

    async mounted() {
        this.isLoading = true;
        await this.getSpotify();
        this.isLoading = false;
    }

    async getSpotify() {
        const { error } = await this.$store.dispatch('account/getSpotify');

        if (error) {
            this.error = error.toString();
        }
    }

    async connect() {
        await this.$store.dispatch('account/connectRedirect', ChannelType.Spotify);
    }

    async disconnect() {
        try {
            await this.$store.dispatch('account/update', { spotifyAccess: false });

            this.$store.commit('account/setSpotify', null);
        } catch (error) {
            this.error = (error as Error).toString();
        }
    }
}
</script>
