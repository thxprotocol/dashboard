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
                    <p class="brand-text">Tokens</p>
                    <b-button
                        v-b-modal="'modalERC20Create'"
                        class="rounded-pill mr-2"
                        variant="secondary"
                        v-b-tooltip
                        title="The fungible token standard ERC-20 could be used for making payments, exchanging value, point systems
                and reputation metrics."
                    >
                        <i class="fas fa-plus mr-2"></i>
                        <span>Create Token</span>
                    </b-button>
                    <b-button
                        v-b-modal="'modalERC20Import'"
                        class="rounded-pill mr-2"
                        variant="secondary"
                        v-b-tooltip
                        title="Import an existing ERC20 token contract, top up your pool and manage the distribution."
                    >
                        <i class="fas fa-arrow-down mr-2"></i>
                        <span>Import Token</span>
                    </b-button>
                    <b-button to="/pools" variant="link" class="text-light">
                        <i class="fas fa-chart-pie mr-2"></i>
                        <span>Deploy a token pool</span>
                    </b-button>
                </div>
            </b-jumbotron>
        </div>
        <div class="container container-md">
            <b-row>
                <b-col class="text-right pb-3">
                    <base-btn-toggle-archive @archived="$store.dispatch('erc20/list', { archived: $event })" />
                </b-col>
            </b-row>
            <base-nothing-here
                v-if="!Object.values(erc20s).length"
                text-submit="Create a Token"
                title="You have not created a Token yet"
                description="Tokens could be used for making payments, exchanging value, point systems
                and reputation metrics."
                @clicked="$bvModal.show('modalERC20Create')"
            />
            <b-row v-else>
                <b-col md="6" lg="4" :key="erc20._id" v-for="erc20 of erc20s">
                    <base-card-erc20 :erc20="erc20" />
                    <base-modal-pool-create :erc20="erc20" :tokenId="erc20._id" @created="loadList()" />
                </b-col>
            </b-row>
        </div>
        <modal-erc20-create />
        <modal-erc20-import />
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import ModalErc20Create from '@/components/modals/BaseModalERC20Create.vue';
import ModalErc20Import from '@/components/modals/BaseModalERC20Import.vue';
import BaseCardErc20 from '@/components/cards/BaseCardERC20.vue';
import BaseNothingHere from '@/components/BaseListStateEmpty.vue';
import BaseBtnToggleArchive from '@/components/buttons/BaseBtnToggleArchive.vue';
import BaseModalPoolCreate from '@/components/modals/BaseModalPoolCreate.vue';
import { IERC20s } from '@/types/erc20';

@Component({
    components: {
        BaseBtnToggleArchive,
        BaseCardErc20,
        ModalErc20Create,
        ModalErc20Import,
        BaseNothingHere,
        BaseModalPoolCreate,
    },
    computed: mapGetters({
        erc20s: 'erc20/all',
    }),
})
export default class Tokens extends Vue {
    erc20s!: IERC20s;

    loadList() {
        this.$store.dispatch('erc20/list');
    }

    mounted() {
        this.$store.dispatch('account/getProfile');
        this.loadList();
    }
}
</script>
