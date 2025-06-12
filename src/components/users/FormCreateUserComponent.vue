<template>
  <q-form @submit.prevent="handleSubmit" class="row">
    <div class="col-xs-12 q-pa-sm">
      <q-input
        outlined
        dense
        v-model="form.name"
        label="Nombre"
        :rules="[(val) => !!val || 'Requerido']"
      />
    </div>
    <div class="col-xs-12 q-pa-sm">
      <q-input
        outlined
        dense
        v-model="form.email"
        label="Email"
        type="email"
        :rules="[(val) => !!val || 'Requerido']"
      />
    </div>
    <div class="col-xs-12 q-pa-sm">
      <q-select
        outlined
        dense
        v-model="form.role"
        :options="roles"
        label="Rol"
        :rules="[(val) => !!val || 'Requerido']"
        emit-value
        map-options
      />
    </div>
    <div class="col-xs-12 q-pa-sm">
      <q-input
        outlined
        dense
        v-if="!isEdit"
        v-model="form.password"
        label="Contraseña"
        :type="isPasswordVisible ? 'text' : 'password'"
        :rules="[(val) => !!val || 'Requerido']"
      >
        <template v-slot:append>
          <q-icon
            :name="isPasswordVisible ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPasswordVisible = !isPasswordVisible"
          />
        </template>
      </q-input>
    </div>

    <div class="col-xs-12 q-pa-sm row justify-between">
      <q-btn no-caps label="Cancelar" color="warning" @click="goBack" />
      <q-btn
        no-caps
        :loading="isLoading"
        :label="isEdit ? 'Actualizar usuario' : 'Crear usuario'"
        color="positive"
        type="submit"
      />
    </div>
  </q-form>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, defineEmits } from 'vue';
import { useRoute } from 'vue-router';
import { useQuasar } from 'quasar';
import { controlError } from '../../helpers/';
import { authRequest, usersRequest } from '../../request';

// Opciones de roles (ajusta según tu modelo/backend)
const roles = [
  { label: 'Administrador', value: 'admin' },
  { label: 'Manager', value: 'manager' },
  { label: 'Developer', value: 'developer' },
];

const emit = defineEmits(['onCancel', 'onSuccess']);

// Router y Quasar
const $q = useQuasar();
const route = useRoute();

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
const isPasswordVisible = ref(false);

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
        avatar: `https://avatar.iran.liara.run/username?username=${form.value.name}&bold=false&length=1`,
      });

      $q.notify({ type: 'positive', message: 'Usuario creado.' });
    }

    emit('onSuccess');
  } catch (e) {
    controlError(e);
  } finally {
    isLoading.value = false;
  }
};

const goBack = () => {
  emit('onCancel');
};
</script>
