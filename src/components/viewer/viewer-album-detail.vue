<template>
  <div class="">
    <div class="border relative" v-for="item in items" :key="item.id">
      <!-- To data manager -->
      <router-link
        class="absolute right-2 top-2 hover:text-sky-500"
        :to="{ name: 'data-manager-show', params: { id: item.id } }"
      >
        <pencil-alt-icon class="w-6 h-6" />
      </router-link>
      <h1 class="text-center font-bold">{{ item.title }}</h1>
      <div class="flex justify-center">
        <!-- Cover -->
        <div class="border">
          <div class="">
            <img :src="`${item.savepath}/${item.coverName}`" alt="" />
          </div>
        </div>
        <!-- Information -->
        <div class="border">
          <!-- Title -->
          <div class="flex">
            <div class="w-fit flex flex-col">
              <p>Pages:</p>
            </div>
            <div class="flex flex-col">
              <p>{{ item.imageLength }}</p>
            </div>
          </div>
          <!-- Button -->
          <div class="">
            <router-link
              :to="{ name: 'viewer-album-gallery', params: { id: item.id } }"
              >VIEW</router-link
            >
          </div>
        </div>
      </div>
      <!-- Preview images -->
      <div class="flex flex-wrap gap-2 justify-center">
        <div class="w-36" v-for="(name, i) in item.imageNames" :key="i">
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
import { PencilAltIcon } from "@heroicons/vue/solid";
export default {
  components: { PencilAltIcon },
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
  methods: {},
};
</script>