import type { User } from './user.models';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  estimatedHours: number;
  actualHours: number;
  assignedTo?: User;
  dueDate: string;
  projectId: string;
  createdAt: string;
}
