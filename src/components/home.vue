<script>
export default {};
</script>

<template>
  <router-link class="hover:text-sky-500" :to="{ name: 'download' }"
    >Download</router-link
  >
  <router-link class="hover:text-sky-500" :to="{ name: 'data-manager' }"
    >Data Manager</router-link
  >
  <router-link class="hover:text-sky-500" :to="{ name: 'viewer' }"
    >Viewer</router-link
  >
</template>