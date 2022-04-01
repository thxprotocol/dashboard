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
            <base-badge-network class="mr-2" :network="erc20.network" />
            <b-badge variant="light" class="cursor-pointer p-2 mr-1 text-muted" @click="openTokenUrl()">
                <i class="fas fa-external-link-alt mr-1"></i> Explore
            </b-badge>
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
            <p class="m-0">
                <strong
                    v-b-tooltip
                    :title="erc20.type == ERC20Type.Limited ? 'Total supply' : 'Total minted supply'"
                    class="font-weight-bold h3 text-primary"
                >
                    {{ erc20.totalSupply }} {{ erc20.symbol }}
                </strong>
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
import { ERC20Type, TERC20 } from '@/types/erc20';
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
    ERC20Type = ERC20Type;
    loading = true;
    error = '';

    @Prop() erc20!: TERC20;

    async mounted() {
        this.$store.dispatch('account/getProfile');
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
