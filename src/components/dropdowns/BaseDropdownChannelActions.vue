<template>
    <b-dropdown variant="link" class="dropdown-select bg-white">
        <template #button-content>
            <div v-if="action">
                {{ action.name }}
            </div>
        </template>
        <b-dropdown-item-button :key="action.type" v-for="action of actions" @click="onActionClick(action)">
            {{ action.name }}
        </b-dropdown-item-button>
    </b-dropdown>
</template>

<script lang="ts">
import { BDropdown, BDropdownItemButton, BBadge, BSpinner } from 'bootstrap-vue';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';

@Component({
    components: {
        BBadge,
        BDropdown,
        BDropdownItemButton,
        BSpinner,
    },
    computed: mapGetters({}),
})
export default class BaseDropdownChannelActions extends Vue {
    @Prop() actions!: any;

    action: any = null;

    mounted() {
        this.action = this.actions[0];
    }

    onActionClick(action: any) {
        this.action = action;
        this.$emit('selected', action);
    }
}
</script>
