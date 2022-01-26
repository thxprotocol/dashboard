<template>
    <b-dropdown variant="link" class="dropdown-select bg-white">
        <template #button-content>
            <div v-if="item" class="text-overflow-ellipsis">
                {{ item.text }}
            </div>
        </template>
        <b-dropdown-item-button
            button-class="border-bottom small"
            :key="item.id"
            v-for="item of items"
            @click="onItemClick(item)"
        >
            <span class="text-muted"> {{ format(new Date(item.created_at), 'HH:mm MMMM dd, yyyy') }}</span
            ><br />
            {{ item.text }}
        </b-dropdown-item-button>
    </b-dropdown>
</template>

<script lang="ts">
import { BDropdown, BDropdownItemButton, BBadge, BSpinner } from 'bootstrap-vue';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import { format } from 'date-fns';

@Component({
    components: {
        BBadge,
        BDropdown,
        BDropdownItemButton,
        BSpinner,
    },
    computed: mapGetters({}),
})
export default class BaseDropdownTwitterTweets extends Vue {
    format = format;

    @Prop() items!: any;

    item: any = null;

    mounted() {
        this.onItemClick(this.items[0]);
    }

    onItemClick(item: any) {
        this.item = item;
        this.$emit('selected', item);
    }
}
</script>
