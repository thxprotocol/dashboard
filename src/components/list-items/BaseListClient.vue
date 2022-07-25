<template>
    <b-row class="">
        <b-col cols="6" class="d-flex align-items-center">
            <b-form-group class="w-100">
                <label for="clientId"> Client ID </label>
                <b-input-group size="sm">
                    <b-form-input readonly size="sm" id="clientId" :value="clientId" />
                    <template #append>
                        <b-button
                            size="sm"
                            class="btn btn-primary"
                            type="button"
                            variant="primary"
                            v-b-tooltip
                            v-clipboard:copy="client.clientId"
                            title="Click to copy"
                        >
                            <i class="fas fa-clipboard m-0" style="font-size: 1.2rem"></i>
                        </b-button>
                    </template>
                </b-input-group>
            </b-form-group>
        </b-col>
        <b-col cols="6" class="d-flex align-items-center">
            <b-form-group class="w-100">
                <label for="clientSecret"> Client Secret </label>
                <b-input-group size="sm">
                    <b-form-input readonly size="sm" id="clientSecret" :value="clientSecret" />
                    <template #append>
                        <b-button
                            size="sm"
                            class="btn btn-primary"
                            type="button"
                            variant="primary"
                            v-b-tooltip
                            v-clipboard:copy="client.clientSecret"
                            title="Click to copy"
                        >
                            <i class="fas fa-clipboard m-0"></i>
                        </b-button>
                    </template>
                </b-input-group>
            </b-form-group>
        </b-col>
    </b-row>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { TClient } from '@/store/modules/clients';
import { IPool } from '@/store/modules/pools';

export interface TClientInfo {
    clientId: string;
    clientSecret: string;
    requestUris: string[];
}

@Component({})
export default class BaseListClient extends Vue {
    @Prop() client!: TClient;
    @Prop() pool!: IPool;

    get clientId() {
        return `${this.client.clientId.substring(0, 6)}*************`;
    }

    get clientSecret() {
        return `${this.client.clientSecret.substring(0, 6)}********************`;
    }

    mounted() {
        this.$store.dispatch('clients/get', { client: this.client, pool: this.pool });
    }
}
</script>
