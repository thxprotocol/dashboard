<template>
    <b-dropdown variant="link" class="dropdown-select">
        <template #button-content>
            <div class="d-flex align-items-center">
                <img v-if="!token._id" :src="token.logoURI" class="mr-3" width="20" :alt="token.name" />
                <base-identicon v-else class="mr-3" :size="20" variant="darker" :uri="token.logoURI" />
                <strong class="mr-1">{{ token.symbol }}</strong> {{ token.name }}
            </div>
        </template>
        <b-dropdown-item-button key="custom-token-address" @click="onTokenListItemClick(null)">
            Provide ERC721 token contract address
        </b-dropdown-item-button>
        <b-dropdown-divider v-if="hasERC721s" />
        <b-dropdown-item-button
            :disabled="network !== erc721.network"
            :key="erc721._id"
            v-for="erc721 of erc721s"
            @click="onTokenListItemClick(erc721)"
        >
            <div class="d-flex align-items-center">
                <base-identicon class="mr-3" size="20" variant="darker" :uri="erc721.logoURI" />
                <strong class="mr-1">{{ erc721.symbol }}</strong> {{ erc721.name }}
            </div>
        </b-dropdown-item-button>
    </b-dropdown>
</template>

<script lang="ts">
import { NetworkProvider, PoolToken } from '@/store/modules/pools';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import BaseIdenticon from '../BaseIdenticon.vue';
import { IERC721s } from '@/types/erc721';

@Component({
    components: {
        BaseIdenticon,
    },
    computed: mapGetters({
        erc721s: 'erc721/all',
    }),
})
export default class BaseDropdownSelectERC721 extends Vue {
    NetworkProvider = NetworkProvider;
    token: PoolToken | null = null;
    tokenList: PoolToken[] = [];

    erc721s!: IERC721s;

    @Prop() network!: NetworkProvider;

    get hasERC721s() {
        return !!Object.values(this.erc721s).length;
    }

    async mounted() {
        this.$store.dispatch('erc721/list').then(() => {
            for (const id in this.erc721s) {
                this.$store.dispatch('erc721/read', id);
            }
            this.token = Object.values(this.erc721s).length
                ? ((Object.values(this.erc721s)[0] as unknown) as PoolToken)
                : null;
        });

        this.$emit('selected', this.token);
    }

    onTokenListItemClick(token: PoolToken) {
        this.token = token;
        this.$emit('selected', this.token);
    }
}
</script>
