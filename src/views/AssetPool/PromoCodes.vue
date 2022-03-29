<template>
    <div>
        <b-row class="mb-3">
            <b-col class="d-flex align-items-center">
                <h2 class="mb-0">Promo Codes</h2>
            </b-col>
            <b-col class="d-flex justify-content-end">
                <b-button v-b-modal="'modalPromoCodeCreate'" class="rounded-pill" variant="primary">
                    <i class="fas fa-plus mr-2"></i>
                    <span class="d-none d-md-inline">Create a promo code</span>
                </b-button>
            </b-col>
        </b-row>
        <b-alert show variant="info" v-if="!promoCodesForPool">
            Let your audience redeem {{ assetPool.poolToken.symbol }} in their wallet for unique promo codes.
            <b-link v-b-modal="'modalPromoCodeCreate'">Let's create your first Promo Code!</b-link>
        </b-alert>
        <div class="container">
            <b-row>
                <b-col md="6" :key="promoCode.id" v-for="promoCode of promoCodesForPool">
                    <base-promo-code :promoCode="promoCode" :assetPool="assetPool" />
                </b-col>
            </b-row>
        </div>
        <modal-promo-code-create :assetPool="assetPool" />
    </div>
</template>

<script lang="ts">
import { mapGetters } from 'vuex';
import { Component, Vue } from 'vue-property-decorator';
import ModalPromoCodeCreate from '@/components/ModalPromoCodeCreate.vue';
import BasePromoCode from '@/components/BasePromoCode.vue';
import { IAssetPools } from '@/store/modules/assetPools';
import { IPromoCodes } from '@/types/IPromoCodes';

@Component({
    components: {
        ModalPromoCodeCreate,
        BasePromoCode,
    },
    computed: mapGetters({
        assetPools: 'assetPools/all',
        promoCodes: 'promoCodes/all',
    }),
})
export default class PromoCodesView extends Vue {
    assetPools!: IAssetPools;
    promoCodes!: IPromoCodes;

    get assetPool() {
        return this.assetPools[this.$route.params.address];
    }

    get promoCodesForPool() {
        return this.promoCodes[this.$route.params.address];
    }

    async mounted() {
        await this.$store.dispatch('promoCodes/list', { poolAddress: this.assetPool.address });
    }
}
</script>
