<template>
    <b-modal size="lg" :title="assetPool.title" :id="`modalAssetPoolDetails-${assetPool.address}`">
        <b-overlay :show="loading" class="m-n3 pt-3 pb-3">
            <div class="ml-3 mr-3">
                <b-form-group>
                    <label for="clientId">Connected App:</label>
                    <b-form-select v-model="application">
                        <b-form-select-option
                            :value="application"
                            :key="application.clientId"
                            v-for="application of applications"
                        >
                            {{ application.clientName }}
                        </b-form-select-option>
                    </b-form-select>
                </b-form-group>
                <hr />

                <b-form-group>
                    <label for="title">Title:</label>
                    <b-form-input id="title" v-model="title" />
                </b-form-group>
                <b-form-group>
                    <label for="clientId">
                        <b-badge variant="primary" v-if="network === 0">Test</b-badge>
                        <b-badge variant="success" v-if="network === 1">Main</b-badge>
                        Contract Address:
                    </label>
                    <b-form-input readonly id="address" v-model="assetPool.address" />
                </b-form-group>
                <b-form-group>
                    <b-form-checkbox v-model="enableGovernance"
                        ><strong>Enable governance</strong>
                        <p class="text-muted">
                            Governance will require a voting procedure for high risk transactions.
                        </p></b-form-checkbox
                    >
                </b-form-group>
                <b-card>
                    <strong>
                        {{ assetPool.poolToken.balance }}
                        {{ assetPool.poolToken.symbol }}
                    </strong>
                    {{ assetPool.poolToken.name }}
                </b-card>
            </div>
        </b-overlay>

        <template v-slot:modal-footer="{ cancel }">
            <b-link @click="cancel()"> Cancel</b-link>
            <b-button :disabled="loading" variant="primary" class="btn-rounded" @click="update()"> Update </b-button>
        </template>
    </b-modal>
</template>

<script lang="ts">
import { Application, IApplications } from '@/store/modules/applications';
import { AssetPool, NetworkProvider } from '@/store/modules/assetPools';
import {
    BBadge,
    BButton,
    BCard,
    BCollapse,
    BFormCheckbox,
    BFormGroup,
    BFormInput,
    BFormSelect,
    BFormSelectOption,
    BLink,
    BModal,
    BOverlay,
} from 'bootstrap-vue';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';

@Component({
    components: {
        'b-modal': BModal,
        'b-link': BLink,
        'b-card': BCard,
        'b-badge': BBadge,
        'b-form-checkbox': BFormCheckbox,
        'b-form-group': BFormGroup,
        'b-form-select': BFormSelect,
        'b-form-select-option': BFormSelectOption,
        'b-form-input': BFormInput,
        'b-button': BButton,
        'b-collapse': BCollapse,
        'b-overlay': BOverlay,
    },
    computed: mapGetters({
        assetPools: 'assetPools/all',
        applications: 'applications/all',
    }),
})
export default class ModalAssetPoolDetails extends Vue {
    loading = false;
    application: Application | null = null;
    enableGovernance = true;
    network: NetworkProvider = NetworkProvider.Test;
    title = '';

    @Prop() assetPool!: AssetPool;

    applications!: IApplications;

    mounted() {
        this.application =
            Object.values(this.applications).find((app: Application) => app.clientId === this.assetPool.aud) || null;
        this.title = this.assetPool.title;
        this.enableGovernance = !this.assetPool.bypassPolls;
        this.network = this.assetPool.network;
    }

    async update() {
        this.loading = true;
        try {
            await this.$store.dispatch('assetPools/update', {
                address: this.assetPool.address,
                title: this.title,
                aud: this.application?.clientId,
                bypassPolls: !this.enableGovernance,
                network: this.network,
            });

            await this.$store.dispatch('assetPools/read', this.assetPool.address);

            this.$bvModal.hide(`modalAssetPoolDetails-${this.assetPool.address}`);
        } catch (e) {
            console.error(e);
        } finally {
            this.loading = false;
        }
    }
}
</script>
