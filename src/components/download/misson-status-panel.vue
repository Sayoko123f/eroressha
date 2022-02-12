<template>
  <div>
    <div class="">
      <div class="">
        <button
          class="
            px-2
            py-1
            border-b-2
            hover:border-lime-600 hover:opacity-100
            transtion-color
          "
          :class="
            missionFilterByStatus === -1
              ? 'border-lime-500 opacity-100'
              : 'border-white opacity-60'
          "
          @click="handleFilterClick(-1)"
        >
          All
        </button>
        <button
          class="
            px-2
            py-1
            border-b-2
            hover:border-lime-600 hover:opacity-100
            transtion-color
          "
          :class="
            missionFilterByStatus === 1
              ? 'border-lime-500 opacity-100'
              : 'border-white opacity-60'
          "
          @click="handleFilterClick(1)"
        >
          Undone
        </button>
        <button
          class="
            px-2
            py-1
            border-b-2
            hover:border-lime-600 hover:opacity-100
            transtion-color
          "
          :class="
            missionFilterByStatus === 2
              ? 'border-lime-500 opacity-100'
              : 'border-white opacity-60'
          "
          @click="handleFilterClick(2)"
        >
          Done
        </button>
      </div>
    </div>
    <div class="border p-1">
      <div class="flex">
        <div class="w-1/2 truncate">URL</div>
        <div class="w-1/6 truncate">Status</div>
        <div class="w-2/6 truncate">Progress</div>
      </div>
    </div>
    <div class="border p-1 h-64 overflow-y-auto">
      <div
        class="flex w-full py-1 hover:bg-lime-100"
        :class="selectedMissionIndex === i ? 'bg-lime-50' : 'bg-white'"
        v-for="(item, i) in getMissions"
        :key="item.PID"
        @click="selectedMissionIndex = i"
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
    <!-- Log Modal -->
    <div class="">
      <div class="" v-for="index in showLogModals" :key="index">
        <draggable-window
          :heading="missions[index].albumUrl"
          :lines="missions[index].logs"
          @close="() => handleLogModalClose(index)"
        />
      </div>
    </div>
    <!-- Detail -->
    <div class="border p-1 h-48">
      <div class="" v-if="selectedMissionIndex !== -1">
        <!-- Start download button -->
        <div class="flex gap-2">
          <button
            class="hover:bg-lime-200 px-4 py-2 tracking-wide"
            :class="
              selectedMission.status === 0
                ? 'cursor-pointer'
                : 'cursor-not-allowed'
            "
            :disabled="selectedMission.status !== 0"
            @click="handleStartClick"
          >
            <span class="align-bottom tracking-wide">START</span>
            <play-icon class="inline-block h-6 w-6" />
          </button>
          <button
            class="hover:bg-lime-200 px-4 py-2 tracking-wide cursor-pointer"
            @click="handleShowLogModalClick"
          >
            LOG
          </button>
          <button
            class="hover:bg-lime-200 px-4 py-2 tracking-wide cursor-pointer"
            @click="handleOpenExplorer"
          >
            <span class="align-bottom tracking-wide"
              >Reveal in File Explorer</span
            >
            <folder-open-icon class="inline-block h-6 w-6" />
          </button>
        </div>
        <div class="">
          Title:
          <span class="ml-1" v-if="selectedMission.meta.title">{{
            selectedMission.meta.title
          }}</span>
        </div>
        <div class="">
          Savepath:
          <span class="ml-1" v-if="selectedMission.meta.savepath">{{
            selectedMission.meta.savepath
          }}</span>
        </div>
        <div class="">
          Image Pages:
          <span class="ml-1" v-if="selectedMission.meta.imageLength">{{
            selectedMission.meta.imageLength
          }}</span>
        </div>
      </div>
    </div>
    <div class="">
      <button class="px-2 py-1 hover:text-sky-500" @click="allStart">
        <span class="align-bottom tracking-wide">ALL START</span>
        <play-icon class="inline-block h-6 w-6" />
      </button>
    </div>
  </div>
</template>

<script>
import { insert as idbInsert } from "../../api-idb.js";
import { PlayIcon, FolderOpenIcon } from "@heroicons/vue/solid";
import draggableWindow from "../draggable-window.vue";
export default {
  components: { draggableWindow, PlayIcon, FolderOpenIcon },
  data: () => ({
    missions: [],
    selectedMissionIndex: -1,
    missionFilterByStatus: -1,
    showLogModals: [], // index in missions.
  }),
  mounted() {
    window.api.receive("download-log", (PID, message) => {
      this.addLog(PID, message);
    });
    window.api.receive("download-update", (args) => {
      console.log("In status-panel, event download-update.");
      console.log(args);
      this.updateOrInsertMission(args);
    });
    window.api.receive("download-progress", (PID, progress) => {
      console.log("progress:", progress);
      const index = this.missions.findIndex((e) => e.PID === PID);
      this.missions[index].progress = progress;
    });
  },
  computed: {
    selectedMission() {
      return this.getMissions[this.selectedMissionIndex];
    },
    getMissions() {
      if (this.missionFilterByStatus === 2) {
        return this.missions.filter((e) => e.status === 2);
      }
      if (
        this.missionFilterByStatus === 1 ||
        this.missionFilterByStatus === 0
      ) {
        return this.missions.filter((e) => e.status === 1 || e.status === 0);
      }
      return this.missions;
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
    checkMissionData(item) {
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
    },
    handleFilterClick(status) {
      this.selectedMissionIndex = -1;
      switch (status) {
        case 1:
          this.missionFilterByStatus = 1;
          return;
        case 2:
          this.missionFilterByStatus = 2;
          return;
        default:
          this.missionFilterByStatus = -1;
          return;
      }
    },
    updateOrInsertMission(item) {
      this.checkMissionData(item);
      const { PID } = item;
      const index = this.missions.findIndex((e) => e.PID === PID);
      if (index === -1) {
        this.missions.push(item);
        return;
      }
      for (const o in item) {
        this.missions[index][o] = item[o];
      }
      // if status == 2, save metadata to indexedDB
      if (item.status === 2) {
        item.meta.createTime = Date.now();
        console.log(item.meta);
        idbInsert(item.meta).catch((err) => {
          window.alert("Unexpected idbSet error:(");
          console.error(err);
        });
      }
    },
    handleStartClick() {
      console.log(this.selectedMission);
      window.api.send("download-start", this.selectedMission.PID);
    },
    handleShowLogModalClick() {
      const index = this.missions.findIndex(
        (e) => e.PID === this.selectedMission.PID
      );
      if (this.showLogModals.includes(index)) {
        return;
      }
      this.showLogModals.push(index);
    },
    handleLogModalClose(index) {
      const missionIndex = this.showLogModals.findIndex((e) => e === index);
      this.showLogModals.splice(missionIndex, 1);
    },
    addLog(PID, message) {
      const index = this.missions.findIndex((e) => e.PID === PID);
      if (index === -1) {
        console.warn(`Not found mission PID: ${PID}`);
        return;
      }
      this.missions[index].logs.push(message);
    },
    allStart() {
      this.missions
        .filter((e) => e.status === 0)
        .forEach((i) => {
          window.api.send("download-start", i.PID);
        });
    },
    handleOpenExplorer() {
      if (!this.selectedMission?.meta?.savepath) {
        return;
      }
      console.log(this.selectedMission.meta.savepath);
      window.api.openExplorer(this.selectedMission.meta.savepath);
    },
  },
};
</script>