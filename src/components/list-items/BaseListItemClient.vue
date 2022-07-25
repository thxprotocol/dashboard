<template>
    <b-row class="bg-light pt-1 mb-1">
        <b-col md="6" class="d-flex align-items-center">
            <b-form-group class="w-100" label="Client Name" label-class="text-gray">
                {{ client.name }}
            </b-form-group>
        </b-col>
        <b-col md="6" class="d-flex align-items-center">
            <b-form-group class="w-100" label="Grant Type" label-class="text-gray">
                {{ client.grantType }}
            </b-form-group>
        </b-col>
        <b-col md="6" class="d-flex align-items-center">
            <b-form-group class="w-100" label="Client ID" label-class="text-gray">
                <b-input-group size="sm">
                    <b-form-input readonly size="sm" :value="client.clientId" />
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
        <b-col md="6" class="d-flex align-items-center">
            <b-form-group class="w-100" label="Client Secret" label-class="text-gray">
                <b-input-group size="sm">
                    <b-form-input readonly size="sm" :value="clientSecret" />
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
export default class BaseListItemClient extends Vue {
    @Prop() client!: TClient;
    @Prop() pool!: IPool;

    get clientSecret() {
        return (
            this.client.clientSecret &&
            Array.from({ length: this.client.clientSecret.length })
                .map(() => '•')
                .join('')
        );
    }

    mounted() {
        this.$store.dispatch('clients/get', { client: this.client, pool: this.pool });
    }
}
</script>
