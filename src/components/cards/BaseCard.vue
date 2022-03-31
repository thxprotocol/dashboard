<template>
    <b-skeleton-wrapper :loading="isLoading" @error="error = $event" @loading="onIsLoading($event)">
        <template #loading>
            <b-card class="mt-3 mb-3 shadow-sm cursor-pointer">
                <b-skeleton animation="fade" width="65%"></b-skeleton>
                <hr />
                <b-skeleton animation="fade" width="55%"></b-skeleton>
                <b-skeleton animation="fade" class="mb-3" width="70%"></b-skeleton>
                <b-skeleton type="button" animation="fade" class="rounded-pill" width="100%"></b-skeleton>
            </b-card>
        </template>
        <b-card class="mb-3">
            <b-alert variant="danger" show v-if="error">{{ error }}</b-alert>
            <slot :clicked="handleClick"></slot>
        </b-card>
    </b-skeleton-wrapper>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class BaseCard extends Vue {
    handleClick(test: any) {
        console.log(test);

        debugger;
        // isLoading = $event;
    }
}
</script>
