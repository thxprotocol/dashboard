<template>
    <base-modal :loading="loading" :error="error" title="Create a payment request" id="modalPaymentCreate">
        <template #modal-body v-if="!loading">
            <b-form-group>
                <template #label>
                    Amount
                    <i
                        class="fas fa-info-circle text-gray"
                        v-b-tooltip
                        title="For precision purposes amounts are always stored in wei, but you can enter them in the format of your choice."
                    ></i
                ></template>
                <b-input-group>
                    <b-form-input type="number" v-model="amount" />
                    <template #append>
                        <b-dropdown :text="`${pool.token.symbol} (${unit})`" variant="primary">
                            <b-dropdown-item :key="key" v-for="(u, key) of units" @click="unit = key">
                                {{ key }}
                            </b-dropdown-item>
                        </b-dropdown>
                    </template>
                </b-input-group>
                <small class="text-muted"> {{ amountInWei }} {{ pool.token.symbol }} (wei)</small>
            </b-form-group>
            <b-form-group label="Success URL">
                <b-form-input v-model="successUrl" />
            </b-form-group>
            <b-form-group label="Fail URL">
                <b-form-input v-model="failUrl" />
            </b-form-group>
            <b-form-group label="Cancel URL">
                <b-form-input v-model="cancelUrl" />
            </b-form-group>
        </template>
        <template #btn-primary>
            <b-button :disabled="loading" class="rounded-pill" @click="submit()" variant="primary" block>
                Create Payment Request
            </b-button>
        </template>
    </base-modal>
</template>

<script lang="ts">
import { IPool } from '@/store/modules/pools';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import BaseFormSelectNetwork from '../form-select/BaseFormSelectNetwork.vue';
import BaseModal from './BaseModal.vue';
import { unitMap, Unit } from 'web3-utils';

@Component({
    components: {
        BaseModal,
        BaseFormSelectNetwork,
    },
    computed: mapGetters({}),
})
export default class BaseModalPaymentCreate extends Vue {
    units: any = unitMap;
    unit: Unit = 'ether';
    loading = false;
    error = '';

    amount = 0;
    successUrl = '';
    failUrl = '';
    cancelUrl = '';

    get amountInWei() {
        return this.amount * this.units[this.unit];
    }

    @Prop() pool!: IPool;

    async submit() {
        this.loading = true;

        const payment = {
            chainId: this.pool.chainId,
            amount: this.amountInWei,
            successUrl: this.successUrl,
            failUrl: this.failUrl,
            cancelUrl: this.cancelUrl,
        };

        await this.$store.dispatch('payments/create', { pool: this.pool, payment });

        this.$bvModal.hide(`modalPaymentCreate`);
        this.loading = false;
    }
}
</script>
<style lang="scss"></style>
