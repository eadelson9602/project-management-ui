<template>
  <q-page class="q-pa-lg">
    <!-- Header y Bienvenida -->
    <div class="row q-mb-md">
      <div class="col-12">
        <div class="text-h4 q-mb-sm">Dashboard</div>
        <div class="text-subtitle2">Bienvenido a tu panel de control</div>
      </div>
    </div>

    <!-- Estadísticas principales -->
    <div class="row q-col-gutter-md q-mb-md">
      <!-- Proyectos -->
      <q-card class="col-12 col-md-3">
        <q-card-section>
          <div class="text-h6 text-primary">Proyectos</div>
          <div class="text-h2 q-mt-sm">15</div>
          <div class="text-caption text-positive">+20% desde el mes pasado</div>
        </q-card-section>
      </q-card>

      <!-- Tareas -->
      <q-card class="col-12 col-md-3">
        <q-card-section>
          <div class="text-h6 text-teal">Tareas</div>
          <div class="text-h2 q-mt-sm">45</div>
          <div class="text-caption text-negative">-5% desde el mes pasado</div>
        </q-card-section>
      </q-card>

      <!-- Usuarios -->
      <q-card class="col-12 col-md-3">
        <q-card-section>
          <div class="text-h6 text-purple">Usuarios</div>
          <div class="text-h2 q-mt-sm">25</div>
          <div class="text-caption text-positive">+15% desde el mes pasado</div>
        </q-card-section>
      </q-card>

      <!-- Tiempo -->
      <q-card class="col-12 col-md-3">
        <q-card-section>
          <div class="text-h6 text-orange">Horas Trabajadas</div>
          <div class="text-h2 q-mt-sm">120</div>
          <div class="text-caption text-positive">+10% desde el mes pasado</div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Gráficos -->
    <div class="row q-col-gutter-md q-mb-md">
      <!-- Gráfico de Proyectos -->
      <q-card class="col-12 col-md-6">
        <q-card-section>
          <div class="text-h6">Progreso de Proyectos</div>
          <div class="q-mt-md">
            <q-linear-progress :value="0.75" color="primary" class="q-mb-sm" />
            <div class="text-caption">75% completado</div>
          </div>
          <div class="q-mt-md">
            <q-linear-progress :value="0.5" color="teal" class="q-mb-sm" />
            <div class="text-caption">50% completado</div>
          </div>
          <div class="q-mt-md">
            <q-linear-progress :value="0.3" color="purple" class="q-mb-sm" />
            <div class="text-caption">30% completado</div>
          </div>
        </q-card-section>
      </q-card>

      <!-- Gráfico de Tareas -->
      <q-card class="col-12 col-md-6">
        <q-card-section>
          <div class="text-h6">Estado de Tareas</div>
          <div class="q-mt-md">
            <q-linear-progress :value="0.6" color="green" class="q-mb-sm" />
            <div class="text-caption">60% completadas</div>
          </div>
          <div class="q-mt-md">
            <q-linear-progress :value="0.3" color="orange" class="q-mb-sm" />
            <div class="text-caption">30% en progreso</div>
          </div>
          <div class="q-mt-md">
            <q-linear-progress :value="0.1" color="red" class="q-mb-sm" />
            <div class="text-caption">10% pendientes</div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Últimas Actividades -->
    <div class="row q-col-gutter-md">
      <q-card class="col-12 col-md-6">
        <q-card-section>
          <div class="text-h6">Últimas Actividades</div>
          <q-list separator>
            <q-item>
              <q-item-section avatar>
                <q-icon name="assignment" color="primary" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Proyecto A iniciado</q-item-label>
                <q-item-label caption>Hace 2 horas</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section avatar>
                <q-icon name="check_circle" color="green" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Tarea completada</q-item-label>
                <q-item-label caption>Hace 5 horas</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section avatar>
                <q-icon name="person_add" color="purple" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Nuevo usuario registrado</q-item-label>
                <q-item-label caption>Hace 1 día</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>

      <!-- Proyectos Recientes -->
      <q-card class="col-12 col-md-6">
        <q-card-section>
          <div class="text-h6">Proyectos Recientes</div>
          <q-list separator>
            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="folder" color="primary" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Proyecto A</q-item-label>
                <q-item-label caption>Estado: En progreso</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-badge color="primary">75%</q-badge>
              </q-item-section>
            </q-item>
            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="folder" color="teal" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Proyecto B</q-item-label>
                <q-item-label caption>Estado: Pendiente</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-badge color="teal">30%</q-badge>
              </q-item-section>
            </q-item>
            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="folder" color="purple" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Proyecto C</q-item-label>
                <q-item-label caption>Estado: Completado</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-badge color="purple">100%</q-badge>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
// No necesitamos imports adicionales ya que estamos usando componentes de Quasar
</script>
