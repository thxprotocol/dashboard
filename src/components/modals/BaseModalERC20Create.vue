<template>
    <base-modal :loading="loading" :error="error" title="Create Token Contract" id="modalERC20Create">
        <template #modal-body v-if="!loading">
            <base-form-select-network @selected="chainId = $event" :chainId="chainId" />
            <label>Variant</label>
            <b-form-group>
                <b-form-radio v-model="tokenType" name="tokenType" :value="ERC20Type.Unlimited">
                    <strong>Unlimited Supply Token (ERC-20) </strong>
                    <p>
                        Tokens will be minted by the asset pool when an outgoing transfer is required. You don't have to
                        worry about periodic deposits.
                    </p>
                </b-form-radio>
                <b-form-radio v-model="tokenType" name="tokenType" :value="ERC20Type.Limited">
                    <strong> Limited Supply Token (ERC-20) </strong>
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
                        <b-form-input id="erc20Name" v-model="name" placeholder="XYZ Network Token" />
                    </b-form-group>
                </b-col>
                <b-col>
                    <b-form-group>
                        <label for="erc20Address">Symbol</label>
                        <b-form-input id="erc20Symbol" v-model="symbol" placeholder="XYZ" />
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row v-if="tokenType === ERC20Type.Limited">
                <b-col>
                    <b-form-group>
                        <label for="erc20Address">Total Supply</label>
                        <b-form-input id="erc20totalSupply" min="0" type="number" v-model="totalSupply" />
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <label>Token Icon</label>
                    <b-form-group>
                        <b-form-file v-model="logoImg" accept="image/*" />
                    </b-form-group>
                </b-col>
            </b-row>
        </template>
        <template #btn-primary>
            <b-button :disabled="loading" class="rounded-pill" @click="submit()" variant="primary" block>
                Create ERC20 Token
            </b-button>
        </template>
    </base-modal>
</template>

<script lang="ts">
import { ChainId } from '@/types/enums/ChainId';
import { ERC20Type, TERC20 } from '@/types/erc20';
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
    tokenList: TERC20[] = [];
    chainId: ChainId = ChainId.PolygonMumbai;

    erc20Token: TERC20 | null = null;
    erc20TokenAddress = '';

    name = '';
    symbol = '';
    totalSupply = 0;
    logoImg: File | null = null;

    async submit() {
        this.loading = true;

        const data = {
            chainId: this.chainId,
            name: this.name,
            symbol: this.symbol,
            type: this.tokenType,
            totalSupply: this.tokenType === ERC20Type.Limited ? this.totalSupply : 0,
            file: this.logoImg,
        };

        await this.$store.dispatch('erc20/create', data);

        this.$bvModal.hide(`modalERC20Create`);
        this.loading = false;
    }
}
</script>
<style lang="scss"></style>
