<template>
  <div class="dome-content url-content">
    <a :href="content.url"> {{ content.url }} </a>
  </div>
</template>

<script>
export default {
  props: ["rawContent"],

  computed: {
    content() {
      return JSON.parse(this.rawContent);
    },
  },
};
</script>