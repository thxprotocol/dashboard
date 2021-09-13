<template>
    <b-overlay :show="loading" rounded="sm">
        <b-card
            @click="$router.push({ name: 'pool', params: { address: assetPool.address } })"
            class="mt-3 mb-3 shadow-sm"
        >
            <b-button
                variant="link"
                class="btn-remove rounded-pill float-right"
                size="sm"
                @click.stop="$bvModal.show(`modalDelete-${assetPool.address}`)"
            >
                <i class="far fa-trash-alt"></i>
            </b-button>
            <b-badge class="p-2 text-white" variant="gray" v-if="assetPool.network === 0"> Polygon Test </b-badge>
            <b-badge class="p-2" variant="primary" v-if="assetPool.network === 1"> Polygon Main </b-badge>
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
        </b-card>
        <modal-delete :id="`modalDelete-${assetPool.address}`" :call="remove" :subject="assetPool.title" />
    </b-overlay>
</template>

<script lang="ts">
import { UserProfile } from '@/store/modules/account';
import { AssetPool, IAssetPools } from '@/store/modules/assetPools';
import { BBadge, BButton, BCard, BLink, BOverlay } from 'bootstrap-vue';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import ModalDelete from './ModalDelete.vue';

@Component({
    components: {
        'b-link': BLink,
        'b-button': BButton,
        'b-badge': BBadge,
        'b-card': BCard,
        'b-overlay': BOverlay,
        'modal-delete': ModalDelete,
    },
    computed: mapGetters({
        profile: 'account/profile',
        assetPools: 'assetPools/all',
    }),
})
export default class BaseAssetPool extends Vue {
    loading = false;

    @Prop() assetPool!: AssetPool;

    profile!: UserProfile;
    assetPools!: IAssetPools;

    openUrl(url: string) {
        return (window as any).open(url, '_blank').focus();
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
