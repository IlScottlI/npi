import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      path: '/',
      name: 'Overview',
      component: () =>
        import(/* webpackChunkName: "home" */ '@/views/Overview/Index'),
    },
    {
      path: '/investigate',
      name: 'Investigate',
      component: () =>
        import(/* webpackChunkName: "investigate" */ '@/views/Investigate/Index'),
      },
      {
        path: '/scrap',
        name: 'Scrap',
        component: () =>
        import(/* webpackChunkName: "scrap" */ '@/views/Scrap/Index'),
    },
    {
      path: '/rework',
      name: 'Rework',
      component: () =>
        import(/* webpackChunkName: "rework" */ '@/views/Rework/Index'),
    },
    {
      path: '/donate',
      name: 'Donate',
      component: () =>
        import(/* webpackChunkName: "donate" */ '@/views/Donate/Index'),
    },
    {
      path: '/donate/sno',
      name: 'Donate',
      component: () =>
        import(/* webpackChunkName: "donate" */ '@/views/Donate/Index'),
    },
    {
      path: '/donate/fpwh',
      name: 'Donate',
      component: () =>
        import(/* webpackChunkName: "donate" */ '@/views/Donate/PendingFpwh/Index'),
    },
    {
      path: '/donate/pe',
      name: 'Donate',
      component: () =>
        import(/* webpackChunkName: "donate" */ '@/views/Donate/PendingPe/Index'),
    },
    {
      path: '/return',
      name: 'Return',
      component: () =>
        import(/* webpackChunkName: "return" */ '@/views/Return/Index'),
    },
    {
      path: '/return/mpd',
      name: 'Return',
      component: () =>
        import(/* webpackChunkName: "return" */ '@/views/Return/Index'),
    },
    {
      path: '/return/ops',
      name: 'Return',
      component: () =>
        import(/* webpackChunkName: "return" */ '@/views/Return/PendingOps/Index'),
    },
    {
      path: '/return/dbs',
      name: 'Return',
      component: () =>
        import(/* webpackChunkName: "return" */ '@/views/Return/PendingDbs/Index'),
    },
    {
      path: '/return/pe',
      name: 'Return',
      component: () =>
        import(/* webpackChunkName: "return" */ '@/views/Return/PendingPe/Index'),
    },
    {
      path: '/release',
      name: 'Release',
      component: () =>
        import(/* webpackChunkName: "release" */ '@/views/Release/Index'),
    },
    {
      path: '/unpickable',
      name: 'Unpickable',
      component: () =>
        import(/* webpackChunkName: "unpickable" */ '@/views/Unpickable/Index'),
    },
    {
      path: '/unpickable/unpickable',
      name: 'Unpickable',
      component: () =>
        import(/* webpackChunkName: "unpickable" */ '@/views/Unpickable/Index'),
    },
    {
      path: '/unpickable/reconcile',
      name: 'Unpickable',
      component: () =>
        import(/* webpackChunkName: "unpickable" */ '@/views/Unpickable/PendingReconcile/Index'),
    },
  ],
})

// Bootstrap Analytics
// Set in .env
// https://github.com/MatteoGabriele/vue-analytics
if (process.env.VUE_APP_GOOGLE_ANALYTICS) {
  Vue.use(require('vue-analytics').default, {
    id: process.env.VUE_APP_GOOGLE_ANALYTICS,
    router,
    autoTracking: {
      page: process.env.NODE_ENV !== 'development',
    },
  })
}

export default router
