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

export interface TaskTableRequestProps {
  pagination: {
    page: number;
    rowsPerPage: number;
    sortBy?: string;
    descending?: boolean;
    sortOrder?: string;
    rowsNumber?: number;
  };
  filter?: Record<string, unknown>;
  getCellValue?: (col: Record<string, unknown>, row: Record<string, unknown>) => unknown;
}
