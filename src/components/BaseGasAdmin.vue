<template>
    <div class="gas-admin d-flex justify-content-between small" @click="toggleNetwork()">
        <div>
            <span :class="`text-${gasAdminHealth.maxFee.variant}`"> {{ gasAdminHealth.maxFee.value }} Gwei </span>
            <a v-b-tooltip :title="`MaxFeePerGas on ${currentNetworkName}.`">
                <i class="fas fa-question-circle" :class="`text-${gasAdminHealth.maxFee.variant}`"></i>
            </a>
        </div>
        <div>
            <span :class="`text-${gasAdminHealth.balance.variant}`"> {{ gasAdminHealth.balance.value }} MATIC </span>
            <a v-b-tooltip :title="`Gas admin balance on ${currentNetworkName}.`">
                <i class="fas fa-question-circle" :class="`text-${gasAdminHealth.balance.variant}`"></i>
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
        { balance: { value: 0, variant: 'light' }, maxFee: { value: 0, variant: 'light' } },
        { balance: { value: 0, variant: 'light' }, maxFee: { value: 0, variant: 'light' } },
    ];

    async mounted() {
        await this.getGasAdminHealth();
    }

    get gasAdminHealth() {
        return this.health[this.currentNetwork];
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
        await this.getGasAdminHealth();
    }

    async getGasAdminHealth() {
        function getMaxFeeVariant({ maxFeePerGas }: { maxFeePerGas: number }) {
            if (maxFeePerGas > 600) return 'danger';
            if (maxFeePerGas > 300) return 'warning';
            return 'success';
        }
        function getBalanceVariant({ balance }: { balance: number }) {
            if (balance < 5) return 'danger';
            if (balance < 25) return 'warning';
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

            this.health[NetworkProvider.Test].balance = {
                value: Math.floor(r.data.testnet.balance * 100) / 100,
                variant: getBalanceVariant(r.data.testnet),
            };
            this.health[NetworkProvider.Test].maxFee = {
                value: Math.ceil(r.data.testnet.feeData.maxFeePerGas),
                variant: getMaxFeeVariant(r.data.testnet.feeData),
            };

            this.health[NetworkProvider.Main].balance = {
                value: Math.floor(r.data.mainnet.balance * 100) / 100,
                variant: getBalanceVariant(r.data.mainnet),
            };
            this.health[NetworkProvider.Main].maxFee = {
                value: Math.ceil(r.data.mainnet.feeData.maxFeePerGas),
                variant: getMaxFeeVariant(r.data.mainnet.feeData),
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
