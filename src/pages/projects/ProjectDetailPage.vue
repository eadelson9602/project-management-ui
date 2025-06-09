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

    <q-card class="q-mb-md" flat>
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
        <q-table
          flat
          :rows="project.tasks || []"
          :columns="taskColumns"
          row-key="id"
          :loading="loading"
        >
          <template v-slot:body-cell-status="props">
            <q-td :props="props">
              <q-badge :color="getStatusColor(props.row.status)">
                {{ props.row.status }}
              </q-badge>
            </q-td>
          </template>
          <template v-slot:body-cell-developer="props">
            <q-td :props="props">
              {{ getDeveloperName(props.row.developerId) }}
            </q-td>
          </template>
        </q-table>
      </q-tab-panel>

      <q-tab-panel name="developers">
        <q-table
          :rows="project.developers || []"
          :columns="developerColumns"
          row-key="id"
          :loading="loading"
          flat
        />
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
              <q-select
                v-model="editForm.status"
                :options="statusOptions"
                label="Estado"
                emit-value
                map-options
              />
              <q-select
                v-model="editForm.priority"
                :options="priorityOptions"
                label="Prioridad"
                emit-value
                map-options
              />
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
import { useRoute, useRouter } from 'vue-router';
import { useQuasar, Dialog } from 'quasar';
import { projectRequest } from '../../request';
import { controlError } from '../../helpers';
import type { Project } from '../../models/project.models';
import type { User } from '../../models/user.models';

const $q = useQuasar();
const route = useRoute();
const router = useRouter();

const project = ref<Project>({
  id: '',
  name: '',
  description: '',
  status: 'todo',
  priority: 'medium',
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
  status: 'todo',
  priority: 'medium',
  startDate: '',
  endDate: '',
  managerId: '',
  createdAt: '',
  developers: [],
});

const statusOptions = [
  { label: 'Pendiente', value: 'todo' },
  { label: 'En progreso', value: 'in_progress' },
  { label: 'Completado', value: 'done' },
  { label: 'Revision', value: 'review' },
];
const priorityOptions = [
  {
    label: 'Alta',
    value: 'high',
  },
  {
    label: 'Media',
    value: 'medium',
  },
  {
    label: 'Baja',
    value: 'low',
  },
];

const taskColumns = [
  { name: 'name', label: 'Nombre', field: 'title', align: 'left' as const },
  { name: 'description', label: 'Decripción', field: 'description', align: 'left' as const },
  { name: 'status', label: 'Estado', field: 'status', align: 'left' as const },
  { name: 'developer', label: 'Desarrollador', field: 'developerId', align: 'left' as const },
  { name: 'startDate', label: 'Inicio', field: 'startDate', align: 'left' as const },
  { name: 'priority', label: 'Prioridad', field: 'priority', align: 'left' as const },
  {
    name: 'estimatedHours',
    label: 'Horas estimadas',
    field: 'estimatedHours',
    align: 'left' as const,
  },
  { name: 'actualHours', label: 'Hora actual', field: 'actualHours', align: 'left' as const },
  { name: 'dueDate', label: 'Fin', field: 'dueDate', align: 'left' as const },
];

const developerColumns = [
  { name: 'name', label: 'Nombre', field: 'name', align: 'left' as const },
  { name: 'email', label: 'Email', field: 'email', align: 'left' as const },
  { name: 'role', label: 'Rol', field: 'role', align: 'left' as const },
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

const fetchProject = async () => {
  loading.value = true;
  try {
    const id = route.params.id as string | undefined;
    if (!id) {
      // Si no hay id, mostrar dialog para seleccionar proyecto
      await showProjectSelectionDialog();
      return;
    }
    const response = await projectRequest.getProjectById(id);
    if (!response) {
      $q.notify({ type: 'negative', message: 'Proyecto no encontrado.' });
      await router.replace({ name: 'projects' });
      return;
    }
    project.value = response;
  } catch (error) {
    controlError(error);
  } finally {
    loading.value = false;
  }
};

const showProjectSelectionDialog = async () => {
  try {
    loading.value = true;
    const allProjects = await projectRequest.getProjects({ page: 1, limit: 100 });
    const options = (allProjects.data || []).map((p: Project) => ({
      label: p.name,
      value: p.id,
    }));

    if (!options.length) {
      $q.notify({ type: 'negative', message: 'No hay proyectos disponibles.' });
      await router.replace({ name: 'projects' });
      return;
    }

    Dialog.create({
      title: 'Selecciona un proyecto',
      message: 'No se proporcionó un ID de proyecto. Por favor selecciona uno:',
      options: {
        type: 'radio',
        model: options[0].value,
        items: options,
      },
      cancel: true,
      persistent: true,
      ok: {
        label: 'Ir al proyecto',
        color: 'primary',
      },
    })
      .onOk((selectedId: string) => {
        if (selectedId) {
          void router.replace({ name: 'project-detail', params: { id: selectedId } });
        } else {
          void router.replace({ name: 'projects' });
        }
      })
      .onCancel(() => {
        void router.replace({ name: 'projects' });
      });
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
    await fetchProject();
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
    $q.notify({
      type: 'positive',
      message: 'Redirigiendo...',
    });
    await router.replace({ name: 'projects' });
  } catch (error) {
    controlError(error);
  }
};

const getDeveloperName = (developerId: string) => {
  const dev = project.value.developers?.find((d: User) => d.id === developerId);
  return dev ? dev.name : 'Sin asignar';
};

onMounted(async () => {
  await fetchProject();
});
</script>
