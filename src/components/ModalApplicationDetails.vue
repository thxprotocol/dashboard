<template>
    <b-modal size="lg" :title="clientName" :id="`modalApplicationDetails-${clientId}`">
        <b-overlay :show="loading" rounded="sm">
            <b-form-group>
                <label for="clientId">Client ID:</label>
                <b-form-input readonly id="clientId" v-model="clientId" />
            </b-form-group>
            <b-form-group>
                <label for="clientId">Client Secret:</label>
                <b-form-input readonly id="clientSecret" v-model="clientSecret" />
            </b-form-group>
            <b-form-group>
                <label for="requestUris">Request URI's:</label>
                <div :key="uri" v-for="uri of requestUris">
                    <b-form-input readonly id="requestUris" :value="uri" />
                </div>
            </b-form-group>
        </b-overlay>
        <template v-slot:modal-footer="{ ok }">
            <b-button variant="primary" class="btn-rounded" @click="ok()"> Close </b-button>
        </template>
    </b-modal>
</template>

<script lang="ts">
import { BButton, BCard, BCollapse, BFormGroup, BFormInput, BFormRadio, BLink, BModal, BOverlay } from 'bootstrap-vue';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
    components: {
        'b-modal': BModal,
        'b-link': BLink,
        'b-card': BCard,
        'b-form-radio': BFormRadio,
        'b-form-group': BFormGroup,
        'b-form-input': BFormInput,
        'b-button': BButton,
        'b-collapse': BCollapse,
        'b-overlay': BOverlay,
    },
})
export default class ModalApplicationDetails extends Vue {
    loading = false;

    @Prop() clientName!: string;
    @Prop() clientId!: string;
    @Prop() clientSecret!: string;
    @Prop() requestUris!: string[];
}
</script>
