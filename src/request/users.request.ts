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
      const { data } = await api.post<ResponseFilter<User[]>>('users', options);

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
