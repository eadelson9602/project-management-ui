import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  // Public routes
  {
    path: '/login',
    component: () => import('pages/auth/LoginPage.vue'),
    meta: { public: true },
  },
  {
    path: '/register',
    component: () => import('pages/auth/RegisterPage.vue'),
    meta: { public: true },
  },
  {
    path: '/password/reset',
    component: () => import('pages/auth/PasswordResetPage.vue'),
    meta: { public: true },
  },

  // Protected routes
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: 'inicio',
        name: 'dashboard',
        component: () => import('pages/DashboardPage.vue'),
        meta: {
          title: 'Dashboard',
          roles: ['admin', 'manager', 'developer'],
          breadcrumb: [{ text: 'Dashboard', to: '/' }],
        },
      },
      {
        path: 'projects',
        name: 'projects',
        component: () => import('pages/projects/ProjectListPage.vue'),
        meta: {
          title: 'Proyectos',
          roles: ['admin', 'manager', 'developer'],
          breadcrumb: [{ text: 'Proyectos', to: '/projects' }],
        },
      },
      {
        path: 'projects/:id',
        name: 'project-detail',
        component: () => import('pages/projects/ProjectDetailPage.vue'),
        meta: {
          title: 'Detalles del Proyecto',
          roles: ['admin', 'manager', 'developer'],
          breadcrumb: [
            { text: 'Proyectos', to: '/projects' },
            { text: 'Detalles', to: '/projects/:id' },
          ],
        },
      },
      {
        path: '/projects',
        name: 'projects',
        component: () => import('pages/projects/ProjectsPage.vue'),
        meta: {
          title: 'Projects',
          roles: ['admin', 'manager'],
          breadcrumb: [
            { text: 'Dashboard', to: '/' },
            { text: 'Projects', to: '/projects' },
          ],
        },
      },
      {
        path: '/tasks',
        name: 'tasks',
        component: () => import('pages/tasks/TasksPage.vue'),
        meta: {
          title: 'Tasks',
          roles: ['admin', 'manager', 'developer'],
          breadcrumb: [
            { text: 'Dashboard', to: '/' },
            { text: 'Tasks', to: '/tasks' },
          ],
        },
      },
      {
        path: '/profile',
        name: 'profile',
        component: () => import('pages/auth/ProfilePage.vue'),
        meta: {
          title: 'Profile',
          roles: ['admin', 'manager', 'developer'],
          breadcrumb: [
            { text: 'Dashboard', to: '/' },
            { text: 'Profile', to: '/profile' },
          ],
        },
      },
    ],
  },

  // Error pages
  {
    path: '/unauthorized',
    component: () => import('pages/ErrorUnauthorized.vue'),
    meta: { public: true },
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
    meta: { public: true },
  },
];

export default routes;
