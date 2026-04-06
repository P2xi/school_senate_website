<template>
  <article class="metric-card">
    <div class="icon" aria-hidden="true">{{ icon }}</div>
    <div class="copy">
      <strong>{{ value }}</strong>
      <p>{{ label }}</p>
      <small>{{ description }}</small>
    </div>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  icon: string
  value: string
  label: string
  description: string
}>()
</script>

<style scoped>
.metric-card {
  position: relative;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.8rem;
  align-items: start;
  border-radius: 18px;
  padding: 1rem;
  border: 1px solid rgba(174, 198, 240, 0.2);
  background:
    radial-gradient(circle at 10% 10%, rgba(122, 158, 236, 0.18), rgba(122, 158, 236, 0) 48%),
    linear-gradient(155deg, rgba(16, 28, 50, 0.9), rgba(10, 20, 39, 0.88));
  backdrop-filter: blur(10px);
  box-shadow:
    0 14px 30px rgba(4, 10, 22, 0.28),
    inset 0 1px 0 rgba(214, 227, 255, 0.08);
  transition:
    transform 240ms cubic-bezier(0.22, 1, 0.36, 1),
    border-color 240ms cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 240ms cubic-bezier(0.22, 1, 0.36, 1);
}

.metric-card:hover {
  transform: translateY(-3px);
  border-color: rgba(194, 214, 251, 0.46);
  box-shadow:
    0 18px 34px rgba(5, 12, 28, 0.36),
    0 0 22px rgba(101, 140, 225, 0.22);
}

.icon {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  border: 1px solid rgba(180, 205, 249, 0.26);
  background: rgba(174, 198, 239, 0.1);
  color: #cfdfff;
  font-size: 0.92rem;
}

.copy {
  display: grid;
  gap: 0.24rem;
}

.copy strong {
  margin: 0;
  color: #f6faff;
  font-size: clamp(1.4rem, 2.1vw, 1.8rem);
  line-height: 1;
}

.copy p {
  margin: 0;
  color: rgba(228, 236, 252, 0.94);
  font-size: 0.88rem;
  font-weight: 620;
}

.copy small {
  color: rgba(190, 206, 235, 0.86);
  line-height: 1.5;
  font-size: 0.78rem;
}
</style>
