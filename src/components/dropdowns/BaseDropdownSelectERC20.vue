<template>
    <b-dropdown variant="link" class="dropdown-select">
        <template #button-content>
            <div v-if="erc20Token">
                <div class="d-flex align-items-center">
                    <img
                        v-if="!erc20Token._id"
                        :src="erc20Token.logoURI"
                        class="mr-3"
                        width="20"
                        :alt="erc20Token.name"
                    />
                    <base-identicon v-else class="mr-3" :size="20" variant="darker" :uri="erc20Token.logoURI" />
                    <strong class="mr-1">{{ erc20Token.symbol }}</strong> {{ erc20Token.name }}
                </div>
            </div>
            <div v-else>Provide ERC20 token contract address</div>
        </template>
        <b-dropdown-item-button key="custom-token-address" @click="onTokenListItemClick(null)">
            Provide ERC20 token contract address
        </b-dropdown-item-button>
        <b-dropdown-divider v-if="hasERC20s" />
        <b-dropdown-item-button
            :disabled="network !== erc20.network"
            :key="erc20._id"
            v-for="erc20 of erc20s"
            @click="onTokenListItemClick(erc20)"
        >
            <div class="d-flex align-items-center">
                <base-identicon class="mr-3" size="20" variant="darker" :uri="erc20.logoURI" />
                <strong class="mr-1">{{ erc20.symbol }}</strong> {{ erc20.name }}
            </div>
        </b-dropdown-item-button>
        <b-dropdown-divider />
        <b-dropdown-item-button
            :disabled="network !== NetworkProvider.Main"
            :key="erc20.address"
            v-for="erc20 of tokenList"
            @click="onTokenListItemClick(erc20)"
        >
            <img :src="erc20.logoURI" width="20" class="mr-3" :alt="erc20.name" />
            <strong>{{ erc20.symbol }}</strong> {{ erc20.name }}
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

const QUICKSWAP_TOKEN_LIST =
    'https://unpkg.com/quickswap-default-token-list@1.2.29/build/quickswap-default.tokenlist.json';

@Component({
    components: {
        BaseIdenticon,
    },
    computed: mapGetters({
        erc20s: 'erc20/all',
    }),
})
export default class ModalAssetPoolCreate extends Vue {
    NetworkProvider = NetworkProvider;
    erc20Token: PoolToken | null = null;
    tokenList: PoolToken[] = [];

    erc20s!: IERC20s;

    @Prop() network!: NetworkProvider;

    get hasERC20s() {
        return !!Object.values(this.erc20s).length;
    }

    async mounted() {
        this.$store.dispatch('erc20/list').then(() => {
            for (const id in this.erc20s) {
                this.$store.dispatch('erc20/read', id);
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
