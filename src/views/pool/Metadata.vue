<template>
    <div>
        <b-row class="mb-3">
            <b-col class="d-flex align-items-center">
                <h2 class="mb-0">Metadata</h2>
            </b-col>
            <b-col class="d-flex justify-content-end">
                <b-button v-b-modal="'modalNFTCreate'" class="rounded-pill" variant="primary">
                    <i class="fas fa-plus mr-2"></i>
                    <span class="d-none d-md-inline">Create an NFT</span>
                </b-button>
            </b-col>
        </b-row>
        <base-nothing-here
            v-if="!erc721 || (erc721.metadata && !erc721.metadata.length)"
            item="an NFT"
            @clicked="$bvModal.show('modalNFTCreate')"
        />
        <base-card-erc721-metadata
            v-if="erc721 && erc721.metadata && erc721.metadata.length"
            :erc721="erc721"
            :metadata="erc721.metadata"
            :pool="pool"
        />
        <base-modal-erc721-metadata-create v-if="erc721" :pool="pool" :erc721="erc721" />
    </div>
</template>

<script lang="ts">
import { AssetPool, IAssetPools } from '@/store/modules/pools';
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import { IERC721s, TERC721 } from '@/types/erc721';
import BaseNothingHere from '@/components/BaseNothingHere.vue';
import BaseCardErc721Metadata from '@/components/cards/BaseCardERC721Metadata.vue';
import BaseModalErc721MetadataCreate from '@/components/modals/BaseModalERC721MetadataCreate.vue';

@Component({
    components: {
        BaseNothingHere,
        BaseModalErc721MetadataCreate,
        BaseCardErc721Metadata,
    },
    computed: mapGetters({
        pools: 'pools/all',
        erc721s: 'erc721/all',
    }),
})
export default class MetadataView extends Vue {
    docsUrl = process.env.VUE_APP_DOCS_URL;
    apiUrl = process.env.VUE_APP_API_ROOT;
    widgetUrl = process.env.VUE_APP_WIDGET_URL;

    error = '';
    loading = true;

    pools!: IAssetPools;
    erc721s!: IERC721s;

    get pool(): AssetPool {
        return this.pools[this.$route.params.address];
    }

    get erc721(): TERC721 {
        return this.erc721s[this.pool.token._id];
    }

    mounted() {
        this.$store.dispatch('erc721/read', this.pool.token._id).then(async () => {
            await this.$store.dispatch('erc721/listMetadata', this.erc721);
        });
    }
}
</script>
