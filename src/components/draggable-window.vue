<template>
  <div class="w-96 absolute shadow-lg" ref="win">
    <div
      class="bg-blue-200 hover:bg-blue-300 cursor-move p-2 font-bold relative"
      @mousedown.self.stop="handleMouseDown"
    >
      {{ heading }}
      <span
        class="
          absolute
          right-2
          top-2
          h-6
          w-6
          text-gray-200
          hover:text-gray-400
          cursor-pointer
        "
        @click.stop="close"
      >
        <x-icon />
      </span>
    </div>
    <div
      class="p-2 bg-zinc-50 overflow-auto max-h-[384px] flex flex-col"
      ref="box"
    >
      <div v-for="(line, i) in lines" :key="i">{{ line }}</div>
    </div>
  </div>
</template>
<script>
import { XIcon } from "@heroicons/vue/outline";
export default {
  components: { XIcon },
  emits: ["close"],
  props: {
    lines: {
      type: Array,
      default: () => [],
    },
    heading: {
      type: String,
      default: "Heading",
    },
  },
  data: () => ({
    canMove: false,
  }),
  beforeUnmount() {
    document.onmouseup = null;
    document.onmousemove = null;
  },
  watch: {
    lines: {
      handler: function () {
        this.$nextTick(() => {
          this.$refs.box.scrollTop = this.$refs.box.scrollHeight;
        });
      },
      deep: true,
    },
  },
  methods: {
    handleMouseDown(e) {
      let pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;
      const handleMouseUp = () => (this.canMove = false);
      const handleMouseMove = (e) => {
        if (!this.canMove) {
          return;
        }
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        const win = this.$refs.win;
        win.style.top = win.offsetTop - pos2 + "px";
        win.style.left = win.offsetLeft - pos1 + "px";
      };
      this.canMove = true;
      e.preventDefault();
      pos3 = e.clientX;
      pos4 = e.clientY;

      document.onmousemove = handleMouseMove;
      document.onmouseup = handleMouseUp;
    },
    close() {
      this.$emit("close");
    },
  },
};
</script>