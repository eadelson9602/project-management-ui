<template>
  <q-form @submit.prevent="handleLogin" class="q-gutter-md">
    <div class="col-xs-12">
      <q-input
        v-model="form.email"
        label="Correo electrónico"
        type="email"
        :rules="[(val) => !!val || 'Campo requerido']"
        outlined
        dense
      />
    </div>

    <div class="col-xs-12">
      <q-input
        v-model="form.password"
        label="Contraseña"
        :type="isPasswordVisible ? 'text' : 'password'"
        :rules="[(val) => !!val || 'Campo requerido']"
        outlined
        dense
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

    <div class="col-xs-12flex justify-between items-center">
      <q-checkbox v-model="rememberMe" label="Recordarme" />
      <q-btn flat color="primary" label="¿Olvidaste tu contraseña?" class="text-caption" />
    </div>

    <div class="col-xs-12">
      <q-btn
        type="submit"
        color="primary"
        label="Iniciar sesión"
        class="full-width"
        :loading="loading"
      />
    </div>
  </q-form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { controlError } from '../../helpers/controlError';
import { authRequest } from 'src/request';

const $q = useQuasar();
const router = useRouter();

const loading = ref(false);
const isPasswordVisible = ref(false);
const rememberMe = ref(false);

const form = ref({
  email: '',
  password: '',
});

const handleLogin = async () => {
  loading.value = true;
  try {
    const data = await authRequest.login(form.value);

    $q.notify({
      type: 'positive',
      message: 'Inicio de sesión exitoso',
    });

    await router.push({ name: 'home' });

    $q.notify({
      type: 'positive',
      message: `Bienvenido, ${data.name}`,
    });
  } catch (error) {
    controlError(error);
  } finally {
    loading.value = false;
  }
};
</script>
