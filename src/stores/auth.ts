import { defineStore } from 'pinia';
import { LocalStorage } from 'quasar';
import type { User } from '../models/user.models';
import { decryptedAES, decryptJSON } from '../helpers';

interface Permissions {
  dashboard: boolean;
  projects: boolean;
  tasks: boolean;
  profile: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  permissions: Permissions;
  isAuthenticated: boolean;
}

export const useAuthStore = defineStore('authStore', {
  state: (): AuthState => ({
    user: null,
    token: null,
    permissions: {
      dashboard: false,
      projects: false,
      tasks: false,
      profile: false,
    },
    isAuthenticated: false,
  }),

  getters: {
    hasPermission: (state) => {
      return (permission: keyof Permissions): boolean => {
        return !!state.permissions[permission];
      };
    },
    hasRole: (state) => {
      return (role: string): boolean => {
        return state.user?.role === role;
      };
    },
  },
  actions: {
    setUser(user: User, token: string) {
      this.user = user;
      this.token = token;
      this.isAuthenticated = true;
      this.updatePermissions();
    },
    login(token: string, user: User) {
      // Guardar el token encriptado
      LocalStorage.set('token', token);
      LocalStorage.set('userAuth', JSON.stringify(user));
      // Actualizar el estado
      this.setUser(user, token);
    },
    logout() {
      LocalStorage.remove('token');
      LocalStorage.remove('userAuth');
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;
      this.permissions = {
        dashboard: false,
        projects: false,
        tasks: false,
        profile: false,
      };
    },
    loadUserFromStorage() {
      const user = decryptJSON(LocalStorage.getItem('userAuth') || '{}') as unknown as User;
      const token = decryptedAES(LocalStorage.getItem('token') || '');
      if (user && token) {
        this.setUser(user, token);
      }
    },
    updatePermissions() {
      if (!this.user?.role) return;
      // Definir los permisos por rol
      const permissionsByRole: Record<string, Permissions> = {
        admin: {
          dashboard: true,
          projects: true,
          tasks: true,
          profile: true,
        },
        manager: {
          dashboard: false,
          projects: true,
          tasks: true,
          profile: true,
        },
        developer: {
          dashboard: true,
          projects: false,
          tasks: true,
          profile: true,
        },
        user: {
          dashboard: false,
          projects: false,
          tasks: true,
          profile: true,
        },
      };
      // Obtener los permisos del rol del usuario
      const userRole = this.user.role;
      this.permissions = permissionsByRole[userRole] || {
        dashboard: false,
        projects: false,
        tasks: false,
        profile: false,
      };
    },
    hasAccessToModule(module: keyof Permissions) {
      return !!this.permissions[module];
    },
  },

  persist: true,
});
