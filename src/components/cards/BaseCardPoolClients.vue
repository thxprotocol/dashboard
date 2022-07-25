<template>
    <b-card class="shadow-sm mb-5">
        <b-row class="justify-content-end mb-3">
            <b-button variant="primary" @click="$bvModal.show('modalClientCreate')"> Generate new Client </b-button>
        </b-row>

        <base-list-item-client :pool="pool" :client="client" :key="client.clientId" v-for="client of clients" />
        <b-pagination
            class="mt-3"
            @change="onChangePage"
            v-model="page"
            :per-page="limit"
            :total-rows="total"
            align="center"
        ></b-pagination>
        <base-modal-client-create :pool="pool" :page="page" />
    </b-card>
</template>
<script lang="ts">
import { mapGetters } from 'vuex';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { TClient } from '@/store/modules/clients';
import BaseListItemClient from '../list-items/BaseListItemClient.vue';
import BaseModalClientCreate from '../modals/BaseModalClientCreate.vue';
import { IPool } from '@/store/modules/pools';

@Component({
    components: {
        BaseListItemClient,
        BaseModalClientCreate,
    },
    computed: mapGetters({
        clients: 'clients/all',
    }),
})
export default class BaseCardPoolClients extends Vue {
    @Prop() pool!: IPool;

    page = 1;
    limit = 5;
    total = 0;
    isLoading = true;

    clients!: { [id: string]: TClient };

    get filteredClients() {
        return Object.values(this.clients).filter((client: TClient) => client.page === this.page);
    }

    async onChangePage(page: number) {
        this.page = page;
        this.isLoading = true;
        this.$store.dispatch('clients/list', { page: this.page, limit: this.limit, pool: this.pool }).then(() => {
            this.isLoading = false;
        });
    }

    mounted() {
        this.$store.dispatch('clients/list', { page: this.page, limit: this.limit, pool: this.pool }).then(() => {
            this.isLoading = false;
        });
    }
}
</script>
