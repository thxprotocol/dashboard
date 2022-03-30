<template>
    <b-dropdown size="sm" variant="darker" no-caret toggle-class="d-flex align-items-center" menu-class="bg-light">
        <template #button-content>
            <i class="fas fa-chart-bar text-success m-0 p-1 px-2" style="font-size: 1.5rem"></i>
        </template>
        <b-dropdown-item :href="`https://mumbai.polygonscan.com/address/${health[0].admin.address}`" target="_blank">
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
    </b-dropdown>
</template>

<script lang="ts">
import { NetworkProvider } from '@/store/modules/assetPools';
import axios from 'axios';
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class BaseDropdownAdminBalance extends Vue {
    apiUrl = process.env.VUE_APP_API_URL;
    walletUrl = process.env.VUE_APP_WALLET_URL;
    health = [
        { admin: { address: '', value: 0, variant: 'light' }, gasTank: { value: 0, variant: 'light' } },
        { admin: { address: '', value: 0, variant: 'light' }, gasTank: { value: 0, variant: 'light' } },
    ];

    async mounted() {
        await this.getHealth();
    }

    async getHealth() {
        function getBalanceVariant({ balance }: { balance: string }) {
            if (Number(balance) < 5) return 'danger';
            if (Number(balance) < 25) return 'warning';
            return 'success';
        }

        try {
            const r = await axios({
                method: 'GET',
                url: '/health',
            });

            if (r.status !== 200) {
                throw new Error('Could not fetch API health.');
            }

            this.health[NetworkProvider.Test].admin = {
                address: r.data.testnet.admin.address,
                value: Math.floor(Number(r.data.testnet.admin.balance) * 100) / 100,
                variant: getBalanceVariant(r.data.testnet.admin),
            };
            this.health[NetworkProvider.Test].gasTank = {
                value: Math.floor(Number(r.data.testnet.gasTank.balance) * 100) / 100,
                variant: getBalanceVariant(r.data.testnet.gasTank),
            };

            this.health[NetworkProvider.Main].admin = {
                address: r.data.mainnet.admin.address,
                value: Math.floor(Number(r.data.mainnet.admin.balance) * 100) / 100,
                variant: getBalanceVariant(r.data.mainnet.admin),
            };
            this.health[NetworkProvider.Main].gasTank = {
                value: Math.floor(Number(r.data.mainnet.gasTank.balance) * 100) / 100,
                variant: getBalanceVariant(r.data.mainnet.gasTank),
            };
        } catch (error) {
            console.error(error);
        }
    }
}
</script>
