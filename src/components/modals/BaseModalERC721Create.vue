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
                            <b-form-textarea
                                v-else
                                placeholder="Primary color of the planet"
                                :state="getPropValidation(prop.propType, prop.description)"
                                :value="prop.description"
                                @input="schema[key]['description'] = $event"
                            />

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
            <b-button
                :disabled="loading || schemaHaveErrors"
                class="rounded-pill"
                @click="submit()"
                variant="primary"
                block
            >
                Create ERC721 Token
            </b-button>
        </template>
    </base-modal>
</template>

<script lang="ts">
import { NetworkProvider } from '@/store/modules/pools';
import { ERC721Type, TERC721 } from '@/types/erc721';
import axios from 'axios';
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import BaseFormSelectNetwork from '../form-select/BaseFormSelectNetwork.vue';
import BaseModal from './BaseModal.vue';

const URL_REGEX = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;

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

    authUrl = process.env.VUE_APP_AUTH_URL;

    erc721Token: TERC721 | null = null;

    propTypes = [
        { label: 'String', value: 'string' },
        { label: 'Link', value: 'link' },
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

    propValidation = {
        link: this.validateLink,
    };

    get schemaHaveErrors() {
        return this.schema.reduce((pre, cur) => {
            if (pre) return pre;
            const currentFieldValid = this.getPropValidation(cur.propType, cur.description);
            if (currentFieldValid === false) return true;
            return false;
        }, false);
    }

    getPropValidation = (name: string, value: string) => {
        switch (name) {
            case 'link':
                return this.validateLink(value);
            default:
                return undefined;
        }
    };

    validateLink(str: string) {
        return URL_REGEX.test(str);
    }

    async upload(file: File) {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await axios({
                url: '/upload',
                method: 'PUT',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                data: formData,
            });

            return response.data.publicUrl;
        } catch {
            /* NO-OP */
        }
    }

    async onDescChange(index: number, data: any) {
        const publicUrl = await this.upload(data.target.files[0]);
        Vue.set(this.schema[index], 'description', publicUrl);
    }

    async submit() {
        if (this.schemaHaveErrors) return;

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
