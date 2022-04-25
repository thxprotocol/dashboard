<template>
    <b-link @click="openAddressUrl()" class="text-truncate">
        {{ address }}
    </b-link>
</template>

<script lang="ts">
import { NetworkProvider } from '@/store/modules/pools';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({})
export default class BaseAnchorAddress extends Vue {
    @Prop() address!: string;
    @Prop() network!: NetworkProvider;

    openAddressUrl() {
        const url = `https://${this.network === NetworkProvider.Test ? 'mumbai.' : ''}polygonscan.com/address/${
            this.address
        }`;
        return (window as any).open(url, '_blank').focus();
    }
}
</script>
