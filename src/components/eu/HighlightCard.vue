<template>
  <article class="impact-card">
    <span class="icon" aria-hidden="true">{{ icon }}</span>
    <h3>{{ title }}</h3>
    <p>{{ text }}</p>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  icon: string
  title: string
  text: string
}>()
</script>

<style scoped>
.impact-card {
  display: grid;
  gap: 0.58rem;
  border-radius: 18px;
  border: 1px solid rgba(176, 201, 247, 0.22);
  background:
    radial-gradient(circle at 12% 4%, rgba(130, 165, 239, 0.16), rgba(130, 165, 239, 0) 44%),
    linear-gradient(158deg, rgba(16, 29, 52, 0.88), rgba(10, 22, 42, 0.92));
  padding: 1rem;
  box-shadow: 0 14px 28px rgba(4, 10, 22, 0.26);
}

.icon {
  width: 32px;
  height: 32px;
  border-radius: 9px;
  border: 1px solid rgba(181, 206, 249, 0.3);
  display: grid;
  place-items: center;
  color: #d8e7ff;
  background: rgba(149, 174, 221, 0.14);
  font-size: 0.9rem;
}

h3 {
  margin: 0;
  color: #f2f8ff;
  font-size: 1.02rem;
}

p {
  margin: 0;
  color: rgba(198, 213, 238, 0.9);
  line-height: 1.64;
  font-size: 0.86rem;
}
</style>
