<template>
  <q-page class="q-pa-md">
    <q-dialog v-model="dialogCreateTask">
      <q-card style="width: 450px; max-width: 80vw">
        <q-card-section>
          <form-create-task-component @create-task="createTask" />
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-table
      :rows="tasks"
      :columns="columns"
      row-key="id"
      :loading="loading"
      :pagination="pagination"
      @request="fetchTasks"
    >
      <template v-slot:top>
        <q-toolbar>
          <q-toolbar-title>Tareas</q-toolbar-title>
          <q-btn
            icon="add"
            color="primary"
            label="Nueva Tarea"
            @click="dialogCreateTask = true"
            class="q-ml-md"
          />
        </q-toolbar>
      </template>
      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <q-badge :color="getStatusColor(props.row.status)">
            {{ getStatusLabel(props.row.status) }}
          </q-badge>
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn icon="edit" color="primary" flat round size="sm" @click="editTask(props.row)" />
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
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { taskRequest } from '../../request';
import { controlError } from '../../helpers';
import { FormCreateTaskComponent } from '../../components';
import type { Task, TaskTableRequestProps } from '../../models/task.models';

const $q = useQuasar();

// Estado
const loading = ref(false);
const tasks = ref<Task[]>([]);
const dialogCreateTask = ref(false);

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
  $q.loading.show({ message: 'Cargando tareas...' });
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
    $q.loading.hide();
  }
};

const editTask = (task: Task) => {
  // Implementar edición de tarea
  console.log('Editar tarea:', task);
};

const createTask = async (task: Task) => {
  try {
    // Implementar creación de tarea
    await taskRequest.createTask(task);

    $q.notify({
      type: 'positive',
      message: 'Tarea creada exitosamente',
    });

    await fetchTasks({ pagination: pagination.value });
  } catch (error) {
    controlError(error);
  }
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
});
</script>
