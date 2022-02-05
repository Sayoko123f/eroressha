<script>
export default {
  data: () => ({
    t: "Hi here is test",
  }),
  props: {
    uid: Number,
  },
  mounted() {
    // window.addEventListener("hello-reply", (e) => {
    //   this.replyHello(e.detail);
    // });
    window.api.receive("fromMain", this.replyHello);
  },
  methods: {
    sendHello() {
      window.api.send("hello-message", { foo: "bar", 123: 456 });
    },
    replyHello(...args) {
      console.log(this.t);
      if (this.uid) {
        console.log("this uid:", this.uid);
      }
      console.log(args);
    },
  },
};
</script>

<template>
  <div class="">
    <h2 class="text-green-500">{{ t }}{{ uid }}</h2>
    <button class="px-4 py-2 hover:bg-blue-500" @click="sendHello">
      SENDHELLO
    </button>
  </div>
</template>