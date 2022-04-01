<template>
    <base-card>
        <template #default="{ isLoading }">
            <b-alert variant="danger" show v-if="error">{{ error }}</b-alert>
            {{ isLoading }}
            <div class="mb-3 d-flex align-items-center" v-if="erc20.name">
                <img
                    height="30"
                    class="mr-3"
                    :src="`https://avatars.dicebear.com/api/identicon/${erc20.address}.svg`"
                    alt=""
                />
                <strong> {{ erc20.name }} </strong>
            </div>
            <hr />
            <b-button variant="primary" block> Configure</b-button>
        </template>
    </base-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import BaseCard from './BaseCard.vue';
import { TERC20 } from '@/types/erc20';

@Component({
    components: {
        BaseCard,
    },
    computed: mapGetters({
        profile: 'account/profile',
        spotify: 'account/spotify',
    }),
})
export default class BaseCardERC20 extends Vue {
    isLoading!: true;
    error = '';

    @Prop() erc20!: TERC20;

    async mounted() {
        this.$store.dispatch('erc20/read', this.erc20._id).then(() => {
            //
        });
    }
}
</script>
