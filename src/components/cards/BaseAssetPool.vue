<template>
    <base-card
        class="cursor-pointer"
        :loading="loading"
        @click="$router.push({ path: `pool/${assetPool.address}/rewards` })"
    >
        <template #card-body>
            <b-alert class="m-0" show variant="warning" v-if="warning">
                {{ warning }}
                <b-link href="https://discord.com/invite/TzbbSmkE7Y" target="_blank">
                    Please contact us in Discord
                </b-link>
            </b-alert>
            <template v-if="assetPool.poolToken">
                <b-button
                    variant="link"
                    class="btn-remove rounded-pill float-right"
                    size="sm"
                    @click.stop="$bvModal.show(`modalDelete-${assetPool.address}`)"
                >
                    <i class="far fa-trash-alt"></i>
                </b-button>
                <base-badge-network :network="assetPool.network" class="mr-1" />
                <b-badge class="p-2 mr-1 text-muted" variant="light">
                    <i class="fas fa-users mr-1"></i>
                    {{ assetPool.metrics.members }}
                </b-badge>
                <b-badge class="p-2 mr-1 text-muted" variant="light">
                    <i class="fas fa-gift mr-1"></i>
                    {{ assetPool.metrics.withdrawals }}
                </b-badge>
                <p class="font-weight-bold text-primary h3 mt-2 mb-0">
                    {{ assetPool.balance }} {{ assetPool.poolToken.symbol }}
                </p>
                <base-modal-delete
                    :id="`modalDelete-${assetPool.address}`"
                    :call="() => remove(assetPool.address)"
                    :subject="assetPool.address"
                />
            </template>
        </template>
    </base-card>
</template>

<script lang="ts">
import { IAccount } from '@/types/account';
import { AssetPool, IAssetPools } from '@/store/modules/assetPools';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import BaseModalDelete from '@/components/modals/BaseModalDelete.vue';
import BaseBadgeNetwork from '@/components/badges/BaseBadgeNetwork.vue';
import BaseCard from './BaseCard.vue';

@Component({
    components: {
        BaseModalDelete,
        BaseBadgeNetwork,
        BaseCard,
    },
    computed: mapGetters({
        profile: 'account/profile',
        assetPools: 'assetPools/all',
    }),
})
export default class BaseAssetPool extends Vue {
    warning = '';
    loading = true;

    @Prop() assetPool!: AssetPool;

    profile!: IAccount;
    assetPools!: IAssetPools;

    async mounted() {
        await this.$store.dispatch('assetPools/read', this.assetPool.address);
        this.loading = false;
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
