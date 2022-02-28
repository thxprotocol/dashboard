<template>
    <b-popover :target="target" triggers="hover" placement="top" title="Active poll">
        <div class="d-flex justify-content-between align-items-center mb-3">
            Start:
            <b-badge variant="dark">{{ format(new Date(reward.poll.startTime), 'HH:mm MMMM dd, yyyy') }}</b-badge>
        </div>
        <div class="d-flex justify-content-between align-items-center mb-3">
            End:
            <b-badge variant="dark">{{ format(new Date(reward.poll.endTime), 'HH:mm MMMM dd, yyyy') }}</b-badge>
        </div>
        <b-progress class="mb-3" :max="reward.poll.totalVoted" show-value>
            <b-progress-bar
                :value="reward.poll.yesCounter"
                :label="`${reward.poll.yesCounter} x Yes`"
                variant="success"
            ></b-progress-bar>
            <b-progress-bar :value="reward.poll.noCounter" :label="`${reward.poll.yesCounter} x No`" variant="danger" />
        </b-progress>
        <b-button @click="finalizePoll()" size="sm" variant="primary" class="rounded-pill" block>Finalize</b-button>
    </b-popover>
</template>

<script lang="ts">
import { Reward } from '@/store/modules/rewards';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { format } from 'date-fns';

@Component({})
export default class BasePopoverRewardPoll extends Vue {
    format = format;

    @Prop() reward!: Reward;
    @Prop() target!: string;

    finalizePoll() {
        this.$store.dispatch('rewards/finalize', this.reward);
    }
}
</script>
