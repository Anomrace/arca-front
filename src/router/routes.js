// src/router/routes.js
const routes = [
  {
    path: '/dashboard-admin',
    component: () => import('layouts/AdminLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/dashboard/AdminDashboard.vue'),
        meta: { requiresAuth: true, roles: ['admin'] },
      },
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
    path: '/dashboard-professor',
    component: () => import('layouts/ProfessorLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/dashboard/ProfessorDashboard.vue'),
        meta: { requiresAuth: true },
      },
      { path: 'students', component: () => import('pages/StudentsPage.vue') },
      { path: 'staff', component: () => import('pages/StaffPage.vue') },
      { path: 'calendar', component: () => import('pages/CalendarPage.vue') },
      { path: 'resources', component: () => import('pages/ResourcesPage.vue') },
      { path: 'settings', component: () => import('pages/SettingsPage.vue') },
    ],
  },
  {
    path: '/dashboard-parent',
    component: () => import('layouts/ParentLayout.vue'),
    children: [
      { path: '', component: () => import('pages/dashboard/ParentDashboard.vue') },
      { path: 'invoices', component: () => import('pages/InvoicesPage.vue') },
      { path: 'calendar', component: () => import('pages/CalendarPage.vue') },
      { path: 'resources', component: () => import('pages/ResourcesPage.vue') },
      { path: 'settings', component: () => import('pages/SettingsPage.vue') },
    ],
  },
  {
    path: '/dashboard-student',
    component: () => import('layouts/StudentLayout.vue'),
    children: [
      { path: '', component: () => import('pages/dashboard/StudentDashboard.vue') },
      { path: 'calendar', component: () => import('pages/CalendarPage.vue') },
      { path: 'resources', component: () => import('pages/ResourcesPage.vue') },
      { path: 'settings', component: () => import('pages/SettingsPage.vue') },
    ],
  },
  {
    path: '/auth',
    component: () => import('layouts/AuthLayout.vue'),
    children: [{ path: '', component: () => import('pages/LoginPage.vue') }],
  },
  {
    path: '/unauthorized',
    component: () => import('pages/UnauthorizedPage.vue'),
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
