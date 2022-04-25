<template>
    <base-modal :error="error" title="Mint NFT" id="modalNFTMint">
        <template #modal-body>
            <label>Recipient</label>
            <b-form-group>
                <b-form-input v-model="recipient" placeholder="Recipient of the NFT" />
            </b-form-group>
            <label>Properties</label>
            <b-form-group :key="key" v-for="(prop, key) of erc721.properties">
                <b-form-input :type="parsePropType(prop.propType)" v-model="prop.value" :placeholder="prop.name" />
                <small class="text-muted">{{ prop.description }}</small>
            </b-form-group>
        </template>
        <template #btn-primary>
            <b-button :disabled="loading" class="rounded-pill" @click="submit()" variant="primary" block>
                Mint NFT
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
        const metadata: { key: string; value: string | number | undefined }[] = [];

        this.erc721.properties.forEach((prop: TProp) => {
            metadata.push({
                key: prop.name,
                value: prop.value,
            });
        });
        this.$store.dispatch('erc721/mint', {
            pool: this.pool,
            erc721: this.erc721,
            beneficiary: this.recipient,
            metadata,
        });
    }
}
</script>
