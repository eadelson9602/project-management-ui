<template>
  <q-page class="flex flex-center">
    <div class="text-center">
      <q-icon name="error_outline" size="64px" color="negative" />
      <h2 class="q-my-md text-h4">No Autorizado</h2>
      <p class="text-subtitle1 q-my-md">No tienes permisos para acceder a esta página.</p>
      <p class="text-body1">
        Si crees que deberías tener acceso a esta página, por favor contacta al administrador del
        sistema.
      </p>

      <q-btn color="primary" label="Volver al Dashboard" @click="goHome" class="q-mt-md" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const goHome = async () => {
  await router.push({ name: 'home' });
};
</script>

<style scoped>
.q-page {
  min-height: 80vh;
}
</style>
