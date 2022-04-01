<template>
    <b-badge class="p-2" :class="classes" :variant="variant">
        {{ label }}
    </b-badge>
</template>

<script lang="ts">
import { NetworkProvider } from '@/store/modules/assetPools';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({})
export default class BaseBadgeNetwork extends Vue {
    variant = '';
    label = '';
    classes = {};

    @Prop() network!: NetworkProvider;

    mounted() {
        this.variant = this.network === NetworkProvider.Main ? 'primary' : 'gray';
        this.label = this.network === NetworkProvider.Main ? 'Polygon Main' : 'Polygon Mumbai';
        this.classes = { 'text-white': this.network === NetworkProvider.Test };
    }
}
</script>
