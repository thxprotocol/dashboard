<template>
    <b-modal size="lg" title="Create Asset Pool" id="modalAssetPoolCreate">
        <b-overlay :show="loading" rounded="sm">
            <form v-on:submit.prevent="submit" id="formAssetPoolCreate">
                <b-form-group>
                    <label for="clientId">Connected App:</label>
                    <b-form-select v-model="application">
                        <b-form-select-option
                            :value="application"
                            :key="application.clientId"
                            v-for="application of applications"
                        >
                            {{ application.clientName }}
                            ({{ application.clientId }})
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
                            disabled
                            v-model="tokenOption"
                            :aria-describedby="ariaDescribedby"
                            name="tokenOption"
                            :value="0"
                        >
                            Use existing token
                        </b-form-radio>
                        <b-form-radio
                            v-model="tokenOption"
                            :aria-describedby="ariaDescribedby"
                            name="tokenOption"
                            :value="1"
                        >
                            Create new token
                        </b-form-radio>
                    </b-form-group>
                    <b-card v-if="tokenOption === 0">
                        <b-form-group>
                            <b-form-select v-model="erc20Address">
                                <b-form-select-option
                                    :value="token.address"
                                    :key="token.address"
                                    v-for="token of tokenList"
                                >
                                    {{ token.symbol }} | {{ token.name }}
                                </b-form-select-option>
                            </b-form-select>
                            <small class="text-muted">
                                Only tokens that are available on
                                <a href="https://quickswap.exchange" target="_blank">Quickswap</a> are available for
                                your asset pool.
                            </small>
                        </b-form-group>
                        <b-form-group>
                            <label for="erc20Address">ERC20 Address:</label>
                            <b-form-input disabled readonly id="erc20Address" v-model="erc20Address" />
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
                            <small class="text-muted">
                                A total supply of 0 will enable the asset pool to create tokens out of thin air when
                                needed. All other values will be transfered to the given address.
                            </small>
                        </b-form-group>
                    </b-card>
                </template>
            </form>
        </b-overlay>
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
import { RPC } from '@/store/modules/assetPools';
import {
    BButton,
    BCard,
    BCollapse,
    BFormGroup,
    BFormInput,
    BFormRadio,
    BFormSelect,
    BFormSelectOption,
    BLink,
    BModal,
    BOverlay,
} from 'bootstrap-vue';
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const tokenList = require('quickswap-default-token-list').tokens;

enum PoolTokenType {
    Existing = 0,
    New = 1,
}

@Component({
    components: {
        'b-modal': BModal,
        'b-link': BLink,
        'b-card': BCard,
        'b-form-radio': BFormRadio,
        'b-form-group': BFormGroup,
        'b-form-input': BFormInput,
        'b-button': BButton,
        'b-collapse': BCollapse,
        'b-form-select': BFormSelect,
        'b-form-select-option': BFormSelectOption,
        'b-overlay': BOverlay,
    },
    computed: mapGetters({
        applications: 'applications/all',
    }),
})
export default class ModalAssetPoolCreate extends Vue {
    loading = false;
    title = '';
    tokenOption = 1;
    tokenList = tokenList;
    network: RPC = 0;

    erc20Address = tokenList[0].address;
    erc20Name = '';
    erc20Symbol = '';
    erc20TotalSupply = 0;

    application: Application | null = null;
    applications!: IApplications;

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
                              address: this.erc20Address,
                          }
                        : undefined,
            };

            await this.$store.dispatch('assetPools/create', data);
            await this.$store.dispatch('account/getProfile');
            this.$bvModal.hide(`modalAssetPoolCreate`);
        } catch (e) {
            console.error(e);
        } finally {
            this.loading = false;
        }
    }
}
</script>
