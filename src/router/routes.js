const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue'), meta: { requiresAuth: true } },
      {
        path: 'students',
        component: () => import('pages/StudentsPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'staff',
        component: () => import('pages/StaffPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'invoices',
        component: () => import('pages/InvoicesPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'calendar',
        component: () => import('pages/CalendarPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'resources',
        component: () => import('pages/ResourcesPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'expenses',
        component: () => import('pages/ExpensesPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'settings',
        component: () => import('pages/SettingsPage.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/auth',
    component: () => import('layouts/AuthLayout.vue'),
    children: [{ path: '', component: () => import('pages/LoginPage.vue') }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
