<template>
  <div class="">
    <div class="" v-for="item in items" :key="item.id">
      <h1>
        <router-link
          :to="{ name: 'viewer-album-detail', params: { id: item.id } }"
          >{{ item.title }}</router-link
        >
      </h1>
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
import * as store from "../../api-loki.js";
export default {
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
};
</script>