<template>
    <base-modal
        size="lg"
        title="Add a Deposit"
        id="modalDepositCreate"
        @show="onShow"
        :hide-footer="loading"
        :loading="loading"
        :error="error" 
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
    <template #modal-body v-if="!loading">
        <form v-on:submit.prevent="submit" id="formDepositCreate">
            <b-alert variant="danger" show v-if="error && error.length > 0">
                {{ error }}
            </b-alert>
            <b-card bg-variant="light" class="border-0" body-class="p-5" v-else>
                <b-input-group :append="pool.token.symbol">
                    <b-form-input type="number" v-model="amount" />
                </b-input-group>
            </b-card>
        </form>
    </template>
    
    <template #btn-primary>
            <b-button
                :disabled="loading || error != ''"
                class="rounded-pill"
                type="submit"
                form="formDepositCreate"
                variant="primary"
                block
            >
                 Send Deposit
            </b-button>
        </template>
    </base-modal>
</template>

<script lang="ts">
import { AssetPool } from '@/store/modules/pools';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import BaseModal from './BaseModal.vue';

@Component({
    components: {
        BaseModal
    },
    computed: mapGetters({
        pools: 'pools/all',
    }),
})
export default class BaseModalDepositCreate extends Vue {
    loading = false;
    error = '';
    amount = 0;

    @Prop() pool!: AssetPool;

    onShow() {
        this.amount = 0;
        this.error = '';
    }

    async submit() {
        this.loading = true;
        try {
            await this.$store.dispatch('deposits/create', {
                amount: this.amount,
                poolAddress: this.pool.address,
            });
            this.$emit('submit');
            await this.$store.dispatch('pools/read', this.pool.address);
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
