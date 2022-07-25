<template>
    <base-modal :error="error" title="Create Client" id="modalClientCreate">
        <template #modal-body>
            <form v-on:submit.prevent="submit" id="formClientCreate">
                <b-card bg-variant="light" class="border-0" body-class="p-5">
                    <b-row class="mb-2">
                        <b-col>
                            <b-form-group>
                                <label for="erc20Address">Name:*</label>
                                <b-form-input id="erc20Name" v-model="name" placeholder="XYZ Network Token" />
                            </b-form-group>
                        </b-col>
                    </b-row>
                    <b-row class="mb-2">
                        <b-col>
                            <label> Grant Type:*</label>
                            <b-dropdown variant="link" class="dropdown-select bg-white">
                                <template #button-content>
                                    <div>
                                        {{ grantType }}
                                    </div>
                                </template>
                                <b-dropdown-item-button @click="onGrantClick('authorization_code')">
                                    authorization_code
                                </b-dropdown-item-button>
                                <b-dropdown-item-button @click="onGrantClick('client_credentials')">
                                    client_credentials
                                </b-dropdown-item-button>
                            </b-dropdown>
                        </b-col>
                    </b-row>
                    <b-row v-if="grantType === 'authorization_code'">
                        <b-col>
                            <b-form-group>
                                <label for="clientRedirectUrl">Redirect URI</label>
                                <b-form-input
                                    id="clientRedirectUrl"
                                    v-model="redirectUri"
                                    placeholder="https://thx.network/redirect"
                                />
                            </b-form-group>
                        </b-col>
                        <b-col>
                            <b-form-group>
                                <label for="requestURI">Request URI</label>
                                <b-form-input
                                    id="requestURI"
                                    v-model="requestUri"
                                    placeholder="https://thx.network/auth"
                                />
                            </b-form-group>
                        </b-col>
                    </b-row>
                </b-card>
            </form>
        </template>
        <template #btn-primary>
            <b-button :disabled="!isValid" type="submit" form="formClientCreate" variant="primary" block>
                Submit
            </b-button>
        </template>
    </base-modal>
</template>

<script lang="ts">
import { AxiosError } from 'axios';
import { Component, Prop, Vue } from 'vue-property-decorator';
import BaseModal from './BaseModal.vue';

type GrantType = 'authorization_code' | 'client_credentials';

@Component({
    components: {
        BaseModal,
    },
})
export default class BaseModalClientCreate extends Vue {
    @Prop() poolId!: string;
    @Prop() onSubmit!: () => void;

    name = '';
    grantType: GrantType = 'client_credentials';
    redirectUri = '';
    requestUri = '';

    error = '';

    get isValid() {
        return this.name !== '';
    }

    async onGrantClick(grant: GrantType) {
        this.grantType = grant;
        this.redirectUri = '';
        this.requestUri = '';
    }

    async submit() {
        try {
            await this.$store.dispatch('clients/create', {
                name: this.name,
                poolId: this.poolId,
                grantType: this.grantType,
                redirectUri: this.redirectUri,
                requestUri: this.requestUri,
            });

            this.onSubmit();

            this.name = '';
            this.grantType = 'client_credentials';
            this.redirectUri = '';
            this.requestUri = '';

            this.$bvModal.hide(`modalClientCreate`);
        } catch (error) {
            this.error = (error as AxiosError).response?.data.error.message || 'Could not create your token.';
        }
    }
}
</script>