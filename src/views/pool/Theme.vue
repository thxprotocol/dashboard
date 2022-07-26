<template>
    <div>
        <b-row class="mb-3">
            <h2 class="mb-0">Theme</h2>
        </b-row>
        <b-card class="shadow-sm mb-5">
            <b-form-group>
                <label for="backgroundImgUrl">Background URL</label>
                <b-input-group>
                    <template #prepend>
                        <b-card
                            body-class="py-1 px-2 d-flex align-items-center"
                            v-if="backgroundImgUrl"
                            bg-variant="light"
                        >
                            <img height="30" width="30" class="m-0" :src="backgroundImgUrl" />
                        </b-card>
                    </template>
                    <b-form-input v-model="backgroundImgUrl" />
                </b-input-group>
            </b-form-group>

            <b-form-group>
                <label for="logoImgUrl">Token Icon URL</label>
                <b-input-group>
                    <template #prepend>
                        <b-card body-class="py-1 px-2 d-flex align-items-center" v-if="logoImgUrl" bg-variant="light">
                            <img height="30" width="30" class="m-0" :src="logoImgUrl" />
                        </b-card>
                    </template>
                    <b-form-input v-model="logoImgUrl" />
                </b-input-group>
            </b-form-group>
            <div class="d-flex justify-content-end">
                <b-button
                    variant="primary"
                    :disabled="!isBrandUpdateInvalid"
                    @click="updateBrand()"
                    class="rounded-pill"
                >
                    Update
                    <i v-if="!loading" class="fas fa-save ml-2" style="font-size: 1.2rem"></i>
                    <b-spinner v-else class="ml - 2" small variant="white" />
                </b-button>
            </div>
        </b-card>
    </div>
</template>

<script lang="ts">
import { IPools } from '@/store/modules/pools';
import { Component, Vue } from 'vue-property-decorator';
import { ChainId } from '@/types/enums/ChainId';
import { mapGetters } from 'vuex';
import { isValidUrl } from '@/utils/url';

@Component({
    computed: mapGetters({
        pools: 'pools/all',
    }),
})
export default class AssetPoolView extends Vue {
    ChainId = ChainId;
    loading = true;
    pools!: IPools;
    chainId: ChainId = ChainId.PolygonMumbai;
    logoImgUrl = '';
    backgroundImgUrl = '';

    get pool() {
        return this.pools[this.$route.params.id];
    }

    get isBrandUpdateInvalid() {
        const backgroundUrlIsValid = this.backgroundImgUrl
            ? isValidUrl(this.backgroundImgUrl)
            : this.backgroundImgUrl === '';
        const logoUrlIsValid = this.logoImgUrl ? isValidUrl(this.logoImgUrl) : this.logoImgUrl === '';
        return logoUrlIsValid && backgroundUrlIsValid;
    }

    mounted() {
        this.chainId = this.pool.chainId;
        this.getBrand().then(() => {
            this.loading = false;
        });
    }

    async getBrand() {
        const data = await this.$store.dispatch('brands/pool', this.pool._id);
        if (data) {
            this.backgroundImgUrl = data.backgroundImgUrl;
            this.logoImgUrl = data.logoImgUrl;
        }
    }

    async updateBrand() {
        this.loading = true;
        await this.$store.dispatch('brands/update', {
            poolId: this.pool._id,
            backgroundImgUrl: this.backgroundImgUrl,
            logoImgUrl: this.logoImgUrl,
        });
        this.loading = false;
    }
}
</script>
