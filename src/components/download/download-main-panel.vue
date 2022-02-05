<template>
  <misson-create-panel />
  <misson-status-panel />
</template>

<script>
import missonCreatePanel from "./misson-create-panel.vue";
import missonStatusPanel from "./misson-status-panel.vue";
export default {
  components: { missonCreatePanel, missonStatusPanel },
};
</script>