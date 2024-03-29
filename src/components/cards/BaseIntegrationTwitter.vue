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
            <div class="mb-3 d-flex align-items-center">
                <img height="30" class="mr-3" :src="require('@/assets/logo-twitter.png')" alt="" />
                <strong> Twitter </strong>
            </div>
            <hr />
            <p class="text-muted">Connect and reward likes, retweets and followers.</p>
            <b-button v-if="!twitter" @click="connect()" variant="primary" block class="rounded-pill">
                Connect
            </b-button>
            <b-button v-if="twitter" variant="light" block @click="disconnect()" class="rounded-pill">
                <span class="text-danger">Disconnect</span>
            </b-button>
        </b-card>
    </b-skeleton-wrapper>
</template>

<script lang="ts">
import { IAccount, ITwitter } from '@/types/account';
import { ChannelType } from '@/types/rewards';
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';

@Component({
    computed: mapGetters({
        profile: 'account/profile',
        twitter: 'account/twitter',
    }),
})
export default class BaseIntegrationTwitter extends Vue {
    isLoading = true;
    twitter!: ITwitter;
    profile!: IAccount;

    mounted() {
        this.$store.dispatch('account/getTwitter').then(() => (this.isLoading = false));
    }

    connect() {
        this.$store.dispatch('account/connectRedirect', ChannelType.Twitter);
    }

    disconnect() {
        this.$store
            .dispatch('account/update', { twitterAccess: false })
            .then(() => this.$store.dispatch('account/getTwitter'));
    }
}
</script>
