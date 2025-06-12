<template>
  <q-form @submit.prevent="submitForm" class="q-gutter-md">
    <q-input
      filled
      label="Título"
      v-model="task.title"
      required
      :rules="[(val) => !!val || 'El título es requerido']"
    />
    <q-input
      filled
      label="Descripción"
      v-model="task.description"
      type="textarea"
      required
      :rules="[(val) => !!val || 'La descripción es requerida']"
    />
    <q-select
      filled
      label="Estado"
      v-model="task.status"
      :options="statusOptions"
      required
      :rules="[(val) => !!val || 'El estado es requerido']"
    />
    <q-input
      filled
      label="Fecha límite"
      v-model="task.dueDate"
      type="date"
      required
      :rules="[(val) => !!val || 'La fecha límite es requerida']"
    />
    <q-select
      filled
      label="Prioridad"
      v-model="task.priority"
      :options="priorityOptions"
      required
      :rules="[(val) => !!val || 'La prioridad es requerida']"
    />
    <q-btn type="submit" color="primary" label="Crear tarea" />
  </q-form>
</template>

<script lang="ts" setup>
import { ref, defineEmits, onMounted } from 'vue';
import { usersRequest } from '../../request';
import { controlError } from '../../helpers';

const statusOptions = [
  { label: 'Pendiente', value: 'pendiente' },
  { label: 'En progreso', value: 'en_progreso' },
  { label: 'Completada', value: 'completada' },
];

const priorityOptions = [
  { label: 'Baja', value: 'baja' },
  { label: 'Media', value: 'media' },
  { label: 'Alta', value: 'alta' },
];

const task = ref({
  title: '',
  description: '',
  status: 'pendiente',
  dueDate: '',
  priority: 'media',
});

const emit = defineEmits(['create-task']);

const submitForm = () => {
  // Emitir el evento con los datos de la tarea
  emit('create-task', { ...task.value });
  // Limpiar el formulario
  task.value = {
    title: '',
    description: '',
    status: 'pendiente',
    dueDate: '',
    priority: 'media',
  };
};

const getDeveloperOptions = async () => {
  try {
    const response = await usersRequest.getAllUsers({
      page: 1,
      limit: 10,
      sortOrder: 'ASC',
      filters: {
        role: 'developer',
      },
    });
    return response.data.map((dev: any) => ({
      label: dev.name,
      value: dev.id,
    }));
  } catch (error) {
    controlError(error);
  } finally {
  }
};

onMounted(() => {
  getDeveloperOptions();
});
</script>

<style scoped>
.q-gutter-md {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
