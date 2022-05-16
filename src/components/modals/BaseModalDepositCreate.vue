<template>
    <b-modal
        size="lg"
        title="Add a Deposit"
        id="modalDepositCreate"
        no-close-on-backdrop
        no-close-on-esc
        centered
        @show="onShow()"
        :hide-footer="loading"
    >
        <template v-slot:modal-header v-if="loading">
            <div
                class="w-auto center-center bg-secondary mx-n5 mt-n5 pt-5 pb-5 flex-grow-1 flex-column position-relative"
                :style="`
                    border-top-left-radius: 0.5rem;
                    border-top-right-radius: 0.5rem;
                    background-image: url(${require('@/assets/thx_modal-header.webp')});
                `"
            >
                <h2 class="d-block">Uno momento!</h2>
                <div
                    class="shadow-sm bg-white p-2 rounded-pill d-flex align-items-center justify-content-center"
                    style="position: absolute; bottom: 0; left: 50%; margin-left: -32px; margin-bottom: -32px"
                >
                    <b-spinner size="lg" style="width: 3rem; height: 3rem" variant="primary"></b-spinner>
                </div>
            </div>
        </template>
        <div class="pt-5 pb-3" v-if="loading">
            <p class="text-center">
                <strong>We are sending your deposit</strong><br /><span class="text-muted">
                    This should be done real soon.
                </span>
            </p>
        </div>
        <form v-else v-on:submit.prevent="submit" id="formDepositCreate">
            <b-alert variant="danger" show v-if="error">
                {{ error }}
            </b-alert>
            <b-card bg-variant="light" class="border-0" body-class="p-5" v-else>
                <b-form-group>
                    <label>Amount </label
                    ><a title="The amount of the Deposit expressed in WEI" target="_blank"
                        ><i class="fas fa-question-circle" aria-hidden="true"></i
                    ></a>
                    <b-form-input v-model="amount" placeholder="0" type="number" min="1" />
                </b-form-group>
            </b-card>
        </form>
        <template v-slot:modal-footer="{}">
            <b-button
                :disabled="loading"
                class="rounded-pill"
                type="submit"
                variant="primary"
                form="formDepositCreate"
                block
            >
                Send Deposit
            </b-button>
        </template>
    </b-modal>
</template>

<script lang="ts">
import { AssetPool } from '@/store/modules/pools';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';

@Component({
    computed: mapGetters({
        clients: 'clients/all',
    }),
})
export default class ModalDepositCreate extends Vue {
    loading = false;
    error = '';
    amount = 0;

    @Prop() pool!: AssetPool;

    onShow() {
        this.amount = 0;
    }
    
    async submit() {
        this.loading = true;
        try {
            await this.$store.dispatch('deposits/create', {
                amount: this.amount,
                poolAddress: this.pool.address,
            });
            this.$emit('submit');
            this.$bvModal.hide(`modalDepositCreate`);
        } catch (e) {
            this.error = 'Could not send the Deposit';
        } finally {
            this.loading = false;
        }
    }
}
</script>
<style lang="scss"></style>
