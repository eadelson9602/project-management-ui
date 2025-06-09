import type { RouteRecordRaw } from 'vue-router';
import { authGuard } from './guards/auth.guard';

const routes: RouteRecordRaw[] = [
  // Public routes
  {
    path: '/auth',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      {
        path: '/login',
        name: 'login',
        component: () => import('pages/auth/LoginPage.vue'),
        meta: { public: true },
      },
      {
        path: '/register',
        name: 'register',
        component: () => import('pages/auth/RegisterPage.vue'),
        meta: { public: true },
      },
      {
        path: '/password_reset',
        name: 'password_reset',
        component: () => import('pages/auth/PasswordResetPage.vue'),
        meta: { public: true },
      },
    ],
  },

  // Protected routes
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: 'home',
        name: 'home',
        component: () => import('pages/DashboardPage.vue'),
        meta: {
          title: 'Dashboard',
          roles: ['admin', 'manager', 'developer'],
          requiresAuth: true,
        },
      },
      {
        path: 'projects',
        name: 'projects',
        component: () => import('pages/projects/ProjectListPage.vue'),
        meta: {
          title: 'Proyectos',
          requiresAuth: true,
          roles: ['admin', 'manager', 'developer'],
        },
      },
      {
        path: 'projects/:id',
        name: 'project-detail',
        component: () => import('pages/projects/ProjectDetailPage.vue'),
        meta: {
          title: 'Detalles del Proyecto',
          requiresAuth: true,
          roles: ['admin', 'manager', 'developer'],
        },
      },
      {
        path: '/tasks',
        name: 'tasks',
        component: () => import('pages/tasks/TasksPage.vue'),
        meta: {
          title: 'Tasks',
          requiresAuth: true,
          roles: ['admin', 'manager', 'developer'],
        },
      },
      {
        path: '/profile',
        name: 'profile',
        component: () => import('pages/auth/ProfilePage.vue'),
        meta: {
          title: 'Profile',
          requiresAuth: true,
          roles: ['admin', 'manager', 'developer'],
        },
      },
      {
        path: '/users',
        name: 'users',
        component: () => import('pages/user/UsersPage.vue'),
        meta: {
          title: 'Users',
          requiresAuth: true,
          roles: ['admin', 'manager', 'developer'],
        },
      },
    ],
  },

  // Error pages
  {
    path: '/unauthorized',
    name: 'unauthorized',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '/',
        component: () => import('pages/ErrorUnauthorized.vue'),
      },
    ],
    meta: { public: true },
    beforeEnter: authGuard,
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
    meta: { public: true },
  },
];

export default routes;
