<template>
    <div>
        <b-row class="mb-3">
            <b-col class="d-flex align-items-center">
                <h2 class="mb-0">Promotions</h2>
            </b-col>
            <b-col class="d-flex justify-content-end">
                <b-button v-b-modal="'modalPromotionCreate'" class="rounded-pill" variant="primary">
                    <i class="fas fa-plus mr-2"></i>
                    <span class="d-none d-md-inline">Create a promotion</span>
                </b-button>
            </b-col>
        </b-row>
        <b-alert show variant="info" v-if="!promotionsForPool">
            Let your audience redeem {{ pool.token.symbol }} in their wallet for unique promo codes.
            <b-link v-b-modal="'modalPromotionCreate'">Let's create your first promotion!</b-link>
        </b-alert>
        <div class="container">
            <b-row>
                <b-col md="6" :key="promotion.id" v-for="promotion of promotionsForPool">
                    <base-promo-code :promoCode="promotion" :pool="pool" />
                </b-col>
            </b-row>
        </div>
        <modal-promotion-create :pool="pool" />
    </div>
</template>

<script lang="ts">
import { mapGetters } from 'vuex';
import { Component, Vue } from 'vue-property-decorator';
import ModalPromotionCreate from '@/components/modals/BaseModalPromotionCreate.vue';
import BasePromoCode from '@/components/cards/BasePromoCode.vue';
import { IAssetPools } from '@/store/modules/pools';
import { IPromoCodes } from '@/types/IPromoCodes';

@Component({
    components: {
        ModalPromotionCreate,
        BasePromoCode,
    },
    computed: mapGetters({
        pools: 'pools/all',
        promotions: 'promoCodes/all',
    }),
})
export default class PromotionsView extends Vue {
    pools!: IAssetPools;
    promotions!: IPromoCodes;

    get pool() {
        return this.pools[this.$route.params.address];
    }

    get promotionsForPool() {
        return this.promotions[this.$route.params.address];
    }

    async mounted() {
        await this.$store.dispatch('promoCodes/list', { poolAddress: this.pool.address });
    }
}
</script>
