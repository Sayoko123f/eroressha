<template>
  <div class="">
    <div class="" v-for="item in items" :key="item.id">
      <h1 class="text-center font-bold py-2">
        <router-link
          :to="{ name: 'viewer-album-detail', params: { id: item.id } }"
          >{{ item.title }}</router-link
        >
      </h1>
      <div class="flex justify-center">
        <!-- Full screen button -->
        <button
          class="px-2 py-1 hover:text-sky-500"
          @click="handleRequestFullscreen"
        >
          <arrows-expand-icon class="w-6 h-6 inline-block" />
        </button>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <div class="mx-auto" v-for="(name, i) in item.imageNames" :key="i">
          <img
            src="@/assets/loading.svg"
            :data-src="`${item.savepath}/${name}`"
            alt="Not Found"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { ArrowsExpandIcon } from "@heroicons/vue/solid";
import * as store from "../../api-loki.js";
export default {
  components: { ArrowsExpandIcon },
  data: () => ({
    items: [],
  }),
  async mounted() {
    const item = await store.findById(this.id);
    console.log(item);
    this.items = [item];

    // lazy loading images
    this.$nextTick(() => {
      const lazyImages = [...document.querySelectorAll("img[data-src]")];
      const lazyObserver = new IntersectionObserver(function (
        entries,
        observer
      ) {
        for (let i = 0; i < entries.length; i++) {
          if (entries[i].isIntersecting) {
            const target = entries[i].target;
            target.src = target.dataset.src;
            observer.unobserve(target);
          }
        }
      });
      for (let i = 0; i < lazyImages.length; i++) {
        lazyObserver.observe(lazyImages[i]);
      }
    });
  },
  computed: {
    id() {
      return parseInt(this.$route.params.id);
    },
  },
  methods: {
    handleRequestFullscreen() {
      if (document.webkitIsFullScreen) {
        document.exitFullscreen();
      } else {
        document.documentElement.requestFullscreen();
      }
    },
  },
};
</script>