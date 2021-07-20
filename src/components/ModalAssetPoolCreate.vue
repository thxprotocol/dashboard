<template>
    <b-modal size="lg" title="Create Asset Pool" id="modalAssetPoolCreate">
        <div class="center-center bg-light m-n3 h-100 flex-column pt-5 pb-5" v-if="loading">
            <b-spinner class="mb-3" variant="primary"></b-spinner>
            <p class="text-muted text-center">Deploying your asset pool. <br />This will take about 20 seconds.</p>
        </div>
        <form v-else v-on:submit.prevent="submit" id="formAssetPoolCreate">
            <b-alert variant="danger" show v-if="error">
                {{ error }}
            </b-alert>
            <b-form-group>
                <label for="networkId">Network:</label>
                <b-form-select v-model="network">
                    <b-form-select-option :value="0">Polygon Test (Mumbai) Network</b-form-select-option>
                    <b-form-select-option :value="1">Polygon Main Network</b-form-select-option>
                </b-form-select>
            </b-form-group>
            <template>
                <hr />
                <b-form-group label="Token (ERC-20)" v-slot="{ ariaDescribedby }">
                    <b-form-radio
                        :disabled="network !== 1"
                        v-model="tokenOption"
                        :aria-describedby="ariaDescribedby"
                        name="tokenOption"
                        :value="0"
                    >
                        <strong>Use existing token</strong>
                        <p>
                            Pick a monetary ERC-20 token from the Quickswap token list.
                            <a :href="docsUrl + '/create-pool#11-erc20-existing-token-contract'" target="_blank">
                                <i class="fas fa-question-circle"></i>
                            </a>
                        </p>
                    </b-form-radio>
                    <b-form-radio
                        v-model="tokenOption"
                        :aria-describedby="ariaDescribedby"
                        name="tokenOption"
                        :value="1"
                    >
                        <strong>Create new token</strong>
                        <p>
                            Choose between an
                            <a :href="docsUrl + '/create-pool#12-erc20-unlimitedsupply-token-contract'" target="_blank">
                                unlimited
                                <i class="fas fa-question-circle"></i>
                            </a>
                            or
                            <a :href="docsUrl + '/create-pool#13-erc20-limitedsupply-token-contract'" target="_blank">
                                limited
                                <i class="fas fa-question-circle"></i>
                            </a>
                            supply.
                        </p>
                    </b-form-radio>
                </b-form-group>
                <b-card v-if="tokenOption === 0">
                    <b-form-group>
                        <b-dropdown variant="light" class="dropdown-select">
                            <template #button-content>
                                <img :src="erc20Token.logoURI" width="20" class="mr-2" :alt="erc20Token.name" />
                                <strong>{{ erc20Token.symbol }}</strong> {{ erc20Token.name }}
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
                        <small class="text-muted">
                            Only
                            <a href="https://quickswap.exchange" target="_blank">quickswap.exchange</a> listed tokens
                            can be used in the THX protocol.
                        </small>
                    </b-form-group>
                    <b-form-group>
                        <label for="erc20Address">ERC20 Address:</label>
                        <div id="erc20Address" class="form-control" readonly>
                            {{ erc20Token.address }}
                        </div>
                    </b-form-group>
                </b-card>
                <b-card v-if="tokenOption === 1">
                    <b-form-group>
                        <label for="erc20Address">Name:</label>
                        <b-form-input id="erc20Name" v-model="erc20Name" placeholder="ABC Network Token" />
                    </b-form-group>
                    <b-form-group>
                        <label for="erc20Address">Symbol:</label>
                        <b-form-input id="erc20Symbol" v-model="erc20Symbol" placeholder="ABC" />
                    </b-form-group>
                    <b-form-group>
                        <label for="erc20Address">Total Supply:</label>
                        <b-form-input id="erc20totalSupply" min="0" type="number" v-model="erc20TotalSupply" />
                        <p class="text-muted small">Configure a total supply of 0 for an unlimited supply.</p>
                        <b-alert variant="info" show v-if="erc20TotalSupply == 0" class="m-0">
                            Tokens are minted whenever required in an asset pool transaction.
                        </b-alert>
                    </b-form-group>
                </b-card>
            </template>
        </form>
        <template v-slot:modal-footer="{ cancel }">
            <b-link class="mr-3" variant="dark" @click="cancel()"> Cancel </b-link>
            <b-button
                :disabled="loading"
                class="btn-rounded"
                type="submit"
                variant="primary"
                form="formAssetPoolCreate"
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

async function getLatestTokenList() {
    let json;
    let i = 75;

    while (i > 0) {
        let r;
        try {
            r = await axios({
                method: 'GET',
                url: `https://unpkg.com/quickswap-default-token-list@1.0.${i++}/build/quickswap-default.tokenlist.json`,
                withCredentials: false,
            });
        } catch (e) {
            break;
        }
        json = r.data;
    }
    return json;
}

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

    erc20Token!: PoolToken;

    erc20Name = '';
    erc20Symbol = '';
    erc20TotalSupply = 0;

    client: Client | null = null;
    clients!: IClients;

    async mounted() {
        try {
            const list = await getLatestTokenList();

            this.tokenList = list.tokens;
            this.erc20Token = this.tokenList[0];
        } catch (e) {
            console.error(e);
            this.error = 'Could not fetch the token list.';
        }
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
                              network: this.network,
                          }
                        : this.tokenOption === PoolTokenType.Existing
                        ? {
                              address: this.erc20Token.address,
                          }
                        : undefined,
            };

            const assetPool = await this.$store.dispatch('assetPools/create', data);

            await this.$store.dispatch('clients/read', assetPool.rat);

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
<style lang="scss">
.dropdown-select .dropdown-menu {
    max-height: 30vh;
    overflow-y: auto;

    button {
        max-width: 300px !important;
    }
}
</style>
