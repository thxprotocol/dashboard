<template>
    <b-button size="sm" variant="outline-dark" class="rounded-pill pl-3" @click="toggleShowArchived">
        <span>{{ !showArchived ? 'Show' : 'Hide' }} archived</span>
        <i class="fas fa-file-archive mr-2"></i>
    </b-button>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class BaseBtnToggleArchive extends Vue {
    showArchived = false;

    toggleShowArchived() {
        this.showArchived = !this.showArchived;
        this.$emit('archived', this.showArchived);
    }
}
</script>
