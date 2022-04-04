<template>
    <base-card :loading="loading" classes="cursor-pointer" @click="openTokenUrl()">
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
            <div class="my-3 d-flex align-items-center" v-if="erc20.name">
                <img
                    height="40"
                    width="40"
                    style="border-radius: 50%"
                    class="mr-2 bg-darker outline-darker"
                    :src="`https://avatars.dicebear.com/api/identicon/${erc20.address}.svg`"
                    alt=""
                />
                <div>
                    <strong class="m-0">{{ erc20.symbol }}</strong>
                    <br />
                    {{ erc20.name }}
                </div>
            </div>
            <p class="m-0">
                <label class="text-muted">
                    {{ erc20.type == ERC20Type.Limited ? 'Total supply' : 'Total minted supply' }}</label
                >
                <br />
                <strong class="font-weight-bold h3 text-primary"> {{ erc20.totalSupply }} </strong>
            </p>
        </template>
        <base-modal-delete :id="`modalDelete-${erc20._id}`" :call="remove" :subject="erc20.name" />
    </base-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import { ERC20Type, TERC20 } from '@/types/erc20';
import { NetworkProvider } from '@/store/modules/assetPools';
import BaseCard from './BaseCard.vue';
import BaseBadgeNetwork from '../badges/BaseBadgeNetwork.vue';
import BaseModalDelete from '../modals/BaseModalDelete.vue';
import { IAccount } from '@/types/account';

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

    profile!: IAccount;

    @Prop() erc20!: TERC20;

    async mounted() {
        await this.$store.dispatch('account/getProfile');
        this.$store.dispatch('erc20/read', this.erc20._id).then(() => {
            this.loading = false;
        });
    }

    openTokenUrl() {
        const url = `https://${this.erc20.network === NetworkProvider.Test ? 'mumbai.' : ''}polygonscan.com/token/${
            this.erc20.address
        }`;
        return (window as any).open(url, '_blank').focus();
    }

    remove() {
        this.$store.dispatch('erc20/remove', this.erc20._id);
    }
}
</script>
