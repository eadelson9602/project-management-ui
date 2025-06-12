import { api } from 'boot/axios';
import type { Task } from '../models/task.models';
import { errorHandler } from '../helpers/';

export const taskRequest = {
  async getTasks(params?: Record<string, unknown>) {
    try {
      const response = await api.post('/tasks', params);
      return response.data;
    } catch (error) {
      errorHandler(error);
      return { data: [], meta: { page: 0, limit: 0, totalItems: 0, totalPages: 0 } };
    }
  },

  async getTaskById(id: string) {
    try {
      const response = await api.get(`/tasks/find/${id}`);
      return response.data;
    } catch (error) {
      errorHandler(error);
      return null;
    }
  },

  async createTask(data: Partial<Task>) {
    try {
      const response = await api.post('/tasks/create', data);
      return response.data;
    } catch (error) {
      errorHandler(error);
      return null;
    }
  },

  async updateTask(data: Partial<Task>) {
    try {
      const response = await api.patch('/tasks/update', data);
      return response.data;
    } catch (error) {
      errorHandler(error);
      return null;
    }
  },

  async deleteTask(id: string) {
    try {
      await api.delete(`/tasks/delete/${id}`);
      return true;
    } catch (error) {
      errorHandler(error);
      return false;
    }
  },
};
