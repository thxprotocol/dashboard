<template>
    <base-modal
        size="lg"
        id="modalPoolMemberAdd"
        title="Add new member to this Pool"
        :hide-footer="loading"
        :loading="loading"
        :error="error"
    >
        <template template #modal-body v-if="!loading">
            <form v-on:submit.prevent="submit" id="formPoolMemberAdd">
                <b-form-group>
                    <b-input-group>
                        <b-form-input
                            type="text"
                            v-model="memberAddress"
                            placeholder="Please input the member address"
                        />
                    </b-input-group>
                </b-form-group>
            </form>
        </template>

        <template #btn-primary>
            <b-button
                :disabled="loading"
                class="rounded-pill"
                type="submit"
                form="formPoolMemberAdd"
                variant="primary"
                block
            >
                Add
            </b-button>
        </template>
    </base-modal>
</template>

<script lang="ts">
import { IPool } from '@/store/modules/pools';
import { Component, Prop, Vue } from 'vue-property-decorator';
import BaseModal from './BaseModal.vue';

@Component({
    components: {
        BaseModal,
    },
})
export default class BaseModalMemberAdd extends Vue {
    memberAddress = '';
    loading = false;
    error = '';

    @Prop() pool!: IPool;
    @Prop() onSuccess!: () => void;

    async submit() {
        this.loading = true;
        await this.$store.dispatch('pools/addMember', {
            pool: this.pool,
            address: this.memberAddress,
        });
        this.onSuccess();
        this.loading = false;
    }
}
</script>
