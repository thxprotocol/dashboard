<template>
    <div>
        <div class="container-xl">
            <b-jumbotron
                class="mt-3 jumbotron-header"
                bg-variant="light"
                :style="{
                    'min-height': 'none',
                    'border-radius': '1rem',
                    'background-size': 'cover',
                    'background-image': `url(${require('@/assets/thx_jumbotron.webp')})`,
                }"
            >
                <div class="container container-md py-5">
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
                    </b-button>
                    <b-button to="/pools" variant="link" class="text-light">
                        <i class="fas fa-chart-pie mr-2"></i>
                        <span>Deploy an NFT pool</span>
                    </b-button>
                </div>
            </b-jumbotron>
        </div>
        <div class="container container-md">
            <b-row>
                <b-col class="text-right pb-3">
                    <base-btn-toggle-archive @archived="$store.dispatch('erc721/list', { archived: $event })" />
                </b-col>
            </b-row>
            <base-nothing-here
                v-if="!Object.values(erc721s).length"
                text-submit="Create an NFT"
                title="You have not created an NFT yet"
                description="NFT's could be used for creating digital art collections, certificates
                of authenticity, in-game loot and social status."
                @clicked="$bvModal.show('modalERC721Create')"
            />
            <b-row v-else>
                <b-col md="6" lg="4" :key="erc721._id" v-for="erc721 of erc721s">
                    <base-card-erc721 :erc721="erc721" />
                    <base-modal-pool-create :erc721="erc721" :tokenId="erc721._id" @created="loadList()" />
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
import BaseNothingHere from '@/components/BaseListStateEmpty.vue';
import { IERC721s } from '@/types/erc721';
import BaseBtnToggleArchive from '@/components/buttons/BaseBtnToggleArchive.vue';
import BaseModalPoolCreate from '@/components/modals/BaseModalPoolCreate.vue';

@Component({
    components: {
        BaseBtnToggleArchive,
        BaseCardErc721,
        ModalErc721Create,
        BaseNothingHere,
        BaseModalPoolCreate,
    },
    computed: mapGetters({
        erc721s: 'erc721/all',
    }),
})
export default class NFTView extends Vue {
    erc721s!: IERC721s;

    loadList() {
        this.$store.dispatch('erc721/list');
    }

    mounted() {
        this.$store.dispatch('account/getProfile');
        this.loadList();
    }
}
</script>
