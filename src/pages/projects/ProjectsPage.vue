<template>
  <q-page padding>
    <!-- Filtros -->
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-md-4">
        <q-input v-model="filters.name" label="Nombre del Proyecto" dense outlined />
      </div>
      <div class="col-12 col-md-4">
        <q-input v-model="filters.client" label="Cliente" dense outlined />
      </div>
      <div class="col-12 col-md-4">
        <q-select v-model="filters.status" :options="statusOptions" label="Estado" dense outlined />
      </div>
    </div>

    <!-- Botones de acción -->
    <div class="row q-mb-md">
      <q-btn color="primary" label="Filtrar" @click="fetchProjects" class="q-mr-sm" />
      <q-btn color="secondary" label="Limpiar filtros" @click="clearFilters" />
    </div>

    <!-- Tabla -->
    <q-table
      :rows="projects"
      :columns="columns"
      :loading="loading"
      row-key="id"
      :pagination="pagination"
      @request="onRequest"
      :rows-per-page-options="[10, 20, 50]"
    >
      <template v-slot:body-cell-actions="props">
        <q-td>
          <q-btn
            flat
            round
            color="info"
            icon="visibility"
            size="sm"
            @click="viewProject(props.row)"
          />
          <q-btn flat round color="primary" icon="edit" size="sm" @click="editProject(props.row)" />
          <q-btn
            flat
            round
            color="negative"
            icon="delete"
            size="sm"
            @click="deleteProject(props.row)"
          />
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { projectRequest } from '../../request';
import { controlError } from '../../helpers';
import type { Project } from '../../models/project.models';

const router = useRouter();

// Definir las columnas de la tabla
const columns = [
  {
    name: 'name',
    label: 'Nombre',
    field: 'name',
    align: 'left' as const,
    sortable: true,
  },
  {
    name: 'status',
    label: 'Estado',
    field: 'status',
    align: 'left' as const,
    sortable: true,
  },
  {
    name: 'startDate',
    label: 'Fecha Inicio',
    field: 'startDate',
    align: 'left' as const,
    sortable: true,
  },
  {
    name: 'endDate',
    label: 'Fecha Fin',
    field: 'endDate',
    align: 'left' as const,
    sortable: true,
  },
  {
    name: 'actions',
    label: 'Acciones',
    field: 'actions',
    align: 'center' as const,
  },
];

// Opciones de estado de proyecto
const statusOptions = [
  { label: 'Activo', value: 'active' },
  { label: 'En pausa', value: 'paused' },
  { label: 'Finalizado', value: 'finished' },
];

// Estado
const projects = ref<Project[]>([]);
const loading = ref(false);
const pagination = ref({
  sortBy: 'name',
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
});

// Filtros
const filters = ref({
  name: '' as string | null,
  client: '' as string | null,
  status: '' as string | null,
});

// Métodos
async function fetchProjects() {
  try {
    loading.value = true;
    const filterObj: { name?: string; client?: string; status?: string } = {};
    if (filters.value.name) filterObj.name = filters.value.name;
    if (filters.value.client) filterObj.client = filters.value.client;
    if (filters.value.status) filterObj.status = filters.value.status;

    const response = await projectRequest.getProjects({
      page: pagination.value.page,
      limit: pagination.value.rowsPerPage,
    });

    projects.value = response.data;
    pagination.value.rowsNumber = response.meta.totalItems;
  } catch (error) {
    controlError(error);
  } finally {
    loading.value = false;
  }
}

async function clearFilters() {
  filters.value = {
    name: '',
    client: '',
    status: '',
  };
  await fetchProjects();
}

async function onRequest(requestProp: {
  pagination: {
    sortBy: string;
    descending: boolean;
    page: number;
    rowsPerPage: number;
    rowsNumber?: number;
  };
  filter?: Record<string, unknown>;
  getCellValue: (col: Record<string, unknown>, row: Record<string, unknown>) => unknown;
}) {
  const { page, rowsPerPage, sortBy, descending } = requestProp.pagination ?? {};
  pagination.value = {
    ...pagination.value,
    page: page ?? pagination.value.page,
    rowsPerPage: rowsPerPage ?? pagination.value.rowsPerPage,
    sortBy: sortBy ?? pagination.value.sortBy,
    descending: descending ?? pagination.value.descending,
  };
  await fetchProjects();
}

const $q = useQuasar();

const viewProject = async (project: Project) => {
  // Implementa la navegación o modal para ver detalles
  await router.push({ name: 'project-detail', params: { id: project.id } });
};

function editProject(project: Project) {
  // Implementa la navegación a la edición
  $q.notify({ type: 'info', message: `Editar proyecto: ${project.name}` });
}

async function deleteProject(project: Project) {
  try {
    await projectRequest.deleteProject(project.id);
    await fetchProjects();
    $q.notify({
      type: 'positive',
      message: 'Proyecto eliminado exitosamente',
    });
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Error al eliminar el proyecto',
    });
    controlError(error);
  }
}

// Inicializar
onMounted(async () => {
  await fetchProjects();
});
</script>
