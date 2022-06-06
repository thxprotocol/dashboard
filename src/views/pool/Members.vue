<template>
    <div class="container pt-3 h-100 d-flex flex-column">
        <b-card class="shadow-sm">
            <b-alert v-if="members.length === 0" variant="info" show> There no member on this pool yet. </b-alert>
            <div class="row pt-2 pb-2">
                <div class="col-md-4">
                    <strong>Member ID</strong>
                </div>
                <div class="col-md-2">
                    <strong>Address</strong>
                </div>
                <div class="col-md-4"></div>
            </div>
            <b-skeleton-wrapper :loading="loading">
                <template #loading>
                    <b-form-group class="mb-0">
                        <hr />
                        <div class="row pt-2 pb-2">
                            <div class="col-md-4">
                                <b-skeleton animation="fade" width="85%"></b-skeleton>
                                <b-skeleton animation="fade" width="80%"></b-skeleton>
                            </div>
                            <div class="col-md-2">
                                <b-skeleton animation="fade" width="85%"></b-skeleton>
                                <b-skeleton animation="fade" width="80%"></b-skeleton>
                            </div>
                            <div class="col-md-4 text-right d-flex justify-content-end">
                                <b-skeleton type="avatar" class="inline"></b-skeleton>
                                <b-skeleton type="avatar" class="inline ml-1"></b-skeleton>
                            </div>
                        </div>
                    </b-form-group>
                </template>
                <b-form-group class="mb-0" :key="member.id" v-for="member of members">
                    <hr />
                    <div class="row pt-2 pb-2">
                        <div class="col-md-4 d-flex align-items-center">
                            {{ member.memberId }}
                        </div>
                        <div class="col-md-2 d-flex align-items-center">
                            {{ member.address }}
                        </div>
                    </div>
                </b-form-group>
            </b-skeleton-wrapper>
        </b-card>
        <b-pagination
            class="mt-3"
            @change="onChangePage"
            v-model="currentPage"
            :per-page="perPage"
            :total-rows="total"
            align="center"
        ></b-pagination>
    </div>
</template>

<script lang="ts">
import { GetMembersProps, GetMembersResponse, IPools } from '@/store/modules/pools';
import { IMemberByPage } from '@/types/account';
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';

@Component({
    computed: mapGetters({
        pools: 'pools/all',
    }),
})
export default class Members extends Vue {
    memberPerPage: IMemberByPage = {};
    loading = false;
    currentPage = 1;
    perPage = 10;
    total = 0;

    pools!: IPools;

    get members() {
        return this.memberPerPage[this.currentPage] || [];
    }

    get pool() {
        return this.pools[this.$route.params.id];
    }

    async getMoreMembers({ pool, page, limit }: GetMembersProps) {
        this.loading = true;
        const response: GetMembersResponse = await this.$store.dispatch('pools/getMembers', {
            pool,
            page,
            limit,
        });

        Vue.set(this.memberPerPage, this.currentPage, response.results);
        this.total = response.total;
        this.loading = false;
    }

    async onChangePage(page: number) {
        await this.getMoreMembers({
            pool: this.pool,
            page: page,
            limit: this.perPage,
        });
    }

    async mounted() {
        await this.getMoreMembers({
            pool: this.pool,
            page: this.currentPage,
            limit: this.perPage,
        });
    }
}
</script>
