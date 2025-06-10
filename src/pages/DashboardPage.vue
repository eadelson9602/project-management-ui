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
    <div class="row">
      <!-- Proyectos -->
      <div class="col-12 col-md-3 q-pa-sm" v-for="card in cards" :key="card.title">
        <CardDashboardComponent
          :title="card.title"
          :value="card.value"
          :subtitle="card.subtitle"
          :colorTitle="card.colorTitle"
          :colorSubtitle="card.colorSubtitle"
          :colorValue="card.colorValue"
        />
      </div>
    </div>

    <!-- Gráficos -->
    <div class="row">
      <!-- Gráfico de Proyectos -->
      <div class="col-12 col-md-6 q-pa-sm">
        <q-card>
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
      </div>

      <!-- Gráfico de Tareas -->
      <div class="col-12 col-md-6 q-pa-sm">
        <q-card>
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
    </div>

    <div class="row">
      <!-- Últimas Actividades -->
      <div class="col-12 col-md-6 q-pa-sm">
        <q-card>
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
      </div>
      <!-- Proyectos Recientes -->
      <div class="col-12 col-md-6 q-pa-sm">
        <q-card>
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
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { CardDashboardComponent } from '../components';

const cards = [
  {
    title: 'Proyectos',
    value: 15,
    subtitle: '+20% desde el mes pasado',
    colorTitle: 'primary',
    colorSubtitle: 'positive',
    colorValue: 'primary',
  },
  {
    title: 'Tareas',
    value: 45,
    subtitle: '-5% desde el mes pasado',
    colorTitle: 'teal',
    colorSubtitle: 'negative',
    colorValue: 'teal',
  },
  {
    title: 'Usuarios',
    value: 25,
    subtitle: '+15% desde el mes pasado',
    colorTitle: 'purple',
    colorSubtitle: 'positive',
    colorValue: 'purple',
  },
  {
    title: 'Horas Trabajadas',
    value: 120,
    subtitle: '+10% desde el mes pasado',
    colorTitle: 'orange',
    colorSubtitle: 'positive',
    colorValue: 'orange',
  },
];
</script>
