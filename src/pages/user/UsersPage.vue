<template>
  <q-page padding>
    <!-- Filtros -->
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-md-3">
        <q-input v-model="filters.name" label="Nombre" dense outlined />
      </div>
      <div class="col-12 col-md-3">
        <q-input v-model="filters.email" label="Email" dense outlined />
      </div>
      <div class="col-12 col-md-3">
        <q-select
          v-model="filters.role"
          :options="['admin', 'manager', 'developer']"
          label="Rol"
          dense
          outlined
        />
      </div>
      <div class="col-12 col-md-3">
        <q-select
          v-model="filters.isActive"
          :options="[true, false]"
          label="Estado"
          dense
          outlined
        />
      </div>
    </div>

    <!-- Botones de acción -->
    <div class="row q-mb-md">
      <q-btn color="primary" label="Filtrar" @click="fetchUsers" class="q-mr-sm" />
      <q-btn color="secondary" label="Limpiar filtros" @click="clearFilters" />
    </div>

    <!-- Tabla -->
    <q-table
      :rows="users"
      :columns="columns"
      :loading="loading"
      row-key="id"
      :pagination="pagination"
      @request="onRequest"
      :rows-per-page-options="[10, 20, 50]"
    >
      <template v-slot:body-cell-actions="props">
        <q-td>
          <q-btn flat round color="primary" icon="edit" size="sm" @click="editUser(props.row)" />
          <q-btn
            flat
            round
            color="negative"
            icon="delete"
            size="sm"
            @click="deleteUser(props.row)"
          />
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { ref, onMounted } from 'vue';
import { usersRequest } from '../../request';
import { controlError } from '../../helpers';
import type { User } from '../../models/user.models';

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
    name: 'email',
    label: 'Email',
    field: 'email',
    align: 'left' as const,
    sortable: true,
  },
  {
    name: 'role',
    label: 'Rol',
    field: 'role',
    align: 'left' as const,
    sortable: true,
  },
  {
    name: 'isActive',
    label: 'Estado',
    field: 'isActive',
    align: 'center' as const,
    sortable: true,
  },
  {
    name: 'actions',
    label: 'Acciones',
    field: 'actions',
    align: 'center' as const,
  },
];

// Estado
const users = ref<User[]>([]);
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
  email: '' as string | null,
  role: '' as string | null,
  isActive: null as boolean | null,
});

// Métodos
async function fetchUsers() {
  try {
    loading.value = true;
    const filterObj: { name?: string; email?: string; role?: string; isActive?: boolean } = {};
    if (filters.value.name) filterObj.name = filters.value.name;
    if (filters.value.email) filterObj.email = filters.value.email;
    if (filters.value.role) filterObj.role = filters.value.role;
    if (filters.value.isActive !== null) filterObj.isActive = filters.value.isActive;

    const sort = pagination.value.descending ? 'DESC' : 'ASC';

    const response = await usersRequest.getAllUsers({
      page: pagination.value.page,
      limit: pagination.value.rowsPerPage,
      sortOrder: sort,
      filters: filterObj,
    });

    console.log(response);
    users.value = response.data;
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
    email: '',
    role: '',
    isActive: false,
  };
  await fetchUsers();
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
  await fetchUsers();
}

const $q = useQuasar();

async function editUser(user: User) {
  try {
    const result = await usersRequest.updateUser(user.id!, user);
    console.log('Usuario editado:', result);
  } catch (error) {
    console.error('Error al editar usuario:', error);
    $q.notify({
      type: 'negative',
      message: 'Error al editar el usuario',
    });
    controlError(error);
  }
}

async function deleteUser(user: User) {
  try {
    const success = await usersRequest.deleteUser(user.id!);
    if (success) {
      await fetchUsers();
      $q.notify({
        type: 'positive',
        message: 'Usuario eliminado exitosamente',
      });
    } else {
      $q.notify({
        type: 'negative',
        message: 'Error al eliminar el usuario',
      });
    }
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    $q.notify({
      type: 'negative',
      message: 'Error al eliminar el usuario',
    });
  }
}

// Inicializar
onMounted(async () => {
  await fetchUsers();
});
</script>
