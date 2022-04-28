<template>
    <b-dropdown variant="link" class="dropdown-select">
        <template #button-content>
            <div class="d-flex align-items-center" v-if="token && !token.loading">
                <base-identicon class="mr-3" :size="20" variant="darker" :uri="token.logoURI" />
                <strong class="mr-1">{{ token.symbol }}</strong> {{ token.name }}
            </div>
        </template>
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
                this.$store.dispatch('erc721/read', id).then(() => {
                    if (!this.token) {
                        this.token = (this.erc721s[id] as unknown) as PoolToken;
                        this.$emit('selected', this.token);
                    }
                });
            }
        });
    }

    onTokenListItemClick(token: PoolToken) {
        this.token = token;
        this.$emit('selected', this.token);
    }
}
</script>
