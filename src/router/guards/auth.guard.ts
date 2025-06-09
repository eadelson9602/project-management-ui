import { useAuthStore } from '../../stores/auth';
import { useRouter } from 'vue-router';
import { LocalStorage } from 'quasar';
import type { RouteLocationNormalizedGeneric } from 'vue-router';

export function authGuard(to: RouteLocationNormalizedGeneric) {
  const authStore = useAuthStore();
  const router = useRouter();

  // Si la ruta es pública, permitir acceso
  if (to.meta.public) {
    return true;
  }

  // Verificar si el usuario está autenticado
  if (!authStore.isAuthenticated) {
    // Guardar la ruta actual para redirigir después del login
    LocalStorage.set('redirectAfterLogin', to.fullPath);
    return router.push({ name: 'login' });
  }

  // Verificar roles si están especificados en la meta
  if (Array.isArray(to.meta.roles)) {
    const hasRequiredRole = to.meta.roles.some((role: string) => authStore.hasRole(role));
    if (!hasRequiredRole) {
      return router.push({ name: 'unauthorized' });
    }
  }

  return true;
}
