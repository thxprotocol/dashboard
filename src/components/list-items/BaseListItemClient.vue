<template>
    <b-card class="shadow-sm mb-2">
        <b-row>
            <b-col md="3">
                <b-form-group class="w-100" label="Client Name" label-class="text-gray">
                    {{ client.name }}
                </b-form-group>
            </b-col>
            <b-col md="3">
                <b-form-group class="w-100" label="Grant Type" label-class="text-gray">
                    {{ client.grantType }}
                </b-form-group>
            </b-col>
            <b-col md="6">
                <b-form-row>
                    <b-col md="3">
                        <label class="text-gray">Client ID</label>
                    </b-col>
                    <b-col>
                        <b-input-group size="sm" class="mb-2">
                            <b-form-input readonly size="sm" :value="client.clientId" />
                            <template #append>
                                <b-button size="sm" variant="dark" v-clipboard:copy="client.clientId">
                                    <i class="fas fa-clipboard m-0"></i>
                                </b-button>
                            </template>
                        </b-input-group>
                    </b-col>
                </b-form-row>
                <b-form-row>
                    <b-col md="3">
                        <label class="text-gray">Client Secret</label>
                    </b-col>
                    <b-col>
                        <b-input-group size="sm">
                            <b-form-input readonly size="sm" :value="clientSecret" />
                            <template #append>
                                <b-button size="sm" variant="dark" v-clipboard:copy="client.clientSecret">
                                    <i class="fas fa-clipboard m-0"></i>
                                </b-button>
                            </template>
                        </b-input-group>
                    </b-col>
                </b-form-row>
            </b-col>
        </b-row>
    </b-card>
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
        this.$store.cache.dispatch('clients/get', { client: this.client, pool: this.pool });
    }
}
</script>
