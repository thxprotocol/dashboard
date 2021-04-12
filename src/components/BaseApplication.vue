<template>
    <b-overlay :show="loading" rounded="sm">
        <b-card :title="clientName" class="mt-3 mb-3">
            <code class="mb-3 d-block">
                {{ clientId }}
            </code>

            <template #footer>
                <div class="text-right">
                    <b-link class="text-danger small mr-3" size="sm" href="#" v-b-modal="`modalDelete-${clientId}`">
                        Remove
                    </b-link>
                    <b-button
                        variant="primary"
                        class="btn-rounded"
                        size="sm"
                        v-b-modal="`modalApplicationDetails-${clientId}`"
                    >
                        Details
                    </b-button>
                </div>
            </template>
            <modal-delete :id="`modalDelete-${clientId}`" :call="remove" :subject="clientName" />
            <modal-application-details
                :clientName="clientName"
                :clientId="clientId"
                :clientSecret="clientSecret"
                :requestUris="requestUris"
            />
        </b-card>
    </b-overlay>
</template>

<script lang="ts">
import { Application } from '@/store/modules/applications';
import { BButton, BCard, BLink, BOverlay } from 'bootstrap-vue';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import ModalApplicationDetails from './ModalApplicationDetails.vue';
import ModalDelete from './ModalDelete.vue';

@Component({
    components: {
        'b-link': BLink,
        'b-button': BButton,
        'b-card': BCard,
        'b-overlay': BOverlay,
        'modal-delete': ModalDelete,
        'modal-application-details': ModalApplicationDetails,
    },
    computed: mapGetters({
        applications: 'applications/all',
    }),
})
export default class BaseApplication extends Vue {
    loading = false;

    clientName = '';
    clientId = '';
    clientSecret = '';
    requestUris = '';

    @Prop() app!: Application;

    applications!: any;

    async mounted() {
        this.clientName = this.app.clientName;
        this.clientId = this.app.clientId;
        this.clientSecret = this.app.clientSecret;
        this.requestUris = this.app.requestUris;
    }

    async remove() {
        try {
            const r = await this.$store.dispatch('applications/remove', this.app.registrationAccessToken);

            if (r && r.response.data.error) {
                return r.response.data;
            }
        } catch (e) {
            console.error(e);
        } finally {
            this.loading = false;
        }
    }
}
</script>
