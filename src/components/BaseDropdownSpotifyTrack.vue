<template>
    <div>
        <label>Spotify Track URL:</label>
        <b-form-input
            :class="{ 'is-valid': trackId.length }"
            class="mb-3"
            placeholder="https://open.spotify.com/track/3Xvvu6znhWYasoqzAbn2Hd"
            @input="onChange"
            v-model="url"
        />

        <b-alert show variant="info" v-if="trackId">
            Spotify Track ID: <strong> {{ trackId }}</strong>
        </b-alert>
    </div>
</template>

<script lang="ts">
import { BAlert, BButton, BFormInput, BInputGroup, BInputGroupAppend } from 'bootstrap-vue';
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';

@Component({
    components: {
        BAlert,
        BButton,
        BInputGroup,
        BFormInput,
        BInputGroupAppend,
    },
    computed: mapGetters({}),
})
export default class BaseDropdownSpotifyTrack extends Vue {
    url = '';
    trackId = '';

    onChange(url: string) {
        const result = url.replace(/.*\/(?:track)\/([\w-]{22}).*/, '$1');

        if (result !== this.url) {
            this.trackId = result;
            this.$emit('selected', { id: result });
        } else {
            this.trackId = '';
        }
    }
}
</script>
