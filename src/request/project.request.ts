import { api } from 'boot/axios';
import type { Filter } from '../models/filter.models';
import type { Project } from '../models/project.models';
import { errorHandler } from '../helpers/';

export const projectRequest = {
  getProjects: async (params: Filter) => {
    try {
      const response = await api.post('/projects', params);
      return response.data;
    } catch (error) {
      errorHandler(error);
    }
  },

  getProjectById: async (id: string) => {
    try {
      const response = await api.get<Project>(`/projects/find/${id}`);
      return response.data;
    } catch (error) {
      errorHandler(error);
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
      errorHandler(error);
    }
  },

  updateProject: async (project: Project) => {
    try {
      const response = await api.patch<Project>(`/projects/update/`, {
        ...project,
        startDate: project.startDate.toString(),
        endDate: project.endDate.toString(),
        createdAt: project.createdAt.toString(),
      });
      return response.data;
    } catch (error) {
      errorHandler(error);
    }
  },

  deleteProject: async (id: string) => {
    try {
      await api.delete(`/projects/remove/${id}`);
    } catch (error) {
      errorHandler(error);
    }
  },

  assignDeveloper: async (projectId: string, developerId: string) => {
    try {
      await api.post(`/projects/${projectId}/developers`, {
        developerId,
      });
    } catch (error) {
      errorHandler(error);
    }
  },

  removeDeveloper: async (id: string, developerId: string) => {
    try {
      await api.delete(`/projects/${id}/developers/${developerId}`);
    } catch (error) {
      errorHandler(error);
    }
  },
};
