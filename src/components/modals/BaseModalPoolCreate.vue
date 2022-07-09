<template>
    <base-modal :loading="loading" :error="error" title="Create Token Pool" id="modalAssetPoolCreate">
        <template #modal-body v-if="profile && !loading">
            <base-form-select-network @selected="onSelectChain" />
            <label>Variant</label>
            <b-form-group>
                <b-form-radio
                    @change="onSelectPoolVariant"
                    v-model="poolVariant"
                    name="poolVariant"
                    value="defaultPool"
                >
                    <strong> Token Pool</strong>
                    <p>Reward your users with ERC-20 tokens via claim URLS, QR codes, widgets and more.</p>
                    <small class="text-muted">2.5% protocol fee on pool deposits and withdrawals</small>
                </b-form-radio>
                <b-form-radio @change="onSelectPoolVariant" v-model="poolVariant" name="poolVariant" value="nftPool">
                    <strong> NFT Pool <b-badge variant="primary">Beta</b-badge> </strong>
                    <p>Mint NFT's from your collection for your users.</p>
                </b-form-radio>
                <b-form-radio :disabled="true" v-model="poolVariant" name="poolVariant" value="paymentPool">
                    <strong> Payment Pool <b-badge variant="primary">New</b-badge> </strong>
                    <p>
                        Integrate our payment gateway or send payment URL's to ask your customers for a crypto payment
                        in any token.
                    </p>
                    <small class="text-muted">2.5% protocol fee on pool withdrawals</small>
                </b-form-radio>
            </b-form-group>
            <b-form-group>
                <label> Token Contract </label>
                <base-dropdown-select-erc20
                    :chainId="chainId"
                    @selected="onSelectToken"
                    v-if="poolVariant === 'defaultPool'"
                />
                <base-dropdown-select-erc-721
                    :chainId="chainId"
                    @selected="onSelectToken"
                    v-if="poolVariant === 'nftPool'"
                />
                <base-dropdown-select-multiple-erc20
                    v-if="poolVariant === 'paymentPool'"
                    :chainId="chainId"
                    @selected="onSelectTokens"
                />
            </b-form-group>
        </template>
        <template #btn-primary>
            <b-button :disabled="disabled" class="rounded-pill" @click="submit()" variant="primary" block>
                Create Token Pool
            </b-button>
        </template>
    </base-modal>
</template>

<script lang="ts">
import { ChainId } from '@/types/enums/ChainId';
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import BaseFormSelectNetwork from '@/components/form-select/BaseFormSelectNetwork.vue';
import BaseDropdownSelectErc20 from '@/components/dropdowns/BaseDropdownSelectERC20.vue';
import BaseDropdownSelectMultipleErc20 from '@/components/dropdowns/BaseDropdownSelectMultipleERC20.vue';
import BaseDropdownSelectErc721 from '@/components/dropdowns/BaseDropdownSelectERC721.vue';
import BaseModal from './BaseModal.vue';
import { AxiosError } from 'axios';
import { IAccount } from '@/types/account';
import { TERC20 } from '@/types/erc20';

@Component({
    components: {
        BaseModal,
        BaseFormSelectNetwork,
        BaseDropdownSelectErc20,
        BaseDropdownSelectMultipleErc20,
        BaseDropdownSelectErc721,
    },
    computed: mapGetters({
        profile: 'account/profile',
        erc20s: 'erc20/all',
    }),
})
export default class ModalAssetPoolCreate extends Vue {
    loading = false;
    error = '';
    chainId: ChainId = ChainId.PolygonMumbai;
    poolVariant = 'defaultPool';
    tokens: TERC20[] = [];
    profile!: IAccount;

    get disabled() {
        return this.loading || !this.tokens.length;
    }

    onSelectChain(chainId: ChainId) {
        this.chainId = chainId;
        this.tokens = [];
    }

    onSelectPoolVariant(variant: string) {
        this.poolVariant = variant;
        this.tokens = [];
    }

    onSelectToken(token: TERC20) {
        this.tokens = [token];
    }

    onSelectTokens(tokens: TERC20[]) {
        this.tokens = tokens;
    }

    async submit() {
        this.loading = true;
        try {
            await this.$store.dispatch('pools/create', {
                chainId: this.chainId,
                tokens: this.tokens.map((erc20) => erc20.address),
                variant: this.poolVariant,
            });
            this.$bvModal.hide(`modalAssetPoolCreate`);
        } catch (error) {
            this.error = (error as AxiosError).response?.data.error.message || 'Could not deploy your token pool.';
        } finally {
            this.loading = false;
        }
    }
}
</script>
