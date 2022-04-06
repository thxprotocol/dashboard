<template>
    <base-modal :loading="loading" :error="error" title="Create Token" id="modalERC20Create">
        <template #modal-body v-if="!loading">
            <base-form-select-network @selected="network = $event" />
            <b-form-group>
                <b-form-radio v-model="tokenType" name="tokenType" :value="ERC20Type.Unlimited">
                    <strong> ERC-20 Unlimited </strong>
                    <p>
                        Tokens with a limited supply are considered scarce assets and have the potential to gain
                        monetary value when publically traded.
                    </p>
                </b-form-radio>
                <b-form-radio v-model="tokenType" name="tokenType" :value="ERC20Type.Limited">
                    <strong> ERC-20 Limited </strong>
                    <p>
                        Tokens will be minted by the asset pool when an outgoing transfer is required. You don't have to
                        worry about periodic deposits.
                    </p>
                </b-form-radio>
            </b-form-group>
            <b-row>
                <b-col>
                    <b-form-group>
                        <label for="erc20Address">Name</label>
                        <b-form-input id="erc20Name" v-model="erc20Name" placeholder="XYZ Network Token" />
                    </b-form-group>
                </b-col>
                <b-col>
                    <b-form-group>
                        <label for="erc20Address">Symbol</label>
                        <b-form-input id="erc20Symbol" v-model="erc20Symbol" placeholder="XYZ" />
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row v-if="tokenType === ERC20Type.Limited">
                <b-col>
                    <b-form-group>
                        <label for="erc20Address">Total Supply</label>
                        <b-form-input id="erc20totalSupply" min="0" type="number" v-model="erc20TotalSupply" />
                    </b-form-group>
                </b-col>
            </b-row>
        </template>
        <template #btn-primary>
            <b-button :disabled="loading" class="rounded-pill" @click="submit()" variant="primary" block>
                Create Token
            </b-button>
        </template>
    </base-modal>
</template>

<script lang="ts">
import { NetworkProvider, PoolToken } from '@/store/modules/assetPools';
import { ERC20Type } from '@/types/erc20';
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import BaseFormSelectNetwork from '../form-select/BaseFormSelectNetwork.vue';
import BaseModal from './BaseModal.vue';

@Component({
    components: {
        BaseModal,
        BaseFormSelectNetwork,
    },
    computed: mapGetters({}),
})
export default class ModalERC20Create extends Vue {
    ERC20Type = ERC20Type;
    docsUrl = process.env.VUE_APP_DOCS_URL;
    publicUrl = process.env.VUE_APP_PUBLIC_URL;
    loading = false;
    error = '';

    tokenType = ERC20Type.Unlimited;
    tokenList: PoolToken[] = [];
    network: NetworkProvider = NetworkProvider.Test;

    erc20Token: PoolToken | null = null;
    erc20TokenAddress = '';

    erc20Name = '';
    erc20Symbol = '';
    erc20TotalSupply = 0;

    async submit() {
        this.loading = true;

        const data = {
            network: this.network,
            name: this.erc20Name,
            symbol: this.erc20Symbol,
            type: this.tokenType,
            totalSupply: this.tokenType === ERC20Type.Limited ? this.erc20TotalSupply : 0,
        };

        await this.$store.dispatch('erc20/create', data);

        this.$bvModal.hide(`modalERC20Create`);
        this.loading = false;
    }
}
</script>
<style lang="scss"></style>
