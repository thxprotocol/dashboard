<template>
    <b-modal
        :size="size || 'lg'"
        @show="$emit('show')"
        :title="title"
        :id="id"
        no-close-on-backdrop
        centered
        :body-bg-variant="loading ? 'light' : 'white'"
        :hide-footer="loading"
        :hide-header="loading"
    >
        <div class="w-100 center-center bg-light py-3" v-if="loading">
            <div class="text-center">
                <b-spinner variant="gray" /><br />
                <strong class="text-gray">Working on it...</strong>
            </div>
        </div>
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
    @Prop() size!: string;
    @Prop() title!: string;
    @Prop() loading!: boolean;
    @Prop() error!: string;
    @Prop() hideFooter!: boolean;
}
</script>
