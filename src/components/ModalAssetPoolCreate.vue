<template>
    <b-modal size="md" title="Create Asset Pool" id="modalAssetPoolCreate">
        <div class="center-center bg-light m-n3 h-100 flex-column pt-5 pb-5" v-if="loading">
            <b-spinner class="mb-3" variant="primary"></b-spinner>
            <p class="text-muted text-center">Deploying your asset pool. <br />This will take about 20 seconds.</p>
        </div>
        <form v-else v-on:submit.prevent="submit" id="formAssetPoolCreate">
            <b-form-group>
                <label for="networkId">Network:</label>
                <b-form-select v-model="network">
                    <b-form-select-option :value="0">Test Network</b-form-select-option>
                    <b-form-select-option :value="1" disabled>Main Network</b-form-select-option>
                </b-form-select>
                <small class="text-muted">Only Paid plans can access the Polygon Main Network.</small>
            </b-form-group>
            <b-form-group>
                <label for="clientId">Application:</label>
                <b-form-select v-model="application">
                    <b-form-select-option disabled :value="null"> Select access credentials </b-form-select-option>
                    <b-form-select-option
                        :value="application"
                        :key="application.clientId"
                        v-for="application of applications"
                    >
                        {{ application.clientName }}
                    </b-form-select-option>
                </b-form-select>
            </b-form-group>
            <template v-if="application">
                <hr />
                <b-form-group>
                    <label for="poolTitle">Title:</label>
                    <b-form-input id="poolTitle" v-model="title" />
                </b-form-group>
                <b-form-group label="Token (ERC20)" v-slot="{ ariaDescribedby }">
                    <b-form-radio
                        :disabled="network !== 1"
                        v-model="tokenOption"
                        :aria-describedby="ariaDescribedby"
                        name="tokenOption"
                        :value="0"
                    >
                        <strong>Use existing token</strong>
                        <p>Only Paid plans can access existing tokens.</p>
                    </b-form-radio>
                    <b-form-radio
                        v-model="tokenOption"
                        :aria-describedby="ariaDescribedby"
                        name="tokenOption"
                        :value="1"
                    >
                        <strong>Create new token</strong>
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
                        <b-form-input disabled readonly id="erc20Address" v-model="erc20Token.address" />
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
import { Application, IApplications } from '@/store/modules/applications';
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
        applications: 'applications/all',
    }),
})
export default class ModalAssetPoolCreate extends Vue {
    loading = false;
    title = '';
    tokenOption = 1;
    tokenList: PoolToken[] = [];
    network: NetworkProvider = NetworkProvider.Test;

    erc20Token!: PoolToken;

    erc20Name = '';
    erc20Symbol = '';
    erc20TotalSupply = 0;

    application: Application | null = null;
    applications!: IApplications;

    async mounted() {
        try {
            const r = await axios({
                method: 'GET',
                url: 'https://unpkg.com/quickswap-default-token-list@1.0.54/build/quickswap-default.tokenlist.json',
                withCredentials: false,
            });
            this.tokenList = r.data.tokens;
            this.erc20Token = this.tokenList[0];
        } catch (e) {
            console.error(e);
        }
    }

    async submit() {
        if (!this.application) {
            // cast validatione errors
            return;
        }
        this.loading = true;

        try {
            const data = {
                title: this.title,
                aud: this.application.clientId,
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

            await this.$store.dispatch('assetPools/create', data);

            this.$bvModal.hide(`modalAssetPoolCreate`);
        } catch (e) {
            console.error(e);
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
