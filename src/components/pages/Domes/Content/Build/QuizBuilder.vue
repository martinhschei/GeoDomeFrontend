<template>
  <div class="mt-4 quiz-builder p-4 shadow rounded">
    <input
      type="text"
      placeholder="Quiz name"
      class="form-control shadow"
      v-model="form.fields.name"
    />
    <hr />
    <div class="questions">
      <div
        class="mb-4 question"
        v-for="(question, questionIndex) in form.fields.questions"
        :key="questionIndex"
      >
        <div class="row">
          <div class="col-1" style="padding-top: 8px">
            # {{ questionIndex + 1 }}
          </div>
          <div class="col-11">
            <input
              type="text"
              v-model="question.text"
              class="shadow form-control"
            />
          </div>
        </div>
        <div
          class="row mt-2"
          v-for="(alternative, alternativeIndex) in question.alternatives"
          :key="alternativeIndex"
        >
          <div class="col-1"></div>
          <div class="col-1" style="padding-top: 8px">
            <input
              type="radio"
              :value="true"
              @click="check"
              :data-question="`${questionIndex}`"
              :name="`is_correct_${questionIndex}`"
              :data-alternative="`${alternativeIndex}`"
            />
          </div>
          <div class="col-10">
            <div class="rounded shadow">
              <input
                text="text"
                class="form-control"
                v-model="alternative.text"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <hr />
    <div class="buttons row">
      <div class="col-6 text-left">
        <button @click.prevent="save" class="btn btn-success">Save</button>
      </div>
      <div class="col-6 text-right">
        <button @click.prevent="addQuestion" class="btn btn-success">
          Add question
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { Form } from "./../../../../../extensions/form";
import ContentBuilder from "./../../../../../mixins/ContentBuilder";

export default {
  mixins: [ContentBuilder],

  data() {
    return {
      form: new Form({
        name: "",
        questions: [
          {
            text: "",
            alternatives: [
              {
                text: "",
                isCorrect: false,
              },
              {
                text: "",
                isCorrect: false,
              },
              {
                text: "",
                isCorrect: false,
              },
              {
                text: "",
                isCorrect: false,
              },
            ],
          },
        ],
      }),
    };
  },

  methods: {
    save() {
      this.form.json("/api/quiz").then((result) => {
        if (result.success) {
          this.form = new Form(result.data);
          this.$swal("Created!", "Quiz is saved!", "success");
          this.createDomeContent({
            name: "Quiz",
            id: result.data.id,
          });
        }
      });
    },

    check(event) {
      const { question, alternative } = event.srcElement.dataset;

      this.form.fields.questions[question].alternatives.forEach(
        (alternative) => {
          alternative.isCorrect = false;
        }
      );

      this.form.fields.questions[question].alternatives[alternative].isCorrect =
        event.srcElement.checked;
    },

    addQuestion() {
      this.form.fields.questions.push({
        text: "",
        alternatives: [
          {
            text: "",
            isCorrect: false,
          },
          {
            text: "",
            isCorrect: false,
          },
          {
            text: "",
            isCorrect: false,
          },
          {
            text: "",
            isCorrect: false,
          },
        ],
      });
    },
  },
};
</script>

<style scoped>
</style>