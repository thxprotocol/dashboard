<template>
    <b-modal size="lg" title="Create Asset Pool" id="modalAssetPoolCreate">
        <form v-on:submit.prevent="submit" id="formAssetPoolCreate">
            <b-form-group>
                <label for="poolTitle">Title:</label>
                <b-form-input id="poolTitle" v-model="title" />
            </b-form-group>
            <b-form-group label="Token (ERC20)" v-slot="{ ariaDescribedby }">
                <b-form-radio v-model="tokenOption" :aria-describedby="ariaDescribedby" name="tokenOption" :value="0">
                    Create new token
                </b-form-radio>
                <b-form-radio v-model="tokenOption" :aria-describedby="ariaDescribedby" name="tokenOption" :value="1">
                    Use existing token
                </b-form-radio>
            </b-form-group>

            <b-card v-if="tokenOption === 0">
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
                    <b-form-input id="erc20totalSupply" type="number" v-model="erc20TotalSupply" />
                    <small class="text-muted">
                        A total supply of 0 will enable the asset pool to create tokens out of thin air when needed. All
                        other values will be transfered to the given address.
                    </small>
                </b-form-group>
            </b-card>

            <b-card v-if="tokenOption === 1">
                <b-form-group>
                    <label for="erc20Address">ERC20 Address:</label>
                    <b-form-input id="erc20Address" v-model="erc20Address" />
                </b-form-group>
            </b-card>
        </form>
        <template v-slot:modal-footer="{ cancel }">
            <b-link class="mr-3" variant="dark" @click="cancel()"> Cancel </b-link>
            <b-button class="btn-rounded" type="submit" variant="primary" form="formAssetPoolCreate">
                Create Asset Pool
            </b-button>
        </template>
    </b-modal>
</template>

<script lang="ts">
import { BButton, BCard, BCollapse, BFormGroup, BFormInput, BFormRadio, BLink, BModal } from 'bootstrap-vue';
import { Component, Vue } from 'vue-property-decorator';

enum PoolTokenType {
    New = 0,
    Existing = 1,
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
    },
})
export default class ModalAssetPoolCreate extends Vue {
    title = '';
    tokenOption = 0;
    erc20Address = '';
    erc20Name = '';
    erc20Symbol = '';
    erc20TotalSupply = 0;

    async submit() {
        try {
            debugger;
            const data = {
                title: this.title,
                token:
                    this.tokenOption === PoolTokenType.New
                        ? {
                              name: this.erc20Name,
                              symbol: this.erc20Symbol,
                              totalSupply: this.erc20TotalSupply,
                          }
                        : this.tokenOption === PoolTokenType.Existing
                        ? {
                              address: this.erc20Address,
                          }
                        : undefined,
            };

            await this.$store.dispatch('assetPools/create', data);
            debugger;
        } catch (e) {
            console.error(e);
        }
    }
}
</script>
