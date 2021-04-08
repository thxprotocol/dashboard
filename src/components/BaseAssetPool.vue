<template>
    <b-overlay :show="loading" rounded="sm" v-if="p">
        <b-card class="mt-3 mb-3 position-relative">
            <div class="d-flex justify-content-between">
                <strong class="mr-3">{{ p.title }}</strong>
                <b-badge class="d-flex align-items-center" variant="primary" v-if="p.network === 0"> Test </b-badge>
                <b-badge class="d-flex align-items-center" variant="success" v-if="p.network === 1"> Main </b-badge>
            </div>
            <hr />
            <div class="font-weight-bold m-0 text-primary h3">{{ p.poolToken.balance }} {{ p.poolToken.symbol }}</div>
            <template #footer>
                <div class="text-right">
                    <b-link class="text-danger small mr-3" size="sm" href="#" v-b-modal="`modalDelete-${p.address}`">
                        Remove
                    </b-link>
                    <b-button
                        variant="primary"
                        class="btn-rounded"
                        size="sm"
                        v-b-modal="`modalAssetPoolDetails-${address}`"
                    >
                        Details
                    </b-button>
                </div>
            </template>
            <modal-delete :id="`modalDelete-${p.address}`" :call="remove" :subject="p.title" />
            <modal-asset-pool-details :assetPool="p" />
        </b-card>
    </b-overlay>
</template>

<script lang="ts">
import { UserProfile } from '@/store/modules/account';
import { AssetPool, IAssetPools } from '@/store/modules/assetPools';
import { BBadge, BButton, BCard, BLink, BOverlay } from 'bootstrap-vue';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import ModalAssetPoolDetails from './ModalAssetPoolDetails.vue';
import ModalDelete from './ModalDelete.vue';

@Component({
    components: {
        'b-link': BLink,
        'b-button': BButton,
        'b-badge': BBadge,
        'b-card': BCard,
        'b-overlay': BOverlay,
        'modal-delete': ModalDelete,
        'modal-asset-pool-details': ModalAssetPoolDetails,
    },
    computed: mapGetters({
        profile: 'account/profile',
        assetPools: 'assetPools/all',
    }),
})
export default class BaseAssetPool extends Vue {
    loading = false;

    @Prop() address!: string;

    profile!: UserProfile;
    assetPools!: IAssetPools;

    get p(): AssetPool {
        return this.assetPools[this.address];
    }

    async mounted() {
        this.loading = true;
        try {
            await this.$store.dispatch('assetPools/read', this.address);
        } catch (e) {
            console.error(e);
        } finally {
            this.loading = false;
        }
    }

    async remove() {
        this.loading = true;
        try {
            await this.$store.dispatch('assetPools/remove', this.address);
            await this.$store.dispatch('account/getProfile');
        } catch (e) {
            console.error(e);
        } finally {
            this.loading = false;
        }
    }
}
</script>
<style lang="scss" scoped>
.card-title {
    font-size: 1rem;
}
</style>
