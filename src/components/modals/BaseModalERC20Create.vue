<template>
    <base-modal :loading="loading" :error="error" title="Create Token" id="modalERC20Create">
        <template #modal-body v-if="!loading">
            <base-form-select-network @selected="onSelectNetwork" />
            <b-form-group>
                <b-form-radio v-model="tokenOption" name="tokenOption" :value="0">
                    <strong>
                        ERC-20 Limited
                        <a
                            v-b-tooltip
                            title="Tokens will be minted by the asset pool when an outgoing transfer is required. You don't have to worry about periodic deposits."
                        >
                            <i class="fas fa-question-circle"></i>
                        </a>
                    </strong>
                    <p>
                        Tokens will be minted by the asset pool when an outgoing transfer is required. You don't have to
                        worry about periodic deposits.
                    </p>
                </b-form-radio>
                <b-form-radio v-model="tokenOption" name="tokenOption" :value="1">
                    <strong>
                        ERC-20 Unlimited
                        <a
                            v-b-tooltip
                            title="Tokens with a limited supply are considered scarce assets and have the potential to gain monetary value when publically traded."
                        >
                            <i class="fas fa-question-circle"></i>
                        </a>
                    </strong>
                    <p>
                        Tokens with a limited supply are considered scarce assets and have the potential to gain
                        monetary value when publically traded.
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
            <b-row v-if="tokenOption === 0">
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
    docsUrl = process.env.VUE_APP_DOCS_URL;
    publicUrl = process.env.VUE_APP_PUBLIC_URL;
    loading = false;
    error = '';

    tokenOption = 1;
    tokenList: PoolToken[] = [];
    network: NetworkProvider = NetworkProvider.Test;

    erc20Token: PoolToken | null = null;
    erc20TokenAddress = '';

    erc20Name = '';
    erc20Symbol = '';
    erc20TotalSupply = 0;

    onSelectNetwork(network: NetworkProvider) {
        this.network = network;
    }

    async submit() {
        this.loading = true;

        const data = {
            network: this.network,
            name: this.erc20Name,
            symbol: this.erc20Symbol,
            totalSupply: this.erc20TotalSupply,
        };

        await this.$store.dispatch('erc20/create', data);

        this.$bvModal.hide(`modalERC20Create`);
        this.loading = false;
    }
}
</script>
<style lang="scss"></style>
