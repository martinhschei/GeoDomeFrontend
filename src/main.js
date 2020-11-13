import Vue from 'vue';
import App from './App.vue';

import Store from './extensions/store/base';
import Router from './extensions/router/base';

import 'bootstrap/dist/css/bootstrap.min.css';

import VueSwal from 'vue-swal';
Vue.use(VueSwal);

Vue.config.productionTip = false

new Vue({
	render: h => h(App),
	router: Router,
	store: Store,
}).$mount('#app')
