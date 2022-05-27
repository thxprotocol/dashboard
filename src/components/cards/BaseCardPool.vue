<template>
    <base-card :loading="loading">
        <template #card-body>
            <b-alert class="m-0" show variant="warning" v-if="warning">
                {{ warning }}
                <b-link href="https://discord.com/invite/TzbbSmkE7Y" target="_blank">
                    Please contact us in Discord
                </b-link>
            </b-alert>
            <b-alert v-if="outOfDate && artifacts" variant="danger" show>
                Version conflict ({{ pool.version }} -> {{ artifacts }}), contact the team.
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
                <base-badge-network :network="pool.network" :version="pool.version" class="mr-1" />
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
                <base-modal-delete :id="`modalDelete-${pool.address}`" :call="() => remove()" :subject="pool.address" />

                <hr />
                <b-button :disabled="outOfDate" class="rounded-pill" variant="light" @click="openPoolUrl()" block>
                    View Pool
                </b-button>
            </template>
        </template>
    </base-card>
</template>

<script lang="ts">
import { IAccount } from '@/types/account';
import { IPool } from '@/store/modules/pools';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { mapGetters, mapState } from 'vuex';
import BaseModalDelete from '@/components/modals/BaseModalDelete.vue';
import BaseBadgeNetwork from '@/components/badges/BaseBadgeNetwork.vue';
import BaseCard from './BaseCard.vue';
import promisePoller, { CANCEL_TOKEN } from 'promise-poller';

@Component({
    components: {
        BaseModalDelete,
        BaseBadgeNetwork,
        BaseCard,
    },
    computed: {
        ...mapState('account', ['version', 'artifacts']),
        ...mapGetters({
            profile: 'account/profile',
        }),
    },
})
export default class BaseCardPool extends Vue {
    warning = '';
    loading = true;

    @Prop() pool!: IPool;

    profile!: IAccount;
    artifacts!: string;

    get outOfDate() {
        return this.pool.version !== this.artifacts;
    }

    async mounted() {
        await this.$store.dispatch('pools/read', this.pool._id);

        if (!this.pool.address) {
            this.waitForAddress();
        } else {
            this.loading = false;
        }
    }

    waitForAddress() {
        const taskFn = async () => {
            const pool = await this.$store.dispatch('pools/read', this.pool._id);
            if (pool.address.length) {
                this.loading = false;
                return Promise.resolve(pool);
            } else {
                return Promise.reject(pool);
            }
        };

        promisePoller({
            taskFn,
            interval: 3000,
            retries: 10,
        });
    }

    async remove() {
        this.loading = true;
        try {
            await this.$store.dispatch('pools/remove', this.pool);
        } catch (e) {
            console.error(e);
        } finally {
            this.loading = false;
        }
    }

    openPoolUrl() {
        this.$router.push({ path: `pool/${this.pool._id}/${this.pool.isNFTPool ? 'metadata' : 'rewards'}` });
    }
}
</script>
