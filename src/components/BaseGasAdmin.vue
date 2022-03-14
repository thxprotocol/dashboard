<template>
    <div class="gas-admin d-flex justify-content-between small" @click="toggleNetwork()">
        <div>
            <span :class="`text-${gasAdminHealth.variant}`"> {{ gasAdminHealth.value }} Gwei </span>
            <a v-b-tooltip :title="`THX API Admin balance on ${currentNetworkName}.`">
                <i class="fas fa-question-circle" :class="`text-${gasAdminHealth.variant}`"></i>
            </a>
        </div>
        <div>
            <span :class="`text-${gasTankHealth.variant}`"> {{ gasTankHealth.value }} MATIC </span>
            <a v-b-tooltip :title="`ITX Gas Tank balance on ${currentNetworkName}.`">
                <i class="fas fa-question-circle" :class="`text-${gasTankHealth.variant}`"></i>
            </a>
        </div>
    </div>
</template>

<script lang="ts">
import { NetworkProvider } from '@/store/modules/assetPools';
import axios from 'axios';
import { BCard } from 'bootstrap-vue';
import { Component, Vue } from 'vue-property-decorator';

@Component({
    components: {
        BCard,
    },
})
export default class BaseGasAdmin extends Vue {
    apiUrl = process.env.VUE_APP_API_URL;
    currentNetwork = NetworkProvider.Main;
    health = [
        { admin: { value: 0, variant: 'light' }, gasTank: { value: 0, variant: 'light' } },
        { admin: { value: 0, variant: 'light' }, gasTank: { value: 0, variant: 'light' } },
    ];

    async mounted() {
        await this.getHealth();
    }

    get gasAdminHealth() {
        return this.health[this.currentNetwork].admin;
    }

    get gasTankHealth() {
        return this.health[this.currentNetwork].gasTank;
    }

    get currentNetworkName() {
        switch (this.currentNetwork) {
            default:
            case NetworkProvider.Test:
                return 'Polygon Testnet';
            case NetworkProvider.Main:
                return 'Polygon Mainnet';
        }
    }

    async toggleNetwork() {
        this.currentNetwork =
            this.currentNetwork === NetworkProvider.Main ? NetworkProvider.Test : NetworkProvider.Main;
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
                value: Math.floor(Number(r.data.testnet.admin.balance) * 100) / 100,
                variant: getBalanceVariant(r.data.testnet.admin),
            };
            this.health[NetworkProvider.Test].gasTank = {
                value: Math.floor(Number(r.data.testnet.gasTank.balance) * 100) / 100,
                variant: getBalanceVariant(r.data.testnet.gasTank),
            };

            this.health[NetworkProvider.Main].admin = {
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

<style lang="scss">
.gas-admin {
    margin: 0;
    opacity: 0.5;
    border-bottom-left-radius: 0.25rem;

    &:hover {
        opacity: 1;
        cursor: pointer;
    }
}
</style>
