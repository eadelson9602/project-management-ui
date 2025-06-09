import { LocalStorage } from 'quasar';
import { api } from 'boot/axios';
import { encryptedAES, encryptJSON, decryptJSON, errorHandler } from '../helpers/';
import type { User } from '../models/user.models';
import type { UserAuth } from '../models/auth.models';

export const authRequest = {
  login: async (credentials: { email: string; password: string }) => {
    try {
      const response = await api.post<UserAuth>('/auth/login', credentials);
      if (response.data.token) {
        LocalStorage.set('token', encryptedAES(response.data.token));
        LocalStorage.set('userAuth', encryptJSON(response.data as unknown as JSON));

        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      }
      return response.data;
    } catch (error: unknown) {
      errorHandler(error);
    }
  },

  refreshToken: async () => {
    try {
      const response = await api.post<UserAuth>('/auth/refresh');
      LocalStorage.set('token', encryptedAES(response.data.token));
      LocalStorage.set('userAuth', encryptJSON(response.data as unknown as JSON));
      api.defaults.headers.common['x-access-token'] = response.data.token;
      return response.data;
    } catch (error: unknown) {
      errorHandler(error);
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
      LocalStorage.clear();
      api.defaults.headers.common['x-access-token'] = '';
    } catch (error: unknown) {
      errorHandler(error);
    }
  },

  register: async (userData: User) => {
    try {
      const response = await api.post<User>('/users/create', userData);
      return response.data;
    } catch (error: unknown) {
      errorHandler(error);
    }
  },

  getCurrentUser: async () => {
    try {
      const currentUser = decryptJSON(
        LocalStorage.getItem('userAuth') as string,
      ) as unknown as UserAuth;
      const response = await api.get<User>(`/users/find/${currentUser.id}`);

      return response.data;
    } catch (error: unknown) {
      errorHandler(error);
    }
  },
};
