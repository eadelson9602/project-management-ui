import { api } from 'boot/axios';
import { useQuasar, LocalStorage } from 'quasar';
import type { Filter } from '../models/filter.models';
import type { Project } from '../models/project.models';

const $q = useQuasar();

export const projectRequest = {
  getProjects: async (params: Filter) => {
    try {
      const response = await api.get('/projects', {
        params: {
          ...params,
          token: LocalStorage.getItem('token'),
        },
      });
      return response.data;
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: 'Error al obtener proyectos',
      });
      throw error;
    }
  },

  getProjectById: async (id: string) => {
    try {
      const response = await api.get<Project>(`/projects/${id}`);
      return response.data;
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: 'Error al obtener el proyecto',
      });
      throw error;
    }
  },

  createProject: async (project: Project) => {
    try {
      const response = await api.post<Project>('/projects', {
        ...project,
        startDate: project.startDate.toString(),
        endDate: project.endDate.toString(),
        createdAt: project.createdAt.toString(),
      });
      return response.data;
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: 'Error al crear el proyecto',
      });
      throw error;
    }
  },

  updateProject: async (project: Project) => {
    try {
      const response = await api.patch<Project>(`/projects/${project.id}`, {
        ...project,
        startDate: project.startDate.toString(),
        endDate: project.endDate.toString(),
        createdAt: project.createdAt.toString(),
      });
      return response.data;
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: 'Error al actualizar el proyecto',
      });
      throw error;
    }
  },

  deleteProject: async (id: string) => {
    try {
      await api.delete(`/projects/${id}`);
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: 'Error al eliminar el proyecto',
      });
      throw error;
    }
  },

  assignDeveloper: async (projectId: string, developerId: string) => {
    try {
      await api.post(`/projects/${projectId}/developers`, {
        developerId,
      });
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: 'Error al asignar desarrollador',
      });
      throw error;
    }
  },

  removeDeveloper: async (id: string, developerId: string) => {
    try {
      await api.delete(`/projects/${id}/developers/${developerId}`);
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: 'Error al remover desarrollador',
      });
      throw error;
    }
  },
};
