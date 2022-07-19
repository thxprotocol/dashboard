<template>
    <base-modal :loading="loading" title="Import Token Contract" id="modalERC20Import">
        <template #modal-body v-if="!loading">
            <b-form-group label="Select an existing ERC20 contract">
                <BaseDropDownSelectPolygonERC20 :erc20="erc20" @selected="onERC20Selected" />
            </b-form-group>
            <b-form-group label="Contract Address">
                <b-form-input v-model="erc20Address" />
            </b-form-group>
        </template>
        <template #btn-primary>
            <b-button
                :disabled="loading || erc20Address == ''"
                class="rounded-pill"
                @click="submit()"
                variant="primary"
                block
            >
                Import ERC20 Token
            </b-button>
        </template>
    </base-modal>
</template>

<script lang="ts">
import { ChainId } from '@/types/enums/ChainId';
import { TERC20 } from '@/types/erc20';
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import BaseDropDownSelectPolygonERC20 from '../dropdowns/BaseDropDownSelectPolygonERC20.vue';
import BaseModal from './BaseModal.vue';

@Component({
    components: {
        BaseModal,
        BaseDropDownSelectPolygonERC20,
    },
    computed: mapGetters({}),
})
export default class ModalERC20Import extends Vue {
    loading = false;
    chainId: ChainId = ChainId.Polygon;
    erc20: TERC20 | null = null;
    erc20Address = '';

    async submit() {
        this.loading = true;

        const data = {
            chainId: this.chainId,
            address: this.erc20Address,
        };

        await this.$store.dispatch('erc20/import', data);

        this.$bvModal.hide(`modalERC20Import`);
        this.loading = false;
        this.erc20 = null;
    }

    onERC20Selected(erc20: TERC20) {
        this.erc20 = erc20;
        this.erc20Address = erc20.address;
    }
}
</script>
<style lang="scss"></style>
