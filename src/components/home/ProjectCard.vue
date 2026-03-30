<template>
  <article class="project-card" :class="{ featured }">
    <header class="project-head">
      <h3>{{ title }}</h3>
      <span class="status-badge" :class="badgeClass">{{ status }}</span>
    </header>

    <p class="project-summary">{{ summary }}</p>

    <footer class="project-footer">
      <RouterLink class="project-action" :to="actionTo">{{ actionLabel }}</RouterLink>
    </footer>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type ProjectStatus = 'Yakında' | 'Devam Ediyor' | 'Tamamlandı' | 'Planlanıyor'

const props = defineProps<{
  title: string
  summary: string
  status: ProjectStatus
  actionLabel: string
  actionTo: string
  featured?: boolean
}>()

const badgeClass = computed(() => {
  if (props.status === 'Yakında') return 'soon'
  if (props.status === 'Devam Ediyor') return 'ongoing'
  if (props.status === 'Planlanıyor') return 'planned'
  return 'completed'
})
</script>

<style scoped>
.project-card {
  height: 100%;
  padding: 1.24rem;
  border-radius: 18px;
  border: 1px solid var(--border-soft);
  background: linear-gradient(180deg, rgba(21, 37, 62, 0.86), rgba(17, 31, 54, 0.86));
  display: grid;
  gap: 0.9rem;
  position: relative;
  overflow: hidden;
  transition:
    transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.3s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

.project-card::before {
  content: '';
  position: absolute;
  width: 180px;
  height: 180px;
  left: -60px;
  top: -70px;
  border-radius: 50%;
  pointer-events: none;
  background: radial-gradient(circle, rgba(140, 175, 248, 0.24), rgba(140, 175, 248, 0));
  filter: blur(24px);
  opacity: 0.55;
  transition: opacity 0.3s cubic-bezier(0.22, 1, 0.36, 1), transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

.project-card::after {
  content: '';
  position: absolute;
  inset: -42% auto -42% -120%;
  width: 34%;
  background: linear-gradient(90deg, transparent, rgba(224, 236, 255, 0.14), transparent);
  transform: skewX(-16deg);
  opacity: 0;
  transition: transform 360ms cubic-bezier(0.22, 1, 0.36, 1), opacity 300ms ease;
}

.project-card:hover {
  transform: translateY(-8px) scale(1.015);
  border-color: rgba(190, 205, 232, 0.48);
  box-shadow:
    0 20px 36px rgba(2, 8, 20, 0.3),
    0 0 30px rgba(74, 116, 214, 0.26);
}

.project-card.featured {
  border-color: rgba(200, 217, 247, 0.52);
  box-shadow:
    0 16px 30px rgba(2, 8, 20, 0.28),
    0 0 26px rgba(78, 120, 218, 0.24);
}

.project-card:hover::before {
  opacity: 0.9;
  transform: translate3d(10px, 8px, 0) scale(1.08);
}

.project-card:hover::after {
  opacity: 1;
  transform: translateX(300%) skewX(-16deg);
}

.project-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.9rem;
}

.project-head h3 {
  margin: 0;
  font-size: 1.03rem;
  line-height: 1.4;
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

.project-card.featured .project-head h3 {
  font-weight: 680;
}

.project-summary {
  margin: 0;
  color: rgba(190, 205, 231, 0.9);
  line-height: 1.66;
  font-size: 0.9rem;
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

.project-footer {
  margin-top: auto;
  display: flex;
  align-items: center;
}

.project-action {
  color: #eaf2ff;
  text-decoration: none;
  font-size: 0.86rem;
  font-weight: 620;
  letter-spacing: 0.01em;
  display: inline-flex;
  align-items: center;
  min-height: 30px;
  transition:
    color 0.24s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.24s cubic-bezier(0.22, 1, 0.36, 1),
    text-shadow 0.24s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.24s cubic-bezier(0.22, 1, 0.36, 1);
}

.project-card:hover .project-head h3,
.project-card:hover .project-summary {
  transform: translateY(-2px);
}

.project-card:hover .project-action {
  transform: translateY(-1px);
}

.project-action:hover,
.project-action:focus-visible {
  color: #ffffff;
  text-shadow: 0 0 10px rgba(136, 173, 245, 0.36);
  box-shadow: 0 0 14px rgba(103, 140, 220, 0.18);
}

.project-action:active {
  transform: scale(0.985);
  animation: projectActionGlowPulse 220ms cubic-bezier(0.22, 1, 0.36, 1);
}

.status-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 24px;
  padding: 0 0.6rem;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 580;
  line-height: 1;
  align-self: flex-start;
  white-space: nowrap;
  border: 1px solid transparent;
  transition:
    box-shadow 0.24s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.24s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.24s cubic-bezier(0.22, 1, 0.36, 1);
}

.status-badge.ongoing {
  background: rgba(121, 166, 124, 0.17);
  color: #b9dfbb;
  border-color: rgba(121, 166, 124, 0.28);
}

.status-badge.soon {
  background: rgba(180, 163, 122, 0.16);
  color: #f1e0b9;
  border-color: rgba(210, 190, 140, 0.45);
  box-shadow: inset 0 0 8px rgba(214, 192, 140, 0.14);
}

.status-badge.planned {
  background: rgba(146, 166, 200, 0.18);
  color: #c4d6fb;
  border-color: rgba(170, 193, 236, 0.5);
  box-shadow: inset 0 0 8px rgba(155, 183, 236, 0.16);
}

.project-card:hover .status-badge {
  transform: translateY(-1px);
  box-shadow:
    inset 0 0 10px rgba(210, 224, 255, 0.22),
    0 0 14px rgba(113, 148, 230, 0.2);
}

.status-badge.completed {
  background: rgba(170, 154, 124, 0.16);
  color: #f0deba;
  border-color: rgba(170, 154, 124, 0.3);
}

@keyframes projectActionGlowPulse {
  0% { box-shadow: 0 0 0 rgba(103, 140, 220, 0); }
  50% { box-shadow: 0 0 16px rgba(103, 140, 220, 0.32); }
  100% { box-shadow: 0 0 0 rgba(103, 140, 220, 0); }
}

@media (prefers-reduced-motion: reduce) {
  .project-card {
    transition: none;
  }

  .project-card:hover {
    transform: none;
  }
}
</style>
