<template>
    <b-dropdown variant="link" class="dropdown-select">
        <template #button-content>
            <div v-if="erc20Token && erc20Token.chainId === chainId">
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
            <div v-else>Select an ERC20 token</div>
        </template>
        <b-dropdown-item v-if="!hasERC20s"> No tokens available. </b-dropdown-item>

        <b-dropdown-item-button :key="erc20.address" v-for="erc20 of tokenList" @click="onTokenListItemClick(erc20)">
            <img :src="erc20.logoURI" width="20" class="mr-3" :alt="erc20.name" />
            <strong>{{ erc20.symbol }}</strong> {{ erc20.name }}
        </b-dropdown-item-button>
    </b-dropdown>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import axios from 'axios';
import { TERC20 } from '@/types/erc20';
import BaseIdenticon from '../BaseIdenticon.vue';
import { ChainId } from '@/types/enums/ChainId';

const QUICKSWAP_TOKEN_LIST =
    'https://unpkg.com/quickswap-default-token-list@1.2.40/build/quickswap-default.tokenlist.json';

@Component({
    components: {
        BaseIdenticon,
    },
})
export default class DropDownSelectQuickSwapTokeList extends Vue {
    tokenList: TERC20[] = [];
    erc20Token: TERC20 | null = null;

    @Prop() chainId!: ChainId;

    get hasERC20s() {
        return !!this.tokenList.length;
    }

    async mounted() {
        const { tokens } = await this.getLatestTokenList();

        this.tokenList = tokens;
    }

    async getLatestTokenList() {
        const r = await axios({
            method: 'GET',
            url: QUICKSWAP_TOKEN_LIST,
            withCredentials: false,
        });

        return r.data;
    }

    onTokenListItemClick(erc20: TERC20 | null) {
        this.erc20Token = erc20;
        this.$emit('selected', this.erc20Token);
    }
}
</script>
