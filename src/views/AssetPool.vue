<template>
    <div class="pt-5">
        <div class="container container-md" v-if="assetPool">
            <div class="d-flex align-items-center">
                <h1 class="mr-3">
                    {{ assetPool.poolToken.symbol + ' Pool' }}
                </h1>
                <b-badge variant="gray" class="text-white p-2" v-if="network === 0">Polygon Test</b-badge>
                <b-badge variant="primary" class="p-2" v-if="network === 1">Polygon Main</b-badge>
            </div>

            <!-- <p class="text-muted">Created at November 15th 4:30 am | Block #333213</p> -->
            <hr />
            <div class="d-flex mb-4 mt-5">
                <router-link
                    class="btn btn-tab shadow-sm"
                    :style="{
                        'background-image': `url(${require('../assets/thx_jumbotron.webp')})`,
                    }"
                    :to="`/pool/${assetPool.address}/info`"
                >
                    <img height="30" :src="require('../assets/thx_pool_info.webp')" />
                    <div class="d-none d-md-block">Information</div>
                </router-link>
                <router-link
                    class="btn btn-tab shadow-sm"
                    :style="{
                        'background-image': `url(${require('../assets/thx_jumbotron.webp')})`,
                    }"
                    :to="`/pool/${assetPool.address}/rewards`"
                >
                    <img height="30" :src="require('../assets/thx_pool_rewards.webp')" />
                    <div class="d-none d-md-block">Rewards</div>
                </router-link>
                <router-link
                    class="btn btn-tab shadow-sm"
                    :style="{
                        'background-image': `url(${require('../assets/thx_jumbotron.webp')})`,
                    }"
                    :to="`/pool/${assetPool.address}/widgets`"
                >
                    <img height="30" :src="require('../assets/thx_pool_widgets.webp')" />
                    <div class="d-none d-md-block">Widgets</div>
                </router-link>
                <router-link
                    class="btn btn-tab shadow-sm"
                    :style="{
                        'background-image': `url(${require('../assets/thx_jumbotron.webp')})`,
                    }"
                    :to="`/pool/${assetPool.address}/authorization`"
                >
                    <img height="30" :src="require('../assets/thx_pool_authorization.webp')" />
                    <div class="d-none d-md-block">Authorization</div>
                </router-link>
            </div>
            <router-view></router-view>
        </div>
    </div>
</template>

<script lang="ts">
import { IAssetPools, NetworkProvider } from '@/store/modules/assetPools';
import {
    BAlert,
    BBadge,
    BButton,
    BCard,
    BCardText,
    BCollapse,
    BFormCheckbox,
    BFormGroup,
    BFormInput,
    BFormTextarea,
    BFormSelect,
    BFormSelectOption,
    BInputGroup,
    BLink,
    BModal,
    BOverlay,
    BTabs,
    BTab,
    BListGroupItem,
    BListGroup,
    BPopover,
    BInputGroupAppend,
    BSpinner,
} from 'bootstrap-vue';
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';

@Component({
    components: {
        'b-modal': BModal,
        'b-alert': BAlert,
        'b-tabs': BTabs,
        'b-tab': BTab,
        'b-card-text': BCardText,
        'b-link': BLink,
        'b-card': BCard,
        'b-badge': BBadge,
        'b-spinner': BSpinner,
        'b-form-checkbox': BFormCheckbox,
        'b-form-group': BFormGroup,
        'b-form-select': BFormSelect,
        'b-form-textarea': BFormTextarea,
        'b-form-select-option': BFormSelectOption,
        'b-form-input': BFormInput,
        'b-list-group': BListGroup,
        'b-list-group-item': BListGroupItem,
        'b-input-group': BInputGroup,
        'b-input-group-append': BInputGroupAppend,
        'b-button': BButton,
        'b-collapse': BCollapse,
        'b-overlay': BOverlay,
        'b-popover': BPopover,
    },
    computed: mapGetters({
        assetPools: 'assetPools/all',
        rewards: 'rewards/all',
        widgets: 'widgets/all',
    }),
})
export default class AssetPoolView extends Vue {
    docsUrl = process.env.VUE_APP_DOCS_URL;
    apiUrl = process.env.VUE_APP_API_ROOT;
    widgetUrl = process.env.VUE_APP_WIDGET_URL;
    error = '';
    loading = true;
    network: NetworkProvider = NetworkProvider.Test;
    assetPools!: IAssetPools;

    get assetPool() {
        return this.assetPools[this.$route.params.address];
    }

    async mounted() {
        try {
            await this.$store.dispatch('assetPools/read', this.$route.params.address);

            this.network = this.assetPool.network;
        } catch (e) {
            this.error = 'Could not get the rewards.';
        } finally {
            this.loading = false;
        }
    }
}
</script>
