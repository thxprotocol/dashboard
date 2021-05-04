<template>
    <b-modal size="lg" title="Create Application" id="modalApplicationCreate">
        <b-overlay :show="loading" rounded="sm">
            <form v-on:submit.prevent="submit" id="formApplicationCreate">
                <b-form-group>
                    <label for="appTitle">Title:</label>
                    <b-form-input id="appTitle" v-model="title" />
                </b-form-group>
            </form>
        </b-overlay>
        <template v-slot:modal-footer="{ cancel }">
            <b-link class="mr-3" variant="dark" @click="cancel()"> Cancel </b-link>
            <b-button
                :disabled="loading"
                class="btn-rounded"
                type="submit"
                variant="primary"
                form="formApplicationCreate"
            >
                Create Application
            </b-button>
        </template>
    </b-modal>
</template>

<script lang="ts">
import { BButton, BCard, BCollapse, BFormGroup, BFormInput, BFormRadio, BLink, BModal, BOverlay } from 'bootstrap-vue';
import { Component, Vue } from 'vue-property-decorator';

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
export default class ModalApplicationCreate extends Vue {
    title = '';
    requestUri = '';
    loading = false;
    async submit() {
        this.loading = true;
        try {
            const data = {
                title: this.title,
                requestUri: this.requestUri,
            };

            await this.$store.dispatch('applications/create', data);
            await this.$store.dispatch('account/getProfile');

            this.$bvModal.hide(`modalApplicationCreate`);
        } catch (e) {
            console.error(e);
        } finally {
            this.loading = false;
        }
    }
}
</script>
