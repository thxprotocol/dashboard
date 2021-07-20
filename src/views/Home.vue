<template>
    <div class="section-home container container-md">
        <b-alert variant="info" show class="mt-4" v-if="!Object.values(assetPools).length">
            Hi there! You can use this dashboard to create an asset pool on the Polygon blockchain that you can control
            with THX API.
        </b-alert>
        <div class="row" v-if="assetPools">
            <div class="col-md-6 col-lg-4" :key="assetPool.address" v-for="assetPool of assetPools">
                <base-asset-pool :assetPool="assetPool" />
            </div>
            <div class="col-md-6 col-lg-4">
                <div class="d-flex align-items-center h-100">
                    <b-button v-b-modal="'modalAssetPoolCreate'" class="btn-rounded" variant="primary" block>
                        <span>Create asset pool</span>
                        <i class="fas fa-plus ml-2"></i>
                    </b-button>
                </div>
            </div>
        </div>
        <modal-asset-pool-create />
    </div>
</template>

<script lang="ts">
import BaseAssetPool from '@/components/BaseAssetPool.vue';
import ModalAssetPoolCreate from '@/components/ModalAssetPoolCreate.vue';
import { UserProfile } from '@/store/modules/account';
import { Client, IClients } from '@/store/modules/clients';
import { IAssetPools } from '@/store/modules/assetPools';
import { BAlert, BButton, BCard, BModal } from 'bootstrap-vue';
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';

@Component({
    components: {
        'base-asset-pool': BaseAssetPool,
        'modal-asset-pool-create': ModalAssetPoolCreate,
        'b-alert': BAlert,
        'b-button': BButton,
        'b-card': BCard,
        'b-modal': BModal,
    },
    computed: mapGetters({
        profile: 'account/profile',
        clients: 'clients/all',
        assetPools: 'assetPools/all',
    }),
})
export default class Home extends Vue {
    profile!: UserProfile;
    assetPools!: IAssetPools;
    clients!: IClients;

    async mounted() {
        try {
            await this.$store.dispatch('account/getProfile');

            for (const rat of this.profile.registrationAccessTokens) {
                const client: Client = await this.$store.dispatch('clients/read', rat);

                client.assetPools.forEach((address: string) => {
                    this.$store.dispatch('assetPools/read', address);
                });
            }
        } catch (e) {
            debugger;
        }
    }
}
</script>
