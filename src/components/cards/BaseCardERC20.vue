<template>
    <base-card :loading="erc20.loading" classes="cursor-pointer" @click="openTokenUrl()">
        <template #card-body v-if="erc20.name">
            <b-button
                variant="link"
                class="btn-remove rounded-pill float-right"
                size="sm"
                @click.stop="$bvModal.show(`modalDelete-${erc20._id}`)"
            >
                <i class="far fa-trash-alt"></i>
            </b-button>
            <base-badge-network class="mr-2" :network="erc20.network" />
            <div class="my-3 d-flex align-items-center" v-if="erc20.name">
                <base-identicon class="mr-2" size="40" :rounded="true" variant="darker" :uri="erc20.logoURI" />
                <div>
                    <strong class="m-0">{{ erc20.symbol }}</strong>
                    <br />
                    {{ erc20.name }}
                </div>
            </div>
            <p>
                <span class="text-muted">Total supply</span><br />
                <strong class="font-weight-bold h3 text-primary"> {{ erc20.totalSupply }} </strong>
            </p>
            <p class="m-0">
                <span class="text-muted">Treasury</span><br />
                <strong class="font-weight-bold h3 text-primary"> {{ erc20.adminBalance }} </strong>
            </p>
            <b-button
                block
                @click.stop="$bvModal.show('modalDepositCreate')"
                class="rounded-pill mt-3"
                variant="primary"
            >
                <i class="fas fa-plus mr-2" aria-hidden="true"></i>
                Top up pool
            </b-button>
            <base-modal-deposit-create :erc20="erc20" />
        </template>
    </base-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import { ERC20Type, TERC20 } from '@/types/erc20';
import { NetworkProvider } from '@/store/modules/pools';
import { IAccount } from '@/types/account';
import BaseCard from './BaseCard.vue';
import BaseBadgeNetwork from '../badges/BaseBadgeNetwork.vue';
import BaseIdenticon from '../BaseIdenticon.vue';
import BaseModalDepositCreate from '../modals/BaseModalDepositCreate.vue';

@Component({
    components: {
        BaseModalDepositCreate,
        BaseCard,
        BaseBadgeNetwork,
        BaseIdenticon,
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

    mounted() {
        this.$store.dispatch('erc20/read', this.erc20._id);
    }

    openTokenUrl() {
        const url = `https://${this.erc20.network === NetworkProvider.Test ? 'mumbai.' : ''}polygonscan.com/token/${
            this.erc20.address
        }`;
        return (window as any).open(url, '_blank').focus();
    }
}
</script>
