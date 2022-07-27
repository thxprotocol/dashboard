<template>
    <base-modal :error="error" title="Create NFT" id="modalNFTCreate">
        <template #modal-body>
            <b-form-group label="Title">
                <b-form-input v-model="title" />
            </b-form-group>
            <b-form-group label="Description">
                <b-form-input v-model="description" />
            </b-form-group>
            <!-- <b-form-group>
                <template #label>
                    Recipient
                    <a
                        href="#"
                        v-b-tooltip
                        title="Fill in the address of the recipient of your NFT. You can also do this after creating the metadata."
                    >
                        <i class="fas fa-question-circle"></i>
                    </a>
                </template>
                <b-form-input v-model="recipient" />
                <small class="text-muted"> Leave this field blank if you do not want to mint the NFT now. </small>
            </b-form-group> -->
            <label>Properties</label>
            <b-card bg-variant="light">
                <b-form-group :key="key" v-for="(prop, key) of erc721.properties">
                    <template #label>
                        {{ prop.name }}
                        <a href="#" v-b-tooltip :title="prop.description">
                            <i class="fas fa-question-circle"></i>
                        </a>
                    </template>
                    <b-form-file
                        @change="onDescChange"
                        :data-key="key"
                        v-if="parsePropType(prop.propType) === 'image'"
                        accept="image/*"
                    />

                    <b-form-input
                        v-else
                        :type="parsePropType(prop.propType)"
                        :state="getPropValidation(prop.propType, prop.value || '')"
                        v-model="prop.value"
                        required
                        :placeholder="`Provide a ${prop.propType} value in this field.`"
                    />
                </b-form-group>
            </b-card>
        </template>
        <template #btn-primary>
            <b-button :disabled="loading" class="rounded-pill" @click="submit()" variant="primary" block>
                Create NFT
            </b-button>
        </template>
    </base-modal>
</template>

<script lang="ts">
import axios from 'axios';
import { IPool } from '@/store/modules/pools';
import { TERC721, TERC721DefaultProp } from '@/types/erc721';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import BaseModal from './BaseModal.vue';
import { isValidUrl } from '@/utils/url';

const PROPTYPE_MAP: { [key: string]: string } = {
    string: 'text',
    number: 'number',
    image: 'image',
    link: 'link',
};

@Component({
    components: {
        BaseModal,
    },
    computed: mapGetters({}),
})
export default class ModalRewardCreate extends Vue {
    authUrl = process.env['VUE_APP_AUTH_URL'];
    docsUrl = process.env['VUE_APP_DOCS_URL'];
    loading = false;
    error = '';

    recipient = '';
    title = '';
    description = '';

    @Prop() pool!: IPool;
    @Prop() erc721!: TERC721;

    get isSubmitDisabled() {
        return this.loading;
    }

    get schemaHaveErrors() {
        return this.erc721.properties.reduce((pre: any, cur: any) => {
            if (pre) return pre;
            return this.getPropValidation(cur.propType, cur.value || '');
        }, false);
    }
    getPropValidation = (name: string, value: string) => {
        switch (name) {
            case 'link':
                return isValidUrl(value);
            default:
                return undefined;
        }
    };

    parsePropType(propType: string) {
        return PROPTYPE_MAP[propType];
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
    async onDescChange(event: any) {
        const publicUrl = await this.upload(event.target.files[0]);
        Vue.set(this.erc721.properties[event.target.dataset['key']], 'value', publicUrl);
    }

    submit() {
        if (this.schemaHaveErrors) return;

        const attributes: { key: string; value: string | number | undefined }[] = [];

        this.erc721.properties.forEach((prop: TERC721DefaultProp) => {
            attributes.push({
                key: prop.name,
                value: prop.value,
            });
        });

        this.$store.dispatch('erc721/createMetadata', {
            pool: this.pool,
            erc721: this.erc721,
            attributes,
            title: this.title,
            description: this.description,
            recipient: this.recipient.length ? this.recipient : undefined,
        });

        this.$bvModal.hide('modalNFTCreate');
    }
}
</script>
