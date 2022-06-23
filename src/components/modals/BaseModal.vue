<template>
    <b-modal
        size="lg"
        @show="$emit('show')"
        :title="title"
        :id="id"
        no-close-on-backdrop
        centered
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
                <h2 class="d-block">Almost there!</h2>
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
                <strong>We are deploying your smart contract!</strong><br /><span class="text-muted">
                    Hang tight, this can take about 20 seconds...
                </span>
            </p>
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
    @Prop() title!: string;
    @Prop() loading!: boolean;
    @Prop() error!: string;
}
</script>
