<template>
  <div class="">
    <div class="">
      <button
        class="px-2 py-1 border-b-2"
        :class="
          missonFilterByStatus === -1 ? 'border-lime-500' : 'border-white'
        "
        @click="handleFilterClick(-1)"
      >
        All
      </button>
      <button
        class="px-2 py-1 border-b-2"
        :class="missonFilterByStatus === 1 ? 'border-lime-500' : 'border-white'"
        @click="handleFilterClick(1)"
      >
        Undone
      </button>
      <button
        class="px-2 py-1 border-b-2"
        :class="missonFilterByStatus === 2 ? 'border-lime-500' : 'border-white'"
        @click="handleFilterClick(2)"
      >
        Done
      </button>
    </div>
  </div>
  <div class="border p-1">
    <div class="flex">
      <div class="w-1/2">URL</div>
      <div class="w-1/6">Status</div>
      <div class="w-2/6">Progress</div>
    </div>
  </div>
  <div class="border p-1 h-48 overflow-y-auto">
    <div
      class="flex w-full py-1 hover:bg-lime-100"
      :class="selectedMissonIndex === i ? 'bg-lime-50' : 'bg-white'"
      v-for="(item, i) in getMissons"
      :key="item.PID"
      @click="selectedMissonIndex = i"
    >
      <div class="w-1/2 truncate" :title="item.albumUrl">
        {{ item.albumUrl }}
      </div>
      <div class="w-1/6 truncate">{{ showStatus(item.status) }}</div>
      <div class="w-2/6">
        <div class="w-full h-full relative bg-gray-100">
          <div
            class="absolute h-full bg-lime-500"
            :style="{ width: `${Math.floor(item.progress * 100)}%` }"
          ></div>
        </div>
      </div>
    </div>
  </div>
  <!-- Detail -->
  <div class="border p-1 h-48">
    <div class="" v-if="selectedMissonIndex !== -1">
      <!-- Start download button -->
      <div class="">
        <button
          class="hover:bg-lime-200 px-4 py-2 tracking-wide"
          :class="
            selectedMisson.status === 0
              ? 'cursor-pointer'
              : 'cursor-not-allowed'
          "
          :disabled="selectedMisson.status !== 0"
          @click="handleStartClick"
        >
          START
        </button>
      </div>
      <div class="">
        Title:
        <span class="ml-1" v-if="selectedMisson.meta.title">{{
          selectedMisson.meta.title
        }}</span>
      </div>
    </div>
  </div>
  <!-- Log -->
  <div class="border p-1 h-48 overflow-y-auto">
    <div class="flex flex-col" v-if="selectedMissonIndex !== -1">
      <div class="" v-for="(str, i) in selectedMisson.logs" :key="i">
        {{ str }}
      </div>
    </div>
  </div>
  <div class="">
    <button class="px-2 py-1 hover:bg-lime-100" @click="allStart">
      ALL START
    </button>
  </div>
</template>

<script>
export default {
  data: () => ({
    missons: [],
    selectedMissonIndex: -1,
    missonFilterByStatus: -1,
  }),
  mounted() {
    window.api.receive("download-log", (PID, message) => {
      console.log("In status-panel, event download-log.");
      this.addLog(PID, message);
    });
    window.api.receive("download-update", (args) => {
      console.log("In status-panel, event download-update.");
      console.log(args);
      this.updateOrInsertMisson(args);
    });
    window.api.receive("download-progress", (PID, progress) => {
      console.log("In status-panel, event download-progress.");
      console.log("progress:", progress);
      const index = this.missons.findIndex((e) => e.PID === PID);
      this.missons[index].progress = progress;
    });
  },
  computed: {
    selectedMisson() {
      return this.getMissons[this.selectedMissonIndex];
    },
    getMissons() {
      if (this.missonFilterByStatus === 2) {
        return this.missons.filter((e) => e.status === 2);
      }
      if (this.missonFilterByStatus === 1 || this.missonFilterByStatus === 0) {
        return this.missons.filter((e) => e.status === 1 || e.status === 0);
      }
      return this.missons;
    },
  },
  methods: {
    showStatus(status) {
      switch (status) {
        case 0:
          return "Ready";
        case 1:
          return "Running";
        case 2:
          return "Finished";
        default:
          throw new Error(`Unexpected status ${status}`);
      }
    },
    checkMissonData(item) {
      if (typeof item.albumUrl !== "string") {
        throw new TypeError("albumUrl must be string");
      }
      if (
        !Number.isFinite(item.progress) ||
        item.progress < 0 ||
        item.progress > 1
      ) {
        throw new RangeError("progress expect between 0 and 1.");
      }
      if (!Number.isSafeInteger(item.downloaded) || item.downloaded < 0) {
        throw new TypeError("Downloaded must be positive integer.");
      }
    },
    handleFilterClick(status) {
      this.selectedMissonIndex = -1;
      switch (status) {
        case 1:
          this.missonFilterByStatus = 1;
          return;
        case 2:
          this.missonFilterByStatus = 2;
          return;
        default:
          this.missonFilterByStatus = -1;
          return;
      }
    },
    updateOrInsertMisson(item) {
      this.checkMissonData(item);
      const { PID } = item;
      const index = this.missons.findIndex((e) => e.PID === PID);
      if (index === -1) {
        this.missons.push(item);
        return;
      }
      for (const o in item) {
        this.missons[index][o] = item[o];
      }
    },
    handleStartClick() {
      console.log(this.selectedMisson);
      window.api.send("download-start", this.selectedMisson.PID);
    },
    addLog(PID, message) {
      const index = this.missons.findIndex((e) => e.PID === PID);
      if (index === -1) {
        console.warn(`Not found misson PID: ${PID}`);
        return;
      }
      this.missons[index].logs.push(message);
    },
    allStart() {
      this.missons
        .filter((e) => e.status === 0)
        .forEach((i) => {
          window.api.send("download-start", i.PID);
        });
    },
  },
};
</script>