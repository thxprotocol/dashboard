<template>
    <b-dropdown size="sm" variant="link" no-caret toggle-class="d-flex align-items-center float-right">
        <template #button-content>
            <i class="fas fa-ellipsis-v m-0 p-1 px-2 text-muted" aria-hidden="true" style="font-size: 1rem"></i>
        </template>
        <b-dropdown-item size="sm" variant="dark" @click="$emit('remove')">
            <span class="text-muted"><i class="fas fa-trash-alt mr-3"></i>Remove</span>
        </b-dropdown-item>
    </b-dropdown>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class BaseDropdownPoolMenu extends Vue {}
</script>
