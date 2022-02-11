<template>
  <div class="flex flex-wrap justify-center items-center gap-8">
    <div class="w-[300px] group" v-for="item in items" :key="item.id">
      <div class="">
        <router-link
          :to="{ name: 'viewer-album-detail', params: { id: item.id } }"
        >
          <img
            class="
              w-[300px]
              h-[400px]
              transition
              group-hover:[filter:brightness(104%)]
              cursor-pointer
            "
            :src="`${item.savepath}/${item.coverName}`"
            alt=""
          />
        </router-link>
      </div>
      <div class="line-clamp-2 max-h-[4rem]">
        <router-link
          class="
            group-hover:text-sky-500 group-hover:underline
            underline-offset-2
          "
          :to="{ name: 'viewer-album-detail', params: { id: item.id } }"
        >
          {{ item.title }}
        </router-link>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    items: Array,
  },
};
</script>