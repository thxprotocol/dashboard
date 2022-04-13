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
                    <span>Create ERC20 Token</span>
                </b-button>
                <b-button v-b-modal="'modalERC721Create'" class="rounded-pill" variant="secondary">
                    <i class="fas fa-plus mr-2"></i>
                    <span>Create ERC721 Token</span>
                </b-button>
                <b-button to="/pools" variant="link" class="text-light">
                    <i class="fas fa-chart-pie mr-2"></i>
                    <span>Deploy pool for this token</span>
                </b-button>
            </div>
        </b-jumbotron>
        <div class="container container-md">
            <div class="row">
                <div class="col-md-6 col-lg-4" :key="erc20.id" v-for="erc20 of erc20s">
                    <base-card-erc20 :erc20="erc20" />
                </div>
            </div>
            <div class="row">
                <div class="col-md-6 col-lg-4" :key="erc721.id" v-for="erc721 of erc721s">
                    <base-card-erc721 :erc721="erc721" />
                </div>
            </div>
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

@Component({
    components: {
        BaseAssetPool,
        BaseCardErc20,
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
    }
}
</script>
