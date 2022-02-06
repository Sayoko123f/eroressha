<template>
  <div class="relative">
    <button class="hover:text-sky-500" @click="createPanelOpened = true">
      <span class="align-bottom">NEW</span>
      <plus-circle-icon class="inline-block h-6 w-6" />
    </button>
    <center-center-modal
      v-if="createPanelOpened"
      @close="handleCreatePanelClose"
      v-slot="parent"
    >
      <misson-create-panel :close="parent.close" />
    </center-center-modal>
    <misson-status-panel />
  </div>
</template>

<script>
import missonCreatePanel from "./misson-create-panel.vue";
import missonStatusPanel from "./misson-status-panel.vue";
import centerCenterModal from "../center-center-modal.vue";
import { PlusCircleIcon } from "@heroicons/vue/outline";
export default {
  components: {
    PlusCircleIcon,
    missonCreatePanel,
    missonStatusPanel,
    centerCenterModal,
  },
  data: () => ({
    createPanelOpened: false,
  }),
  methods: {
    handleCreatePanelClose() {
      this.createPanelOpened = false;
    },
  },
};
</script>