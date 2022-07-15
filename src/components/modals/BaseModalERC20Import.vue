<template>
    <base-modal :loading="loading" :error="error" title="Import Token Contract" id="modalERC20Import">
        <template #modal-body v-if="!loading">
            <!-- <base-form-select-network @selected="chainId = $event" /> -->
            <b-form-group>
                <base-drop-down-select-quick-swap-toke-list @selected="onSelectToken" />
            </b-form-group>
        </template>
        <template #btn-primary>
            <b-button
                :disabled="loading || erc20TokenAddress == ''"
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
// import BaseFormSelectNetwork from '../form-select/BaseFormSelectNetwork.vue';
import BaseDropDownSelectQuickSwapTokeList from '../dropdowns/BaseDropdownSelectQuickSwapTokeList.vue';
import BaseModal from './BaseModal.vue';

@Component({
    components: {
        BaseModal,
        // BaseFormSelectNetwork,
        BaseDropDownSelectQuickSwapTokeList,
    },
    computed: mapGetters({}),
})
export default class ModalERC20Import extends Vue {
    loading = false;
    error = '';
    chainId: ChainId = ChainId.PolygonMumbai;
    erc20Token: TERC20 | null = null;
    erc20TokenAddress = '';

    onSelectToken(token: TERC20) {
        this.erc20TokenAddress = token.address;
    }

    mounted() {
        console.log('erc20TokenAddress', this.erc20TokenAddress);
    }

    async submit() {
        this.loading = true;

        const data = {
            chainId: this.chainId,
            address: this.erc20TokenAddress,
        };

        await this.$store.dispatch('erc20/import', data);

        this.$bvModal.hide(`modalERC20Import`);
        this.loading = false;
        this.erc20TokenAddress = '';
    }
}
</script>
<style lang="scss"></style>
