<template>
    <b-modal centered title="Copy reward QR code" :id="`modal-reward-qrcode-${reward.id}`">
        <b-card class="border-0" bg-variant="light" body-class="text-center">
            <qrcode-vue :value="rewardURL" size="200" level="H" />
        </b-card>
        <template v-slot:modal-footer="{ cancel }">
            <b-button class="rounded-pill" type="submit" variant="primary" @click="cancel" block> Close </b-button>
        </template>
    </b-modal>
</template>

<script lang="ts">
import QrcodeVue from 'qrcode.vue';
import { AssetPool } from '@/store/modules/assetPools';
import { Reward } from '@/store/modules/rewards';
import { BButton, BInputGroup, BFormInput, BModal, BInputGroupAddon, BCard } from 'bootstrap-vue';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
    components: {
        BCard,
        BModal,
        BButton,
        BFormInput,
        BInputGroup,
        BInputGroupAddon,
        QrcodeVue,
    },
})
export default class BaseModalRewardQRCode extends Vue {
    @Prop() rewardURL!: string;
    @Prop() reward!: Reward;
    @Prop() assetPool!: AssetPool;
}
</script>

<style></style>
