<template>
    <base-modal :loading="loading" :error="error" title="Create ERC721 contract" id="modalERC721Create">
        <template #modal-body v-if="!loading">
            <base-form-select-network @selected="network = $event" />
            <label>Variant</label>
            <b-form-group>
                <b-form-radio v-model="tokenType" name="tokenType" :value="ERC721Type.Default">
                    <strong> ERC-721 NFT </strong>
                    <p>Unique tokens minted on the go, also known as NFT's.</p>
                </b-form-radio>
            </b-form-group>
            <b-row>
                <b-col>
                    <b-form-group>
                        <label>Name</label>
                        <b-form-input v-model="name" placeholder="XYZ Collection" />
                    </b-form-group>
                </b-col>
                <b-col>
                    <b-form-group>
                        <label>Symbol</label>
                        <b-form-input v-model="symbol" placeholder="XYZ" />
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <b-form-group>
                        <label>Metadata Schema</label>
                        <b-form-input
                            :value="prop"
                            @input="schema[key] = $event"
                            :key="key"
                            v-for="(prop, key) of schema"
                            class="mt-2"
                        />
                        <div class="text-center mt-2">
                            <b-button block @click="schema.push('')" variant="light" class="rounded-pill">
                                <i class="fas fa-plus"></i> Add property
                            </b-button>
                        </div>
                    </b-form-group>
                </b-col>
            </b-row>
        </template>
        <template #btn-primary>
            <b-button :disabled="loading" class="rounded-pill" @click="submit()" variant="primary" block>
                Create ERC721 Token
            </b-button>
        </template>
    </base-modal>
</template>

<script lang="ts">
import { NetworkProvider, PoolToken } from '@/store/modules/assetPools';
import { ERC721Type } from '@/types/erc721';
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
    ERC721Type = ERC721Type;
    loading = false;
    error = '';

    tokenType = ERC721Type.Default;
    tokenList: PoolToken[] = [];
    network: NetworkProvider = NetworkProvider.Test;

    erc721Token: PoolToken | null = null;

    name = '';
    symbol = '';
    schema = [''];

    async submit() {
        this.loading = true;

        const data = {
            network: this.network,
            name: this.name,
            symbol: this.symbol,
            schema: this.schema,
        };

        await this.$store.dispatch('erc721/create', data);

        this.$bvModal.hide(`modalERC20Create`);
        this.loading = false;
    }
}
</script>
<style lang="scss"></style>
