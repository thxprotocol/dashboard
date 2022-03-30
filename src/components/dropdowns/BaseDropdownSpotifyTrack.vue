<template>
    <div>
        <label>Your Tracks:</label>
        <b-dropdown variant="link" class="dropdown-select bg-white mb-3">
            <template #button-content>
                <div v-if="item" class="d-flex align-items-center text-overflow-ellipsis">
                    <img
                        :src="item.track.album.images[0].url"
                        v-if="item.track.album.images[0].url"
                        width="30"
                        class="mr-2"
                        :alt="item.track.name"
                    />
                    {{ item.track.name }}
                </div>
            </template>
            <b-dropdown-item-button :key="item.track.id" v-for="item of items" @click="onItemClick(item)">
                <div class="d-flex overflow-hidden">
                    <div class="d-flex align-items-center">
                        <img
                            :src="item.track.album.images[0].url"
                            v-if="item.track.album.images[0].url"
                            height="50"
                            width="auto"
                            class="mr-3"
                            :alt="item.track.name"
                        />
                    </div>
                    <div class="d-flex align-items-center">
                        <div>
                            {{ item.track.name }}
                        </div>
                    </div>
                </div>
            </b-dropdown-item-button>
        </b-dropdown>

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
import { Component, Prop, Vue } from 'vue-property-decorator';
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
    @Prop() items!: any;

    url = '';
    trackId = '';

    item: any = null;

    mounted() {
        this.item = this.items[0];
        this.$emit('selected', { id: this.item.track.id });
    }

    onItemClick(item: any) {
        this.item = item;
        this.$emit('selected', { id: this.item.track.id });
    }

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
