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
            <div class="col-md-6 col-lg-4" :key="app.clientId" v-for="app of applications">
                <base-application :app="app" />
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
            <div class="col-md-6 col-lg-4" :key="assetPool.address" v-for="assetPool of assetPools">
                <base-asset-pool :assetPool="assetPool" />
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
import { IApplications } from '@/store/modules/applications';
import { IAssetPools } from '@/store/modules/assetPools';
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
        applications: 'applications/all',
        assetPools: 'assetPools/all',
    }),
})
export default class Home extends Vue {
    profile!: UserProfile;
    assetPools!: IAssetPools;
    applications!: IApplications;

    async mounted() {
        try {
            await this.$store.dispatch('account/getProfile');

            for (const rat of this.profile.registrationAccessTokens) {
                await this.$store.dispatch('applications/read', rat);

                this.applications[rat].assetPools.forEach((address: string) => {
                    this.$store.dispatch('assetPools/read', address);
                });
            }
        } catch (e) {
            debugger;
        }
    }
}
</script>
