<template>
    <div class="section-home container">
        <div class="justify-content-between d-flex pt-3">
            <h1 class="h3">Your Applications</h1>
            <b-button v-b-modal="'modalApplicationCreate'" class="btn-rounded" variant="primary">
                New application
                <i class="fas fa-plus"></i>
            </b-button>
        </div>
        <hr />
        <div class="row" v-if="profile">
            <div class="col-md-6 col-lg-4" :key="rat" v-for="rat of profile.registrationAccessTokens">
                <base-application :rat="rat" />
            </div>
        </div>
        <div class="justify-content-between d-flex pt-3">
            <h1 class="h3">Your Asset Pools</h1>
            <b-button v-b-modal="'modalAssetPoolCreate'" class="btn-rounded" variant="primary">
                New asset pool
                <i class="fas fa-plus"></i>
            </b-button>
        </div>
        <hr />
        <div class="row" v-if="profile">
            <div class="col-md-6 col-lg-4" :key="address" v-for="address of profile.memberships">
                <base-asset-pool :address="address" />
            </div>
        </div>
        <modal-application-create />
        <modal-asset-pool-create />
    </div>
</template>

<script lang="ts">
import BaseApplication from '@/components/BaseApplication.vue';
import BaseAssetPool from '@/components/BaseAssetPool.vue';
import ModalApplicationCreate from '@/components/ModalApplicationCreate.vue';
import ModalAssetPoolCreate from '@/components/ModalAssetPoolCreate.vue';
import { UserProfile } from '@/store/modules/account';
import { BButton, BCard, BModal } from 'bootstrap-vue';
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';

@Component({
    components: {
        'base-application': BaseApplication,
        'base-asset-pool': BaseAssetPool,
        'modal-application-create': ModalApplicationCreate,
        'modal-asset-pool-create': ModalAssetPoolCreate,
        'b-button': BButton,
        'b-card': BCard,
        'b-modal': BModal,
    },
    computed: mapGetters({
        profile: 'account/profile',
    }),
})
export default class Home extends Vue {
    profile!: UserProfile;

    async mounted() {
        try {
            await this.$store.dispatch('account/getProfile');
        } catch (e) {
            debugger;
        }
    }
}
</script>
