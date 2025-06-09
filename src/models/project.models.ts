import type { User } from './user.models';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  priority: string;
  startDate: string;
  endDate: string;
  managerId: string;
  manager?: User;
  developers?: User[];
  createdAt: string;
}
