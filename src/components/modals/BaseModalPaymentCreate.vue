<template>
    <base-modal :loading="loading" :error="error" title="Create a payment request" id="modalPaymentCreate">
        <template #modal-body v-if="!loading">
            <b-form-group label="Amount (wei)">
                <b-form-input type="number" v-model="amountInWei" />
            </b-form-group>
            <b-form-group label="Return URL">
                <b-form-input v-model="returnUrl" />
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

@Component({
    components: {
        BaseModal,
        BaseFormSelectNetwork,
    },
    computed: mapGetters({}),
})
export default class BaseModalPaymentCreate extends Vue {
    loading = false;
    error = '';

    amountInWei = 0;
    returnUrl = '';

    @Prop() pool!: IPool;

    async submit() {
        this.loading = true;

        const payment = {
            amount: this.amountInWei,
            returnUrl: this.returnUrl,
        };

        await this.$store.dispatch('payments/create', { pool: this.pool, payment });

        this.$bvModal.hide(`modalPaymentCreate`);
        this.loading = false;
    }
}
</script>
<style lang="scss"></style>
