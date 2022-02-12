<template>
  <div class="relative min-h-screen h-fit">
    <div class="text-center py-4">
    <button class="hover:text-sky-500" @click="createPanelOpened = true">
      <span class="align-bottom tracking-wide">NEW MISSION</span>
      <plus-circle-icon class="inline-block h-6 w-6" />
    </button>
    </div>
    <center-center-modal
      v-if="createPanelOpened"
      @close="handleCreatePanelClose"
      v-slot="parent"
    >
      <misson-create-panel :close="parent.close" />
    </center-center-modal>
    <misson-status-panel class="px-4"/>
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