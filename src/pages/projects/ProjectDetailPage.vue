<template>
  <q-page class="q-pa-md">
    <div class="row q-mb-md">
      <div class="col">
        <h4>{{ project.name }}</h4>
        <p class="text-grey">{{ project.description }}</p>
      </div>
      <div class="col-auto">
        <q-btn flat round icon="edit" @click="openEditDialog" />
        <q-btn flat round icon="delete" @click="confirmDelete" />
      </div>
    </div>

    <q-card class="q-mb-md">
      <q-card-section>
        <div class="text-subtitle1">Información del proyecto</div>
        <div class="row q-col-gutter-md">
          <div class="col-3">
            <q-chip :color="getStatusColor(project.status)" text-color="white">
              {{ project.status }}
            </q-chip>
          </div>
          <div class="col-3">
            <q-badge color="primary">Prioridad: {{ project.priority }}</q-badge>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-tabs
      v-model="tab"
      dense
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      align="left"
      narrow-indicator
    >
      <q-tab name="tasks" label="Tareas" />
      <q-tab name="developers" label="Desarrolladores" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="tasks">
        <!-- <q-table :rows="project.tasks" :columns="taskColumns" row-key="id" :loading="loading">
          <template v-slot:body-cell-status="props">
            <q-td :props="props">
              <q-badge :color="getTaskStatusColor(props.row.status)">
                {{ props.row.status }}
              </q-badge>
            </q-td>
          </template>
          <template v-slot:body-cell-developer="props">
            <q-td :props="props">
              {{ getDeveloperName(props.row.developerId) }}
            </q-td>
          </template>
        </q-table> -->
      </q-tab-panel>

      <q-tab-panel name="developers">
        <!-- <q-table
          :rows="project.developers"
          :columns="developerColumns"
          row-key="id"
          :loading="loading"
        /> -->
      </q-tab-panel>
    </q-tab-panels>

    <!-- Edit Dialog -->
    <q-dialog v-model="showEditDialog" persistent>
      <q-card style="width: 700px; max-width: 80vw">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Editar Proyecto</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-form @submit="saveProject">
            <div class="q-gutter-md">
              <q-input
                v-model="editForm.name"
                label="Nombre"
                :rules="[(val) => !!val || 'Campo requerido']"
              />
              <q-input v-model="editForm.description" label="Descripción" type="textarea" />
              <q-select v-model="editForm.status" :options="statusOptions" label="Estado" />
              <q-select v-model="editForm.priority" :options="priorityOptions" label="Prioridad" />
              <q-input
                v-model="editForm.startDate"
                label="Fecha de inicio"
                type="date"
                :rules="[(val) => !!val || 'Campo requerido']"
              />
              <div class="row">
                <q-space />
                <q-btn type="submit" label="Actualizar" color="primary" />
              </div>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Delete Confirmation Dialog -->
    <q-dialog v-model="confirmDeleteDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">Confirmar eliminación</div>
        </q-card-section>
        <q-card-section> ¿Estás seguro que deseas eliminar este proyecto? </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn flat label="Eliminar" color="negative" @click="deleteProject" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useQuasar } from 'quasar';
import type { Project } from '../../models/project.models';
import type { User } from '../../models/user.models';
import { projectRequest } from 'src/request';
import { controlError } from 'src/helpers/controlError';

const $q = useQuasar();
const route = useRoute();

const project = ref<Project>({
  id: '',
  name: '',
  description: '',
  status: 'pendiente',
  priority: 'media',
  startDate: '',
  endDate: '',
  managerId: '',
  developers: [],
  createdAt: '',
});

const tab = ref('tasks');
const loading = ref(false);
const showEditDialog = ref(false);
const confirmDeleteDialog = ref(false);

const editForm = ref<Project>({
  id: '',
  name: '',
  description: '',
  status: 'pendiente',
  priority: 'media',
  startDate: '',
  endDate: '',
  managerId: '',
  createdAt: '',
  developers: [],
});

const statusOptions = ['pendiente', 'en_progreso', 'completado', 'cancelado'];
const priorityOptions = ['baja', 'media', 'alta', 'urgente'];

const taskColumns = [
  { name: 'title', label: 'Título', field: 'title', sortable: true },
  { name: 'status', label: 'Estado', field: 'status', sortable: true },
  { name: 'priority', label: 'Prioridad', field: 'priority', sortable: true },
  { name: 'developer', label: 'Desarrollador', field: 'developerId', sortable: true },
  { name: 'dueDate', label: 'Fecha límite', field: 'dueDate', sortable: true },
];

const developerColumns = [
  { name: 'name', label: 'Nombre', field: 'name', sortable: true },
  { name: 'email', label: 'Email', field: 'email', sortable: true },
  { name: 'role', label: 'Rol', field: 'role', sortable: true },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pendiente':
      return 'warning';
    case 'en_progreso':
      return 'info';
    case 'completado':
      return 'positive';
    case 'cancelado':
      return 'negative';
    default:
      return 'grey';
  }
};

const getTaskStatusColor = (status: string) => {
  switch (status) {
    case 'pendiente':
      return 'warning';
    case 'en_progreso':
      return 'info';
    case 'completado':
      return 'positive';
    case 'cancelado':
      return 'negative';
    default:
      return 'grey';
  }
};

const getDeveloperName = (developerId: string) => {
  const developer = project.value.developers?.find((d: User) => d.id === developerId);
  return developer ? developer.name : '';
};

const fetchProject = async () => {
  loading.value = true;
  try {
    // TODO: Replace with actual API call
    const response = await projectRequest.getProjectById(route.params.id as string);
    const data = response;
    project.value = data;
  } catch (error) {
    controlError(error);
  } finally {
    loading.value = false;
  }
};

const openEditDialog = () => {
  Object.assign(editForm.value, project.value);
  showEditDialog.value = true;
};

const saveProject = async () => {
  try {
    await projectRequest.updateProject(editForm.value);
    $q.notify({
      type: 'positive',
      message: 'Proyecto actualizado exitosamente',
    });
    showEditDialog.value = false;
  } catch (error) {
    controlError(error);
  }
};

const confirmDelete = () => {
  confirmDeleteDialog.value = true;
};

const deleteProject = async () => {
  try {
    await projectRequest.deleteProject(project.value.id);
    $q.notify({
      type: 'positive',
      message: 'Proyecto eliminado exitosamente',
    });
    // Navigate back to project list
    $q.notify({
      type: 'positive',
      message: 'Redirigiendo...',
    });
    // TODO: Add navigation
  } catch (error) {
    controlError(error);
  }
};

// Load project data on mount
onMounted(async () => {
  await fetchProject();
});
</script>
