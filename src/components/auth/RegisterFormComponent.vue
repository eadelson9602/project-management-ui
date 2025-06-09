<template>
  <q-form @submit.prevent="handleRegister" class="q-gutter-sm">
    <div class="col-xs-12">
      <q-input
        v-model="form.name"
        label="Nombre completo"
        :rules="[
          (val) => !!val || 'Campo requerido',
          (val) => val.length >= 2 || 'Mínimo 2 caracteres',
        ]"
        outlined
        dense
      />
    </div>

    <div class="col-xs-12">
      <q-input
        v-model="form.email"
        label="Correo electrónico"
        type="email"
        :rules="[
          (val) => !!val || 'Campo requerido',
          (val) => /.+@.+.+/.test(val) || 'Email no válido',
        ]"
        outlined
        dense
      />
    </div>

    <div class="col-xs-12">
      <q-input
        v-model="form.password"
        label="Contraseña"
        :type="isPasswordVisible ? 'text' : 'password'"
        :rules="[
          (val) => !!val || 'Campo requerido',
          (val) => val.length >= 6 || 'Mínimo 6 caracteres',
        ]"
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

    <div class="col-xs-12">
      <q-input
        v-model="passwordConfirmation"
        label="Confirmar contraseña"
        :type="isPasswordVisible ? 'text' : 'password'"
        :rules="[
          (val) => !!val || 'Campo requerido',
          (val) => val === form.password || 'Las contraseñas no coinciden',
        ]"
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

    <div class="col-xs-12">
      <q-select
        v-model="form.role"
        :options="['admin', 'manager', 'developer']"
        disable
        label="Rol"
        :rules="[(val) => !!val || 'Campo requerido']"
        outlined
        dense
      />
    </div>

    <div class="col-xs-12 flex justify-between items-center">
      <q-checkbox v-model="termsAccepted" label="Acepto los términos y condiciones" />
    </div>

    <div class="col-xs-12">
      <q-btn
        type="submit"
        color="primary"
        label="Crear cuenta"
        class="full-width"
        :loading="loading"
        :disable="!termsAccepted"
      />
    </div>
  </q-form>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { LocalStorage } from 'quasar';
import { encryptedAES, controlError } from '../../helpers';
import { authRequest } from '../../request';
import { useQuasar } from 'quasar';
import type { User } from '../../models/user.models';

const router = useRouter();
const $q = useQuasar();

const loading = ref(false);
const isPasswordVisible = ref(false);
const termsAccepted = ref(false);

const form = ref<User>({
  name: '',
  email: '',
  password: '',
  role: 'developer',
});
const passwordConfirmation = ref('');

const handleRegister = async () => {
  try {
    loading.value = true;

    const data = await authRequest.register(form.value);

    LocalStorage.set('dataUsuario', encryptedAES(JSON.stringify(data)));

    await router.push('login');

    $q.notify({
      message: 'Registro exitoso',
      type: 'positive',
      position: 'bottom-right',
    });
  } catch (error) {
    controlError(error);
  } finally {
    loading.value = false;
  }
};
</script>
<style lang=""></style>
