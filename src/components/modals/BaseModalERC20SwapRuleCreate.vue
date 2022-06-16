<template>
    <base-modal :loading="loading" :error="error" title="Create Swap Rule" id="modalERC20SwapRuleCreate">
        <template #modal-body v-if="profile && !loading">
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
            <b-form-group>
                <label>Token Ratio</label>
                <b-form-input type="number" v-model="tokenMultiplier" />
            </b-form-group>
        </template>
        <template #btn-primary>
            <b-button :disabled="loading" class="rounded-pill" @click="submit()" variant="primary" block>
                Create Swap Role
            </b-button>
        </template>
    </base-modal>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import BaseDropdownSelectErc20 from '@/components/dropdowns/BaseDropdownSelectERC20.vue';
import BaseModal from './BaseModal.vue';
import { AxiosError } from 'axios';
import { IAccount } from '@/types/account';
import { TERC20 } from '@/types/erc20';

@Component({
    components: {
        BaseModal,
        BaseDropdownSelectErc20,
    },
    computed: mapGetters({
        profile: 'account/profile',
        erc20s: 'erc20/all',
    }),
})
export default class ModalERC20SwapRuleCreate extends Vue {
    loading = false;
    error = '';
    tokenMultiplier = null;
    token: TERC20 | null = null;
    tokenAddress = '';
    profile!: IAccount;

    onSelectToken(token: TERC20) {
        this.token = token;
        this.tokenAddress = token ? token.address : '';
    }

    async submit() {
        this.loading = true;
        try {
            await this.$store.dispatch('erc20Swaps/create', {
                tokenInAddress: this.tokenAddress,
                toknMultiplier: this.tokenMultiplier,
            });
            this.$bvModal.hide(`modalSwapRuleCreate`);
        } catch (error) {
            this.error = (error as AxiosError).response?.data.error.message || 'Could not create the Swap Rule';
        } finally {
            this.loading = false;
        }
    }
}
</script>
