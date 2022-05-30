<template>
    <base-modal :loading="loading" :error="error" title="Create NFT contract" id="modalERC721Create">
        <template #modal-body v-if="!loading">
            <base-form-select-network @selected="network = $event" />
            <label>Variant</label>
            <b-form-group>
                <b-form-radio v-model="tokenType" name="tokenType" :value="ERC721Type.Default">
                    <strong> NFT (ERC-721) </strong>
                    <p>Non Fungible Tokens contract where unique tokens are minted on the go, widely known as NFT's.</p>
                </b-form-radio>
            </b-form-group>
            <b-row>
                <b-col>
                    <b-form-group>
                        <label>Name</label>
                        <b-form-input v-model="name" placeholder="Planets of the Galaxy" />
                    </b-form-group>
                </b-col>
                <b-col>
                    <b-form-group>
                        <label>Symbol</label>
                        <b-form-input v-model="symbol" placeholder="GLXY" />
                    </b-form-group>
                </b-col>
            </b-row>
            <b-form-group>
                <label>Description</label>
                <b-form-textarea v-model="description" placeholder="To infinity and beyond!" />
            </b-form-group>
            <b-form-group>
                <label>Properties</label>
                <b-card bg-variant="light" :key="key" v-for="(prop, key) of schema" class="mb-2">
                    <b-row>
                        <b-col md="6" class="mb-2">
                            <b-form-input
                                placeholder="Color"
                                :value="prop.name"
                                @input="schema[key]['name'] = $event"
                            />
                        </b-col>
                        <b-col md="6" class="mb-2">
                            <b-select v-model="prop.propType" @change="schema[key]['propType'] = $event">
                                <b-select-option :value="type.value" :key="key" v-for="(type, key) of propTypes">
                                    {{ type.label }}
                                </b-select-option>
                            </b-select>
                        </b-col>
                        <b-col md="12">
                            <b-form-file @change="(data) => onDescChange(key, data)" v-if="prop.propType === 'image'" />
                            <b-form-textarea                                 accept="image/*"
 :value="prop.description" />
                            <component
                                :value="prop.description"
                                placeholder="Primary color of the planet"
                            ></component>

                            <div class="text-right pt-2">
                                <b-link class="text-danger" @click="$delete(schema, key)" size="sm"> Remove </b-link>
                            </div>
                        </b-col>
                    </b-row>
                </b-card>
                <div class="text-center mt-2">
                    <b-button
                        block
                        @click="
                            schema.push({
                                name: '',
                                propType: 'string',
                                description: '',
                            })
                        "
                        variant="light"
                        class="rounded-pill"
                    >
                        <i class="fas fa-plus"></i> Add property
                    </b-button>
                </div>
            </b-form-group>
        </template>
        <template #btn-primary>
            <b-button :disabled="loading" class="rounded-pill" @click="submit()" variant="primary" block>
                Create ERC721 Token
            </b-button>
        </template>
    </base-modal>
</template>

<script lang="ts">
import { NetworkProvider } from '@/store/modules/pools';
import { ERC721Type, TERC721 } from '@/types/erc721';
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
export default class ModalERC721Create extends Vue {
    ERC721Type = ERC721Type;
    loading = false;
    error = '';

    tokenType = ERC721Type.Default;
    tokenList: TERC721[] = [];
    network: NetworkProvider = NetworkProvider.Test;

    erc721Token: TERC721 | null = null;

    propTypes = [
        { label: 'String', value: 'string' },
        { label: 'Number', value: 'number' },
        { label: 'Image', value: 'image' },
    ];

    name = '';
    symbol = '';
    schema = [
        {
            name: '',
            propType: 'string',
            description: '',
        },
    ];
    description = '';

    getInputComponent(name: string) {
        switch (name) {
            case 'image':
                return 'b-form-file';
            default: {
                return 'b-form-textarea';
            }
        }
    }

    onDescChange(index: number, data: any) {
        // console.log(index, data.target.files[0]);
        Vue.set(this.schema[index], 'description', data.target.files[0]);
    }

    async submit() {
        this.loading = true;

        const data = {
            network: this.network,
            name: this.name,
            symbol: this.symbol,
            description: this.description,
            schema: this.schema,
        };

        await this.$store.dispatch('erc721/create', data);

        this.$bvModal.hide(`modalERC721Create`);
        this.loading = false;
    }
}
</script>
<style lang="scss"></style>
