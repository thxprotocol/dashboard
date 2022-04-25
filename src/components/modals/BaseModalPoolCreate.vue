<template>
    <base-modal :loading="loading" :error="error" title="Create Token Pool" id="modalAssetPoolCreate">
        <template #modal-body v-if="profile && !loading">
            <base-form-select-network @selected="network = $event" />
            <label>Variant</label>
            <b-form-group>
                <b-form-radio v-model="poolVariant" name="poolVariant" value="defaultPool">
                    <strong> Token Pool</strong>
                    <p>Reward members of this pool with ERC-20 tokens with claim URLS, QR codes widgets and more.</p>
                </b-form-radio>
                <b-form-radio v-model="poolVariant" name="poolVariant" value="nftPool">
                    <strong> NFT Pool <b-badge variant="primary">Beta</b-badge> </strong>
                    <p>Mint NFT's from your collection to members of your pool.</p>
                </b-form-radio>
            </b-form-group>
            <b-form-group>
                <label> Token Contract </label>
                <base-dropdown-select-erc20
                    :network="network"
                    @selected="onSelectToken"
                    v-if="poolVariant === 'defaultPool'"
                />
                <base-dropdown-select-erc-721
                    :network="network"
                    @selected="onSelectToken"
                    v-if="poolVariant === 'nftPool'"
                />
                <b-link to="/tokens">Create a new token</b-link>
            </b-form-group>
            <b-form-group>
                <label>Token Contract Address</label>
                <b-input-group>
                    <b-form-input :disabled="!!token" v-model="tokenAddress" />
                    <b-input-group-addon append>
                        <b-button variant="primary" v-clipboard:copy="tokenAddress">
                            <i class="far fa-copy m-0" style="font-size: 1.2rem"></i>
                        </b-button>
                    </b-input-group-addon>
                </b-input-group>
            </b-form-group>
        </template>
        <template #btn-primary>
            <b-button :disabled="loading" class="rounded-pill" @click="submit()" variant="primary" block>
                Create Token Pool
            </b-button>
        </template>
    </base-modal>
</template>

<script lang="ts">
import { NetworkProvider, PoolToken } from '@/store/modules/pools';
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import BaseFormSelectNetwork from '@/components/form-select/BaseFormSelectNetwork.vue';
import BaseDropdownSelectErc20 from '@/components/dropdowns/BaseDropdownSelectERC20.vue';
import BaseDropdownSelectErc721 from '@/components/dropdowns/BaseDropdownSelectERC721.vue';
import BaseModal from './BaseModal.vue';
import { AxiosError } from 'axios';
import { IAccount } from '@/types/account';

@Component({
    components: {
        BaseModal,
        BaseFormSelectNetwork,
        BaseDropdownSelectErc20,
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
    network: NetworkProvider = NetworkProvider.Test;
    poolVariant = 'defaultPool';
    token: PoolToken | null = null;
    tokenAddress = '';
    profile!: IAccount;

    onSelectToken(token: PoolToken) {
        this.token = token;
        this.tokenAddress = token ? token.address : '';
    }

    async submit() {
        this.loading = true;
        try {
            await this.$store.dispatch('pools/create', {
                network: this.network,
                token: this.tokenAddress,
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
