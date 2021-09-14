<template>
    <b-modal
        size="lg"
        title="Create Reward"
        id="modalRewardCreate"
        no-close-on-backdrop
        no-close-on-esc
        centered
        :hide-footer="loading"
    >
        <template v-slot:modal-header v-if="loading">
            <div
                class="w-auto center-center bg-secondary mx-n5 mt-n5 pt-5 pb-5 flex-grow-1 flex-column position-relative"
                :style="`
                    border-top-left-radius: 0.5rem;
                    border-top-right-radius: 0.5rem;
                    background-image: url(${require('../assets/thx_modal-header.webp')});
                `"
            >
                <h2 class="d-block">Give us a moment!</h2>
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
                <strong>We are creating your reward</strong><br /><span class="text-muted">
                    Hang tight, this can take a few seconds...
                </span>
            </p>
        </div>
        <form v-else v-on:submit.prevent="submit" id="formRewardCreate">
            <b-alert variant="danger" show v-if="error">
                {{ error }}
            </b-alert>
            <p>
                Create rewards that can be given to pool members.
                <a :href="docsUrl + '/rewards#1-create-a-reward'" target="_blank">
                    <i class="fas fa-question-circle"></i>
                </a>
            </p>
            <b-card class="border-0" bg-variant="light" body-class="p-5">
                <b-form-group>
                    <label>
                        Withdraw amount
                        <a
                            :href="docsUrl + '/rewards'"
                            v-b-tooltip
                            :title="`The amount of ${assetPool.poolToken.symbol} earned with this reward.`"
                            target="_blank"
                        >
                            <i class="fas fa-question-circle"></i>
                        </a>
                    </label>
                    <b-input-group :append="assetPool.poolToken.symbol">
                        <b-form-input type="number" v-model="rewardWithdrawAmount" />
                    </b-input-group>
                </b-form-group>
                <b-form-group v-if="enableGovernance">
                    <label>
                        Withdraw poll duration
                        <a
                            :href="docsUrl + '/rewards'"
                            v-b-tooltip
                            title="The duration in seconds of the withdraw poll that is started when the rewards is claimed or given."
                            target="_blank"
                        >
                            <i class="fas fa-question-circle"></i>
                        </a>
                    </label>
                    <b-input-group append="Seconds">
                        <b-form-input type="number" v-model="rewardWithdrawDuration" />
                    </b-input-group>
                </b-form-group>
            </b-card>
        </form>
        <template v-slot:modal-footer="{}">
            <b-button
                :disabled="loading"
                class="rounded-pill"
                type="submit"
                variant="primary"
                form="formRewardCreate"
                block
            >
                Add Reward
            </b-button>
        </template>
    </b-modal>
</template>

<script lang="ts">
import { AssetPool } from '@/store/modules/assetPools';
import {
    BAlert,
    BButton,
    BCard,
    BCollapse,
    BDropdown,
    BDropdownItemButton,
    BFormGroup,
    BFormInput,
    BFormRadio,
    BFormSelect,
    BFormSelectOption,
    BInputGroup,
    BLink,
    BModal,
    BSpinner,
} from 'bootstrap-vue';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import { Reward } from '@/store/modules/rewards';

@Component({
    components: {
        'b-modal': BModal,
        'b-alert': BAlert,
        'b-link': BLink,
        'b-card': BCard,
        'b-input-group': BInputGroup,
        'b-dropdown': BDropdown,
        'b-dropdown-item-button': BDropdownItemButton,
        'b-form-radio': BFormRadio,
        'b-form-group': BFormGroup,
        'b-form-input': BFormInput,
        'b-button': BButton,
        'b-collapse': BCollapse,
        'b-form-select': BFormSelect,
        'b-form-select-option': BFormSelectOption,
        'b-spinner': BSpinner,
    },
    computed: mapGetters({
        clients: 'clients/all',
    }),
})
export default class ModalRewardCreate extends Vue {
    docsUrl = process.env.VUE_APP_DOCS_URL;
    loading = false;
    error = '';
    rewardWithdrawAmount = 0;
    rewardWithdrawDuration = 0;

    @Prop() assetPool!: AssetPool;
    @Prop() filteredRewards!: Reward[];
    @Prop() enableGovernance!: boolean;

    async submit(close: boolean) {
        this.loading = true;
        try {
            await this.$store.dispatch('rewards/create', {
                address: this.assetPool.address,
                withdrawAmount: this.rewardWithdrawAmount,
                withdrawDuration: this.rewardWithdrawDuration,
            });

            this.rewardWithdrawAmount = 0;
            this.rewardWithdrawDuration = 0;

            if (close) {
                this.$bvModal.hide(`modalRewardCreate`);
            }
        } catch (e) {
            this.error = 'Could not add the reward.';
        } finally {
            this.loading = false;
        }
    }
}
</script>
<style lang="scss"></style>
