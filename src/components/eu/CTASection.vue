<template>
  <section class="cta-shell">
    <p class="kicker">{{ kicker }}</p>
    <h2>{{ title }}</h2>
    <p class="desc">{{ text }}</p>
    <div class="actions">
      <RouterLink class="cta-btn primary" :to="primaryTo">{{ primaryLabel }}</RouterLink>
      <RouterLink class="cta-btn secondary" :to="secondaryTo">{{ secondaryLabel }}</RouterLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'

defineProps<{
  kicker: string
  title: string
  text: string
  primaryLabel: string
  primaryTo: string
  secondaryLabel: string
  secondaryTo: string
}>()
</script>

<style scoped>
.cta-shell {
  border-radius: 24px;
  border: 1px solid rgba(188, 212, 250, 0.3);
  padding: clamp(1.2rem, 2.2vw, 2rem);
  background:
    radial-gradient(circle at 14% 18%, rgba(123, 159, 238, 0.24), rgba(123, 159, 238, 0) 42%),
    linear-gradient(170deg, rgba(18, 35, 63, 0.92), rgba(12, 24, 46, 0.94));
  box-shadow:
    0 22px 42px rgba(4, 10, 22, 0.38),
    0 0 26px rgba(94, 132, 220, 0.16);
  display: grid;
  gap: 0.74rem;
}

.kicker {
  margin: 0;
  font-size: 0.74rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(178, 202, 246, 0.88);
  font-weight: 640;
}

h2 {
  margin: 0;
  color: #f6faff;
  font-size: clamp(1.5rem, 3vw, 2.12rem);
  line-height: 1.08;
}

.desc {
  margin: 0;
  max-width: 62ch;
  color: rgba(205, 220, 245, 0.9);
  line-height: 1.66;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.68rem;
  margin-top: 0.24rem;
}

.cta-btn {
  min-height: 44px;
  border-radius: 12px;
  padding: 0 1rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  border: 1px solid transparent;
  font-size: 0.88rem;
  font-weight: 620;
  transition:
    transform 220ms cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 220ms cubic-bezier(0.22, 1, 0.36, 1),
    border-color 220ms cubic-bezier(0.22, 1, 0.36, 1);
}

.primary {
  color: #0b1830;
  background: linear-gradient(130deg, #f8fbff 0%, #deebff 50%, #bfd5ff 100%);
  border-color: rgba(224, 236, 255, 0.76);
  box-shadow:
    0 12px 26px rgba(111, 149, 231, 0.3),
    0 0 18px rgba(101, 142, 234, 0.2);
}

.secondary {
  color: #ecf3ff;
  background: rgba(149, 174, 221, 0.12);
  border-color: rgba(179, 203, 248, 0.34);
}

.cta-btn:hover,
.cta-btn:focus-visible {
  transform: translateY(-2px);
  box-shadow:
    0 14px 30px rgba(87, 127, 218, 0.34),
    0 0 20px rgba(102, 143, 234, 0.24);
}

@media (max-width: 760px) {
  .actions {
    flex-direction: column;
  }

  .cta-btn {
    width: 100%;
  }
}
</style>
