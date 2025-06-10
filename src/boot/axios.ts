import { defineBoot } from '#q-app/wrappers';
import axios, { type AxiosInstance } from 'axios';
import { LocalStorage } from 'quasar';
import { decryptedAES } from '../helpers/';

declare module 'vue' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
  }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const baseURL = process.env.__URLAPI__ || 'http://localhost:3000';
const api = axios.create({ baseURL, withCredentials: true });

export default defineBoot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api
  const token = LocalStorage.getItem('token') as unknown as string;

  api.defaults.headers.common['Authorization'] = `Bearer ${token ? decryptedAES(token) : ''}`;

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Aquí implementarás la lógica para refrescar el token
        // Por ejemplo, puedes llamar a la función refreshToken de tu store
        // store.refreshToken();
      }
      // Ensure we always reject with an Error instance
      const err = error.response
        ? new Error(error.response.data?.message || error.response.statusText)
        : new Error(error.message || 'Network error');

      return Promise.reject(err);
    },
  );
});

export { api };
