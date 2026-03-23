<template>
  <header class="section-header">
    <p class="section-label">{{ label }}</p>
    <h2 class="section-title">{{ title }}</h2>
    <p v-if="description" class="section-description">{{ description }}</p>
  </header>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  title: string
  description?: string
}>()
</script>

<style scoped>
.section-header {
  display: grid;
  gap: 0.48rem;
  position: relative;
}

.section-header::before {
  content: '';
  width: 132px;
  height: 2px;
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(157, 188, 245, 0.9), rgba(157, 188, 245, 0));
  box-shadow: 0 0 12px rgba(101, 140, 224, 0.32);
  transform-origin: left center;
  animation: headingStreakPulse 11s cubic-bezier(0.22, 1, 0.36, 1) infinite;
}

.section-label {
  margin: 0;
  color: var(--accent-strong);
  font-size: 0.76rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-weight: 600;
}

.section-title {
  margin: 0;
  font-size: clamp(1.6rem, 2.8vw, 2.25rem);
  line-height: 1.12;
  letter-spacing: -0.015em;
}

.section-description {
  margin: 0.08rem 0 0;
  max-width: 62ch;
  color: rgba(196, 209, 232, 0.9);
  line-height: 1.68;
  font-size: 0.97rem;
}

@keyframes headingStreakPulse {
  0%, 100% { opacity: 0.72; transform: scaleX(1); }
  50% { opacity: 1; transform: scaleX(1.05); }
}
</style>
