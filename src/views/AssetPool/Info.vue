<template>
    <div>
        <h2 class="font-weight-normal">Information</h2>
        <p>General and event information regarding your Asset Pool.</p>
        <b-card class="shadow-sm">
            <b-form-group>
                <label> Blockchain Network </label>
                <b-form-input readonly v-if="network === 0" value="Polygon Test" />
                <b-form-input readonly v-if="network === 1" value="Polygon Mainnet" />
                <b-link
                    target="_blank"
                    :href="network === 0 ? `https://mumbai.polygonscan.com` : `https://polygonscan.com`"
                >
                    Visit the Block Explorer
                </b-link>
            </b-form-group>
            <b-form-group>
                <label for="clientId"> Asset Pool Contract </label>
                <div class="input-group">
                    <b-form-input readonly id="address" v-model="assetPool.address" />
                    <div class="input-group-append">
                        <button class="btn btn-primary" type="button" v-clipboard:copy="assetPool.address">
                            <i class="far fa-copy m-0" style="font-size: 1.2rem"></i>
                        </button>
                    </div>
                </div>
                <b-link
                    target="_blank"
                    :href="
                        (network === 0 ? `https://mumbai.polygonscan.com` : `https://polygonscan.com`) +
                        `/address/${assetPool.address}/transactions`
                    "
                >
                    View your asset pool transactions
                </b-link>
            </b-form-group>
            <b-form-group>
                <label for="erc20Address">Token Contract</label>
                <div class="input-group">
                    <b-form-input readonly id="address" v-model="assetPool.poolToken.address" />
                    <div class="input-group-append">
                        <button class="btn btn-primary" type="button" v-clipboard:copy="assetPool.poolToken.address">
                            <i class="far fa-copy m-0" style="font-size: 1.2rem"></i>
                        </button>
                    </div>
                </div>
                <b-link
                    target="_blank"
                    :href="
                        (network === 0 ? `https://mumbai.polygonscan.com` : `https://polygonscan.com`) +
                        `/address/${assetPool.poolToken.address}/transactions`
                    "
                >
                    View your token transactions
                </b-link>
            </b-form-group>
        </b-card>
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
        clients: 'clients/all',
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
