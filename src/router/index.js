import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index'
import cover from '@/components/cover'

Vue.use(Router)

export default new Router({
	routes: [{
		path: '/',
		name: 'cover',
		component: cover
	},{
		path: '/index',
		name: 'index',
		component: index
	}]
})