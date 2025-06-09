import { useQuasar, LocalStorage } from 'quasar';
import { api } from 'boot/axios';
import type { UserAuth } from '../models/auth.models';
import type { User } from '../models/user.models';

const $q = useQuasar();

export const authRequest = {
  login: async (credentials: { email: string; password: string }) => {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data.token) {
        LocalStorage.set('token', response.data.token);
        LocalStorage.set('refreshToken', response.data.refreshToken);
        LocalStorage.set('user', response.data.user);
      }
      return response.data;
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: 'Error al iniciar sesión',
      });
      throw error;
    }
  },

  refreshToken: async () => {
    try {
      const response = await api.post('/auth/refresh');
      LocalStorage.set('token', response.data.token);
      LocalStorage.set('refreshToken', response.data.refreshToken);
      return response.data;
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: 'Error al refrescar el token',
      });
      throw error;
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
      LocalStorage.clear();
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: 'Error al cerrar sesión',
      });
      throw error;
    }
  },

  register: async (userData: UserAuth) => {
    return await api.post<User>('/auth/register', userData);
  },

  getCurrentUser: async () => {
    return await api.get<User>('/auth/profile');
  },
};
