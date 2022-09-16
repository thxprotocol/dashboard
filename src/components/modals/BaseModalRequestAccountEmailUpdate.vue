<template>
    <b-modal
        size="lg"
        :title="`Account Email Update`"
        no-close-on-backdrop
        no-close-on-esc
        centered
        :hide-footer="true"
        id="modalRequestAccountEmailUpdate"
    >
        <div class="pt-5 pb-3 text-center">
            <p class="text-center">
                <strong>Your Email address is not set yet, </strong>
            </p>
            <p class="text-center">please go to the Account page to specify the email.</p>

            <b-button
                size="m"
                class="rounded-pill mt-3"
                variant="primary"
                @click="$emit('clicked')"
                :href="publicUrl + '/account'"
            >
                Go to the Account page
            </b-button>
        </div>
    </b-modal>
</template>

<script lang="ts">
import { PUBLIC_URL } from '@/utils/secrets';
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class BaseModalRequestAccountEmailUpdate extends Vue {
    publicUrl = PUBLIC_URL;
}
</script>
