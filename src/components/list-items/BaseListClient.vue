<template>
    <b-row class="mb-3 py-2 bg-light">
        <b-col cols="6" class="d-flex align-items-center">
            <b-form-group class="w-100">
                <label for="clientId"> Client ID </label>
                <div class="input-group">
                    <b-form-input readonly id="clientId" :value="clientId" />
                    <div class="input-group-append">
                        <b-button
                            class="btn btn-primary"
                            type="button"
                            variant="primary"
                            v-b-tooltip
                            v-clipboard:copy="info.clientId"
                            title="Click to copy"
                        >
                            <i class="fas fa-clipboard m-0" style="font-size: 1.2rem"></i>
                        </b-button>
                    </div>
                </div>
            </b-form-group>
        </b-col>
        <b-col cols="6" class="d-flex align-items-center">
            <b-form-group class="w-100">
                <label for="clientSecret"> Client Secret </label>
                <div class="input-group">
                    <b-form-input readonly id="clientSecret" :value="clientSecret" />
                    <div class="input-group-append">
                        <b-button
                            class="btn btn-primary"
                            type="button"
                            variant="primary"
                            v-b-tooltip
                            v-clipboard:copy="info.clientSecret"
                            title="Click to copy"
                        >
                            <i class="fas fa-clipboard m-0" style="font-size: 1.2rem"></i>
                        </b-button>
                    </div>
                </div>
            </b-form-group>
        </b-col>
    </b-row>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { TClient } from '@/store/modules/clients';

export interface TClientInfo {
    clientId: string;
    clientSecret: string;
    requestUris: string[];
}

@Component({})
export default class BaseListClient extends Vue {
    @Prop() client!: TClient;

    info: TClientInfo = { clientId: '', clientSecret: '', requestUris: [] };

    get clientId() {
        return `${this.info.clientId.substring(0, 6)}*************`;
    }

    get clientSecret() {
        return `${this.info.clientSecret.substring(0, 6)}********************`;
    }

    async copyId() {
        await navigator.clipboard.writeText(this.info.clientId);
    }

    async copySecret() {
        await navigator.clipboard.writeText(this.info.clientSecret);
    }

    mounted() {
        const params = {
            clientId: this.client.clientId,
            poolId: this.client.poolId,
            registrationAccessToken: this.client.registrationAccessToken,
        };
        this.$store.dispatch('clients/info', params).then((res) => {
            Vue.set(this, 'info', res);
        });
    }
}
</script>
