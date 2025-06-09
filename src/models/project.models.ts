import type { User } from './user.models';
import type { Task } from './task.models';

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
  tasks?: Task[];
  createdAt: string;
}
