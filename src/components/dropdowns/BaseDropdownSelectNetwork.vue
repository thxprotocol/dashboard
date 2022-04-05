<template>
    <div>
        <b-alert :show="profile.plan === AccountPlanType.Free" variant="warning">
            <i class="fas fa-rocket mr-2"></i>
            Choosing <strong>Polygon Main Network</strong> will change your payment plan from Solo to
            <b-link :href="publicUrl + '/pricing'">Community</b-link>.
        </b-alert>
        <b-form-group>
            <label>Blockchain Network</label>
            <b-form-select v-model="network" @change="onSelectNetwork">
                <b-form-select-option :value="NetworkProvider.Test">
                    Polygon Test Network (Mumbai)
                </b-form-select-option>
                <b-form-select-option :value="NetworkProvider.Main" :disabled="profile.plan === AccountPlanType.Free">
                    Polygon Main Network
                </b-form-select-option>
            </b-form-select>
        </b-form-group>
    </div>
</template>

<script lang="ts">
import { NetworkProvider } from '@/store/modules/assetPools';
import { AccountPlanType } from '@/types/account';
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';

@Component({
    computed: mapGetters({
        profile: 'account/profile',
    }),
})
export default class BaseDropdownSelectNetwork extends Vue {
    NetworkProvider = NetworkProvider;
    AccountPlanType = AccountPlanType;
    network = NetworkProvider.Test;

    mounted() {
        this.$emit('selected', this.network);
    }

    onSelectNetwork(network: NetworkProvider) {
        this.network = network;
        this.$emit('selected', this.network);
    }
}
</script>
