<template>
    <div>
        <b-row class="mb-3">
            <b-col class="d-flex align-items-center">
                <h2 class="mb-0">Payments</h2>
            </b-col>
            <b-col class="d-flex justify-content-end">
                <b-button v-b-modal="'modalPaymentCreate'" class="rounded-pill" variant="primary">
                    <i class="fas fa-plus mr-2"></i>
                    <span class="d-none d-md-inline">Create Payment Request</span>
                </b-button>
                <base-modal-payment-create :pool="pool" />
            </b-col>
        </b-row>
        <base-nothing-here
            v-if="paymentsForPool && !paymentsForPool.length"
            item="a payment request"
            @clicked="$bvModal.show('modalPaymentCreate')"
        />
        <b-card class="shadow-sm" v-else>
            <b-row class="pt-2 pb-2">
                <div class="col-md-3">
                    <strong>Payment ID</strong>
                </div>
                <div class="col-md-2">
                    <strong>Amount</strong>
                </div>
                <div class="col-md-2">
                    <strong>Status</strong>
                </div>
                <div class="col-md-4">
                    <strong>Created/Updated</strong>
                </div>
            </b-row>
            <b-form-group class="mb-0" :key="payment._id" v-for="payment of paymentsForPool">
                <hr />
                <b-row>
                    <b-col md="3">{{ payment._id }}</b-col>
                    <b-col md="2">{{ payment.amount }}</b-col>
                    <b-col md="2">{{ payment.state }}</b-col>
                    <b-col md="4">
                        {{ payment.createdAt }}
                        <br />
                        {{ payment.updatedAt }}
                    </b-col>
                </b-row>
                <hr />
                <b-col md="12">{{ payment.paymentUrl }}</b-col>
                <b-col md="12">{{ payment.successUrl }}</b-col>
                <b-col md="12">{{ payment.cancelUrl }}</b-col>
                <b-col md="12">{{ payment.failUrl }}</b-col>
            </b-form-group>
        </b-card>
    </div>
</template>

<script lang="ts">
import { IPools } from '@/store/modules/pools';
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import { IPayments } from '@/types/IPayments';
import BaseModalPaymentCreate from '@/components/modals/BaseModalPaymentCreate.vue';
import BaseNothingHere from '@/components/BaseNothingHere.vue';

@Component({
    components: {
        BaseNothingHere,
        BaseModalPaymentCreate,
    },
    computed: mapGetters({
        pools: 'pools/all',
        payments: 'payments/all',
    }),
})
export default class Payments extends Vue {
    loading = false;
    pools!: IPools;
    payments!: IPayments;

    get pool() {
        return this.pools[this.$route.params.id];
    }

    get paymentsForPool() {
        if (!this.payments[this.$route.params.id]) return [];
        return Object.values(this.payments[this.$route.params.id]);
    }

    async mounted() {
        await this.$store.dispatch('payments/list', this.pool);
    }
}
</script>
