<template>
  <q-card>
    <q-card-section>
      <div class="text-h6" :style="{ color: colorTitle }">{{ title }}</div>
      <div class="text-h2 q-mt-sm" :style="{ color: colorValue }">{{ value }}</div>
      <div class="text-caption text-positive" :style="{ color: colorSubtitle }">{{ subtitle }}</div>
    </q-card-section>
  </q-card>
</template>
<script lang="ts" setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  subtitle: {
    type: String,
    required: true,
  },
  colorTitle: {
    type: String,
    required: true,
  },
  colorSubtitle: {
    type: String,
    required: true,
  },
  colorValue: {
    type: String,
    required: true,
  },
});
</script>
<style lang=""></style>
