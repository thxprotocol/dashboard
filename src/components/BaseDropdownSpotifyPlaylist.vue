<template>
    <div>
        <label>Your Playlists:</label>
        <b-dropdown variant="link" class="dropdown-select bg-white mb-3">
            <template #button-content>
                <div v-if="item" class="d-flex align-items-center text-overflow-ellipsis">
                    <img :src="item.images[0].url" v-if="item.images[0].url" width="30" class="mr-2" :alt="item.name" />
                    {{ item.name }}
                </div>
            </template>
            <b-dropdown-item-button :key="item.id" v-for="item of items" @click="onItemClick(item)">
                <div class="d-flex">
                    <div class="d-flex align-items-center">
                        <img
                            :src="item.images[0].url"
                            v-if="item.images[0].url"
                            height="50"
                            width="auto"
                            class="mr-3"
                            :alt="item.name"
                        />
                    </div>
                    <div class="d-flex align-items-center">
                        <div>
                            {{ item.name }}
                        </div>
                    </div>
                </div>
            </b-dropdown-item-button>
        </b-dropdown>

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
export default class BaseDropdownSpotifyPlaylists extends Vue {
    @Prop() items!: any;

    url = '';
    trackId = '';

    item: any = null;

    mounted() {
        this.item = this.items[0];
        this.$emit('selected', { id: this.item.id });
    }

    onItemClick(item: any) {
        this.item = item;
        this.$emit('selected', item);
    }

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
