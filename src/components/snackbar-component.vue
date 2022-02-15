<template>
  <div class="absolute left-0 right-0 bottom-0 bg-blue-200 w-fit mx-auto">
    <span class="px-2 py-1">{{ msg }}</span>
    <x-icon
      v-if="!autoClose"
      class="
        h-5
        w-5
        inline-block
        text-gray-500
        hover:text-gray-300
        cursor-pointer
      "
      @click="$emit('close')"
    />
  </div>
</template>

<script>
import { XIcon } from "@heroicons/vue/solid";
export default {
  components: { XIcon },
  emits: ["close"],
  props: {
    msg: String,
    autoClose: {
      type: Boolean,
      default: false,
    },
    autoCloseMs: {
      type: Number,
      default: 3000,
    },
  },
  data: () => ({
    timer: null,
  }),
  mounted() {
    if (this.autoClose) {
      this.timer = window.setTimeout(() => {
        this.timer = null;
        this.$emit("close");
      }, this.autoCloseMs);
    }
  },
  beforeUnmount() {
    if (this.timer) {
      window.clearTimeout(this.timer);
    }
  },
};
</script>