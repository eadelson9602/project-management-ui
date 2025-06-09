<template>
  <q-list>
    <!-- Logo -->
    <q-item class="q-pa-md">
      <q-item-section avatar>
        <q-icon name="apps" size="lg" />
      </q-item-section>
      <q-item-section>
        <q-item-label class="text-h6">Project Manager</q-item-label>
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

      <q-item v-else clickable :to="module.path" exact>
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
import { sidebarConfig } from 'src/config/sidebar.config';

// Get user role (you'll need to implement this based on your auth system)
// const getUserRole = () => {
//   // Implement your role checking logic here
//   return 'developer'; // Example
// };

// const userRole = getUserRole();

// Filter modules based on user role
const visibleModules = computed(() => sidebarConfig.modules);
</script>
