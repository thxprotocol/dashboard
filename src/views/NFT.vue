<template>
    <div>
        <b-jumbotron
            class="jumbotron-header text-left"
            :style="{
                'background-image': `url(${require('@/assets/thx_jumbotron.webp')})`,
            }"
        >
            <div class="container container-md pt-5 pb-5">
                <p class="brand-text">NFT</p>
                <b-button
                    v-b-modal="'modalERC721Create'"
                    class="rounded-pill"
                    variant="secondary"
                    v-b-tooltip
                    title="The non-fungible token standard ERC-721 could be used for creating digital art collections, certificates
                of authenticity, in-game loot and social status."
                >
                    <i class="fas fa-plus mr-2"></i>
                    <span class="mr-2">Create NFT</span>
                    <b-badge variant="primary">Beta</b-badge>
                </b-button>
                <b-button to="/pools" variant="link" class="text-light">
                    <i class="fas fa-chart-pie mr-2"></i>
                    <span>Deploy an NFT pool</span>
                </b-button>
            </div>
        </b-jumbotron>
        <div class="container container-md">
            <base-nothing-here
                v-if="!Object.values(erc721s).length"
                item="an NFT"
                @clicked="$bvModal.show('modalERC721Create')"
            />
            <b-row v-else>
                <b-col md="6" lg="4" :key="erc721._id" v-for="erc721 of erc721s">
                    <base-card-erc721 :erc721="erc721" />
                </b-col>
            </b-row>
        </div>
        <modal-erc721-create />
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import ModalErc721Create from '@/components/modals/BaseModalERC721Create.vue';
import BaseCardErc721 from '@/components/cards/BaseCardERC721.vue';
import BaseNothingHere from '@/components/BaseNothingHere.vue';

@Component({
    components: {
        BaseCardErc721,
        ModalErc721Create,
        BaseNothingHere,
    },
    computed: mapGetters({
        erc721s: 'erc721/all',
    }),
})
export default class NFTView extends Vue {
    mounted() {
        this.$store.dispatch('account/getProfile');
        this.$store.dispatch('erc721/list');
    }
}
</script>