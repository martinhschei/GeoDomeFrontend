<template>
  <div class="mt-4 url-builder p-4 shadow rounded">
    <input
      type="text"
      class="form-control mb-2"
      v-model="form.fields.path"
      placeholder="Type the url"
    />
    <button class="btn btn-sm btn-success" @click.prevent="save">Save</button>
  </div>
</template>

<script>
import { Form } from "../../../../../extensions/form";
import ContentBuilder from "../../../../../mixins/ContentBuilder";

export default {
  mixins: [ContentBuilder],

  data() {
    return {
      form: new Form({
        path: "",
      }),
    };
  },

  methods: {
    save() {
      this.form.json("/api/url").then((result) => {
        if (result.success) {
          this.form = new Form(result.data);
          this.$swal("Created!", "Url is saved!", "success");
          this.createDomeContent({
            name: "Url",
            id: result.data.id,
          });
        }
      });
    },
  },
};
</script>