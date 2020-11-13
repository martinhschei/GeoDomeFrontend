<template>
  <div class="create-dome">
    <div class="create-dome-wizard">
      <form-wizard
        :shape="shape"
        :color="color"
        :title="title"
        :subtitle="subtitle"
      >
        <tab-content title="Basic">
          <div class="form-group">
            <label for="name"> Name * </label>
            <input
              name="name"
              type="text"
              class="form-control"
              v-model="form.name"
            />
          </div>
          <div class="form-group">
            <label for="description"> Description </label>
            <input
              type="text"
              name="description"
              class="form-control"
              v-model="form.description"
            />
          </div>
        </tab-content>
        <tab-content title="Content">
          <div class="dome-content">
            <ul class="list-group">
              <li class="list-group-item">
                <input
                  type="radio"
                  class="mr-2"
                  value="Url"
                  name="content"
                  v-model="form.content"
                />Url - redirect to a url
              </li>
              <li class="list-group-item">
                <input
                  type="radio"
                  class="mr-2"
                  value="Quiz"
                  name="content"
                  v-model="form.content"
                />Quiz - multiple choice quiz
              </li>
              <li class="list-group-item">
                <input
                  type="radio"
                  class="mr-2"
                  value="Files"
                  name="content"
                  v-model="form.content"
                />Files - upload/download files
              </li>
            </ul>
          </div>
        </tab-content>
        <tab-content title="Security">
          <div class="form-group">
            <input type="checkbox" name="security" v-model="useAccessCode" />
            Users must provide access code
          </div>
          <div class="form-group">
            <input
              :disabled="!useAccessCode"
              type="text"
              class="form-control"
              v-model="form.accessCode"
            />
          </div>
        </tab-content>
      </form-wizard>
    </div>
    <router-link to="/"> Back </router-link>
  </div>
</template>

<script>
import "vue-form-wizard/dist/vue-form-wizard.min.css";
import { FormWizard, TabContent } from "vue-form-wizard";

export default {
  components: {
    FormWizard,
    TabContent,
  },

  data() {
    return {
      form: {
        name: "",
        content: "",
        accessCode: "",
        description: "",
      },
      shape: "tab",
      subtitle: "",
      color: "#4D6A6D",
      useAccessCode: false,
      title: "Create a dome",
    };
  },
};
</script>