<template v-slot="parent">
  <div
    class="
      flex flex-col
      justify-center
      gap-y-2
      items-center
      w-5/6
      min-h-[40%]
      relative
      bg-zinc-50
      shadow-md
    "
  >
    <x-icon
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
      @click.self.stop="close"
    />
    <h2 class="text-xl font-bold">New Mission</h2>
    <div class="w-2/3 relative h-11 flex items-center">
      <input
        class="
          w-full
          h-full
          py-2
          px-3
          outline-none
          border border-gray-100
          bg-white
          focus:border-sky-200 focus:ring-sky-200
          text-black
        "
        type="url"
        spellcheck="false"
        placeholder="https://example.com"
        v-model="inputUrl"
        @input="handleInput"
        @keydown.enter.stop="create"
      />
      <span class="absolute inline-block h-6 w-6 -left-7">
        <check-circleIcon class="h-6 w-6 text-green-600" v-show="isSupport" />
        <x-circleIcon class="h-6 w-6 text-red-600" v-show="!isSupport" />
      </span>
      <button
        class="absolute inline-block h-6 w-6 -right-8"
        :class="lock ? 'opacity-60' : 'opacity-100'"
        @click="create"
        :disabled="lock"
      >
        <plus-circleIcon class="h-6 w-6 hover:text-sky-500" />
      </button>
    </div>
  </div>
</template>

<script>
import {
  PlusCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  XIcon,
} from "@heroicons/vue/outline";
export default {
  components: { XIcon, PlusCircleIcon, CheckCircleIcon, XCircleIcon },
  data: () => ({
    // inputUrl: "https://www.wnacg.org/photos-index-aid-140449.html",
    inputUrl: "",
    isSupport: false,
    lock: false,
  }),
  props: {
    close: Function,
  },
  computed: {},
  methods: {
    create() {
      console.log("create Click");
      if (!this.isSupport) {
        return;
      }
      window.api.send("download-create", this.inputUrl);
      this.inputUrl = "";
      this.isSupport = false;
    },
    async isSupportUrl(url) {
      console.log("url", url);
      this.lock = true;
      this.isSupport = await window.api.isSupportUrl(url);
      this.lock = false;
    },
    handleInput(event) {
      this.isSupportUrl(event.target.value);
    },
  },
};
</script>