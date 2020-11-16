<template>
  <div v-cloak class="create-dome">
    <div class="create-dome-wizard">
      <form-wizard
        :shape="shape"
        :color="color"
        :title="title"
        :subtitle="subtitle"
        finish-button-text="Create!"
        @on-complete="formCompleted"
      >
        <tab-content title="Basic">
          <div class="form-group">
            <label for="name"> Name * </label>
            <input
              name="name"
              type="text"
              class="form-control"
              v-model="form.fields.name"
              @focus.prevent="form.clearError('Name')"
            />
            <div
              v-if="form.hasError('Name')"
              class="invalid-feedback"
              style="display: block"
            >
              {{ form.getError("Name") }}
            </div>
          </div>
          <div class="form-group">
            <label for="description"> Description </label>
            <input
              type="text"
              name="description"
              class="form-control"
              v-model="form.fields.description"
            />
          </div>
          <div class="form-group">
            <label for="color"> Color on map </label>
            <div>
              <v-swatches v-model="form.fields.color"></v-swatches>
            </div>
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
                  v-model="form.fields.componentName"
                />Url - redirect to a url
              </li>
              <li class="list-group-item">
                <input
                  type="radio"
                  class="mr-2"
                  value="Quiz"
                  name="content"
                  v-model="form.fields.componentName"
                />Quiz - multiple choice quiz
              </li>
              <li class="list-group-item">
                <input
                  type="radio"
                  class="mr-2"
                  value="Files"
                  name="content"
                  v-model="form.fields.componentName"
                />Files - upload/download files
              </li>
              <li class="list-group-item">
                <input
                  type="radio"
                  class="mr-2"
                  value="Checkin"
                  name="content"
                  v-model="form.fields.componentName"
                />Checkin - checkin to event
              </li>
            </ul>
            <div v-if="contentComponent">
              <component @contentReady="onContentReady" :is="contentComponent">
              </component>
            </div>
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
              v-model="form.fields.accessCode"
            />
          </div>
        </tab-content>
      </form-wizard>
    </div>
    <hr />
    <div class="text-right">
      <router-link to="/" class="ml-3 btn btn-secondary"> Exit </router-link>
    </div>
  </div>
</template>

<script>
import VSwatches from "vue-swatches";
import "vue-swatches/dist/vue-swatches.css";
import { Form } from "./../../../extensions/form";
import UrlBuilder from "./Content/Build/UrlBuilder";
import "vue-form-wizard/dist/vue-form-wizard.min.css";
import { FormWizard, TabContent } from "vue-form-wizard";

export default {
  components: {
    VSwatches,
    FormWizard,
    TabContent,
    Url: UrlBuilder,
  },

  data() {
    return {
      form: new Form({
        name: "",
        radius: 50,
        color: null,
        active: true,
        accessCode: "",
        latitude: null,
        longitude: null,
        description: "",
        componentName: "",
        componentContent: {},
      }),
      shape: "tab",
      subtitle: "",
      color: "#4D6A6D",
      useAccessCode: false,
      title: "Create a dome",
    };
  },

  computed: {
    contentComponent() {
      return this.form.fields.componentName;
    },
  },

  methods: {
    formCompleted() {
      this.submit();
    },

    onContentReady(payload) {
      new Form({
        name: payload.name,
        content: JSON.stringify(payload.content),
      })
        .json("/api/domecontent")
        .then((result) => {
          this.form.addField("DomeContentID", result.data.id);
        });
    },

    submit() {
      this.form.fields.latitude = this.$store.getters.userCoordinates.latitude;
      this.form.fields.longitude = this.$store.getters.userCoordinates.longitude;

      this.form.json("/api/domes").then((result) => {
        if (result.success) {
          this.$swal("Created!", "Dome is ready!", "success");
        }
        if (!result.success) {
          this.$swal("Ops!", "Something is wrong", "warning");
        }
      });
    },
  },
};
</script>