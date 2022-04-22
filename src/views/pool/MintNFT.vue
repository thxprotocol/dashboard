<template>
    <div>
        <b-row class="mb-3">
            <b-col class="d-flex align-items-center">
                <h2 class="mb-0">Mint NFT</h2>
            </b-col>
            <b-col class="d-flex justify-content-end">
                <b-button v-b-modal="'modalNFTMint'" class="rounded-pill" variant="primary">
                    <i class="fas fa-plus mr-2"></i>
                    <span class="d-none d-md-inline">Mint an NFT</span>
                </b-button>
            </b-col>
        </b-row>
        <base-nothing-here v-if="!erc721s.length" />
        <b-row v-else>
            <!-- <b-col md="6" :key="reward.id" v-for="reward of erc721s">
                <base-card-reward :pool="pool" :reward="reward" :isGovernanceEnabled="isGovernanceEnabled" />
            </b-col> -->
        </b-row>
        <base-modal-nft-mint v-if="erc721" :pool="pool" :erc721="erc721" />
    </div>
</template>

<script lang="ts">
import { IAssetPools } from '@/store/modules/pools';
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import BaseNothingHere from '@/components/BaseNothingHere.vue';
import BaseModalNftMint from '@/components/modals/BaseModalNFTMint.vue';
import { IERC721s, TERC721 } from '@/types/erc721';

@Component({
    components: {
        BaseNothingHere,
        BaseModalNftMint,
    },
    computed: mapGetters({
        pools: 'pools/all',
        erc721s: 'erc721/all',
    }),
})
export default class MintNftView extends Vue {
    docsUrl = process.env.VUE_APP_DOCS_URL;
    apiUrl = process.env.VUE_APP_API_ROOT;
    widgetUrl = process.env.VUE_APP_WIDGET_URL;

    error = '';
    loading = true;

    pools!: IAssetPools;
    erc721s!: IERC721s;

    get pool() {
        return this.pools[this.$route.params.address];
    }

    get erc721() {
        return this.erc721s[this.pool.token._id];
    }

    mounted() {
        this.$store.dispatch('erc721/read', this.pool.token._id);
    }
}
</script>
