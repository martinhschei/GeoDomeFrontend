<template>
  <div class="mt-4 url-builder p-4 shadow rounded">
    <input
      type="text"
      class="form-control mb-2"
      v-model="form.url"
      placeholder="Type the url"
    />
    <button class="btn btn-sm btn-success" @click.prevent="contentReady">
      Save
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        url: "",
      },
    };
  },

  computed: {
    contentForm() {
      return this.contentForm;
    },
  },

  methods: {
    contentReady() {
      this.$emit("contentReady", this.form.url);
    },
  },
};
</script>