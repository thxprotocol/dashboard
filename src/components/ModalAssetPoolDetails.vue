<template>
    <b-modal size="lg" :title="assetPool.title" :id="`modalAssetPoolDetails-${assetPool.address}`">
        <b-overlay :show="loading" rounded="sm">
            <b-form-group>
                <label for="clientId">Connected App:</label>
                <b-form-select v-model="application">
                    <b-form-select-option
                        :value="application"
                        :key="application.clientId"
                        v-for="application of applications"
                    >
                        {{ application.clientName }}
                        ({{ application.clientId }})
                    </b-form-select-option>
                </b-form-select>
            </b-form-group>
            <hr />

            <b-form-group>
                <label for="title">Title:</label>
                <b-form-input id="title" v-model="title" />
            </b-form-group>
            <b-form-group>
                <label for="clientId">Contract Address:</label>
                <b-form-input readonly id="address" v-model="assetPool.address" />
            </b-form-group>
            <b-form-group>
                <b-form-checkbox v-model="bypassPolls"> Enable asset pool governance. </b-form-checkbox>
            </b-form-group>
            <b-card>
                {{ assetPool.poolToken.name }}
                <strong>
                    {{ assetPool.poolToken.balance }}
                    {{ assetPool.poolToken.symbol }}
                </strong>
            </b-card>
        </b-overlay>

        <template v-slot:modal-footer="{ cancel }">
            <b-link @click="cancel()"> Cancel</b-link>
            <b-button :disabled="loading" variant="primary" class="btn-rounded" @click="update()"> Update </b-button>
        </template>
    </b-modal>
</template>

<script lang="ts">
import { Application, IApplications } from '@/store/modules/applications';
import { AssetPool } from '@/store/modules/assetPools';
import {
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
    bypassPolls = false;
    title = '';

    @Prop() assetPool!: AssetPool;

    applications!: IApplications;

    mounted() {
        this.application =
            Object.values(this.applications).find((app: Application) => app.clientId === this.assetPool.aud) || null;
        this.title = this.assetPool.title;
        this.bypassPolls = this.assetPool.bypassPolls;
    }

    async update() {
        this.loading = true;
        try {
            await this.$store.dispatch('assetPools/update', {
                address: this.assetPool.address,
                title: this.title,
                aud: this.application?.clientId,
                bypassPolls: this.bypassPolls,
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
