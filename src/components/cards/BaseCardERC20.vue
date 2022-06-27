<template>
    <base-card :loading="isLoading" :is-deploying="isDeploying" classes="cursor-pointer" @click="openTokenUrl()">
        <template #card-header>
            {{ ERC20Type[erc20.type] }}
        </template>
        <template #card-body v-if="erc20.name">
            <base-badge-network class="mr-2" :chainId="erc20.chainId" />
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
                @click.stop="$bvModal.show(`modalDepositCreate-${erc20._id}`)"
                class="rounded-pill mt-3"
                variant="primary"
                :disabled="erc20.type !== ERC20Type.Limited"
            >
                <i class="fas fa-plus mr-2" aria-hidden="true"></i>
                Top up pool
            </b-button>
            <base-modal-deposit-create @submit="$store.dispatch('erc20/read', erc20._id)" :erc20="erc20" />
        </template>
    </base-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import { ERC20Type, TERC20 } from '@/types/erc20';
import { IAccount } from '@/types/account';
import BaseCard from './BaseCard.vue';
import BaseBadgeNetwork from '../badges/BaseBadgeNetwork.vue';
import BaseIdenticon from '../BaseIdenticon.vue';
import BaseModalDepositCreate from '../modals/BaseModalDepositCreate.vue';
import { chainInfo } from '@/utils/chains';
import promisePoller from 'promise-poller';

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
    error = '';
    isLoading = true;
    isDeploying = false;
    profile!: IAccount;

    @Prop() erc20!: TERC20;

    async mounted() {
        await this.$store.dispatch('erc20/read', this.erc20._id);

        if (!this.erc20.address) {
            this.isDeploying = true;
            this.waitForAddress();
        } else {
            this.isDeploying = false;
            this.isLoading = false;
        }
    }

    waitForAddress() {
        const taskFn = async () => {
            const erc20 = await this.$store.dispatch('erc20/read', this.erc20._id);
            if (erc20.address.length) {
                this.isDeploying = false;
                this.isLoading = false;
                return Promise.resolve(erc20);
            } else {
                this.isLoading = false;
                return Promise.reject(erc20);
            }
        };

        promisePoller({
            taskFn,
            interval: 3000,
            retries: 10,
        });
    }

    openTokenUrl() {
        const url = `${chainInfo[this.erc20.chainId].blockExplorer}/token/${this.erc20.address}`;
        return (window as any).open(url, '_blank').focus();
    }
}
</script>
