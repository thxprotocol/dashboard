<template>
    <div>
        <b-jumbotron
            class="jumbotron-header text-left"
            :style="{
                'background-image': `url(${require('../assets/thx_jumbotron.webp')})`,
            }"
        >
            <div class="container container-md pt-10 pb-5">
                <p class="brand-text">Account</p>
                <p>Manage personal details and your subscription.</p>
            </div>
        </b-jumbotron>
        <div class="container container-md" v-if="profile">
            <b-form-group>
                <label>Address:</label>
                <div class="input-group">
                    <b-form-input readonly id="address" v-model="profile.address" />
                    <div class="input-group-append">
                        <button class="btn btn-primary" type="button" v-clipboard:copy="profile.address">
                            <i class="far fa-copy m-0" style="font-size: 1.2rem"></i>
                        </button>
                    </div>
                </div>
            </b-form-group>
        </div>
    </div>
</template>

<script lang="ts">
import { BAlert, BButton, BCard, BFormGroup, BFormInput, BJumbotron } from 'bootstrap-vue';
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';

@Component({
    components: {
        BJumbotron,
        BCard,
        BAlert,
        BButton,
        BFormInput,
        BFormGroup,
    },
    computed: mapGetters({
        profile: 'account/profile',
    }),
})
export default class Account extends Vue {
    async mounted() {
        try {
            await this.$store.dispatch('account/getProfile');
        } catch (e) {
            debugger;
        }
    }
}
</script>
