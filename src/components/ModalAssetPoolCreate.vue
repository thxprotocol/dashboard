<template>
    <b-modal
        size="lg"
        title="Create Asset Pool"
        id="modalAssetPoolCreate"
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
                <strong>We are deploying your asset pool!</strong><br /><span class="text-muted">
                    Hang tight, this can take about 20 seconds...
                </span>
            </p>
        </div>
        <form v-else v-on:submit.prevent="submit" id="formAssetPoolCreate">
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
            <b-form-group label="Asset Type" v-slot="{ ariaDescribedby }">
                <b-form-radio
                    :disabled="network !== 1"
                    v-model="tokenOption"
                    :aria-describedby="ariaDescribedby"
                    name="tokenOption"
                    :value="0"
                >
                    <strong>
                        Use existing token
                        <a
                            v-b-tooltip
                            title="Tokens that are not on the Quickswap token list can not be swapped easily and will therefor not be supported."
                        >
                            <i class="fas fa-question-circle"></i>
                        </a>
                    </strong>
                    <p>Pick a monetary ERC-20 token from the Quickswap token list.</p>
                </b-form-radio>
                <b-form-radio v-model="tokenOption" :aria-describedby="ariaDescribedby" name="tokenOption" :value="1">
                    <strong>
                        Create new token
                        <a
                            v-b-tooltip
                            title="Let us deploy your own token contract and move the token supply into your pool."
                        >
                            <i class="fas fa-question-circle"></i>
                        </a>
                    </strong>
                    <p>
                        Choose between an
                        <a :href="docsUrl + '/create-pool#12-erc20-unlimitedsupply-token-contract'" target="_blank">
                            unlimited
                        </a>
                        or
                        <a :href="docsUrl + '/create-pool#13-erc20-limitedsupply-token-contract'" target="_blank">
                            limited
                        </a>
                        supply.
                    </p>
                </b-form-radio>
            </b-form-group>
            <template v-if="tokenOption === 0 && erc20Token">
                <b-form-group>
                    <label>
                        Token Contract
                        <a
                            v-b-tooltip
                            title="Only quickswap.exchange listed tokens can be used in the THX protocol."
                            target="_blank"
                        >
                            <i class="fas fa-question-circle"></i>
                        </a>
                    </label>
                    <b-dropdown variant="link" class="dropdown-select">
                        <template #button-content>
                            <div>
                                <img :src="erc20Token.logoURI" width="20" class="mr-2" :alt="erc20Token.name" />
                                <strong>{{ erc20Token.symbol }}</strong> {{ erc20Token.name }}
                            </div>
                        </template>
                        <b-dropdown-item-button
                            :key="token.address"
                            v-for="token of tokenList"
                            @click="erc20Token = token"
                        >
                            <img :src="token.logoURI" width="20" class="mr-3" :alt="token.name" />
                            <strong>{{ token.symbol }}</strong> {{ token.name }}
                        </b-dropdown-item-button>
                    </b-dropdown>
                    <small class="text-muted"> </small>
                </b-form-group>
                <b-form-group>
                    <label for="erc20Address">Token Contract Address</label>
                    <div class="input-group mb-3">
                        <input
                            id="erc20Address"
                            readonly
                            type="text"
                            class="form-control"
                            aria-describedby="erc20Address"
                            :value="erc20Token.address"
                        />
                        <div class="input-group-append">
                            <button class="btn btn-primary" type="button" v-clipboard:copy="erc20Token.address">
                                <i class="far fa-copy m-0" style="font-size: 1.2rem"></i>
                            </button>
                        </div>
                    </div>
                </b-form-group>
            </template>
            <template v-if="tokenOption === 1">
                <b-form-group>
                    <label for="erc20Address">Name</label>
                    <b-form-input id="erc20Name" v-model="erc20Name" placeholder="ABC Network Token" />
                </b-form-group>
                <div class="row">
                    <b-form-group class="col-md-6">
                        <label for="erc20Address">Symbol</label>
                        <b-form-input id="erc20Symbol" v-model="erc20Symbol" placeholder="ABC" />
                    </b-form-group>
                    <b-form-group class="col-md-6">
                        <label for="erc20Address">
                            Total Supply
                            <a v-b-tooltip title="Configure a total supply of 0 for an unlimited supply.">
                                <i class="fas fa-question-circle"></i>
                            </a>
                        </label>
                        <b-form-input id="erc20totalSupply" min="0" type="number" v-model="erc20TotalSupply" />
                    </b-form-group>
                </div>
                <b-alert variant="info" show v-if="erc20TotalSupply == 0" class="m-0">
                    Tokens are minted whenever required in an asset pool transaction.
                </b-alert>
            </template>
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
import { Client, IClients } from '@/store/modules/clients';
import { NetworkProvider, PoolToken, PoolTokenType } from '@/store/modules/assetPools';
import axios from 'axios';
import {
    BAlert,
    BButton,
    BCard,
    BCollapse,
    BDropdown,
    BDropdownItemButton,
    BFormGroup,
    BFormInput,
    BFormRadio,
    BFormSelect,
    BFormSelectOption,
    BLink,
    BModal,
    BSpinner,
} from 'bootstrap-vue';
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';

@Component({
    components: {
        'b-modal': BModal,
        'b-alert': BAlert,
        'b-link': BLink,
        'b-card': BCard,
        'b-dropdown': BDropdown,
        'b-dropdown-item-button': BDropdownItemButton,
        'b-form-radio': BFormRadio,
        'b-form-group': BFormGroup,
        'b-form-input': BFormInput,
        'b-button': BButton,
        'b-collapse': BCollapse,
        'b-form-select': BFormSelect,
        'b-form-select-option': BFormSelectOption,
        'b-spinner': BSpinner,
    },
    computed: mapGetters({
        clients: 'clients/all',
    }),
})
export default class ModalAssetPoolCreate extends Vue {
    docsUrl = process.env.VUE_APP_DOCS_URL;
    loading = false;
    error = '';

    tokenOption = 1;
    tokenList: PoolToken[] = [];
    network: NetworkProvider = NetworkProvider.Test;

    erc20Token: PoolToken | null = null;

    erc20Name = '';
    erc20Symbol = '';
    erc20TotalSupply = 0;

    client: Client | null = null;
    clients!: IClients;

    version = 79;

    async mounted() {
        try {
            const list = await this.getLatestTokenList();

            this.tokenList = list.tokens;
            this.erc20Token = this.tokenList[0];
        } catch (e) {
            console.error(e);
            this.error = 'Could not fetch the token list.';
        }
    }

    async getLatestTokenList() {
        const r = await axios({
            method: 'GET',
            url: `https://unpkg.com/quickswap-default-token-list@1.0.85/build/quickswap-default.tokenlist.json`,
            withCredentials: false,
        });

        return r.data;
    }
    async submit() {
        this.loading = true;

        try {
            const data = {
                network: this.network,
                token:
                    this.tokenOption === PoolTokenType.New
                        ? {
                              name: this.erc20Name,
                              symbol: this.erc20Symbol,
                              totalSupply: this.erc20TotalSupply,
                          }
                        : this.tokenOption === PoolTokenType.Existing
                        ? {
                              address: this.erc20Token?.address,
                          }
                        : undefined,
            };
            const rat = await this.$store.dispatch('assetPools/create', data);

            await this.$store.dispatch('clients/read', rat);

            this.$bvModal.hide(`modalAssetPoolCreate`);
        } catch (e) {
            console.error(e);
            this.error = 'Could not deploy your asset pool.';
        } finally {
            this.loading = false;
        }
    }
}
</script>
<style lang="scss"></style>
