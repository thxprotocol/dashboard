<template>
    <b-modal
        size="lg"
        @show="$emit('show')"
        :title="title"
        :id="id"
        no-close-on-backdrop
        centered
        :body-bg-variant="loading ? 'light' : 'white'"
        :hide-footer="loading"
    >
        <template v-slot:modal-header v-if="loading">
            <div class="w-100 center-center bg-light">
                <b-spinner variant="primary"></b-spinner>
            </div>
        </template>
        <b-alert variant="danger" show v-if="error">
            {{ error }}
        </b-alert>
        <slot name="modal-body"></slot>
        <template v-slot:modal-footer="{}">
            <slot name="btn-primary"></slot>
        </template>
    </b-modal>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({})
export default class BaseModal extends Vue {
    @Prop() id!: string;
    @Prop() title!: string;
    @Prop() loading!: boolean;
    @Prop() error!: string;
}
</script>
