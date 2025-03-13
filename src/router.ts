import { createMemoryHistory, createRouter } from 'vue-router'

import HomeView from './views/Home.vue'
import ThreadView from './views/Thread.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/thread/:hash', component: ThreadView },
]

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
})