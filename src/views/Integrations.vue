<template>
    <div>
        <b-jumbotron
            class="jumbotron-header text-left"
            :style="{
                'background-image': `url(${require('../assets/thx_jumbotron.webp')})`,
            }"
        >
            <div class="container container-md pt-10 pb-5">
                <p class="brand-text">Integrations</p>
                <p>Connect your social accounts and create automated token rewards for you audience.</p>
            </div>
        </b-jumbotron>
        <div class="container container-md" v-if="profile">
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
import BaseIntegrationYoutube from '@/components/BaseIntegrationYoutube.vue';
import BaseIntegrationTwitter from '@/components/BaseIntegrationTwitter.vue';
import BaseIntegrationSpotify from '@/components/BaseIntegrationSpotify.vue';

@Component({
    components: {
        'b-jumbotron': BJumbotron,
        'b-card': BCard,
        'b-alert': BAlert,
        'b-button': BButton,
        'base-integration-youtube': BaseIntegrationYoutube,
        BaseIntegrationTwitter,
        BaseIntegrationSpotify,
    },
    computed: mapGetters({
        profile: 'account/profile',
    }),
})
export default class Home extends Vue {
    async mounted() {
        try {
            await this.$store.dispatch('account/getProfile');
        } catch (e) {
            debugger;
        }
    }
}
</script>
