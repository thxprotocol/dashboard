<template>
    <base-card :loading="loading">
        <template #card-body>
            <b-alert class="m-0" show variant="warning" v-if="warning">
                {{ warning }}
                <b-link href="https://discord.com/invite/TzbbSmkE7Y" target="_blank">
                    Please contact us in Discord
                </b-link>
            </b-alert>
            <template v-if="pool.token">
                <b-button
                    variant="link"
                    class="btn-remove rounded-pill float-right"
                    size="sm"
                    @click.stop="$bvModal.show(`modalDelete-${pool.address}`)"
                >
                    <i class="far fa-trash-alt"></i>
                </b-button>
                <base-badge-network :network="pool.network" class="mr-1" />
                <b-badge class="p-2 mr-1 text-muted" variant="light">
                    <i class="fas fa-users mr-1"></i>
                    {{ pool.metrics.members }}
                </b-badge>
                <b-badge class="p-2 mr-1 text-muted" variant="light">
                    <i class="fas fa-gift mr-1"></i>
                    {{ pool.metrics.withdrawals }}
                </b-badge>
                <p class="font-weight-bold text-primary h3 mt-3 mb-0">
                    {{ pool.token.poolBalance }} {{ pool.token.symbol }}
                </p>
                <base-modal-delete
                    :id="`modalDelete-${pool.address}`"
                    :call="() => remove(pool.address)"
                    :subject="pool.address"
                />
                <hr />
                <b-button class="rounded-pill" variant="light" @click="openPoolUrl()" block>View Pool</b-button>
            </template>
        </template>
    </base-card>
</template>

<script lang="ts">
import { IAccount } from '@/types/account';
import { AssetPool } from '@/store/modules/pools';
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
    }),
})
export default class BaseCardPool extends Vue {
    warning = '';
    loading = true;

    @Prop() pool!: AssetPool;

    profile!: IAccount;

    async mounted() {
        await this.$store.dispatch('pools/read', this.pool.address);
        this.loading = false;
    }

    async remove() {
        this.loading = true;
        try {
            await this.$store.dispatch('pools/remove', this.pool.address);
        } catch (e) {
            console.error(e);
        } finally {
            this.loading = false;
        }
    }

    openPoolUrl() {
        this.$router.push({ path: `pool/${this.pool.address}/${this.pool.isNFTPool ? 'metadata' : 'rewards'}` });
    }
}
</script>
