<template>
    <base-card>
        <template #default="{ clicked }">
            <div class="mb-3 d-flex align-items-center">
                <img height="30" class="mr-3" :src="require('@/assets/logo-spotify.png')" alt="" />
                <strong> {{ erc20.name }} </strong>
            </div>
            <hr />
            <b-button @click="clicked('bal')"></b-button>
            <p class="text-muted">Connect and reward track and playlist save and follows.</p>
        </template>
    </base-card>
</template>

<script lang="ts">
import { IAccount, ISpotify } from '@/types/account';
import { ChannelType } from '@/store/modules/rewards';
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import BaseCard from './BaseCard.vue';

@Component({
    components: {
        BaseCard,
    },
    computed: mapGetters({
        profile: 'account/profile',
        spotify: 'account/spotify',
    }),
})
export default class BaseCardERC20 extends Vue {
    spotify!: ISpotify;
    profile!: IAccount;
    error = '';

    async mounted() {
        debugger;
        this.$emit('loading', true);
        await this.getSpotify();
        this.$emit('loading', false);
    }

    async getSpotify() {
        const { error } = await this.$store.dispatch('account/getSpotify');

        if (error) {
            this.$emit('error', error);
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
