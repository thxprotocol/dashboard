<template>
    <b-card class="shadow-sm mb-5">
        <b-row class="justify-content-end mb-3">
            <b-button variant="primary" @click="$bvModal.show('modalClientCreate')" class="rounded-pill">
                Create Client
            </b-button>
        </b-row>

        <base-list-client-item :client="client" :pool="pool" :key="client.clientId" v-for="client of clients" />
        <b-pagination
            class="mt-3"
            @change="onChangePage"
            v-model="page"
            :per-page="limit"
            :total-rows="total"
            align="center"
        ></b-pagination>
        <base-modal-client-create :pool="pool" :onSubmit="submit" />
    </b-card>
</template>
<script lang="ts">
import { mapGetters } from 'vuex';
import { Component, Prop, Vue } from 'vue-property-decorator';

import { ClientByPage, TClient } from '@/store/modules/clients';
import BaseListClientItem from '../list-items/BaseListClient.vue';
import BaseModalClientCreate from '../modals/BaseModalClientCreate.vue';
import { IPool } from '@/store/modules/pools';

@Component({
    components: {
        BaseListClientItem,
        BaseModalClientCreate,
    },
    computed: mapGetters({
        state: 'clients/all',
    }),
})
export default class BasePoolClient extends Vue {
    @Prop() pool!: IPool;

    byPage: ClientByPage = {};
    page = 1;
    limit = 5;
    total = 0;
    isLoading = true;

    get clients() {
        return this.byPage?.[this.page] || [];
    }

    get isEmpty() {
        return this.page === 1 && this.clients.length === 0;
    }

    async onChangePage(page: number) {
        if (this.byPage[page]) return;

        this.page = page;
        this.isLoading = true;
        const params = { page: this.page, limit: this.limit, poolId: this.pool._id };
        const res = await this.$store.dispatch('clients/list', params);
        this.updateByPage(this.page, res.clients);
        this.total = res.total;
        this.isLoading = false;
    }

    async submit() {
        this.isLoading = true;
        const params = { page: this.page, limit: this.limit, poolId: this.pool._id };
        const res = await this.$store.dispatch('clients/list', params);
        this.updateByPage(this.page, res.clients);
        this.total = res.total;
        this.isLoading = false;
    }

    async updateByPage(page: number, clients: TClient[]) {
        Vue.set(this.byPage, page, clients);
    }

    mounted() {
        const params = { page: this.page, limit: this.limit, poolId: this.pool._id };
        this.$store.dispatch('clients/list', params).then((res) => {
            debugger;
            this.updateByPage(this.page, res.clients);
            this.total = res.total;
            this.isLoading = false;
        });
    }
}
</script>
