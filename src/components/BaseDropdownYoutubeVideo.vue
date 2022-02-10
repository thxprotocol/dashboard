<template>
    <div>
        <label>YouTube Video URL:</label>
        <b-form-input
            :class="{ 'is-valid': videoId.length }"
            class="mb-3"
            placeholder="https://www.youtube.com/watch?v=ckoegYJ1FR4"
            @input="onChange"
            v-model="url"
        />

        <b-alert show variant="info" v-if="videoId">
            YouTube Video ID: <strong> {{ videoId }}</strong>
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
export default class BaseDropdownYoutubeVideo extends Vue {
    url = '';
    videoId = '';

    onChange(url: string) {
        const result = /^https?:\/\/(www\.)?youtu\.be/.test(url)
            ? url.replace(/^https?:\/\/(www\.)?youtu\.be\/([\w-]{11}).*/, '$2')
            : url.replace(/.*\?v=([\w-]{11}).*/, '$1');

        if (result !== this.url) {
            this.videoId = result;
            this.$emit('selected', { id: result });
        } else {
            this.videoId = '';
        }
    }
}
</script>
