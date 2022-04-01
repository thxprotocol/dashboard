<template>
    <b-modal
        size="lg"
        title="Create Promo Code"
        id="modalPromoCodeCreate"
        no-close-on-backdrop
        no-close-on-esc
        centered
        @show="onShow"
    >
        <b-alert variant="danger" show v-if="error && !loading">
            {{ error }}
        </b-alert>
        <b-form-group>
            Title: <b-form-input type="text" v-model="title" />
            <div class="text-right small" :class="description.length >= titleMaxLength ? 'text-danger' : 'text-muted'">
                {{ title.length }}/50
            </div>
        </b-form-group>
        <b-form-group>
            Description: <b-form-textarea v-model="description" />
            <div class="text-right small" :class="description.length >= descMaxLength ? 'text-danger' : 'text-muted'">
                {{ description.length }}/{{ descMaxLength }}
            </div></b-form-group
        >
        <b-form-group>
            Promo Code: <b-form-input type="text" v-model="value" />
            <div class="text-right small" :class="description.length >= descMaxLength ? 'text-danger' : 'text-muted'">
                {{ value.length }}/{{ valueMaxLength }}
            </div></b-form-group
        >
        <b-form-group> Price: <b-form-input type="number" min="0" v-model="price" /> </b-form-group>
        <template v-slot:modal-footer="{}">
            <b-button
                @click="submit()"
                :disabled="loading || !isSubmitEnabled"
                class="rounded-pill"
                variant="primary"
                block
            >
                Create Promo Code
            </b-button>
        </template>
    </b-modal>
</template>

<script lang="ts">
import { AssetPool } from '@/store/modules/assetPools';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({})
export default class ModalPromoCodeCreate extends Vue {
    error = '';
    loading = false;
    titleMaxLength = 50;
    descMaxLength = 255;
    valueMaxLength = 50;

    title = '';
    description = '';
    price = 0;
    value = '';

    @Prop() assetPool!: AssetPool;

    onShow() {
        this.title = '';
        this.description = '';
        this.price = 0;
        this.value = '';
    }

    get isSubmitEnabled() {
        return this.price > 0 && this.value.length > 1 && this.title.length > 3;
    }

    async submit() {
        this.loading = true;

        if (!this.isSubmitEnabled) {
            return;
        }

        const { error } = await this.$store.dispatch('promoCodes/create', {
            title: this.title,
            description: this.description,
            price: this.price,
            value: this.value,
            poolAddress: this.assetPool.address,
        });

        if (error) {
            this.error = error;
        } else {
            this.$bvModal.hide('modalPromoCodeCreate');
        }

        this.loading = false;
    }
}
</script>
