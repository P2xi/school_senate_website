<template>
  <div ref="pageRef" class="projects-page">
    <div class="ambient-layer" aria-hidden="true">
      <span class="ambient-blob blob-a" />
      <span class="ambient-blob blob-b" />
      <span class="ambient-blob blob-c" />
    </div>

    <section class="page-hero page-section" data-scene>
      <p class="hero-tag reveal-item" data-reveal>Eski&#351;ehir MBA Senatosu</p>
      <h1 class="hero-title reveal-item" data-reveal style="--reveal-delay: 70ms">Projeler</h1>
      <p class="hero-subtitle reveal-item" data-reveal style="--reveal-delay: 140ms">
        Okul ya&#351;am&#305;na de&#287;er katan, planlanan ve aktif olarak y&#252;r&#252;t&#252;len senato projeleri.
      </p>

      <div class="hero-stats">
        <article
          v-for="(item, index) in headerStats"
          :key="item.label"
          class="stat-item reveal-item"
          data-reveal
          :style="{ '--reveal-delay': `${index * 90 + 170}ms` }"
        >
          <strong>{{ item.value }}</strong>
          <span>{{ item.label }}</span>
        </article>
      </div>
    </section>

    <section class="projects-grid" aria-label="Proje kartlar&#305;" data-scene>
      <article
        v-for="(project, index) in projectsContent"
        :key="project.title"
        class="project-card reveal-item"
        data-reveal
        :style="{ '--reveal-delay': `${index * 85 + 90}ms` }"
      >
        <header class="card-head">
          <span class="category-label">{{ project.category }}</span>
          <span class="status-badge" :class="getStatusClass(project.status)">{{ project.status }}</span>
        </header>
        <h2>{{ project.title }}</h2>
        <p>{{ project.projectsDescription }}</p>
        <RouterLink class="detail-button" :to="project.detailTo">Detaylar&#305; G&#246;r</RouterLink>
      </article>
    </section>

    <section class="cta-section page-section reveal-item" data-reveal data-scene>
      <h2>Yeni projelere katk&#305; sa&#287;lamak ister misin?</h2>
      <p>Senato &#231;al&#305;&#351;malar&#305;na dahil olmak veya &#246;neri sunmak i&#231;in bizimle ileti&#351;ime ge&#231;.</p>
      <RouterLink class="cta-button" to="/iletisim">&#304;leti&#351;ime Ge&#231;</RouterLink>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import {
  getProjectStatusCount,
  getProjectsPortfolioMetric,
  projectsContent,
  type ProjectStatus,
} from '@/data/projects'

const projectsPortfolioMetric = getProjectsPortfolioMetric()
const pageRef = ref<HTMLElement | null>(null)
let revealObserver: IntersectionObserver | null = null

const headerStats = computed(() => [
  { value: projectsPortfolioMetric.display, label: 'Toplam Proje' },
  { value: String(getProjectStatusCount('Yak\u0131nda')), label: 'Yak\u0131nda' },
  { value: String(getProjectStatusCount('Planlan\u0131yor')), label: 'Planlanan' },
])

const getStatusClass = (status: ProjectStatus): string => {
  if (status === 'Yak\u0131nda') return 'soon'
  if (status === 'Planlan\u0131yor') return 'planned'
  if (status === 'Devam Ediyor') return 'ongoing'
  return 'completed'
}

onMounted(async () => {
  const root = pageRef.value
  if (!root) return

  await nextTick()
  requestAnimationFrame(() => {
    root.classList.add('is-entered')
  })

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    root.querySelectorAll<HTMLElement>('[data-reveal]').forEach((node) => node.classList.add('is-revealed'))
    root.querySelectorAll<HTMLElement>('[data-scene]').forEach((node) => node.classList.add('is-scene-revealed'))
    return
  }

  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-revealed')
        if ((entry.target as HTMLElement).dataset.scene !== undefined) {
          entry.target.classList.add('is-scene-revealed')
        }
        revealObserver?.unobserve(entry.target)
      })
    },
    { threshold: 0.16, rootMargin: '0px 0px -7% 0px' },
  )

  root.querySelectorAll<HTMLElement>('[data-reveal]').forEach((node) => revealObserver?.observe(node))
  root.querySelectorAll<HTMLElement>('[data-scene]').forEach((node) => revealObserver?.observe(node))
})

onBeforeUnmount(() => {
  revealObserver?.disconnect()
})
</script>

<style scoped>
.projects-page {
  --motion-ease: cubic-bezier(0.22, 1, 0.36, 1);
  display: grid;
  gap: 1.72rem;
  position: relative;
  isolation: isolate;
}

.ambient-layer {
  position: absolute;
  inset: -8% -7% -8% -7%;
  pointer-events: none;
  z-index: 0;
}

.ambient-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(58px);
  opacity: 0.4;
  animation: ambientDrift 12s var(--motion-ease) infinite alternate;
}

.blob-a {
  width: min(420px, 36vw);
  height: min(320px, 28vw);
  left: -8%;
  top: 2%;
  background: radial-gradient(circle, rgba(78, 124, 228, 0.34), rgba(78, 124, 228, 0));
}

.blob-b {
  width: min(320px, 28vw);
  height: min(250px, 22vw);
  right: -8%;
  top: 32%;
  background: radial-gradient(circle, rgba(98, 116, 224, 0.28), rgba(98, 116, 224, 0));
  animation-duration: 15s;
}

.blob-c {
  width: min(360px, 30vw);
  height: min(280px, 24vw);
  left: 24%;
  bottom: 6%;
  background: radial-gradient(circle, rgba(63, 114, 220, 0.24), rgba(63, 114, 220, 0));
  animation-duration: 10s;
}

.projects-page > *:not(.ambient-layer) {
  position: relative;
  z-index: 2;
}

.reveal-item {
  opacity: 0;
  transform: translateY(26px) scale(0.985);
  transition:
    opacity 720ms cubic-bezier(0.16, 1, 0.3, 1),
    transform 720ms cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: var(--reveal-delay, 0ms);
}

.reveal-item.is-revealed {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.page-hero {
  display: grid;
  gap: 1rem;
  padding: clamp(1.35rem, 2vw, 1.95rem);
  position: relative;
  overflow: hidden;
  border-color: rgba(181, 203, 242, 0.26);
  box-shadow:
    0 20px 36px rgba(3, 9, 21, 0.3),
    0 0 26px rgba(84, 125, 224, 0.18);
  animation: surfaceBreatheActive 12s var(--motion-ease) infinite;
}

.page-hero::before {
  content: '';
  position: absolute;
  left: -8%;
  top: -24%;
  width: min(500px, 44vw);
  height: min(300px, 26vw);
  border-radius: 50%;
  background: radial-gradient(circle, rgba(126, 161, 244, 0.3), rgba(126, 161, 244, 0));
  filter: blur(34px);
  pointer-events: none;
  animation: haloBreathe 9s var(--motion-ease) infinite;
}

.hero-tag {
  margin: 0;
  color: var(--accent-strong);
  font-size: 0.78rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  font-weight: 650;
}

.hero-title {
  margin: 0;
  font-size: clamp(2.08rem, 4.9vw, 3.24rem);
  line-height: 1.06;
  letter-spacing: -0.016em;
  color: #f4f8ff;
  text-shadow: 0 2px 12px rgba(8, 16, 32, 0.42);
}

.hero-subtitle {
  margin: 0;
  max-width: 66ch;
  color: rgba(224, 236, 255, 0.94);
  line-height: 1.68;
  font-size: 0.99rem;
}

.hero-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.9rem;
  margin-top: 0.2rem;
  position: relative;
}

.hero-stats::before {
  content: '';
  position: absolute;
  left: 0;
  top: -12px;
  width: 148px;
  height: 2px;
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(157, 188, 245, 0.9), rgba(157, 188, 245, 0));
  box-shadow: 0 0 14px rgba(101, 140, 224, 0.42);
  animation: accentPulse 9.5s var(--motion-ease) infinite;
  opacity: 0;
  transform: scaleX(0.62);
  transform-origin: left center;
  transition: opacity 640ms ease, transform 640ms ease;
}

[data-scene].is-scene-revealed .hero-stats::before {
  opacity: 1;
  transform: scaleX(1);
}

.stat-item {
  border: 1px solid rgba(173, 197, 248, 0.28);
  border-radius: 18px;
  background: linear-gradient(178deg, rgba(22, 39, 70, 0.84), rgba(18, 33, 60, 0.76));
  min-height: 96px;
  padding: 0.98rem 1.02rem;
  display: grid;
  align-content: center;
  gap: 0.38rem;
  box-shadow:
    inset 0 1px 0 rgba(208, 224, 255, 0.07),
    0 8px 18px rgba(4, 10, 22, 0.14);
  position: relative;
  overflow: hidden;
  transition:
    transform 0.26s var(--motion-ease),
    box-shadow 0.26s var(--motion-ease),
    border-color 0.26s var(--motion-ease);
}

.stat-item:hover {
  transform: translateY(-6px) scale(1.02);
  border-color: rgba(191, 212, 250, 0.52);
  box-shadow:
    0 18px 30px rgba(4, 10, 22, 0.28),
    0 0 22px rgba(71, 111, 205, 0.28);
}

.stat-item::after {
  content: '';
  position: absolute;
  inset: -40% auto -40% -120%;
  width: 36%;
  background: linear-gradient(90deg, transparent, rgba(220, 236, 255, 0.2), transparent);
  transform: skewX(-16deg);
  opacity: 0;
  transition: transform 420ms var(--motion-ease), opacity 320ms ease;
}

.stat-item:hover::after {
  opacity: 1;
  transform: translateX(310%) skewX(-16deg);
}

.stat-item span {
  color: rgba(196, 209, 232, 0.84);
  font-size: 0.79rem;
  letter-spacing: 0.015em;
  line-height: 1.3;
}

.stat-item strong {
  font-size: 2.08rem;
  line-height: 1;
  letter-spacing: -0.02em;
  color: #f4f9ff;
  text-shadow: 0 1px 10px rgba(103, 140, 220, 0.26);
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.98rem;
  position: relative;
  padding-top: 0.2rem;
}

.projects-grid::before {
  content: '';
  position: absolute;
  left: 0;
  top: -14px;
  width: 146px;
  height: 2px;
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(157, 188, 245, 0.9), rgba(157, 188, 245, 0));
  box-shadow: 0 0 14px rgba(101, 140, 224, 0.44);
  animation: accentPulse 8.5s var(--motion-ease) infinite;
  opacity: 0;
  transform: scaleX(0.62);
  transform-origin: left center;
  transition: opacity 640ms ease, transform 640ms ease;
}

[data-scene].is-scene-revealed.projects-grid::before {
  opacity: 1;
  transform: scaleX(1);
}

.project-card {
  border: 1px solid var(--border-soft);
  border-radius: 18px;
  padding: 1.2rem;
  background: linear-gradient(175deg, rgba(28, 47, 80, 0.74), rgba(13, 26, 52, 0.86));
  display: grid;
  gap: 0.86rem;
  transition:
    transform 0.3s var(--motion-ease),
    border-color 0.3s var(--motion-ease),
    box-shadow 0.3s var(--motion-ease);
}

.project-card:hover {
  transform: translateY(-8px) scale(1.017);
  border-color: rgba(204, 221, 252, 0.68);
  box-shadow:
    0 24px 40px rgba(4, 10, 22, 0.34),
    0 0 30px rgba(73, 116, 216, 0.3);
}

.card-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.74rem;
}

.category-label,
.status-badge {
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  padding: 0 0.58rem;
  border-radius: 999px;
  font-size: 0.7rem;
  line-height: 1;
  font-weight: 580;
  white-space: nowrap;
}

.category-label {
  border: 1px solid rgba(173, 197, 248, 0.32);
  color: #d7e4ff;
  background: rgba(145, 165, 201, 0.13);
}

.status-badge {
  border: 1px solid rgba(180, 195, 220, 0.34);
  color: #d7e4ff;
  background: rgba(145, 165, 201, 0.22);
}

.status-badge.soon {
  background: rgba(180, 163, 122, 0.16);
  color: #f1e0b9;
  border-color: rgba(210, 190, 140, 0.45);
}

.status-badge.planned {
  background: rgba(146, 166, 200, 0.18);
  color: #c4d6fb;
  border-color: rgba(170, 193, 236, 0.5);
}

.status-badge.ongoing {
  background: rgba(121, 166, 124, 0.17);
  color: #b9dfbb;
  border-color: rgba(121, 166, 124, 0.28);
}

.status-badge.completed {
  background: rgba(170, 154, 124, 0.16);
  color: #f0deba;
  border-color: rgba(170, 154, 124, 0.3);
}

.project-card h2 {
  margin: 0;
  font-size: 1.04rem;
  line-height: 1.4;
  color: #f2f7ff;
  text-shadow: 0 1px 6px rgba(7, 14, 28, 0.34);
}

.project-card p {
  margin: 0;
  color: rgba(203, 218, 242, 0.92);
  line-height: 1.68;
  font-size: 0.92rem;
}

.detail-button {
  width: fit-content;
  margin-top: auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 38px;
  padding: 0 0.98rem;
  border-radius: 12px;
  border: 1px solid rgba(181, 201, 238, 0.36);
  color: #eef4ff;
  text-decoration: none;
  font-size: 0.84rem;
  font-weight: 620;
  letter-spacing: 0.01em;
  transition:
    background-color 0.24s var(--motion-ease),
    transform 0.24s var(--motion-ease),
    box-shadow 0.24s var(--motion-ease);
}

.detail-button:hover,
.detail-button:focus-visible {
  background: rgba(173, 197, 248, 0.15);
  transform: translateY(-1px) scale(1.015);
  box-shadow:
    0 14px 26px rgba(44, 74, 136, 0.28),
    0 0 18px rgba(99, 143, 238, 0.24);
}

.detail-button:active {
  transform: scale(0.985);
  animation: buttonGlowPulse 220ms var(--motion-ease);
}

.cta-section {
  display: grid;
  gap: 0.86rem;
  text-align: left;
  padding: clamp(1.35rem, 2.1vw, 2rem);
  background:
    radial-gradient(circle at 18% 16%, rgba(102, 143, 236, 0.28), transparent 44%),
    radial-gradient(circle at 84% 80%, rgba(90, 123, 220, 0.18), transparent 48%),
    linear-gradient(170deg, rgba(24, 44, 80, 0.94), rgba(16, 30, 58, 0.94));
  border-color: rgba(192, 212, 252, 0.32);
  box-shadow:
    0 20px 38px rgba(4, 10, 22, 0.28),
    0 0 28px rgba(82, 126, 224, 0.24);
  animation: surfaceBreatheActive 14s var(--motion-ease) infinite;
}

.cta-section h2 {
  margin: 0;
  font-size: clamp(1.36rem, 2.5vw, 1.84rem);
  line-height: 1.2;
  letter-spacing: -0.01em;
  color: #f5f9ff;
}

.cta-section p {
  margin: 0;
  color: rgba(208, 221, 244, 0.9);
  max-width: 58ch;
  line-height: 1.68;
}

.cta-button {
  width: fit-content;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0 1.08rem;
  border-radius: 12px;
  text-decoration: none;
  color: #0b1830;
  background: linear-gradient(132deg, #f7faff 0%, #dfe9ff 48%, #c1d4fb 100%);
  border: 1px solid rgba(229, 238, 255, 0.62);
  box-shadow:
    0 10px 24px rgba(119, 157, 235, 0.3),
    0 0 14px rgba(99, 143, 238, 0.14);
  font-weight: 620;
  font-size: 0.88rem;
  letter-spacing: 0.01em;
  transition:
    transform 0.26s var(--motion-ease),
    box-shadow 0.26s var(--motion-ease);
}

.cta-button:hover,
.cta-button:focus-visible {
  transform: translateY(-1px) scale(1.015);
  box-shadow:
    0 18px 32px rgba(90, 130, 222, 0.4),
    0 0 24px rgba(99, 143, 238, 0.3);
}

.cta-button:active {
  transform: scale(0.985);
  animation: buttonGlowPulse 220ms var(--motion-ease);
}

@keyframes ambientDrift {
  0% { transform: translate3d(0, 0, 0) scale(1); opacity: 0.3; }
  100% { transform: translate3d(12px, -8px, 0) scale(1.06); opacity: 0.42; }
}

@keyframes haloBreathe {
  0%, 100% { opacity: 0.58; transform: scale(1); }
  50% { opacity: 0.88; transform: scale(1.04); }
}

@keyframes accentPulse {
  0%, 100% { opacity: 0.76; transform: scaleX(1); }
  50% { opacity: 1; transform: scaleX(1.06); }
}

@keyframes buttonGlowPulse {
  0% { box-shadow: 0 0 0 rgba(99, 143, 238, 0); }
  50% { box-shadow: 0 0 16px rgba(99, 143, 238, 0.32); }
  100% { box-shadow: 0 0 0 rgba(99, 143, 238, 0); }
}

@keyframes surfaceBreatheActive {
  0%, 100% {
    box-shadow:
      0 20px 36px rgba(3, 9, 21, 0.28),
      0 0 24px rgba(84, 125, 224, 0.16);
  }
  50% {
    box-shadow:
      0 22px 40px rgba(3, 9, 21, 0.32),
      0 0 30px rgba(102, 145, 238, 0.24);
  }
}

@media (max-width: 980px) {
  .hero-stats,
  .projects-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 680px) {
  .hero-stats,
  .projects-grid {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .page-hero,
  .cta-section,
  .ambient-layer,
  .ambient-blob,
  .page-hero::before,
  .hero-stats::before,
  .projects-grid::before,
  .reveal-item,
  .stat-item,
  .project-card,
  .detail-button,
  .cta-button {
    animation: none !important;
    transition: none !important;
    transform: none !important;
    opacity: 1 !important;
  }
}
</style>




