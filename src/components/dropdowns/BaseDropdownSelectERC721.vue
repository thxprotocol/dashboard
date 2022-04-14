<template>
    <b-dropdown variant="link" class="dropdown-select">
        <template #button-content>
            <div v-if="erc721Token">
                <div class="d-flex align-items-center">
                    <img
                        v-if="!erc721Token._id"
                        :src="erc721Token.logoURI"
                        class="mr-3"
                        width="20"
                        :alt="erc721Token.name"
                    />
                    <base-identicon v-else class="mr-3" :size="20" variant="darker" :uri="erc721Token.logoURI" />
                    <strong class="mr-1">{{ erc721Token.symbol }}</strong> {{ erc721Token.name }}
                </div>
            </div>
            <div v-else>Provide ERC721 token contract address</div>
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
import { NetworkProvider, PoolToken } from '@/store/modules/assetPools';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import axios from 'axios';
import { IERC20s } from '@/types/erc20';
import BaseIdenticon from '../BaseIdenticon.vue';
import { IERC721s } from '@/types/erc721';

const QUICKSWAP_TOKEN_LIST =
    'https://unpkg.com/quickswap-default-token-list@1.2.29/build/quickswap-default.tokenlist.json';

@Component({
    components: {
        BaseIdenticon,
    },
    computed: mapGetters({
        erc20s: 'erc20/all',
        erc721s: 'erc721/all',
    }),
})
export default class ModalAssetPoolCreate extends Vue {
    NetworkProvider = NetworkProvider;
    erc20Token: PoolToken | null = null;
    tokenList: PoolToken[] = [];

    erc20s!: IERC20s;
    erc721s!: IERC721s;

    @Prop() network!: NetworkProvider;

    get hasERC20s() {
        return !!Object.values(this.erc20s).length;
    }
    get hasERC721s() {
        return !!Object.values(this.erc721s).length;
    }

    async mounted() {
        this.$store.dispatch('erc20/list').then(() => {
            for (const id in this.erc20s) {
                this.$store.dispatch('erc20/read', id);
            }
        });

        this.$store.dispatch('erc721/list').then(() => {
            for (const id in this.erc721s) {
                this.$store.dispatch('erc721/read', id);
            }
        });

        const { tokens } = await this.getLatestTokenList();

        this.tokenList = tokens;
        this.erc20Token = Object.values(this.erc20s).length
            ? ((Object.values(this.erc20s)[0] as unknown) as PoolToken)
            : null;

        this.$emit('selected', this.erc20Token);
    }

    async getLatestTokenList() {
        const r = await axios({
            method: 'GET',
            url: QUICKSWAP_TOKEN_LIST,
            withCredentials: false,
        });

        return r.data;
    }

    onTokenListItemClick(erc20: PoolToken) {
        this.erc20Token = erc20;
        this.$emit('selected', this.erc20Token);
    }
}
</script>
