<template>
    <div>
        <b-row class="mb-3">
            <b-col class="d-flex align-items-center">
                <h2 class="mb-0">Clients</h2>
            </b-col>
            <b-col class="d-flex justify-content-end">
                <b-button variant="primary" v-b-modal="'modalClientCreate'" class="rounded-pill">
                    <i class="fas fa-plus mr-2"></i>
                    Create Client
                </b-button>
                <base-modal-client-create :pool="pool" :page="page" @submit="onSubmit" />
            </b-col>
        </b-row>
        <base-list-item-client :pool="pool" :client="client" :key="client.clientId" v-for="client of filteredClients" />
        <b-pagination
            v-if="total > limit"
            class="mt-3"
            @change="onChangePage"
            v-model="page"
            :per-page="limit"
            :total-rows="total"
            align="center"
        ></b-pagination>
    </div>
</template>
<script lang="ts">
import { mapGetters, mapState } from 'vuex';
import { Component, Vue } from 'vue-property-decorator';
import { TClient } from '@/store/modules/clients';
import BaseListItemClient from '@/components/list-items/BaseListItemClient.vue';
import BaseModalClientCreate from '@/components/modals/BaseModalClientCreate.vue';
import { IPools } from '@/store/modules/pools';

@Component({
    components: {
        BaseListItemClient,
        BaseModalClientCreate,
    },
    computed: {
        ...mapState('clients', ['total']),
        ...mapGetters({
            clients: 'clients/all',
            pools: 'pools/all',
        }),
    },
})
export default class Clients extends Vue {
    page = 1;
    limit = 5;
    isLoading = true;

    total!: number;
    clients!: { [id: string]: TClient };
    pools!: IPools;

    get pool() {
        return this.pools[this.$route.params.id];
    }

    get filteredClients() {
        return Object.values(this.clients)
            .filter((client: TClient) => client.page === this.page)
            .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
            .slice(0, 5);
    }

    mounted() {
        this.listClients();
    }

    onChangePage(page: number) {
        this.page = page;
        this.listClients();
    }

    onSubmit() {
        this.page = 1;
        this.listClients();
    }

    async listClients() {
        this.isLoading = true;
        await this.$store.dispatch('clients/list', { page: this.page, limit: this.limit, pool: this.pool });
        this.isLoading = false;
    }
}
</script>
