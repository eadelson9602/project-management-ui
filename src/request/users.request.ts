import { api } from 'boot/axios';
import { errorHandler } from '../helpers/';
import type { User } from '../models/user.models';
import type { ResponseFilter } from '../models/general.models';

interface PaginationOptions {
  page?: number;
  limit?: number;
  sortOrder?: 'ASC' | 'DESC';
  filters?: {
    id?: string;
    name?: string;
    email?: string;
    role?: string;
    isActive?: boolean;
  };
}

export const usersRequest = {
  getAllUsers: async (options?: PaginationOptions): Promise<ResponseFilter<User[]>> => {
    try {
      const params = new URLSearchParams();

      // Agregar parámetros de paginación
      if (options?.page) params.append('page', options.page.toString());
      if (options?.limit) params.append('limit', options.limit.toString());
      if (options?.sortOrder) params.append('sortOrder', options.sortOrder);

      let endpoint = '/users';
      const q: Record<string, string | boolean | undefined> = {};

      // Determinar el endpoint basado en los filtros
      if (options?.filters) {
        if (options.filters.id) {
          endpoint = `/users/find/${options.filters.id}`;
        } else if (options.filters.isActive === false) {
          endpoint = '/users/deleted';
        } else {
          // Construir el objeto de búsqueda para el backend
          if (options.filters.name) q.name = options.filters.name;
          if (options.filters.email) q.email = options.filters.email;
          if (options.filters.role) q.role = options.filters.role;
          if (options.filters.isActive !== undefined) q.isActive = options.filters.isActive;

          if (Object.keys(q).length > 0) {
            params.append('q', JSON.stringify(q));
          }
        }
      }

      const { data } = await api.get<ResponseFilter<User[]>>(endpoint, {
        params: Object.fromEntries(params),
      });

      return data;
    } catch (error: unknown) {
      errorHandler(error);
      return { data: [], meta: { page: 0, limit: 0, totalItems: 0, totalPages: 0 } };
    }
  },

  getUserById: async (id: string) => {
    try {
      const response = await api.get<User>(`/users/${id}`);
      return response.data;
    } catch (error: unknown) {
      errorHandler(error);
      return undefined;
    }
  },

  updateUser: async (id: string, userData: Partial<User>) => {
    try {
      const response = await api.patch<User>(`/users/update/`, userData);
      return response.data;
    } catch (error: unknown) {
      errorHandler(error);
      return undefined;
    }
  },

  deleteUser: async (id: string) => {
    try {
      await api.delete(`/users/delete/${id}`);
      return true;
    } catch (error: unknown) {
      errorHandler(error);
      return false;
    }
  },
};
