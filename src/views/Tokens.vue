<template>
    <div>
        <b-jumbotron
            class="jumbotron-header text-left"
            :style="{
                'background-image': `url(${require('@/assets/thx_jumbotron.webp')})`,
            }"
        >
            <div class="container container-md pt-5 pb-5">
                <p class="brand-text">Tokens</p>
                <b-button v-b-modal="'modalERC20Create'" class="rounded-pill mr-2" variant="secondary">
                    <i class="fas fa-plus mr-2"></i>
                    <span>Create ERC20</span>
                </b-button>
                <b-button v-b-modal="'modalERC721Create'" class="rounded-pill" variant="secondary">
                    <i class="fas fa-plus mr-2"></i>
                    <span>Create ERC721</span>
                </b-button>
                <b-button to="/pools" variant="link" class="text-light">
                    <i class="fas fa-chart-pie mr-2"></i>
                    <span>Deploy pool a token pool</span>
                </b-button>
            </div>
        </b-jumbotron>
        <div class="container container-md">
            <h2>ERC-20</h2>
            <p class="text-muted">
                The fungible asset standard could be used for making payments, exchanging value, point systems and
                reputation metrics.
            </p>
            <b-row>
                <b-col md="6" lg="4" :key="erc20._id" v-for="erc20 of erc20s">
                    <base-card-erc20 :erc20="erc20" />
                </b-col>
            </b-row>
            <hr />
            <h2 class="mt-3">ERC-721</h2>
            <p class="text-muted">
                The NFT standard could be used for creating digital art collections, certificates of authenticity,
                in-game loot and social status.
            </p>
            <b-row>
                <b-col md="6" lg="4" :key="erc721._id" v-for="erc721 of erc721s">
                    <base-card-erc721 :erc721="erc721" />
                </b-col>
            </b-row>
        </div>
        <modal-erc20-create />
        <modal-erc721-create />
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import BaseAssetPool from '@/components/cards/BaseAssetPool.vue';
import ModalErc20Create from '@/components/modals/BaseModalERC20Create.vue';
import ModalErc721Create from '@/components/modals/BaseModalERC721Create.vue';
import BaseCardErc20 from '@/components/cards/BaseCardERC20.vue';
import BaseCardErc721 from '@/components/cards/BaseCardERC721.vue';

@Component({
    components: {
        BaseAssetPool,
        BaseCardErc20,
        BaseCardErc721,
        ModalErc20Create,
        ModalErc721Create,
    },
    computed: mapGetters({
        erc20s: 'erc20/all',
        erc721s: 'erc721/all',
    }),
})
export default class Tokens extends Vue {
    mounted() {
        this.$store.dispatch('account/getProfile');
        this.$store.dispatch('erc20/list');
        this.$store.dispatch('erc721/list');
    }
}
</script>
