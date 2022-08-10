<template>
    <b-dropdown variant="link" class="dropdown-select bg-white">
        <template #button-content> </template>
        <b-dropdown-item-button
            :key="metadata._id"
            v-for="metadata of erc721.metadata"
            @click="$emit('selected', metadata)"
        >
            <div>
                <b-badge
                    :key="key"
                    v-for="(value, key) in metadata.attributes"
                    variant="dark"
                    v-b-tooltip
                    :title="value.value"
                    class="mr-2"
                >
                    {{ value.key }}
                </b-badge>
            </div>
        </b-dropdown-item-button>
    </b-dropdown>
</template>

<script lang="ts">
import { IPool } from '@/store/modules/pools';
import { IERC721s, TERC721 } from '@/types/erc721';
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
    computed: mapGetters({
        erc721s: 'erc721/all',
    }),
})
export default class BaseDropdownERC721Metadata extends Vue {
    erc721s!: IERC721s;

    get erc721(): TERC721 {
        return this.erc721s[this.pool.token._id];
    }

    @Prop() pool!: IPool;

    mounted() {
        if (!this.pool.isNFTPool) {
            return;
        }
        this.$store.dispatch('erc721/read', this.pool.token._id).then(async (erc721) => {
            await this.$store.dispatch('erc721/listMetadata', erc721);
        });
    }
}
</script>
