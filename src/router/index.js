import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import index from '../views/index.vue'
Vue.use(VueRouter)

const routes = [{
		path: '/',
		name: 'home',
		component: HomeView
	},
	{
		path: '/index',
		name: 'index',
		component: index
	}
]

const router = new VueRouter({
	// 路由模式：hash(默认)，history模式
	mode: 'hash',
	// 修改路由高亮样式，默认值为'router-link-active'
	linkactiveclass: 'active',
	routes
})

export default router
