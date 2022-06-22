<template>
    <b-skeleton-wrapper :loading="loading">
        <template #loading>
            <b-card class="mb-3 shadow-sm cursor-pointer">
                <div class="w-100 py-3 text-gray text-center" v-if="isDeploying">
                    <b-spinner variant="gray" class="mb-2" />
                    <p class="m-0">We are deploying your smart contract. Give us a moment!</p>
                </div>
                <template v-else>
                    <b-skeleton animation="fade" class="mb-3" width="75%"></b-skeleton>
                    <b-skeleton animation="fade" class="mb-3" width="50%"></b-skeleton>
                    <hr />
                    <b-skeleton type="button" animation="fade" class="rounded-pill" width="100%"></b-skeleton>
                </template>
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
    @Prop() isDeploying!: boolean;
    @Prop() loading!: boolean;
    @Prop() classes!: string;
}
</script>
