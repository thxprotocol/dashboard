<template>
    <b-card>
        <b-alert variant="danger" show v-if="error">{{ error }}</b-alert>
        <h2 class="h2">
            <img height="20" :src="require('../assets/logo-youtube.png')" alt="" />
            Youtube
        </h2>
        <p v-if="youtube">
            Channels: {{ youtube.channels.length }}<br />
            Videos: {{ youtube.videos.length }} <br />
            Expires: {{ Date(profile.googleAccessTokenExpires) }}
        </p>
        <b-button
            v-if="!youtube"
            :href="`https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URI}&response_type=token&scope=https://www.googleapis.com/auth/youtube.readonly%20https://www.googleapis.com/auth/youtube.force-ssl`"
            variant="primary"
            block
            class="rounded-pill"
        >
            Connect
        </b-button>
        <b-button v-if="youtube" variant="primary" block @click="disconnect()" class="rounded-pill">
            Disconnect
        </b-button>
    </b-card>
</template>

<script lang="ts">
import { IYoutube } from '@/store/modules/account';
import { BAlert, BButton, BCard } from 'bootstrap-vue';
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';

@Component({
    components: {
        'b-card': BCard,
        'b-button': BButton,
        'b-alert': BAlert,
    },
    computed: mapGetters({
        profile: 'account/profile',
        youtube: 'account/youtube',
    }),
})
export default class Home extends Vue {
    GOOGLE_CLIENT_ID = process.env.VUE_APP_GOOGLE_CLIENT_ID;
    GOOGLE_REDIRECT_URI = process.env.VUE_APP_GOOGLE_REDIRECT_URI;
    isLoading = false;
    youtube!: IYoutube;
    error = '';

    async mounted() {
        if (this.$route.hash) {
            this.isLoading = true;

            try {
                const fragments = this.$route.hash.split('#access_token=');
                const expiresIn = fragments[1].split('&expires_in=')[1].split('&scope=')[0];
                const googleAccessToken = fragments[1].split('&token_type=')[0];
                const googleAccessTokenExpires = Date.now() + Number(expiresIn) * 1000;

                await this.$store.dispatch('account/update', {
                    googleAccessToken,
                    googleAccessTokenExpires,
                });

                this.$router.push('/integrations');
            } catch (error) {
                //
            } finally {
                this.isLoading = false;
            }
        }

        const { error } = await this.$store.dispatch('account/getYoutube');

        if (error) this.error = error.toString();
    }

    async disconnect() {
        // Remove googleAccessToken
        await this.$store.dispatch('account/update', { googleAccessToken: '' });
    }
}
</script>
