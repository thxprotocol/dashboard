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
        <b-card>
            <b-alert variant="danger" show v-if="error">{{ error }}</b-alert>
            <div class="mb-3 d-flex align-items-center">
                <img height="30" class="mr-3" :src="require('../assets/logo-youtube.png')" alt="" />
                <strong> YouTube </strong>
            </div>
            <hr />
            <p class="text-muted">Connect and reward likes and subscribes.</p>
            <b-button v-if="!youtube" @click="connect()" variant="primary" block class="rounded-pill">
                Connect
            </b-button>
            <b-button
                v-if="youtube"
                variant="light"
                block
                v-b-modal="`modalDelete-${channelType}`"
                class="rounded-pill"
            >
                <span class="text-danger">Disconnect</span>
            </b-button>
            <modal-delete :id="`modalDelete-${channelType}`" :call="disconnect" subject="YouTube integration" />
        </b-card>
    </b-skeleton-wrapper>
</template>

<script lang="ts">
import { IAccount, IYoutube } from '@/store/modules/account';
import { ChannelType } from '@/store/modules/rewards';
import { BAlert, BButton, BCard, BSkeletonWrapper, BSkeleton } from 'bootstrap-vue';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import ModalDelete from './ModalDelete.vue';

@Component({
    components: {
        ModalDelete,
        BCard,
        BButton,
        BAlert,
        BSkeletonWrapper,
        BSkeleton,
    },
    computed: mapGetters({
        profile: 'account/profile',
        youtube: 'account/youtube',
    }),
})
export default class Home extends Vue {
    isLoading = false;
    youtube!: IYoutube;
    profile!: IAccount;
    error = '';

    @Prop() channelType!: ChannelType;

    async mounted() {
        try {
            this.isLoading = true;

            if (this.$route.query.code) {
                await this.$store.dispatch('account/connectYoutube', this.$route.query.code);
            }
            await this.getYoutube();
        } catch (error) {
            this.error = (error as Error).toString();
        } finally {
            this.isLoading = false;
        }
    }

    async getYoutube() {
        const { error } = await this.$store.dispatch('account/getYoutube');

        if (error) {
            this.error = error.toString();
        }
    }

    async connect() {
        await this.$store.dispatch('account/connectRedirect', ChannelType.YouTube);
    }

    async disconnect() {
        try {
            await this.$store.dispatch('account/update', { googleAccess: false });

            this.$store.commit('account/setYoutube', null);
        } catch (error) {
            this.error = (error as Error).toString();
        }
    }
}
</script>
