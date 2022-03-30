<template>
    <b-modal
        size="lg"
        title="Create Widget"
        id="modalWidgetCreate"
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
                <strong>We are assembling your widget</strong><br /><span class="text-muted">
                    This should be done real soon.
                </span>
            </p>
        </div>
        <form v-else v-on:submit.prevent="submit" id="formWidgetCreate">
            <b-alert variant="danger" show v-if="error">
                {{ error }}
            </b-alert>
            <b-card bg-variant="light" class="border-0" body-class="p-5" v-else>
                <b-form-group>
                    <label>Select widget</label>
                    <b-form-select v-model="widgetType">
                        <b-form-select-option :value="0"> Claim Button </b-form-select-option>
                    </b-form-select>
                </b-form-group>
                <b-form-group>
                    <label>Select reward</label>
                    <b-form-select v-model="widgetReward">
                        <b-form-select-option :key="reward.id" v-for="reward of filteredRewards" :value="reward">
                            #{{ reward.id }} ({{ reward.withdrawAmount }} {{ assetPool.poolToken.symbol }})
                        </b-form-select-option>
                    </b-form-select>
                </b-form-group>
                <b-form-group>
                    <label>Page URL</label>
                    <b-form-input v-model="widgetRequestUri" placeholder="http://localhost:8080" />
                </b-form-group>
            </b-card>
        </form>
        <template v-slot:modal-footer="{}">
            <b-button
                :disabled="loading"
                class="rounded-pill"
                type="submit"
                variant="primary"
                form="formWidgetCreate"
                block
            >
                Add Widget
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
export default class ModalWidgetCreate extends Vue {
    docsUrl = process.env.VUE_APP_DOCS_URL;
    loading = false;
    error = '';

    widgetType = 0;
    widgetReward: Reward | null = null;
    widgetRequestUri = '';

    @Prop() assetPool!: AssetPool;
    @Prop() filteredRewards!: Reward[];

    onShow() {
        this.widgetType = 0;
        this.widgetReward = this.filteredRewards[0];
    }

    async submit() {
        this.loading = true;
        try {
            await this.$store.dispatch('widgets/create', {
                requestUris: [this.widgetRequestUri],
                redirectUris: [this.widgetRequestUri],
                postLogoutRedirectUris: [this.widgetRequestUri],
                metadata: {
                    rewardId: this.widgetReward?.id,
                    poolAddress: this.assetPool.address,
                },
            });
            this.$emit('submit');
            this.$bvModal.hide(`modalWidgetCreate`);
        } catch (e) {
            this.error = 'Could not add the reward.';
        } finally {
            this.loading = false;
        }
    }
}
</script>
<style lang="scss"></style>