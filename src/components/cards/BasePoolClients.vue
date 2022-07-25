<template>
    <b-card class="shadow-sm mb-5">
        <b-row class="justify-content-end mb-3">
            <b-button variant="primary" @click="$bvModal.show('modalClientCreate')"> Generate new Client </b-button>
        </b-row>

        <div :key="client.clientId" v-for="client of clients">
            <base-list-client-item :client="client" />
        </div>
        <b-pagination
            class="mt-3"
            @change="onChangePage"
            v-model="page"
            :per-page="limit"
            :total-rows="total"
            align="center"
        ></b-pagination>
        <base-modal-client-create :poolId="poolId" :onSubmit="submit" />
    </b-card>
</template>
<script lang="ts">
import { mapGetters } from 'vuex';
import { Component, Prop, Vue } from 'vue-property-decorator';

import { ClientByPage, TClient } from '@/store/modules/clients';
import BaseListClientItem from '../list-items/BaseListClient.vue';
import BaseModalClientCreate from '../modals/BaseModalClientCreate.vue';

@Component({
    components: {
        'base-list-client-item': BaseListClientItem,
        BaseModalClientCreate,
    },
    computed: mapGetters({
        state: 'clients/all',
    }),
})
export default class BasePoolClient extends Vue {
    @Prop() poolId!: string;

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
        if (this.byPage[page] !== undefined) return;

        this.page = page;
        this.isLoading = true;
        const params = { page: this.page, limit: this.limit, poolId: this.poolId };
        const res = await this.$store.dispatch('clients/list', params);
        this.updateByPage(this.page, res.clients);
        this.total = res.total;
        this.isLoading = false;
    }

    async submit() {
        this.isLoading = true;
        const params = { page: this.page, limit: this.limit, poolId: this.poolId };
        const res = await this.$store.dispatch('clients/list', params);
        this.updateByPage(this.page, res.clients);
        this.total = res.total;
        this.isLoading = false;
    }

    async updateByPage(page: number, clienst: TClient[]) {
        Vue.set(this.byPage, page, clienst);
    }

    mounted() {
        const params = { page: this.page, limit: this.limit, poolId: this.poolId };
        this.$store.dispatch('clients/list', params).then((res) => {
            this.updateByPage(this.page, res.clients);
            this.total = res.total;
            this.isLoading = false;
        });
    }
}
</script>
