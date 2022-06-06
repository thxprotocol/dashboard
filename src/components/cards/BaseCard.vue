<template>
    <b-skeleton-wrapper :loading="loading">
        <template #loading>
            <b-card class="mb-3 shadow-sm cursor-pointer">
                <b-skeleton animation="fade" class="mb-3" width="75%"></b-skeleton>
                <b-skeleton animation="fade" class="mb-3" width="50%"></b-skeleton>
                <hr />
                <b-skeleton type="button" animation="fade" class="rounded-pill" width="100%"></b-skeleton>
            </b-card>
        </template>
        <b-card class="mb-3" :class="classes" @click="$emit('click')">
            <slot name="card-body"></slot>
        </b-card>
    </b-skeleton-wrapper>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({})
export default class BaseCard extends Vue {
    @Prop() loading!: boolean;
    @Prop() classes!: string;
}
</script>
