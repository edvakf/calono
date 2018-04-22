import Vue from 'vue'
import Router from 'vue-router'
import Welcome from '@/components/Welcome'
import Room from '@/components/Room'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Welcome',
      component: Welcome
    },
    {
      path: '/:name',
      name: 'Room',
      component: Room
    }
  ]
})
