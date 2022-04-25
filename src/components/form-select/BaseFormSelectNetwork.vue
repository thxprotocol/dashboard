<template>
    <div>
        <b-form-group>
            <label>Blockchain Network</label>
            <b-dropdown variant="link" class="dropdown-select">
                <template #button-content>
                    <div class="d-flex align-items-center">
                        <img src="@/assets/thx_logo_polygon.svg" width="20" height="20" class="mr-3" />
                        {{
                            network === NetworkProvider.Test ? 'Polygon Test Network (Mumbai)' : 'Polygon Main Network'
                        }}
                    </div>
                </template>
                <b-dropdown-item-button disabled>
                    <img src="@/assets/thx_logo_ethereum.svg" width="20" height="20" class="mr-3" />
                    Ethereum
                </b-dropdown-item-button>
                <b-dropdown-item-button disabled>
                    <img src="@/assets/thx_logo_arbitrum.svg" width="20" height="20" class="mr-3" />
                    Arbitrum
                </b-dropdown-item-button>
                <b-dropdown-item-button disabled>
                    <img src="@/assets/thx_logo_bsc.svg" width="20" height="20" class="mr-3" />
                    Binance Chain
                </b-dropdown-item-button>
                <b-dropdown-item-button @click="onSelectNetwork(NetworkProvider.Test)">
                    <img src="@/assets/thx_logo_polygon.svg" width="20" height="20" class="mr-3" />
                    Polygon Mumbai (Test Network)
                </b-dropdown-item-button>
                <b-dropdown-item-button @click="onSelectNetwork(NetworkProvider.Main)">
                    <img src="@/assets/thx_logo_polygon.svg" width="20" height="20" class="mr-3" />
                    Polygon
                </b-dropdown-item-button>
            </b-dropdown>
        </b-form-group>
        <b-alert :show="profile.plan === AccountPlanType.Free && network == NetworkProvider.Main" variant="warning">
            <i class="fas fa-rocket mr-2"></i>
            Choosing <strong>Polygon Main Network</strong> will move you from Free to
            <b-link :href="publicUrl + '/pricing'">Basic</b-link> and start invoicing.
        </b-alert>
    </div>
</template>

<script lang="ts">
import { NetworkProvider } from '@/store/modules/pools';
import { AccountPlanType, IAccount } from '@/types/account';
import { PUBLIC_URL } from '@/utils/secrets';
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';

@Component({
    computed: mapGetters({
        profile: 'account/profile',
    }),
})
export default class BaseFormSelectNetwork extends Vue {
    publicUrl = PUBLIC_URL;
    NetworkProvider = NetworkProvider;
    AccountPlanType = AccountPlanType;
    network = NetworkProvider.Test;

    profile!: IAccount;

    mounted() {
        this.network = this.profile.plan !== AccountPlanType.Free ? NetworkProvider.Main : NetworkProvider.Test;
        this.$emit('selected', this.network);
    }

    onSelectNetwork(network: NetworkProvider) {
        this.network = network;
        this.$emit('selected', this.network);
    }
}
</script>
