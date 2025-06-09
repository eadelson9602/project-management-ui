<template>
  <q-page padding>
    <q-card class="q-pa-lg q-mx-auto" style="max-width: 500px">
      <q-card-section>
        <div class="text-h6">{{ isEdit ? 'Editar Usuario' : 'Crear Usuario' }}</div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-form @submit.prevent="handleSubmit" class="q-gutter-md">
          <q-input v-model="form.name" label="Nombre" :rules="[(val) => !!val || 'Requerido']" />
          <q-input
            v-model="form.email"
            label="Email"
            type="email"
            :rules="[(val) => !!val || 'Requerido']"
          />
          <q-select
            v-model="form.role"
            :options="roles"
            label="Rol"
            :rules="[(val) => !!val || 'Requerido']"
            emit-value
            map-options
          />
          <q-input
            v-if="!isEdit"
            v-model="form.password"
            label="Contraseña"
            type="password"
            :rules="[(val) => !!val || 'Requerido']"
          />
          <div class="row justify-end q-gutter-sm">
            <q-btn label="Cancelar" flat @click="goBack" />
            <q-btn :label="isEdit ? 'Actualizar' : 'Crear'" color="primary" type="submit" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { controlError } from '../../helpers/';
import { authRequest, usersRequest } from '../../request';

// Opciones de roles (ajusta según tu modelo/backend)
const roles = [
  { label: 'Administrador', value: 'admin' },
  { label: 'Manager', value: 'manager' },
  { label: 'Developer', value: 'developer' },
];

// Router y Quasar
const $q = useQuasar();
const route = useRoute();
const router = useRouter();

// Detectar si es edición (por id en la ruta)
const userId = computed(() => route.params.id as string | undefined);
const isEdit = computed(() => !!userId.value);

// Modelo del formulario
const form = ref({
  name: '',
  email: '',
  role: '',
  password: '',
});

// Estado de carga
const isLoading = ref(false);

// Cargar usuario si es edición
onMounted(async () => {
  if (isEdit.value && userId.value) {
    try {
      const user = await usersRequest.getUserById(userId.value);
      form.value.name = user?.name ?? '';
      form.value.email = user?.email ?? '';
      form.value.role = user?.role ?? '';
      // No se carga la contraseña por seguridad
    } catch (e) {
      controlError(e);
    }
  }
});

// Enviar formulario
const handleSubmit = async () => {
  isLoading.value = true;
  try {
    if (isEdit.value && userId.value) {
      await usersRequest.updateUser(userId.value, {
        name: form.value.name,
        email: form.value.email,
        role: form.value.role,
      });

      $q.notify({ type: 'positive', message: 'Usuario actualizado.' });
    } else {
      await authRequest.register({
        name: form.value.name,
        email: form.value.email,
        role: form.value.role,
        password: form.value.password,
      });

      $q.notify({ type: 'positive', message: 'Usuario creado.' });
    }

    await goBack();
  } catch (e) {
    controlError(e);
  } finally {
    isLoading.value = false;
  }
};

const goBack = async () => {
  await router.push({ name: 'users' });
};
</script>
