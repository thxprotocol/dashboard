<template>
    <base-modal
        size="lg"
        :title="`Top up a pool with ${pool.token.symbol}`"
        :id="`modalDepositCreate-${pool.token._id}`"
        @show="onShow"
        :loading="loading"
        :error="error"
    >
        <template #modal-body v-if="!loading && erc20">
            <b-alert variant="info" show v-if="pool.token.type === ERC20Type.Unlimited">
                <i class="fas fa-info-circle mr-2"></i>
                <strong>No need to top up your pool!</strong> Tokens will be minted when they are needed.
            </b-alert>
            <template v-else-if="pool.token.type === ERC20Type.Unknown">
                <b-alert variant="warning" show>
                    <i class="fas fa-info-circle mr-2"></i>
                    This ERC20 has not been created with THX tooling.
                </b-alert>
                <p>
                    Transfer <strong>{{ pool.token.symbol }}</strong> to <strong>{{ pool.address }}</strong> to top up
                    your pool.
                </p>
            </template>
            <form v-on:submit.prevent="submit" id="formDepositCreate">
                <b-card bg-variant="light" class="border-0" body-class="p-5">
                    <b-input-group :append="erc20.symbol" :class="{ 'is-valid': amount <= erc20.adminBalance }">
                        <b-form-input type="number" v-model="amount" />
                    </b-input-group>
                    <small class="text-muted">
                        Your treasury holds <strong>{{ erc20.adminBalance }} {{ erc20.symbol }} </strong>.
                        <b-link @click="amount = erc20.adminBalance">Set max amount</b-link>
                    </small>
                </b-card>
            </form>
        </template>
        <template #btn-primary>
            <b-button
                :disabled="loading || pool.token.type !== ERC20Type.Limited"
                class="rounded-pill"
                type="submit"
                form="formDepositCreate"
                variant="primary"
                block
            >
                Top up {{ amount }} {{ pool.token.symbol }}
            </b-button>
        </template>
    </base-modal>
</template>

<script lang="ts">
import { IPool } from '@/store/modules/pools';
import { ERC20Type, IERC20s } from '@/types/erc20';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import BaseModal from './BaseModal.vue';

@Component({
    components: {
        BaseModal,
    },
    computed: mapGetters({
        pools: 'pools/all',
        erc20s: 'erc20/all',
    }),
})
export default class BaseModalDepositCreate extends Vue {
    loading = false;
    error = '';
    amount = 0;
    erc20s!: IERC20s;
    ERC20Type = ERC20Type;

    @Prop() pool!: IPool;

    get erc20() {
        return this.erc20s[this.pool.token._id];
    }

    onShow() {
        this.loading = true;
        this.amount = 0;
        this.error = '';
        this.$store.dispatch('erc20/read', this.pool.token._id).then(async () => {
            this.loading = false;
        });
    }

    async submit() {
        if (!this.pool) return;

        this.loading = true;

        await this.$store.dispatch('pools/topup', {
            amount: this.amount,
            poolId: this.pool._id,
        });

        await this.$store.dispatch('pools/read', this.pool._id);
        this.$emit('submit');
        this.$bvModal.hide(`modalDepositCreate-${this.erc20._id}`);
        this.loading = false;
    }
}
</script>
<style lang="scss"></style>
