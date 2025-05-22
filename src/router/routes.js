const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'dashboard', component: () => import('pages/DashboardPage.vue') },
      { path: 'eleves', name: 'eleves', component: () => import('pages/ElevesPage.vue') },
      {
        path: 'professeurs',
        name: 'professeurs',
        component: () => import('pages/ProfesseursPage.vue'),
      },
      {
        path: 'calendrier',
        name: 'calendrier',
        component: () => import('pages/CalendrierPage.vue'),
      },
      {
        path: 'ressources',
        name: 'ressources',
        component: () => import('pages/RessourcesPage.vue'),
      },
      { path: 'finances', name: 'finances', component: () => import('pages/FinancesPage.vue') },
      { path: 'factures', name: 'factures', component: () => import('pages/FacturesPage.vue') },
      {
        path: 'parametres',
        name: 'parametres',
        component: () => import('pages/ParametresPage.vue'),
      },
    ],
  },

  // ✅ Route login à la racine, avec layout séparé
  {
    path: '/login',
    component: () => import('layouts/NonAuthLayout.vue'),
    children: [
      {
        path: '',
        name: 'login',
        component: () => import('pages/LoginPage.vue'),
        meta: { public: true },
      },
    ],
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]
export default routes
