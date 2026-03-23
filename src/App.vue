<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterView } from 'vue-router'
import LoadingEffect from '@/components/LoadingEffect.vue'

const loading = ref(true)

onMounted(() => {
  setTimeout(() => {
    loading.value = false
  }, 1200)
})
</script>

<template>
  <LoadingEffect v-if="loading" />
  <RouterView v-else />
</template>

<style>
* {
  box-sizing: border-box;
}

html,
body,
#app {
  margin: 0;
  min-height: 100%;
}

body {
  font-family: 'Aptos', 'Segoe UI', 'Trebuchet MS', Arial, sans-serif;
  background: #070f1f;
  color: #edf2ff;
  text-rendering: geometricPrecision;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

a,
button {
  font: inherit;
}
</style>
