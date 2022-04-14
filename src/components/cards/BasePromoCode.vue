<template>
    <b-card tag="article" class="mb-2">
        <b-dropdown class="float-right" variant="light">
            <b-dropdown-item v-b-modal="`modalDelete${promoCode.id}`">Remove</b-dropdown-item>
        </b-dropdown>
        <b-card-title>{{ promoCode.title }}</b-card-title>
        <b-card-text>
            {{ promoCode.description }}
        </b-card-text>
        <b-alert show variant="warning">
            <strong>{{ promoCode.value }}</strong>
        </b-alert>
        <hr />
        <b-input-group size="lg" :append="assetPool.token.symbol">
            <b-form-input type="number" :value="promoCode.price" disabled></b-form-input>
        </b-input-group>
        <modal-delete :call="remove" :id="`modalDelete${promoCode.id}`" :subject="promoCode.id" />
    </b-card>
</template>

<script lang="ts">
import { mapGetters } from 'vuex';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { AssetPool, IAssetPools } from '@/store/modules/assetPools';
import ModalDelete from '../modals/BaseModalDelete.vue';
import { TPromoCode } from '@/store/modules/promoCodes';
import { IPromoCodes } from '@/types/IPromoCodes';

@Component({
    components: {
        ModalDelete,
    },
    computed: mapGetters({
        promoCodes: 'promoCodes/all',
    }),
})
export default class PromoCodesView extends Vue {
    assetPools!: IAssetPools;
    promoCodes!: IPromoCodes;

    @Prop() assetPool!: AssetPool;
    @Prop() promoCode!: TPromoCode;

    async remove() {
        await this.$store.dispatch('promoCodes/delete', this.promoCode);
    }
}
</script>
