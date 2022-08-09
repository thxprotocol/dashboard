<template>
    <base-card :loading="isLoading" :is-deploying="isDeploying">
        <template #card-header>
            {{ variant }}
            <i class="ml-1 fas fa-file-archive text-white small" v-if="pool.archived"></i>
        </template>
        <template #card-body>
            <b-alert class="m-0" show variant="warning" v-if="outOfDate && artifacts">
                Version conflict ({{ pool.version }} -> {{ artifacts }})
                <b-link href="https://discord.com/invite/TzbbSmkE7Y" target="_blank">
                    Please contact us in Discord
                </b-link>
            </b-alert>
            <template v-if="pool.token">
                <base-dropdown-menu-pool
                    :pool="pool"
                    @archive="archive"
                    @remove="$bvModal.show(`modalDelete-${pool.address}`)"
                />
                <base-badge-network :chainId="pool.chainId" class="mr-1" />
                <p class="mt-3 mb-0">
                    <span class="text-muted">Balance:</span><br />
                    <span class="font-weight-bold text-primary h3">
                        {{ pool.token.poolBalance }} {{ pool.token.symbol }}
                    </span>
                </p>
                <base-modal-delete :id="`modalDelete-${pool.address}`" :call="() => remove()" :subject="pool.address" />
                <hr />
                <b-button class="rounded-pill" variant="primary" @click="openPoolUrl()" block>
                    <i class="fas fa-cogs mr-2"></i>
                    Configuration
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
import BaseCard from '@/components/cards/BaseCard.vue';
import promisePoller from 'promise-poller';
import BaseDropdownMenuPool from '@/components/dropdowns/BaseDropdownMenuPool.vue';

@Component({
    components: {
        BaseDropdownMenuPool,
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
    isLoading = true;
    isDeploying = false;

    @Prop() pool!: IPool;

    profile!: IAccount;
    artifacts!: string;

    get outOfDate() {
        return this.pool.version !== this.artifacts;
    }

    get variant() {
        switch (this.pool.variant) {
            default:
                return 'Default';
            case 'defaultPool':
                return 'Default';
            case 'nftPool':
                return 'NFT';
        }
    }

    async mounted() {
        await this.$store.cache.dispatch('pools/read', this.pool._id);

        if (!this.pool.address) {
            this.isDeploying = true;
            this.waitForAddress();
        } else {
            this.isDeploying = false;
            this.isLoading = false;
        }
    }

    waitForAddress() {
        const taskFn = async () => {
            const pool = await this.$store.cache.dispatch('pools/read', this.pool._id);
            if (pool.address.length) {
                this.isDeploying = false;
                this.isLoading = false;
                return Promise.resolve(pool);
            } else {
                this.isLoading = false;
                return Promise.reject(pool);
            }
        };

        promisePoller({
            taskFn,
            interval: 3000,
            retries: 10,
        });
    }

    openPoolUrl() {
        this.$router.push({ path: `pool/${this.pool._id}/${this.pool.isNFTPool ? 'metadata' : 'rewards'}` });
    }

    async remove() {
        this.isLoading = true;
        await this.$store.dispatch('pools/remove', this.pool);
        this.isLoading = false;

        this.$store.cache.delete('pools/read');
    }

    async archive() {
        this.isLoading = true;
        await this.$store.dispatch('pools/update', { pool: this.pool, data: { archived: !this.pool.archived } });
        this.isLoading = false;

        this.$store.cache.delete('pools/read');
    }
}
</script>
