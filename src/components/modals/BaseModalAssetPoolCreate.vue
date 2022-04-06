<template>
    <base-modal @show="onShow" :loading="loading" :error="error" title="Create Token Pool" id="modalAssetPoolCreate">
        <template #modal-body v-if="profile && !loading">
            <base-form-select-network :network="network" @selected="onSelectNetwork" />
            <b-form-group>
                <label> Token Contract </label>
                <base-dropdown-select-erc20 :network="network" @selected="onSelectToken" />
                <b-link to="/tokens">Create your own token.</b-link>
            </b-form-group>
            <b-form-group>
                <label>Token Contract Address</label>
                <b-input-group>
                    <b-form-input :disabled="!!erc20Token" v-model="erc20TokenAddress" />
                    <b-input-group-addon append>
                        <b-button variant="primary" v-clipboard:copy="erc20TokenAddress">
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
import { NetworkProvider, PoolToken } from '@/store/modules/assetPools';
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import BaseFormSelectNetwork from '@/components/form-select/BaseFormSelectNetwork.vue';
import BaseDropdownSelectErc20 from '@/components/dropdowns/BaseDropdownSelectERC20.vue';
import BaseModal from './BaseModal.vue';
import { AxiosError } from 'axios';
import { AccountPlanType, IAccount } from '@/types/account';

@Component({
    components: {
        BaseModal,
        BaseFormSelectNetwork,
        BaseDropdownSelectErc20,
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
    erc20TokenAddress = '';
    erc20Token: PoolToken | null = null;

    profile!: IAccount;

    onShow() {
        this.network = this.profile.plan !== AccountPlanType.Free ? NetworkProvider.Main : NetworkProvider.Test;
    }

    onSelectNetwork(network: NetworkProvider) {
        this.network = network;
    }

    onSelectToken(erc20: PoolToken) {
        this.erc20Token = erc20;
        this.erc20TokenAddress = erc20 ? erc20.address : '';
    }

    async submit() {
        this.loading = true;
        try {
            await this.$store.dispatch('assetPools/create', {
                network: this.network,
                token: {
                    address: this.erc20TokenAddress,
                },
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
