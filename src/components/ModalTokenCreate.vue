<template>
    <b-modal
        size="lg"
        title="Create Token"
        id="modalTokenCreate"
        no-close-on-backdrop
        no-close-on-esc
        centered
        :hide-footer="loading"
    >
        <template v-slot:modal-header v-if="loading">
            <div
                class="w-auto center-center bg-secondary mx-n5 mt-n5 pt-5 pb-5 flex-grow-1 flex-column position-relative"
                :style="`
                    border-top-left-radius: 0.5rem;
                    border-top-right-radius: 0.5rem;
                    background-image: url(${require('../assets/thx_modal-header.webp')});
                `"
            >
                <h2 class="d-block">Almost there!</h2>
                <div
                    class="shadow-sm bg-white p-2 rounded-pill d-flex align-items-center justify-content-center"
                    style="position: absolute; bottom: 0; left: 50%; margin-left: -32px; margin-bottom: -32px"
                >
                    <b-spinner size="lg" style="width: 3rem; height: 3rem" variant="primary"></b-spinner>
                </div>
            </div>
        </template>
        <div class="pt-5 pb-3" v-if="loading">
            <p class="text-center">
                <strong>We are deploying your token contract!</strong><br /><span class="text-muted">
                    Hang tight, this can take about 20 seconds...
                </span>
            </p>
        </div>
        <form v-else v-on:submit.prevent="submit" id="formTokenCreate">
            <b-alert variant="danger" show v-if="error">
                {{ error }}
            </b-alert>
            <b-form-group>
                <label for="networkId">Blockchain Network</label>
                <b-form-select v-model="network">
                    <b-form-select-option :value="0">Polygon Test (Mumbai) Network</b-form-select-option>
                    <b-form-select-option :value="1">Polygon Main Network</b-form-select-option>
                </b-form-select>
            </b-form-group>
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

                <b-form-radio v-model="tokenOption" name="tokenOption" :value="2">
                    <strong>
                        ERC-721 (NFT)
                        <a v-b-tooltip title="Unique tokens minted on the go, also known as NFT's.">
                            <i class="fas fa-question-circle"></i>
                        </a>
                    </strong>
                    <p>Unique tokens minted on the go, also known as NFT's.</p>
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
        </form>
        <template v-slot:modal-footer="{}">
            <b-button
                :disabled="loading"
                class="rounded-pill"
                type="submit"
                variant="primary"
                form="formAssetPoolCreate"
                block
            >
                Create Asset Pool
            </b-button>
        </template>
    </b-modal>
</template>

<script lang="ts">
import { NetworkProvider, PoolToken } from '@/store/modules/assetPools';
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';

@Component({
    computed: mapGetters({}),
})
export default class ModalAssetPoolCreate extends Vue {
    docsUrl = process.env.VUE_APP_DOCS_URL;
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

    async submit() {
        this.loading = true;

        const data = {
            network: this.network,
            token: {
                name: this.erc20Name,
                symbol: this.erc20Symbol,
                totalSupply: this.erc20TotalSupply,
            },
        };
        const { error } = await this.$store.dispatch('tokens/create', data);

        if (error) {
            this.error = error;
        }

        this.$bvModal.hide(`modalAssetPoolCreate`);
        this.loading = false;
    }
}
</script>
<style lang="scss"></style>
