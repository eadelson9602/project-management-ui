<template>
  <q-page class="row justify-center q-pa-md">
    <q-card class="q-pa-md shadow-10" style="width: 100%; max-width: 400px">
      <q-card-section class="flex flex-center">
        <q-avatar size="100px">
          <img src="/img/logo.png" alt="Logo" />
        </q-avatar>
      </q-card-section>

      <q-card-section>
        <div class="text-center q-mb-xl">
          <div class="text-h5 q-mb-sm">Crear cuenta</div>
          <div class="text-subtitle2">Regístrate para comenzar</div>
        </div>

        <register-form-component />
      </q-card-section>

      <q-card-section class="text-center">
        <div class="text-caption">
          ¿Ya tienes cuenta?
          <q-btn flat color="primary" label="Iniciar sesión" @click="goToLogin" class="q-ml-sm" />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { RegisterFormComponent } from '../../components/';
import { useRouter } from 'vue-router';

const router = useRouter();

const goToLogin = async () => {
  await router.push({ name: 'login' });
};
</script>
