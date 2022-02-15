<script>
import { tags as allTags } from "./tags.js";
import { h } from "vue";
export default {
  emits: ["change"],
  data: () => ({
    tags: [],
  }),
  render() {
    return h("div", { class: "" }, this.recu(allTags));
  },
  methods: {
    recu(obj) {
      const arr = [];
      for (const i in obj) {
        arr.push(h("p", { class: "italic" }, i));
        if (Array.isArray(obj[i])) {
          arr.push(
            h(
              "div",
              { class: "flex gap-2" },
              obj[i].map((e) =>
                h(
                  "button",
                  {
                    class: `hover:text-pink-400 px-1 py-0.5 border`,
                    "data-active": "none",
                    onClick: (event) => {
                      const t = event.target;
                      const willBeActive = t.dataset.active === "none";
                      t.dataset.active = willBeActive ? "active" : "none";
                      t.classList.toggle("border-sky-500", willBeActive);
                      t.classList.toggle("text-sky-500", willBeActive);
                      if (willBeActive) {
                        this.tags.push(e);
                      } else {
                        const index = this.tags.findIndex((str) => str === e);
                        this.tags.splice(index, 1);
                      }
                      this.$emit("change", this.tags);
                    },
                  },
                  e
                )
              )
            )
          );
        } else {
          arr.push(h("div", { class: "px-4" }, this.recu(obj[i])));
        }
      }
      return arr;
    },
  },
};
</script>
