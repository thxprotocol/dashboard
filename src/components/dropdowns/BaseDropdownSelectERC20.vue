<template>
    <b-dropdown variant="link" class="dropdown-select">
        <template #button-content>
            <div v-if="erc20Token">
                <img :src="erc20Token.logoURI" width="20" class="mr-2" :alt="erc20Token.name" />
                <strong>{{ erc20Token.symbol }}</strong> {{ erc20Token.name }}
            </div>
            <div v-else>Other ERC20 contract</div>
        </template>
        <b-dropdown-item-button :key="erc20._id" v-for="erc20 of erc20s" @click="onTokenListItemClick(erc20)">
            <img :src="erc20.logoURI" width="20" class="mr-3 bg-darker" style="border-radius: 50%" :alt="erc20.name" />
            <strong>{{ erc20.symbol }}</strong> {{ erc20.name }}
        </b-dropdown-item-button>
        <b-dropdown-divider />
        <b-dropdown-item-button key="custom-token-address" @click="onTokenListItemClick(null)">
            Provide ERC20 token contract address
        </b-dropdown-item-button>
        <b-dropdown-divider />
        <b-dropdown-item-button :key="erc20.address" v-for="erc20 of tokenList" @click="onTokenListItemClick(erc20)">
            <img :src="erc20.logoURI" width="20" class="mr-3" :alt="erc20.name" />
            <strong>{{ erc20.symbol }}</strong> {{ erc20.name }}
        </b-dropdown-item-button>
    </b-dropdown>
</template>

<script lang="ts">
import { NetworkProvider, PoolToken } from '@/store/modules/assetPools';
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import axios from 'axios';
import { IERC20s } from '@/types/erc20';

const QUICKSWAP_TOKEN_LIST =
    'https://unpkg.com/quickswap-default-token-list@1.0.99/build/quickswap-default.tokenlist.json';

@Component({
    computed: mapGetters({
        erc20s: 'erc20/all',
    }),
})
export default class ModalAssetPoolCreate extends Vue {
    erc20Token: PoolToken | null = null;
    tokenList: PoolToken[] = [];
    network: NetworkProvider = NetworkProvider.Test;

    erc20s!: IERC20s;

    async mounted() {
        await this.$store.dispatch('erc20/list');
        const { tokens } = await this.getLatestTokenList();

        this.tokenList = tokens;
        this.erc20Token = Object.values(this.erc20s).length
            ? ((Object.values(this.erc20s)[0] as unknown) as PoolToken)
            : this.tokenList[0];

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
