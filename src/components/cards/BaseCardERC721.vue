<template>
    <base-card :loading="erc721.loading" classes="cursor-pointer" @click="openTokenUrl()">
        <template #card-body v-if="erc721.name">
            <base-badge-network class="mr-2" :network="erc721.network" />
            <div class="my-3 d-flex align-items-center" v-if="erc721.name">
                <base-identicon class="mr-2" size="40" :rounded="true" variant="darker" :uri="erc721.logoURI" />
                <div>
                    <strong class="m-0">{{ erc721.symbol }}</strong>
                    <br />
                    {{ erc721.name }}
                </div>
            </div>

            <p>
                <span class="text-muted">Properties</span><br />
                <b-badge
                    v-b-tooltip
                    :title="`${prop.description} (${prop.propType})`"
                    variant="primary"
                    class="mr-1 mb-1"
                    :key="key"
                    v-for="(prop, key) of erc721.properties"
                >
                    {{ prop.name }}
                </b-badge>
            </p>
            <p>
                <span class="text-muted">Total supply</span><br />
                <strong class="font-weight-bold h3 text-primary"> {{ erc721.totalSupply }} </strong>
            </p>
        </template>
    </base-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import { NetworkProvider } from '@/store/modules/assetPools';
import { IAccount } from '@/types/account';
import BaseCard from './BaseCard.vue';
import BaseBadgeNetwork from '../badges/BaseBadgeNetwork.vue';
import BaseIdenticon from '../BaseIdenticon.vue';
import { ERC721Type, TERC721 } from '@/types/erc721';

@Component({
    components: {
        BaseCard,
        BaseBadgeNetwork,
        BaseIdenticon,
    },
    computed: mapGetters({
        profile: 'account/profile',
    }),
})
export default class BaseCardERC721 extends Vue {
    ERC721Type = ERC721Type;
    error = '';

    profile!: IAccount;

    @Prop() erc721!: TERC721;

    mounted() {
        this.$store.dispatch('erc721/read', this.erc721._id);
    }

    openTokenUrl() {
        const url = `https://${this.erc721.network === NetworkProvider.Test ? 'mumbai.' : ''}polygonscan.com/token/${
            this.erc721.address
        }`;
        return (window as any).open(url, '_blank').focus();
    }
}
</script>
