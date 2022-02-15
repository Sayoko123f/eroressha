<template>
  <div class="">
    <span v-for="i in maxScore" :key="i">
      <fill-star-icon
        class="h-6 w-6 inline-block text-sky-500 cursor-pointer"
        v-if="i <= score"
        @click="$emit('change', i)"
      />
      <not-fill-star-icon
        class="
          h-6
          w-6
          inline-block
          text-black
          hover:text-sky-500
          cursor-pointer
        "
        v-if="i > score"
        @click="$emit('change', i)"
      />
    </span>
  </div>
</template>

<script>
import { StarIcon as notFillStarIcon } from "@heroicons/vue/outline";
import { StarIcon as fillStarIcon } from "@heroicons/vue/solid";
export default {
  components: { fillStarIcon, notFillStarIcon },
  emits: ["change"],
  props: {
    score: Number, // min: 1, max: maxScore
    maxScore: {
      type: Number,
      default: 5,
    },
  },
};
</script>
