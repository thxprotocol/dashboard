<template>
    <b-modal size="lg" :title="`Delete ${subject}`" :id="id">
        <b-overlay :show="loading" rounded="sm">
            <p>
                Are you sure to delete the <strong>{{ subject }}</strong
                >? This action can not be undone.
            </p>
        </b-overlay>

        <template v-slot:modal-footer="{ cancel }">
            <b-link @click="cancel()"> Cancel</b-link>
            <b-button :disabled="loading" variant="danger" class="btn-rounded" @click="remove()"> Remove </b-button>
        </template>
    </b-modal>
</template>

<script lang="ts">
import { BButton, BLink, BModal, BOverlay } from 'bootstrap-vue';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
    components: {
        'b-modal': BModal,
        'b-link': BLink,
        'b-button': BButton,
        'b-overlay': BOverlay,
    },
})
export default class ModalDelete extends Vue {
    loading = false;

    @Prop() id!: string;
    @Prop() subject!: string;
    @Prop() call!: any;

    async remove() {
        this.loading = true;

        try {
            await this.call();

            this.$bvModal.hide(this.id);
        } catch (e) {
            console.error(e);
        } finally {
            this.loading = false;
        }
    }
}
</script>
