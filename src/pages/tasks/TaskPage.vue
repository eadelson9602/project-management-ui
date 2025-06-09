<template>
  <q-page class="q-pa-md">
    <!-- Header -->
    <div class="text-h5 q-mb-md">Gestión de Tareas</div>

    <!-- Formulario de creación de tarea -->
    <q-card class="q-mb-md">
      <q-card-section>
        <q-form @submit.prevent="createTask" class="q-gutter-md">
          <div class="row q-col-gutter-md">
            <!-- Título -->
            <div class="col-12">
              <q-input
                v-model="taskForm.title"
                label="Título de la tarea"
                :rules="[(val) => !!val || 'Campo requerido']"
                outlined
              />
            </div>

            <!-- Descripción -->
            <div class="col-12">
              <q-input
                v-model="taskForm.description"
                label="Descripción"
                type="textarea"
                outlined
              />
            </div>

            <!-- Estado -->
            <div class="col-4">
              <q-select
                v-model="taskForm.status"
                :options="statusOptions"
                label="Estado"
                emit-value
                map-options
                outlined
              />
            </div>

            <!-- Prioridad -->
            <div class="col-4">
              <q-select
                v-model="taskForm.priority"
                :options="priorityOptions"
                label="Prioridad"
                emit-value
                map-options
                outlined
              />
            </div>

            <!-- Desarrollador -->
            <div class="col-4">
              <q-select
                v-model="taskForm.developerId"
                :options="developers"
                label="Desarrollador"
                emit-value
                map-options
                outlined
              />
            </div>

            <!-- Fecha de inicio -->
            <div class="col-6">
              <q-input v-model="taskForm.startDate" label="Fecha de inicio" type="date" outlined />
            </div>

            <!-- Fecha límite -->
            <div class="col-6">
              <q-input v-model="taskForm.dueDate" label="Fecha límite" type="date" outlined />
            </div>

            <!-- Horas estimadas -->
            <div class="col-6">
              <q-input
                v-model.number="taskForm.estimatedHours"
                label="Horas estimadas"
                type="number"
                outlined
              />
            </div>
          </div>

          <!-- Botones -->
          <div class="row justify-end q-mt-md">
            <q-btn
              label="Cancelar"
              type="reset"
              color="grey"
              flat
              class="q-mr-sm"
              @click="resetForm"
            />
            <q-btn label="Crear Tarea" type="submit" color="primary" :loading="loading" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>

    <!-- Lista de tareas -->
    <q-card>
      <q-card-section>
        <q-table
          :rows="tasks"
          :columns="columns"
          row-key="id"
          :loading="loading"
          :pagination="pagination"
          @request="fetchTasks"
        >
          <template v-slot:body-cell-status="props">
            <q-td :props="props">
              <q-badge :color="getStatusColor(props.row.status)">
                {{ getStatusLabel(props.row.status) }}
              </q-badge>
            </q-td>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn
                icon="edit"
                color="primary"
                flat
                round
                size="sm"
                @click="editTask(props.row)"
              />
              <q-btn
                icon="delete"
                color="negative"
                flat
                round
                size="sm"
                @click="deleteTask(props.row.id)"
                class="q-ml-sm"
              />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { taskRequest } from '../../request';
import { controlError } from '../../helpers';
import type { Task, TaskTableRequestProps } from '../../models/task.models';
import type { User } from '../../models/user.models';

const $q = useQuasar();

// Estado
const loading = ref(false);
const tasks = ref<Task[]>([]);
const developers = ref<User[]>([]);

// Formulario
const taskForm = ref({
  title: '',
  description: '',
  status: 'todo' as TaskStatus,
  priority: 'medium',
  developerId: '',
  startDate: '',
  dueDate: '',
  estimatedHours: 0,
});

// Opciones para selects
const statusOptions = [
  { label: 'Pendiente', value: 'todo' },
  { label: 'En progreso', value: 'in_progress' },
  { label: 'Completado', value: 'done' },
  { label: 'En revisión', value: 'review' },
];

const priorityOptions = [
  { label: 'Alta', value: 'high' },
  { label: 'Media', value: 'medium' },
  { label: 'Baja', value: 'low' },
];

// Columnas de la tabla
const columns = [
  { name: 'title', label: 'Título', field: 'title', align: 'left' as const },
  { name: 'description', label: 'Descripción', field: 'description', align: 'left' as const },
  { name: 'status', label: 'Estado', field: 'status', align: 'center' as const },
  { name: 'priority', label: 'Prioridad', field: 'priority', align: 'center' as const },
  { name: 'developer', label: 'Desarrollador', field: 'developerId', align: 'left' as const },
  { name: 'startDate', label: 'Inicio', field: 'startDate', align: 'center' as const },
  { name: 'dueDate', label: 'Fin', field: 'dueDate', align: 'center' as const },
  {
    name: 'estimatedHours',
    label: 'Horas estimadas',
    field: 'estimatedHours',
    align: 'center' as const,
  },
  { name: 'actions', label: 'Acciones', field: 'actions', align: 'right' as const },
];

// Paginación
const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
});

// Métodos
const fetchTasks = async (props: TaskTableRequestProps) => {
  loading.value = true;
  try {
    const response = await taskRequest.getTasks({
      page: props.pagination.page,
      limit: props.pagination.rowsPerPage,
      sortOrder: props.pagination.sortOrder,
    });
    tasks.value = response.data;
    pagination.value.rowsNumber = response.meta.totalItems;
  } catch (error) {
    controlError(error);
  } finally {
    loading.value = false;
  }
};

const fetchDevelopers = async () => {
  try {
    const response = await taskRequest.getTasks({
      filters: JSON.stringify({ role: 'developer' }),
    });
    developers.value = response.data.map((task: Task) => ({
      label: task.assignedTo?.name || 'Desarrollador no asignado',
      value: task.assignedTo?.id,
    }));
  } catch (error) {
    controlError(error);
  }
};

const createTask = async () => {
  loading.value = true;
  try {
    const newTask = await taskRequest.createTask(taskForm.value);
    if (newTask) {
      $q.notify({
        type: 'positive',
        message: 'Tarea creada exitosamente',
      });
      resetForm();
      await fetchTasks({ pagination: pagination.value });
    }
  } catch (error) {
    controlError(error);
  } finally {
    loading.value = false;
  }
};

const editTask = (task: Task) => {
  // Implementar edición de tarea
  console.log('Editar tarea:', task);
};

const deleteTask = async (id: string) => {
  try {
    await taskRequest.deleteTask(id);
    $q.notify({
      type: 'positive',
      message: 'Tarea eliminada exitosamente',
    });
    await fetchTasks({ pagination: pagination.value });
  } catch (error) {
    controlError(error);
  }
};

const resetForm = () => {
  taskForm.value = {
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    developerId: '',
    startDate: '',
    dueDate: '',
    estimatedHours: 0,
  };
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'todo':
      return 'warning';
    case 'in_progress':
      return 'info';
    case 'done':
      return 'positive';
    case 'review':
      return 'secondary';
    default:
      return 'grey';
  }
};

type TaskStatus = 'todo' | 'in_progress' | 'done' | 'review';

const getStatusLabel = (status: TaskStatus) => {
  const labels: Record<TaskStatus, string> = {
    todo: 'Pendiente',
    in_progress: 'En progreso',
    done: 'Completado',
    review: 'En revisión',
  };
  return labels[status];
};

// Cargar datos iniciales
onMounted(async () => {
  await fetchTasks({ pagination: pagination.value });
  await fetchDevelopers();
});
</script>
