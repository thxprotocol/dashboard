<template>
    <div>
        <label>Spotify Playlist URL:</label>
        <b-form-input
            :class="{ 'is-valid': trackId.length }"
            class="mb-3"
            placeholder="https://open.spotify.com/playlist/37i9dQZF1DWUFAJPVM3HTX"
            @input="onChange"
            v-model="url"
        />

        <b-alert show variant="info" v-if="trackId">
            Spotify Playlist ID: <strong> {{ trackId }}</strong>
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
        const result = url.replace(/.*\/(?:playlist)\/([\w-]{22}).*/, '$1');

        if (result !== this.url) {
            this.trackId = result;
            this.$emit('selected', { id: result });
        } else {
            this.trackId = '';
        }
    }
}
</script>
