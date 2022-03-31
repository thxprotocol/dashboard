<template>
    <b-skeleton-wrapper :loading="skeletonLoading">
        <template #loading>
            <b-card class="mt-3 mb-3 shadow-sm cursor-pointer">
                <b-skeleton animation="fade" width="85%"></b-skeleton>
                <b-skeleton animation="fade" width="55%"></b-skeleton>
                <b-skeleton animation="fade" width="70%"></b-skeleton>
                <b-skeleton animation="fade" width="60%"></b-skeleton>
                <b-skeleton animation="fade" width="40%"></b-skeleton>
            </b-card>
        </template>
        <div>
            <b-alert class="m-0" show variant="warning" v-if="warning">
                {{ warning }}
                <b-link href="https://discord.com/invite/TzbbSmkE7Y" target="_blank">
                    Please contact us in Discord
                </b-link>
            </b-alert>

            <b-card
                v-if="assetPool.poolToken"
                @click="$router.push({ path: `pool/${assetPool.address}/rewards` })"
                class="mt-3 mb-3 shadow-sm cursor-pointer"
            >
                <b-button
                    variant="link"
                    class="btn-remove rounded-pill float-right"
                    size="sm"
                    @click.stop="$bvModal.show(`modalDelete-${assetPool.address}`)"
                >
                    <i class="far fa-trash-alt"></i>
                </b-button>
                <b-badge class="p-2 text-white mr-1" variant="gray" v-if="assetPool.network === 0">
                    Polygon Test
                </b-badge>
                <b-badge class="p-2 mr-1" variant="primary" v-if="assetPool.network === 1"> Polygon Main </b-badge>
                <b-badge class="p-2 mr-1 text-muted" variant="light">
                    <i class="fas fa-users mr-1"></i>
                    {{ assetPool.metrics.members }}
                </b-badge>
                <b-badge class="p-2 mr-1 text-muted" variant="light">
                    <i class="fas fa-gift mr-1"></i>
                    {{ assetPool.metrics.withdrawals }}
                </b-badge>
                <p class="font-weight-bold text-primary h3 mt-2">
                    {{ assetPool.poolToken.balance }} {{ assetPool.poolToken.symbol }}
                </p>
                <p class="text-muted mb-0">
                    {{ assetPool.poolToken.name }}
                    <template v-if="assetPool.network === 0">
                        <a
                            target="_blank"
                            :id="`infoTokenTest-${assetPool.address}`"
                            @click.stop="
                                openUrl(
                                    `https://mumbai.polygonscan.com/address/${assetPool.poolToken.address}/transactions`,
                                )
                            "
                        >
                            <i class="fas fa-question-circle text-gray"></i>
                        </a>
                        <b-tooltip :target="`infoTokenTest-${assetPool.address}`" triggers="hover">
                            Total Supply:<br />
                            {{ assetPool.poolToken.totalSupply }} {{ assetPool.poolToken.symbol }}
                        </b-tooltip>
                    </template>
                    <template v-if="assetPool.network === 1">
                        <a
                            target="_blank"
                            :id="`infoTokenMain-${assetPool.address}`"
                            @click.stop="
                                openUrl(
                                    `https://polygonscan.com/address/${assetPool.poolToken.address}/transactions`,
                                    '_blank',
                                ).focus()
                            "
                        >
                            <i class="fas fa-question-circle"></i>
                        </a>
                        <b-tooltip :target="`infoTokenMain-${assetPool.address}`" triggers="hover">
                            Total Supply:<br />
                            {{ assetPool.poolToken.totalSupply }} {{ assetPool.poolToken.symbol }}
                        </b-tooltip>
                    </template>
                </p>
                <modal-delete :id="`modalDelete-${assetPool.address}`" :call="remove" :subject="assetPool.address" />
            </b-card>
        </div>
    </b-skeleton-wrapper>
</template>

<script lang="ts">
import { IAccount } from '@/types/account';
import { AssetPool, IAssetPools } from '@/store/modules/assetPools';
import { BBadge, BButton, BCard, BLink, BOverlay, BSkeleton, BSkeletonWrapper } from 'bootstrap-vue';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import ModalDelete from './ModalDelete.vue';
import { AxiosError } from 'axios';

@Component({
    components: {
        'b-link': BLink,
        'b-button': BButton,
        'b-badge': BBadge,
        'b-card': BCard,
        'b-overlay': BOverlay,
        'modal-delete': ModalDelete,
        'b-skeleton': BSkeleton,
        'b-skeleton-wrapper': BSkeletonWrapper,
    },
    computed: mapGetters({
        profile: 'account/profile',
        assetPools: 'assetPools/all',
    }),
})
export default class BaseAssetPool extends Vue {
    warning = '';
    loading = false;
    skeletonLoading = true;

    @Prop() assetPool!: AssetPool;

    profile!: IAccount;
    assetPools!: IAssetPools;
    openUrl(url: string) {
        return (window as any).open(url, '_blank').focus();
    }

    async mounted() {
        try {
            await this.$store.dispatch('assetPools/read', this.assetPool.address);
        } catch (error) {
            if ((error as AxiosError).response?.status === 403) {
                this.warning = (error as AxiosError).response?.data.error.message;
            }
            throw error;
        } finally {
            this.skeletonLoading = false;
        }
    }

    async remove() {
        this.loading = true;
        try {
            await this.$store.dispatch('assetPools/remove', this.assetPool.address);
        } catch (e) {
            console.error(e);
        } finally {
            this.loading = false;
        }
    }
}
</script>
<style lang="scss" scoped>
.card-title {
    font-size: 1rem;
}
</style>
