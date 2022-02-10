<template>
    <b-form-input type="text" placeholder="Past video URL" v-model="url" />
</template>

<script lang="ts">
import { BDropdown, BDropdownItemButton, BBadge, BSpinner } from 'bootstrap-vue';
import { Component, Vue } from 'vue-property-decorator';
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
export default class BaseDropdownYoutubeVideo extends Vue {
    url = '';

    mounted() {
        //
    }

    onItemClick(item: any) {
        this.$emit('selected', item);
    }
}
</script>
