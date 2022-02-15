<template>
  <div class="" v-if="item.id && itemClone.id">
    <h2 @click="logItemClone">Data Manager Show, id= {{ id }}</h2>
    <div class="">
      <button class="px-4 py-2 hover:text-sky-500" @click.stop="handleSaveClick">
        <span class="align-bottom tracking-wide">Save Edit</span>
        <save-icon class="h-6 w-6 inline-block" />
      </button>
    </div>
    <button class="hover:bg-lime-200 px-4 py-2" @click="handleOpenExplorer">
      <span class="align-bottom tracking-wide">Reveal in File Explorer</span>
      <folder-open-icon class="inline-block h-6 w-6" />
    </button>
    <div class="flex flex-col">
      <!-- title -->
      <div class="flex">
        <label for="meta-title">Title:</label>
        <input
          class="form-input w-2/3"
          id="meta-title"
          type="text"
          v-model="itemClone.title"
          maxlength="240"
          minlength="2"
        />
      </div>
      <!-- coverName -->
      <div class="">
        <label for="meta-cover">Cover:</label>
        <button
          class="px-2 py-1 bg-zinc-100 border border-black hover:bg-zinc-50"
          id="meta-cover"
          @click="handleSelectCoverClick"
        >
          Select File
        </button>
        <span>{{ itemClone.coverName }}</span>
      </div>
      <!-- imageLength -->
      <div class="">
        <span>Pages:</span>
        <span>{{ itemClone.imageLength }}</span>
      </div>
      <score-star
        :score="itemClone.star"
        @change="(i) => (itemClone.star = i)"
      />
      <!-- lang -->
      <div class="">
        <select class="form-select" v-model="itemClone.lang">
          <option disabled value="">Language</option>
          <option :value="la" v-for="la in supportLangs" :key="la">
            {{ la }}
          </option>
        </select>
      </div>
      <!-- artist name-->
      <div class="">
        <p>Artist name</p>
        <!-- English -->
        <div class="">
          <label
            >English (will be converted to lowercase when saving.)
            <input
              class="form-input"
              type="text"
              v-model="itemClone.artist.en"
              placeholder="Tamano Kedama"
              maxlength="200"
            />
          </label>
        </div>
        <!-- Real -->
        <div class="">
          <label
            >Real
            <input
              class="form-input"
              type="text"
              v-model="itemClone.artist.real"
              placeholder="玉之けだま"
              maxlength="200"
            />
          </label>
        </div>
      </div>
      <!-- group name -->
      <div class="">
        <p>Group name</p>
        <!-- English -->
        <div class="">
          <label
            >English (will be converted to lowercase when saving.)
            <input
              class="form-input"
              type="text"
              v-model="itemClone.group.en"
              placeholder="Kedama Gyuunyuu"
              maxlength="200"
            />
          </label>
        </div>
        <!-- Real -->
        <div class="">
          <label
            >Real
            <input
              class="form-input"
              type="text"
              v-model="itemClone.group.real"
              placeholder="毛玉牛乳"
              maxlength="200"
            />
          </label>
        </div>
      </div>
      <!-- description -->
      <div class="">
        <textarea
          class="form-textarea"
          cols="30"
          rows="5"
          placeholder="精華好文推推推"
          v-model="itemClone.description"
          maxlength="2000"
        ></textarea>
      </div>
      <!-- Tags -->
      <select-tags-component @change="handleTagsChange" />
    </div>
    <!-- The savepath all images -->
    <div class="">
      <!-- The savepath not used images -->s
      <p>Not used in display images:</p>
      <div class="p-2 bg-pink-100" v-for="name in notUsedImages" :key="name">
        <span>{{ name }}</span>
        <button
          class="hover:text-sky-500 px-4 py-2"
          @click="() => handleNotUsedImageInsertToTopClick(name)"
        >
          <span class="align-bottom tracking-wide">Insert To Start</span>
          <plus-icon class="inline-block h-6 w-6" />
        </button>
        <button
          class="hover:text-sky-500 px-4 py-2"
          @click="() => handleNotUsedImageInsertToBottomClick(name)"
        >
          <span class="align-bottom tracking-wide">Insert To End</span>
          <plus-icon class="inline-block h-6 w-6" />
        </button>
        <button class="hover:text-sky-500 px-4 py-2">
          <trash-icon class="inline-block h-6 w-6" />
        </button>
      </div>
      <!-- The savepath used images -->
      <p>Used in display images:</p>
      <div class="p-2 bg-green-100" v-for="name in usedImages" :key="name">
        <span>{{ name }}</span>
        <button
          class="hover:text-sky-500 px-4 py-2"
          @click="() => handleUsedImageUpOrDownClick(name, true)"
        >
          <arrow-up-icon class="inline-block h-6 w-6" />
        </button>
        <button
          class="hover:text-sky-500 px-4 py-2"
          @click="() => handleUsedImageUpOrDownClick(name, false)"
        >
          <arrow-down-icon class="inline-block h-6 w-6" />
        </button>
        <button
          class="hover:text-sky-500 px-4 py-2"
          @click="() => handleUsedImageMinusClick(name)"
        >
          <minus-icon class="inline-block h-6 w-6" />
        </button>
      </div>
    </div>
    <snackbar-component
      v-if="snackMsg"
      :msg="snackMsg"
      @close="snackMsg = ''"
      :autoClose="true"
    />
  </div>
</template>

<script>
import {
  FolderOpenIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  TrashIcon,
  MinusIcon,
  PlusIcon,
  SaveIcon,
} from "@heroicons/vue/solid";
import scoreStar from "./score-star.vue";
import { show } from "../../api-idb.js";
import selectTagsComponent from "./select-tags-component.vue";
import snackbarComponent from "../snackbar-component.vue";
export default {
  components: {
    FolderOpenIcon,
    ArrowUpIcon,
    ArrowDownIcon,
    TrashIcon,
    MinusIcon,
    PlusIcon,
    scoreStar,
    selectTagsComponent,
    SaveIcon,
    snackbarComponent,
  },
  data: () => ({
    item: {},
    itemClone: {},
    dirImages: [],
    supportLangs: ["zh-Hant", "zh-Hans", "ja", "en"],
    snackMsg: "",
  }),
  computed: {
    id() {
      return parseInt(this.$route.params.id);
    },
    notUsedImages() {
      if (!this?.itemClone?.imageNames) {
        return [];
      }
      return this.dirImages.filter(
        (e) => !this.itemClone.imageNames.includes(e)
      );
    },
    usedImages() {
      if (!this?.itemClone?.imageNames) {
        return [];
      }
      return this.itemClone.imageNames;
    },
  },
  async mounted() {
    const item = await show(this.id);
    console.log(item);
    for (const prop in item) {
      this.itemClone[prop] = this.item[prop] = item[prop];
    }
    // optional props init
    if (!this.itemClone.tags) {
      this.itemClone.tags = [];
    }
    if (!this.itemClone.description) {
      this.itemClone.description = "";
    }
    if (!this.itemClone.star) {
      this.itemClone.star = 1;
    }
    if (!this.itemClone.artist) {
      this.itemClone.artist = { en: "", real: "" };
    }
    if (!this.itemClone.group) {
      this.itemClone.group = { en: "", real: "" };
    }
    if (!this.itemClone.lang) {
      this.itemClone.lang = this.supportLangs[0];
    }
    await this.readdir();
  },
  methods: {
    handleOpenExplorer() {
      if (!this.item?.savepath) {
        return;
      }
      window.api.openExplorer(this.item.savepath);
    },
    handleSelectCoverClick(event) {
      event.preventDefault();
      window.api
        .showOpenDialog({
          defaultPath: this.item.savepath,
          filters: [
            {
              name: "Images",
              extensions: ["jpg", "jpeg", "jfif", "png", "gif", "webp"],
            },
          ],
          properties: ["openFile"],
        })
        .then((result) => {
          console.log(result);
          if (!result) {
            return;
          }
          this.itemClone.coverName = result;
        });
    },
    async readdir() {
      const result = await window.api.readdir(
        this.item.savepath,
        /[jpe?g|jfif|png|gif|webp]/i
      );
      console.log(result);

      // sort by imageNames index
      result.sort((a, b) => {
        const ai = this.itemClone.imageNames.findIndex((e) => e === a);
        const bi = this.itemClone.imageNames.findIndex((e) => e === b);
        if (ai === -1 && bi === -1) {
          return 0;
        }
        if (ai === -1) {
          return -1;
        }
        if (bi === -1) {
          return 1;
        }
        return ai - bi;
      });

      this.dirImages.push(...result);
    },
    handleUsedImageUpOrDownClick(name, isUp = true) {
      const index = this.itemClone.imageNames.findIndex((e) => e === name);
      console.log("index", index);
      // Out of range
      const nextIndex = isUp ? index - 1 : index + 1;
      if (nextIndex < 0 || nextIndex > this.itemClone.imageNames.length - 1) {
        return;
      }
      console.log("nextIndex", nextIndex);
      const tmp = this.itemClone.imageNames.splice(index, 1)[0];
      this.itemClone.imageNames.splice(nextIndex, 0, tmp);
      console.log(this.itemClone.imageNames);
    },
    handleUsedImageMinusClick(name) {
      const index = this.itemClone.imageNames.findIndex((e) => e === name);
      this.itemClone.imageNames.splice(index, 1);
    },
    handleNotUsedImageInsertToTopClick(name) {
      this.itemClone.imageNames.unshift(name);
    },
    handleNotUsedImageInsertToBottomClick(name) {
      this.itemClone.imageNames.push(name);
    },
    logItemClone() {
      console.log(this.itemClone);
    },
    valid() {
      let isValid = true;
      if (this.itemClone.description.length > 2000) {
        window.alert("description > 2000:(");
        isValid = false;
      }
      if (this.itemClone.title.length < 2) {
        window.alert("title < 2:(");
        isValid = false;
      }
      if (this.itemClone.title.length > 240) {
        window.alert("title > 240:(");
        isValid = false;
      }
      if (
        !Number.isSafeInteger(this.itemClone.star) ||
        this.itemClone.star < 1 ||
        this.itemClone.star > 5
      ) {
        window.alert("star out of range:(");
        isValid = false;
      }
      return isValid;
    },
    handleTagsChange(tags) {
      this.itemClone.tags = tags;
    },
    handleSaveClick() {
      const isValid = this.valid();
      if (isValid) {
        this.snackMsg = "Save success!";
      } else {
        this.snackMsg = "Save Failed :(";
      }
    },
  },
};
</script>
