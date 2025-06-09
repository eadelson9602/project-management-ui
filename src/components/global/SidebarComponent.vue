<template>
  <q-list>
    <!-- Logo -->
    <q-item class="q-pa-md">
      <q-item-section avatar>
        <q-avatar>
          <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
        </q-avatar>
      </q-item-section>
      <q-item-section>
        <q-item-label class="text-body1">{{ user?.name }}</q-item-label>
      </q-item-section>
    </q-item>

    <!-- Modules -->
    <q-item-label header>Modulos</q-item-label>

    <template v-for="module in visibleModules" :key="module.name">
      <q-expansion-item
        v-if="module.isExpanded"
        :label="module.name"
        :icon="module.icon"
        expand-icon-class="text-primary"
      >
        <q-list>
          <q-item
            v-for="child in module.children"
            :key="child.name"
            clickable
            :to="child.path"
            exact
            class="bg-grey-3 q-pl-xl"
          >
            <q-item-section>
              <q-item-label>{{ child.name }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-expansion-item>

      <q-item v-else clickable :to="module.path" exact :disable="!isModuleAccessible(module)">
        <q-item-section avatar>
          <q-icon :name="module.icon" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ module.name }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
  </q-list>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '../../stores/auth';
import { sidebarConfig } from '../../config/sidebar.config';

// Tipos para los módulos
interface Module {
  name: string;
  path: string;
  icon?: string;
  isExpanded?: boolean;
  roles?: string[];
  children?: Module[] | undefined;
}

const authStore = useAuthStore();

const user = computed(() => authStore.user);

// Type guard to ensure authStore is properly initialized
const hasAuthStore = (store: unknown): store is ReturnType<typeof useAuthStore> => {
  return (
    store !== undefined && typeof (store as ReturnType<typeof useAuthStore>).hasRole === 'function'
  );
};

// Filtrar módulos basado en los permisos del usuario
const filteredModules = computed(() => {
  if (!hasAuthStore(authStore)) {
    return [];
  }
  return (sidebarConfig.modules || []).filter((module: Module) => {
    // Si el módulo no tiene roles, siempre se muestra
    if (!module.roles) return true;

    // Verificar si el usuario tiene al menos uno de los roles necesarios
    return module.roles.some((role: string) => authStore.hasRole(role));
  });
});

// Helper para verificar si el usuario tiene acceso a un submódulo basado en roles
function hasChildAccess(child: Module): boolean {
  if (!child.roles) return true;
  return child.roles.some((role: string) => authStore.hasRole(role));
}

// Filtrar submódulos basado en roles
function filterChildren(children: Module[]): Module[] {
  return children.filter((child) => hasChildAccess(child));
}

// Expose the filtered modules to the template
const visibleModules = computed(() => {
  if (!hasAuthStore(authStore)) {
    return [];
  }
  return filteredModules.value.map((module: Module) => ({
    ...module,
    children: module.children ? filterChildren(module.children) : undefined,
  }));
});

// Helper para verificar acceso a un módulo basado en roles
function isModuleAccessible(module: Module): boolean {
  // Si el módulo no tiene roles, siempre se muestra
  if (!module.roles) return true;

  // Verificar si el usuario tiene al menos uno de los roles necesarios
  return module.roles.some((role: string) => authStore.hasRole(role));
}
</script>
