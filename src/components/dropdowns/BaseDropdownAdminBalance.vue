<template>
    <b-dropdown
        @show="getHealth()"
        size="sm"
        variant="darker"
        no-caret
        toggle-class="d-flex align-items-center"
        menu-class="bg-light"
    >
        <template #button-content>
            <i class="fas fa-chart-bar text-success m-0 p-1 px-2" style="font-size: 1.5rem"></i>
        </template>
        <div class="text-center p-3" v-if="loading">
            <b-spinner variant="darker" />
        </div>
        <div v-else>
            <b-dropdown-item
                :href="`https://mumbai.polygonscan.com/address/${health[0].admin.address}`"
                target="_blank"
            >
                <strong>Polygon Mumbai</strong><br />
                <i class="fas fa-wallet mr-2" :class="`text-${health[0].admin.variant}`"></i>
                <small class="mr-2 text-muted"> {{ health[0].admin.value }} MATIC </small><br />
                <i class="fas fa-gas-pump mr-2" :class="`text-${health[0].gasTank.variant}`"></i>
                <small class="text-muted"> {{ health[0].gasTank.value }} MATIC </small>
            </b-dropdown-item>
            <b-dropdown-divider />
            <b-dropdown-item :href="`https://polygonscan.com/address/${health[1].admin.address}`" target="_blank">
                <strong>Polygon Mainnet</strong><br />
                <i class="fas fa-wallet mr-2" :class="`text-${health[1].admin.variant}`"></i>
                <small class="mr-2 text-muted"> {{ health[1].admin.value }} MATIC </small><br />
                <i class="fas fa-gas-pump mr-2" :class="`text-${health[1].gasTank.variant}`"></i>
                <small class="text-muted"> {{ health[1].gasTank.value }} MATIC </small>
            </b-dropdown-item>
        </div>
    </b-dropdown>
</template>

<script lang="ts">
import { NetworkProvider } from '@/store/modules/pools';
import { API_URL, WALLET_URL } from '@/utils/secrets';
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters, mapState } from 'vuex';

@Component({
    computed: { ...mapState('account', ['version', 'artifacts']), ...mapGetters('account', ['networkHealth']) },
})
export default class BaseDropdownAdminBalance extends Vue {
    loading = true;
    apiUrl = API_URL;
    walletUrl = WALLET_URL;
    health = [
        { admin: { address: '', value: 0, variant: 'light' }, gasTank: { value: 0, variant: 'light' } },
        { admin: { address: '', value: 0, variant: 'light' }, gasTank: { value: 0, variant: 'light' } },
    ];
    networkHealth!: any;

    mounted() {
        this.getHealth();
    }

    async getHealth() {
        this.loading = true;

        function getBalanceVariant({ balance }: { balance: string }) {
            if (Number(balance) < 5) return 'danger';
            if (Number(balance) < 25) return 'warning';
            return 'success';
        }

        await this.$store.dispatch('account/getHealth');

        this.health[NetworkProvider.Test].admin = {
            address: this.networkHealth.testnet.admin.address,
            value: Math.floor(Number(this.networkHealth.testnet.admin.balance) * 100) / 100,
            variant: getBalanceVariant(this.networkHealth.testnet.admin),
        };
        this.health[NetworkProvider.Test].gasTank = {
            value: Math.floor(Number(this.networkHealth.testnet.gasTank.balance) * 100) / 100,
            variant: getBalanceVariant(this.networkHealth.testnet.gasTank),
        };

        this.health[NetworkProvider.Main].admin = {
            address: this.networkHealth.mainnet.admin.address,
            value: Math.floor(Number(this.networkHealth.mainnet.admin.balance) * 100) / 100,
            variant: getBalanceVariant(this.networkHealth.mainnet.admin),
        };
        this.health[NetworkProvider.Main].gasTank = {
            value: Math.floor(Number(this.networkHealth.mainnet.gasTank.balance) * 100) / 100,
            variant: getBalanceVariant(this.networkHealth.mainnet.gasTank),
        };

        this.loading = false;
    }
}
</script>
