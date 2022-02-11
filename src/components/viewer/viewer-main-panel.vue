<template>
  <div class="">
    <viewer-album-index :items="albums" />
  </div>
</template>


<script>
import viewerAlbumIndex from "./viewer-album-index.vue";
import * as store from "../../api-loki.js";
export default {
  components: { viewerAlbumIndex },
  data: () => ({
    albums: [],
  }),
  async mounted() {
    console.log("main panel mouted");
    this.albums = await store.all();
    console.log(this.albums);
  },
};
</script>