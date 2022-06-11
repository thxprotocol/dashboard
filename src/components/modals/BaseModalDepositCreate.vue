<template>
    <base-modal
        size="lg"
        :title="`Top up a pool with ${erc20.symbol}`"
        :id="`modalDepositCreate-${erc20._id}`"
        @show="onShow"
        :hide-footer="loading"
        :loading="loading"
        :error="error"
    >
        <template #modal-body v-if="!loading">
            <p>Pick any of your {{ erc20.symbol }} pools and choose the amount for a top up.</p>
            <form v-on:submit.prevent="submit" id="formDepositCreate">
                <b-card bg-variant="light" class="border-0" body-class="p-5">
                    <b-form-group>
                        <b-form-select v-model="pool">
                            <b-form-select-option :value="pool" :key="key" v-for="(pool, key) of filteredPools">
                                {{ pool.token.symbol }} Pool - {{ pool.token.poolBalance }} {{ pool.token.symbol }}
                            </b-form-select-option>
                        </b-form-select>
                    </b-form-group>
                    <b-form-group>
                        <b-input-group :append="erc20.symbol" :class="{ 'is-valid': amount <= erc20.adminBalance }">
                            <b-form-input type="number" v-model="amount" />
                        </b-input-group>
                        <small class="text-muted"
                            >Your treasury holds <strong>{{ erc20.adminBalance }} {{ erc20.symbol }}</strong
                            >. <b-link @click="amount = erc20.adminBalance">Set max amount</b-link>
                        </small>
                    </b-form-group>
                </b-card>
            </form>
        </template>

        <template #btn-primary>
            <b-button
                :disabled="loading"
                class="rounded-pill"
                type="submit"
                form="formDepositCreate"
                variant="primary"
                block
            >
                Transfer to pool
            </b-button>
        </template>
    </base-modal>
</template>

<script lang="ts">
import { IPool, IPools } from '@/store/modules/pools';
import { TERC20 } from '@/types/erc20';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import BaseModal from './BaseModal.vue';

@Component({
    components: {
        BaseModal,
    },
    computed: mapGetters({
        pools: 'pools/all',
    }),
})
export default class BaseModalDepositCreate extends Vue {
    loading = false;
    error = '';
    amount = 0;
    pool: IPool | null = null;
    pools!: IPools;

    @Prop() erc20!: TERC20;

    get filteredPools() {
        return Object.values(this.pools).filter((pool: IPool) => {
            return pool.address && this.erc20.address === pool.token.address && this.erc20.network === pool.network;
        });
    }

    onShow() {
        this.amount = 0;
        this.error = '';
        this.loading = true;
        this.$store.dispatch('pools/list').then(async () => {
            await Promise.all(
                Object.values(this.pools).map((pool: IPool) => this.$store.dispatch('pools/read', pool._id)),
            );
            this.pool = Object.values(this.pools)[0];
            this.loading = false;
        });
    }

    async submit() {
        if (!this.pool) return;

        this.loading = true;

        await this.$store.dispatch('deposits/create', {
            amount: this.amount,
            poolAddress: this.pool.address,
        });

        await this.$store.dispatch('pools/read', this.pool._id);

        this.$bvModal.hide(`modalDepositCreate-${this.erc20._id}`);
        this.loading = false;
    }
}
</script>
<style lang="scss"></style>
