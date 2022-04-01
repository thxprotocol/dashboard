<template>
    <base-card :loading="loading">
        <template #default>
            <b-button
                variant="link"
                class="btn-remove rounded-pill float-right"
                size="sm"
                @click.stop="$bvModal.show(`modalDelete-${assetPool.address}`)"
            >
                <i class="far fa-trash-alt"></i>
            </b-button>
            <base-badge-network :network="erc20.network" />
            <div class="my-3 d-flex align-items-center" v-if="erc20.name">
                <img
                    height="20"
                    width="20"
                    class="mr-2 bg-dark"
                    :src="`https://avatars.dicebear.com/api/identicon/${erc20.address}.svg`"
                    alt=""
                />
                <strong class="m-0">{{ erc20.name }}</strong>
            </div>
            <hr />
            <p class="m-0">
                <label class="text-muted">
                    Total Supply
                    <b-link
                        target="_blank"
                        v-b-tooltip
                        title="View this ERC20 contract on Polygonscan"
                        @click="openTokenUrl()"
                    >
                        <i class="fas fa-question-circle"></i>
                    </b-link>
                </label>
                <br />
                <strong>{{ erc20.totalSupply }} {{ erc20.symbol }}</strong>
            </p>
        </template>
        <base-modal-delete
            :id="`modalDelete-${erc20._id}`"
            :call="$store.dispatch('erc20/remove', erc20._id)"
            :subject="erc20.name"
        />
    </base-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import { TERC20 } from '@/types/erc20';
import BaseCard from './BaseCard.vue';
import BaseBadgeNetwork from '../badges/BaseBadgeNetwork.vue';
import { NetworkProvider } from '@/store/modules/assetPools';
import BaseModalDelete from '../modals/BaseModalDelete.vue';

@Component({
    components: {
        BaseCard,
        BaseBadgeNetwork,
        BaseModalDelete,
    },
    computed: mapGetters({
        profile: 'account/profile',
    }),
})
export default class BaseCardERC20 extends Vue {
    loading = true;
    error = '';

    @Prop() erc20!: TERC20;

    async mounted() {
        this.$store.dispatch('erc20/read', this.erc20._id).then(() => {
            this.loading = false;
        });
    }

    openTokenUrl() {
        const url =
            this.erc20.network === NetworkProvider.Main
                ? `https://polygonscan.com/address/${this.erc20.address}/transactions`
                : `https://mumbai.polygonscan.com/address/${this.erc20.address}/transactions`;
        return (window as any).open(url, '_blank').focus();
    }
}
</script>
