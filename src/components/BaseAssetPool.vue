<template>
    <b-card class="mt-3 mb-3">
        {{ address }}
        <hr />
        <div class="text-right">
            <b-link class="text-danger small mr-3" size="sm" href="#" @click="remove()">Remove</b-link>
            <b-button variant="primary" size="sm" @click="details()">Details</b-button>
        </div>
    </b-card>
</template>

<script lang="ts">
import { UserProfile } from '@/store/modules/account';
import { BButton, BCard, BLink } from 'bootstrap-vue';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
    components: {
        'b-link': BLink,
        'b-button': BButton,
        'b-card': BCard,
    },
})
export default class BaseAssetPool extends Vue {
    @Prop() address!: string;

    profile!: UserProfile;

    async mounted() {
        try {
            await this.$store.dispatch('assetPools/read', {
                profile: this.profile,
                poolAddress: this.address,
            });
        } catch (e) {
            console.error(e);
        }
    }

    remove() {
        return;
    }

    details() {
        return;
    }
}
</script>
