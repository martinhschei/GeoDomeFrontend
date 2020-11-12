import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

import HomePage from './../../components/pages/HomePage';
import CreateDomePage from './../../components/pages/Domes/CreateDomePage';

export default new Router({
	routes: [
		{
			path: '/',
			name: 'Home',
			component: HomePage,
		},
		{
			path: '/create-dome',
			name: 'CreateDome',
			component: CreateDomePage,
		}
	]
});