<template>
    <b-modal centered title="Copy reward URL" size="lg" :id="`modal-reward-link-${reward.id}`">
        <p>Share this link with your audience so they can easily claim your token reward!</p>
        <b-input-group>
            <b-form-input readonly id="address" :value="rewardURL" />
            <b-input-group-append>
                <b-button variant="primary" v-clipboard:copy="rewardURL">
                    <i class="far fa-copy m-0" style="font-size: 1.2rem"></i>
                </b-button>
            </b-input-group-append>
        </b-input-group>
        <p class="text-muted small">
            Conditional rewards will only be distributed when the reward conditions are successfully validated after
            login.
        </p>
        <template v-slot:modal-footer="{ cancel }">
            <b-button @click="cancel" class="rounded-pill" type="submit" variant="primary" block> Close </b-button>
        </template>
    </b-modal>
</template>

<script lang="ts">
import { AssetPool } from '@/store/modules/assetPools';
import { Reward } from '@/store/modules/rewards';
import { BButton, BInputGroup, BFormInput, BModal, BInputGroupAppend } from 'bootstrap-vue';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
    components: {
        'b-modal': BModal,
        'b-button': BButton,
        'b-form-input': BFormInput,
        'b-input-group': BInputGroup,
        'b-input-group-append': BInputGroupAppend,
    },
})
export default class BaseListItemReward extends Vue {
    @Prop() rewardURL!: string;
    @Prop() reward!: Reward;
    @Prop() assetPool!: AssetPool;
}
</script>

<style></style>
