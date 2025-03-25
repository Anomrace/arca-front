import { defineRouter } from '#q-app/wrappers'
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router'
import routes from './routes'
import { useAuthStore } from 'src/stores/auth'
import { supabase } from 'src/boot/supabase'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default defineRouter(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  })
  // Guard global
  Router.beforeEach(async (to, from, next) => {
    const auth = useAuthStore()

    console.log('🔍 Route demandée :', to.fullPath)

    // Vérifie la session (automatiquement stockée par supabase)
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      // 🔐 Pas connecté → accès à une page protégée ?
      if (to.meta.requiresAuth) return next('/auth')
    }

    // Si connecté mais pas encore chargé dans le store
    if (session && !auth.user) {
      try {
        await auth.fetchUser()
        console.log('👤 Rôle après fetch :', auth.user?.user_metadata?.role)
      } catch (err) {
        console.error('❌ Erreur fetch user :', err)
        await auth.logout()
        return next('/auth')
      }
    }

    // Si déjà connecté et essaie d’aller sur /auth → redirige vers dashboard
    if (to.path.startsWith('/auth') && auth.user) {
      const role = auth.user?.user_metadata?.role || 'student'
      return next(`/dashboard-${role}`)
    }

    // Si la route demande un rôle spécifique
    if (to.meta.roles && !to.meta.roles.includes(auth.user?.user_metadata?.role)) {
      return next('/unauthorized')
    }

    next()
  })

  return Router
})
