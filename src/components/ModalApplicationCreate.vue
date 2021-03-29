<template>
    <b-modal size="lg" title="Create Application" id="modalApplicationCreate">
        <form v-on:submit.prevent="submit" id="formApplicationCreate">
            <b-form-group>
                <label for="appTitle">Title:</label>
                <b-form-input id="appTitle" v-model="title" />
            </b-form-group>
        </form>
        <template v-slot:modal-footer="{ cancel }">
            <b-link class="mr-3" variant="dark" @click="cancel()"> Cancel </b-link>
            <b-button class="btn-rounded" type="submit" variant="primary" form="formApplicationCreate">
                Create Application
            </b-button>
        </template>
    </b-modal>
</template>

<script lang="ts">
import { BButton, BCard, BCollapse, BFormGroup, BFormInput, BFormRadio, BLink, BModal } from 'bootstrap-vue';
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
    },
})
export default class ModalApplicationCreate extends Vue {
    title = '';
    tokenOption = 0;
    erc20Address = '';
    erc20Name = '';
    erc20Symbol = '';
    erc20TotalSupply = 0;

    async submit() {
        try {
            const data = {
                title: this.title,
            };
            debugger;
            await this.$store.dispatch('applications/create', data);
        } catch (e) {
            console.error(e);
        }
    }
}
</script>
