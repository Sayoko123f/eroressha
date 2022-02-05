<template>
  <div class="flex justify-center">
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
} from "@heroicons/vue/outline";
export default {
  components: { PlusCircleIcon, CheckCircleIcon, XCircleIcon },
  data: () => ({
    // inputUrl: "https://www.wnacg.org/photos-index-aid-140449.html",
    inputUrl: "",
    isSupport: false,
    lock: false,
  }),
  computed: {},
  methods: {
    create() {
      console.log("create Click");
      if (!this.isSupport) {
        return;
      }
      window.api.send("download-create", this.inputUrl);
      this.inputUrl = "";
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