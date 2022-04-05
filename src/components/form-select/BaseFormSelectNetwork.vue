<template>
    <div>
        <b-form-group>
            <label>Blockchain Network</label>
            <b-form-select v-model="network" @change="onSelectNetwork">
                <b-form-select-option :value="NetworkProvider.Test">
                    Polygon Test Network (Mumbai)
                </b-form-select-option>
                <b-form-select-option :value="NetworkProvider.Main"> Polygon Main Network </b-form-select-option>
            </b-form-select>
        </b-form-group>
        <b-alert :show="profile.plan === AccountPlanType.Free && network == NetworkProvider.Main" variant="warning">
            <i class="fas fa-rocket mr-2"></i>
            Choosing <strong>Polygon Main Network</strong> will move you from Free to
            <b-link :href="publicUrl + '/pricing'">Basic</b-link> and start invoicing.
        </b-alert>
    </div>
</template>

<script lang="ts">
import { NetworkProvider } from '@/store/modules/assetPools';
import { AccountPlanType } from '@/types/account';
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

    mounted() {
        this.$emit('selected', this.network);
    }

    onSelectNetwork(network: NetworkProvider) {
        this.network = network;
        this.$emit('selected', this.network);
    }
}
</script>
