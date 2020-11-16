<template>
  <div class="dome-list">
    <h3>Domes near you</h3>
    <ul class="list-group">
      <li
        @click.prevent="onRowClick(dome)"
        v-for="(dome, index) in domes"
        :key="index"
        class="list-group-item"
      >
        {{ dome.name | limit(17) }}
        <small class="text-muted" v-if="dome.description.length > 0">
          | {{ dome.description | limit(23) }}
        </small>
        <span v-if="dome.isProtected" class="float-right">
          <i class="fa fa-lock"></i>
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: ["domes"],

  methods: {
    onRowClick(dome) {
      this.$emit("domeSelected", dome);
    },
  },
};
</script>