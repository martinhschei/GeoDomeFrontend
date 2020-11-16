import Vue from "vue";

Vue.filter("limit", (string, length) => {
	if (string.length > length) {
		return string.substring(0, length) + "...";
	}
	return string;
});