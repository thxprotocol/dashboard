<template>
    <div>
        <b-jumbotron
            class="jumbotron-header text-left"
            :style="{
                'background-image': `url(${require('@/assets/thx_jumbotron.webp')})`,
            }"
        >
            <div class="container container-md pt-10 pb-5">
                <p class="brand-text">Integrations</p>
                <p>Connect your social accounts and create automated token rewards for you audience.</p>
            </div>
        </b-jumbotron>

        <div class="container container-md" v-if="profile">
            <b-alert variant="info" show>
                🚧 The Spotify integration is undergoing a verification procedure by the Spotify team. We are currently
                limitted to <strong>25 test users</strong>.
                <b-link href="https://discord.com/invite/TzbbSmkE7Y">Contact the THX team</b-link> in Discord if you
                want to try it out!
            </b-alert>
            <div class="row">
                <div class="col-md-6 col-lg-4">
                    <base-integration-youtube />
                </div>
                <div class="col-md-6 col-lg-4">
                    <base-integration-twitter />
                </div>
                <div class="col-md-6 col-lg-4">
                    <base-integration-spotify />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { BAlert, BButton, BCard, BJumbotron } from 'bootstrap-vue';
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import BaseIntegrationYoutube from '@/components/cards/BaseIntegrationYoutube.vue';
import BaseIntegrationTwitter from '@/components/cards/BaseIntegrationTwitter.vue';
import BaseIntegrationSpotify from '@/components/cards/BaseIntegrationSpotify.vue';

@Component({
    components: {
        BaseIntegrationYoutube,
        BaseIntegrationTwitter,
        BaseIntegrationSpotify,
    },
    computed: mapGetters({
        profile: 'account/profile',
    }),
})
export default class Home extends Vue {
    mounted() {
        this.$store.dispatch('account/getProfile');
    }
}
</script>
