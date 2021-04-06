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

    @Prop() rat!: string;

    applications!: any;

    async mounted() {
        this.loading = true;

        try {
            await this.$store.dispatch('applications/read', this.rat);

            this.clientName = this.applications[this.rat].clientName;
            this.clientId = this.applications[this.rat].clientId;
            this.clientSecret = this.applications[this.rat].clientSecret;
            this.requestUris = this.applications[this.rat].requestUris;
        } catch (e) {
            console.error(e);
        } finally {
            this.loading = false;
        }
    }

    async remove() {
        try {
            await this.$store.dispatch('applications/remove', this.rat);
            await this.$store.dispatch('account/getProfile');
        } catch (e) {
            console.error(e);
        } finally {
            this.loading = false;
        }
    }
}
</script>
