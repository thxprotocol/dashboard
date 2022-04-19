<template>
    <b-modal centered title="Copy reward QR code" :id="`modal-reward-qrcode-${reward.id}`">
        <b-card class="border-0" bg-variant="light" body-class="text-center">
            <vue-qr
                :logoSrc="imgData"
                :text="claimURL"
                :correctLevel="3"
                :logoScale="0.3"
                :logoCornerRadius="0"
                :logoMargin="0"
                :whiteMargin="false"
                :size="240"
            />
        </b-card>
        <template v-slot:modal-footer="{ cancel }">
            <b-button class="rounded-pill" type="submit" variant="primary" @click="cancel" block> Close </b-button>
        </template>
    </b-modal>
</template>

<script lang="ts">
import VueQr from 'vue-qr';
import { Reward } from '@/store/modules/rewards';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
    components: {
        VueQr,
    },
})
export default class BaseModalRewardQRCode extends Vue {
    @Prop() reward!: Reward;
    @Prop() imgData!: string;
    @Prop() claimURL!: string;
}
</script>

<style></style>
