<template>
  <div
    class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40"
    :style="{ zIndex: z }"
    @click.self="close"
  >
    <slot :close="close"></slot>
  </div>
</template>

<script>
export default {
  emits: ["close"],
  props: {
    z: {
      type: Number,
      default: 30,
    },
  },
  methods: {
    close() {
      this.$emit("close");
    },
  },
};
</script>