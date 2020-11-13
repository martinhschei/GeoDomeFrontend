import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		domes: [],
		userCoordinates: null,
	},
	mutations: {
		domes(state, value) {
			state.domes = value;
		},
		setUserCoordinates(state, value) {
			state.userCoordinates = value;
		}
	},
	modules: {},
	getters: {
		userCoordinates(state) {
			return state.userCoordinates;
		}
	},
	actions: {},
});