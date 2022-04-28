<template>
    <div class="text-center text-gray py-5">
        <i class="far fa-sticky-note mr-1 h2"></i><br />
        <strong> You have not added {{ item.toLowerCase() }} yet</strong><br />
        <span>Do you want to add one now?</span><br />
        <b-button size="sm" class="rounded-pill mt-3" variant="outline-primary" @click="$emit('clicked')">
            Add {{ item }}
        </b-button>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';

@Component({
    computed: mapGetters({
        profile: 'account/profile',
    }),
})
export default class BaseListStateEmpty extends Vue {
    @Prop() item!: string;

    mounted() {
        if (!this.item) {
            this.item = 'item';
        }
    }
}
</script>
