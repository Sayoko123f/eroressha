<script>
import {
  DocumentDownloadIcon,
  DatabaseIcon,
  EyeIcon,
} from "@heroicons/vue/solid";
export default {
  components: { DocumentDownloadIcon, DatabaseIcon, EyeIcon },
};
</script>

<template>
  <div class="flex flex-wrap h-screen">
    <div class="w-1/2 border flex flex-col items-center justify-center">
      <router-link
        class="hover:text-sky-500 flex flex-col items-center justify-center"
        :to="{ name: 'download' }"
      >
        <document-download-icon class="w-20 h-20" />
        <span class="text-2xl font-bold">Downloader</span>
      </router-link>
    </div>
    <div class="w-1/2 border flex flex-col items-center justify-center">
      <router-link
        class="hover:text-sky-500 flex flex-col items-center justify-center"
        :to="{ name: 'data-manager' }"
      >
        <database-icon class="w-20 h-20" />
        <span class="text-2xl font-bold">Data Manager</span>
      </router-link>
    </div>
    <div class="w-full border flex flex-col items-center justify-center">
      <router-link
        class="hover:text-sky-500 flex flex-col items-center justify-center"
        :to="{ name: 'viewer' }"
      >
        <eye-icon class="w-20 h-20" />
        <span class="text-2xl font-bold">Viewer</span>
      </router-link>
    </div>
  </div>
</template>