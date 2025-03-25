import { defineRouter } from '#q-app/wrappers'
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router'
import routes from './routes'
import { useAuthStore } from 'src/stores/auth'

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
    const token = localStorage.getItem('token')
    const auth = useAuthStore()

    // 1. Redirection vers /auth si la route est protégée et qu'on n'a pas de token
    if (to.meta.requiresAuth && !token) {
      return next('/auth')
    }

    // 2. Si token existe mais user pas encore défini dans le store, on le fetch
    if (token && !auth.user) {
      try {
        await auth.fetchUser()
      } catch (err) {
        console.error('❌ Erreur fetch user :', err)
        auth.logout() // au cas où le token est expiré
        return next('/auth')
      }
    }

    // 3. Empêcher d'accéder à /auth ou /login si on est déjà connecté
    // if (to.path.startsWith('/auth') && auth.user) {
    //   return next(`/dashboard-${auth.user.role || 'student'}`)
    // }
    if (to.path.startsWith('/auth') && auth.user) {
      const role = auth.user.user_metadata?.role || 'student'
      return next(`/dashboard-${role}`)
    }

    // 4. Vérification des rôles si la route en exige
    if (to.meta.roles && !to.meta.roles.includes(auth.user?.role)) {
      return next('/unauthorized') // à créer si besoin
    }

    // ✅ OK, accès autorisé
    next()
  })

  return Router
})
