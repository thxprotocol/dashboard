<template>
    <base-modal :error="error" title="Create NFT" id="modalNFTCreate">
        <template #modal-body>
            <b-form-group label="Title">
                <b-form-input v-model="title" />
            </b-form-group>
            <b-form-group label="Description">
                <b-form-input v-model="description" />
            </b-form-group>
            <b-form-group>
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
            </b-form-group>
            <label>Attributes</label>
            <b-card bg-variant="light">
                <b-form-group :key="key" v-for="(prop, key) of erc721.properties">
                    <template #label>
                        {{ prop.name }}
                        <a href="#" v-b-tooltip :title="prop.description">
                            <i class="fas fa-question-circle"></i>
                        </a>
                    </template>
                    <b-form-input
                        :type="parsePropType(prop.propType)"
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
import { TProp } from '@/store/modules/erc721';
import { AssetPool } from '@/store/modules/pools';
import { TERC721 } from '@/types/erc721';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import BaseModal from './BaseModal.vue';

@Component({
    components: {
        BaseModal,
    },
    computed: mapGetters({}),
})
export default class ModalRewardCreate extends Vue {
    docsUrl = process.env.VUE_APP_DOCS_URL;
    loading = false;
    error = '';

    recipient = '';
    title = '';
    description = '';

    @Prop() pool!: AssetPool;
    @Prop() erc721!: TERC721;

    get isSubmitDisabled() {
        return this.loading;
    }

    parsePropType(propType: string) {
        if (propType === 'string') return 'text';
        if (propType === 'number') return 'number';
    }

    submit() {
        const attributes: { key: string; value: string | number | undefined }[] = [];

        this.erc721.properties.forEach((prop: TProp) => {
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
