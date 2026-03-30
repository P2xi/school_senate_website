<template>
  <div ref="pageRef" class="duyurular-page page-stack">
    <div class="ambient-layer" aria-hidden="true">
      <span class="ambient-blob blob-a" />
      <span class="ambient-blob blob-b" />
      <span class="ambient-blob blob-c" />
    </div>

    <section class="page-hero page-section" data-scene>
      <p class="hero-tag reveal-item" data-reveal>Eskişehir MBA Senatosu</p>
      <h1 class="hero-title reveal-item" data-reveal style="--reveal-delay: 70ms">Duyurular</h1>
      <p class="hero-subtitle reveal-item" data-reveal style="--reveal-delay: 140ms">
        Senato gündemi, resmi bilgilendirmeler ve karar metinleri.
      </p>
    </section>

    <section class="page-section page-grid" data-scene>
      <article
        v-for="(announcement, index) in announcements"
        :key="announcement.title"
        class="info-card reveal-item"
        data-reveal
        :style="{ '--reveal-delay': `${index * 90 + 120}ms` }"
      >
        <h3>{{ announcement.title }}</h3>
        <p>{{ announcement.text }}</p>
      </article>
    </section>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

const announcements = [
  {
    title: 'Mart 2026 Genel Toplantısı',
    text: 'Senato genel toplantısı 20 Mart 2026 tarihinde konferans salonunda gerçekleştirilecektir.',
  },
  {
    title: 'Proje Başvuru Çağrısı',
    text: 'Öğrenci odaklı sosyal ve akademik proje önerileri için başvurular 31 Mart 2026 tarihine kadar açıktır.',
  },
  {
    title: 'Karar Özeti Yayınlandı',
    text: 'Son oturumda alınan kararların özet metni duyurular panelinde erişime açılmıştır.',
  },
]

const pageRef = ref<HTMLElement | null>(null)
let revealObserver: IntersectionObserver | null = null

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
    { threshold: 0.16, rootMargin: '0px 0px -8% 0px' },
  )

  root.querySelectorAll<HTMLElement>('[data-reveal]').forEach((node) => revealObserver?.observe(node))
  root.querySelectorAll<HTMLElement>('[data-scene]').forEach((node) => revealObserver?.observe(node))
})

onBeforeUnmount(() => {
  revealObserver?.disconnect()
})
</script>

<style scoped>
.duyurular-page {
  --motion-ease: cubic-bezier(0.22, 1, 0.36, 1);
  display: grid;
  gap: 1rem;
  position: relative;
  isolation: isolate;
}

.ambient-layer {
  position: absolute;
  inset: -8% -6% -8% -8%;
  pointer-events: none;
  z-index: 0;
}

.ambient-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(56px);
  opacity: 0.2;
  animation: ambientDrift 16s var(--motion-ease) infinite alternate;
}

.blob-a {
  width: min(400px, 34vw);
  height: min(300px, 26vw);
  left: -10%;
  top: -4%;
  background: radial-gradient(circle, rgba(96, 136, 226, 0.26), rgba(96, 136, 226, 0));
}

.blob-b {
  width: min(280px, 24vw);
  height: min(220px, 20vw);
  right: -8%;
  top: 30%;
  background: radial-gradient(circle, rgba(76, 112, 198, 0.2), rgba(76, 112, 198, 0));
  animation-duration: 20s;
}

.blob-c {
  width: min(320px, 28vw);
  height: min(250px, 22vw);
  left: 30%;
  bottom: 4%;
  background: radial-gradient(circle, rgba(82, 122, 214, 0.16), rgba(82, 122, 214, 0));
  animation-duration: 18s;
}

.duyurular-page > *:not(.ambient-layer) {
  position: relative;
  z-index: 2;
}

.reveal-item {
  opacity: 0;
  transform: translateY(24px) scale(0.986);
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
  position: relative;
  overflow: hidden;
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
  margin: 1rem 0 0.8rem;
  font-size: clamp(2rem, 4.8vw, 3.2rem);
  line-height: 1.06;
}

.hero-subtitle {
  margin: 0;
  max-width: 70ch;
  color: #d9e6ff;
  line-height: 1.72;
}

.info-card {
  display: grid;
  gap: 0.58rem;
  padding: 1.2rem;
}

.info-card h3 {
  margin: 0;
  line-height: 1.34;
}

.info-card p {
  margin: 0;
  color: rgba(210, 224, 248, 0.9);
  line-height: 1.68;
}

@keyframes ambientDrift {
  0% {
    transform: translate3d(0, 0, 0) scale(1);
    opacity: 0.16;
  }
  100% {
    transform: translate3d(12px, -8px, 0) scale(1.05);
    opacity: 0.26;
  }
}

@media (prefers-reduced-motion: reduce) {
  .ambient-layer,
  .ambient-blob,
  .reveal-item {
    animation: none !important;
    transition: none !important;
    transform: none !important;
    opacity: 1 !important;
  }
}
</style>
