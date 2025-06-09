import { route } from 'quasar/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import { LocalStorage } from 'quasar';
import { decryptedAES } from '../helpers';
import { useAuthStore } from '../stores/auth';

import routes from './routes';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  // Hacemos beforeach del router para saber que páginas requiren autenticación
  Router.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth); //Con esto sabemos si la ruta visitada requiere autenticación
    // const isLogged = store.state.auth.isLogged //Con esto sabemos si el usuario esta logueado
    /* eslint-disable */
    let tokenEncrypt = LocalStorage.getItem('token') as unknown as string;
    let token = tokenEncrypt ? decryptedAES(tokenEncrypt) : '';

    if (
      (!requiresAuth && token && to.path === '/login') ||
      (requiresAuth && token && to.path === '/')
    ) {
      return next('/home');
    }

    const authStore = useAuthStore();

    // Si la ruta requiere autenticación
    if (to.meta.requiresAuth) {
      if (!authStore.isAuthenticated) {
        return next({ name: 'login' });
      }

      // Si la ruta requiere roles específicos
      if (to.meta.roles && Array.isArray(to.meta.roles)) {
        const userRole = authStore.user?.role;
        if (!userRole || !to.meta.roles.includes(userRole)) {
          return next('/unauthorized');
        }
      }
    }

    setTimeout(() => {
      if (requiresAuth && !token) {
        next('/login');
      } else {
        next();
      }
    }, 200);
  });

  return Router;
});
