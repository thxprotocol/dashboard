<template>
    <b-dropdown variant="link" class="dropdown-select bg-white">
        <template #button-content>{{
            selectedMetadata ? selectedMetadata.title || 'No Title' : 'Select the NFT to Mint'
        }}</template>
        <b-dropdown-item-button
            :key="metadata._id"
            v-for="metadata of erc721.metadata"
            @click="
                $emit('selected', metadata);
                selectedMetadata = metadata;
            "
        >
            <div class="d-flex justify-content-between">
                <div>
                    {{ metadata.title || 'No Title' }}
                </div>
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
                <small class="text-muted">
                    {{ format(new Date(metadata.createdAt), 'dd-MM-yyyy HH:mm') }}
                </small>
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
import { format } from 'date-fns';
import { TERC721Metadata } from '@/types/erc721';

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
    format = format;
    erc721s!: IERC721s;
    selectedMetadata: TERC721Metadata | null = null;

    get erc721(): TERC721 {
        return this.erc721s[this.pool.erc721._id];
    }

    @Prop() pool!: IPool;

    mounted() {
        if (!this.pool.erc721) {
            return;
        }
        this.$store.dispatch('erc721/read', this.pool.erc721._id).then(async (erc721) => {
            await this.$store.dispatch('erc721/listMetadata', erc721);
        });
    }
}
</script>
