<template>
  <div ref="landingRef" class="landing-page">
    <div class="ambient-layer" aria-hidden="true">
      <span class="ambient-blob blob-a" />
      <span class="ambient-blob blob-b" />
      <span class="ambient-blob blob-c" />
      <span class="ambient-blob blob-d" />
      <span class="ambient-blob blob-e" />
      <span class="ambient-band band-a" />
      <span class="ambient-band band-b" />
      <span class="ambient-orb" />
      <span class="ambient-streak" />
      <span class="ambient-grain" />
    </div>

    <section ref="heroRef" class="hero-section page-section" aria-labelledby="hero-title">
      <div class="hero-shimmer" aria-hidden="true" />
      <div class="hero-copy">
        <p class="hero-kicker">Eskişehir MBA Senatosu</p>
        <h1 id="hero-title">
          <span>Öğrenci Temsilinde Güven,</span>
          <span>Süreçte Disiplin</span>
        </h1>
        <p>
          Eskişehir MBA Senatosu, öğrenci iradesini kurumsal temsil yaklaşımıyla birleştirir; akademik ve
          sosyal yaşamda ölçülebilir etki üreten proje kültürü inşa eder.
        </p>
        <div class="hero-actions">
          <RouterLink class="btn btn-primary" to="/projeler">Aktif Projeleri İncele</RouterLink>
          <RouterLink class="btn btn-secondary" to="/duyurular">Resmi Duyuruları Gör</RouterLink>
        </div>
      </div>

      <figure class="hero-media">
        <img :src="image1" alt="Eskişehir MBA Senatosu Avrupa Birliği simülasyonu sertifika töreni" />
        <div class="hero-media-overlay" aria-hidden="true" />
        <figcaption>Avrupa Birliği Simülasyonu – Sertifikalı Uluslararası Temsil Deneyimi</figcaption>
      </figure>
    </section>

    <section class="stats-section" aria-label="Kurumsal güven göstergeleri" data-scene>
      <article
        v-for="(item, index) in stats"
        :key="item.label"
        class="stat-card page-section reveal-item"
        data-reveal
        :data-stat-index="index"
        :style="{ '--reveal-delay': `${index * 120}ms` }"
      >
        <p class="stat-value">{{ displayedStats[index] || item.value }}</p>
        <p class="stat-label">{{ item.label }}</p>
        <p class="stat-detail">{{ item.detail }}</p>
      </article>
    </section>

    <section class="projects-section page-section" aria-labelledby="projects-title" data-scene>
      <div class="section-heading-wrap">
        <SectionHeading
          label="Projeler"
          title="Aktif Projelerimiz"
          description="Takvim, sorumluluk ve çıktı disipliniyle yürütülen senato projeleri."
        />
      </div>

      <div class="projects-grid">
        <ProjectCard
          v-for="(project, index) in projects"
          :key="project.title"
          class="reveal-item"
          data-reveal
          :style="{ '--reveal-delay': `${index * 150}ms` }"
          :title="project.title"
          :summary="project.summary"
          :status="project.status"
          :action-label="project.actionLabel"
          :action-to="project.actionTo"
          :featured="project.featured"
        />
      </div>
    </section>

    <section class="gallery-section" aria-labelledby="gallery-title" data-scene>
      <div class="section-heading-wrap">
        <SectionHeading
          label="Etkinlikler"
          title="Senato Galerisi"
          description="Temsil, proje ve katılım kültürünü yansıtan seçili etkinlik kareleri."
        />
      </div>

      <div class="gallery-grid">
        <article
          v-for="(item, index) in galleryItems"
          :key="`${item.caption}-${item.note}`"
          class="gallery-item reveal-item"
          data-reveal
          :style="{ '--reveal-delay': `${index * 130}ms` }"
          :class="{ 'is-featured': item.featured }"
        >
          <img :src="item.src" :alt="item.alt" />
          <div class="gallery-overlay">
            <p>{{ item.caption }}</p>
            <span>{{ item.note }}</span>
          </div>
        </article>
      </div>
    </section>

    <section id="hakkimizda" class="values-section page-section" aria-labelledby="values-title" data-scene>
      <div>
        <SectionHeading
          label="Değer Önerisi"
          title="Temsili Güçlendiren Çalışma Modeli"
          description="Öğrenci liderliğini kurumsal kalite ile destekleyen temel yaklaşımımız."
        />
      </div>

      <div class="values-grid">
        <article
          v-for="(item, index) in values"
          :key="item.title"
          class="value-card reveal-item"
          data-reveal
          :style="{ '--reveal-delay': `${index * 110}ms` }"
        >
          <h3>{{ item.title }}</h3>
          <p>{{ item.text }}</p>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import image1 from '@/assets/1.jpeg'
import image2 from '@/assets/2.jpeg'
import image3 from '@/assets/3.jpeg'
import image4 from '@/assets/4.jpeg'
import image5 from '@/assets/5.jpeg'
import image6 from '@/assets/6.jpg'
import SectionHeading from '@/components/home/SectionHeading.vue'
import ProjectCard from '@/components/home/ProjectCard.vue'
import { getProjectsPortfolioMetric, projectsContent, type ProjectStatus } from '@/data/projects'

type Project = {
  title: string
  summary: string
  status: ProjectStatus
  actionLabel: string
  actionTo: string
  featured?: boolean
}

type GalleryItem = {
  src: string
  alt: string
  caption: string
  note: string
  featured?: boolean
}

const projectsPortfolioMetric = getProjectsPortfolioMetric()

const stats = [
  { value: projectsPortfolioMetric.display, label: 'Tamamlanmış Proje Sayısı', detail: 'Başarıyla tamamlanan proje portföyü' },
  { value: '28+', label: 'Yıllık Etkinlik', detail: 'Dönem takvimine bağlı etkinlik akışı' },
  {
    value: '100+',
    label: 'Öğrenci Katılımı',
    detail: 'Etkinlik, proje ve geri bildirim süreçlerinde aktif öğrenci katılımı',
  },
  { value: '6', label: 'Temsil Alanı', detail: 'Akademik ve sosyal temsil odakları' },
]

const statTargets = [projectsPortfolioMetric.numeric, 28, 100, 6]
const statSuffix = ['+', '+', '+', '']
const displayedStats = ref<string[]>(['0', '0', '0', '0'])
const animatedStatIndices = new Set<number>()

const projects: Project[] = projectsContent.map((project) => ({
  title: project.title,
  summary: project.homeDescription,
  status: project.status,
  actionLabel: project.status === 'Planlanıyor' ? 'Takvim Detayı' : 'Projeyi İncele',
  actionTo: project.status === 'Planlanıyor' ? '/duyurular' : project.detailTo,
}))

const values = [
  {
    title: 'Öğrenci İradesi',
    text: 'Temsil süreçleri, öğrencinin doğrudan katılımı ve geri bildirimleri üzerine kurgulanır.',
  },
  {
    title: 'Ortak Akıl',
    text: 'Senato, yönetim ve öğrenci toplulukları arasında sürdürülebilir koordinasyon mekanizması kurar.',
  },
  {
    title: 'Temsil Disiplini',
    text: 'Hedef, takvim ve çıktı odağıyla ilerleyen proje yaklaşımı sayesinde kalıcı etki üretilir.',
  },
]

const galleryItems: GalleryItem[] = [
  {
    src: image6,
    alt: 'Genel kurul ve temsil oturumundan görüntü',
    caption: 'Genel Kurul Oturumu',
    note: 'Karar süreçleri ve kurumsal temsil gündemi',
  },
  {
    src: image1,
    alt: 'Uluslararası temsil etkinliğinden görüntü',
    caption: 'Uluslararası Temsil',
    note: 'Resmî temsil ve diplomatik simülasyon deneyimi',
    featured: true,
  },
  {
    src: image5,
    alt: 'Öğrenci proje sunumlarından kare',
    caption: 'Proje Sunumları',
    note: 'Çıktı odaklı dönemsel değerlendirme buluşmaları',
  },
  {
    src: image3,
    alt: 'Sosyal etkinlikten öğrenci katılım fotoğrafı',
    caption: 'Öğrenci Katılımı',
    note: 'Topluluk temelli ortak çalışma kültürü',
  },
  {
    src: image4,
    alt: 'Kurumsal sahne etkinliğinden görüntü',
    caption: 'Kurumsal Etkinlik',
    note: 'Senato vizyonunu görünür kılan resmî organizasyonlar',
  },
  {
    src: image2,
    alt: 'Temsil kurulu toplantısından görüntü',
    caption: 'Koordinasyon Süreci',
    note: 'Planlama, iletişim ve süreç yönetiminden kareler',
  },
]

const landingRef = ref<HTMLElement | null>(null)
const heroRef = ref<HTMLElement | null>(null)
let revealObserver: IntersectionObserver | null = null
let parallaxRaf = 0
let scrollRaf = 0
let lastOffsetX = 0
let lastOffsetY = 0
let scrollShift = 0

const updateHeroParallax = () => {
  if (!heroRef.value) return
  heroRef.value.style.setProperty('--parallax-x', `${lastOffsetX}px`)
  heroRef.value.style.setProperty('--parallax-y', `${lastOffsetY}px`)
}

const handleHeroPointerMove = (event: PointerEvent) => {
  if (!heroRef.value || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const rect = heroRef.value.getBoundingClientRect()
  const x = (event.clientX - rect.left) / rect.width - 0.5
  const y = (event.clientY - rect.top) / rect.height - 0.5
  lastOffsetX = x * 8
  lastOffsetY = y * 6
  cancelAnimationFrame(parallaxRaf)
  parallaxRaf = requestAnimationFrame(updateHeroParallax)
}

const handleHeroPointerLeave = () => {
  lastOffsetX = 0
  lastOffsetY = 0
  cancelAnimationFrame(parallaxRaf)
  parallaxRaf = requestAnimationFrame(updateHeroParallax)
}

const updateScrollParallax = () => {
  if (!landingRef.value) return
  landingRef.value.style.setProperty('--scroll-shift', `${scrollShift}px`)
}

const handleScrollParallax = () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  scrollShift = Math.max(-14, Math.min(14, window.scrollY * 0.02))
  cancelAnimationFrame(scrollRaf)
  scrollRaf = requestAnimationFrame(updateScrollParallax)
}

onMounted(async () => {
  const root = landingRef.value
  if (!root) return

  await nextTick()
  requestAnimationFrame(() => {
    root.classList.add('is-entered')
  })

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    root.querySelectorAll<HTMLElement>('[data-reveal]').forEach((node) => node.classList.add('is-revealed'))
    root.querySelectorAll<HTMLElement>('[data-scene]').forEach((node) => node.classList.add('is-scene-revealed'))
    displayedStats.value = statTargets.map((target, index) => `${target}${statSuffix[index] ?? ''}`)
  } else {
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed')
            if ((entry.target as HTMLElement).dataset.scene !== undefined) {
              entry.target.classList.add('is-scene-revealed')
            }
            const indexAttr = (entry.target as HTMLElement).dataset.statIndex
            if (indexAttr) {
              const index = Number(indexAttr)
              if (!Number.isNaN(index) && !animatedStatIndices.has(index)) {
                animatedStatIndices.add(index)
                const target = statTargets[index] ?? 0
                const suffix = statSuffix[index] ?? ''
                const startTime = performance.now()
                const duration = 900
                const animate = (now: number) => {
                  const t = Math.min(1, (now - startTime) / duration)
                  const eased = 1 - Math.pow(1 - t, 3)
                  const value = Math.round(target * eased)
                  displayedStats.value[index] = `${value}${suffix}`
                  if (t < 1) {
                    requestAnimationFrame(animate)
                  }
                }
                requestAnimationFrame(animate)
              }
            }
            revealObserver?.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.16, rootMargin: '0px 0px -6% 0px' },
    )

    root.querySelectorAll<HTMLElement>('[data-reveal]').forEach((node) => revealObserver?.observe(node))
    root.querySelectorAll<HTMLElement>('[data-scene]').forEach((node) => revealObserver?.observe(node))
  }

  heroRef.value?.addEventListener('pointermove', handleHeroPointerMove, { passive: true })
  heroRef.value?.addEventListener('pointerleave', handleHeroPointerLeave, { passive: true })
  window.addEventListener('scroll', handleScrollParallax, { passive: true })
})

onBeforeUnmount(() => {
  revealObserver?.disconnect()
  heroRef.value?.removeEventListener('pointermove', handleHeroPointerMove)
  heroRef.value?.removeEventListener('pointerleave', handleHeroPointerLeave)
  window.removeEventListener('scroll', handleScrollParallax)
  cancelAnimationFrame(parallaxRaf)
  cancelAnimationFrame(scrollRaf)
})
</script>

<style scoped>
.landing-page {
  --scroll-shift: 0px;
  --motion-ease: cubic-bezier(0.22, 1, 0.36, 1);
  display: grid;
  gap: clamp(2.15rem, 3.15vw, 3.2rem);
  position: relative;
  overflow: visible;
  background: transparent;
}

.landing-page::before {
  content: '';
  position: fixed;
  inset: -12% -10% -12% -14%;
  pointer-events: none;
  z-index: 0;
  background:
    radial-gradient(ellipse at 18% 16%, rgba(110, 150, 236, 0.075), rgba(110, 150, 236, 0) 44%),
    radial-gradient(ellipse at 84% 78%, rgba(92, 120, 196, 0.05), rgba(92, 120, 196, 0) 40%);
}

.landing-page::after {
  content: '';
  position: absolute;
  left: -4%;
  right: -6%;
  top: 6%;
  height: min(280px, 26vw);
  pointer-events: none;
  z-index: 0;
  background:
    radial-gradient(ellipse at 40% 44%, rgba(129, 164, 238, 0.05), rgba(129, 164, 238, 0) 68%),
    linear-gradient(90deg, rgba(68, 108, 190, 0.055) 0%, rgba(68, 108, 190, 0.03) 44%, rgba(68, 108, 190, 0.01) 72%, rgba(68, 108, 190, 0) 100%);
  filter: blur(42px);
}

.ambient-layer {
  position: fixed;
  inset: -24% -18% -20% -26%;
  pointer-events: none;
  z-index: 0;
  overflow: visible;
}

.ambient-layer > :not(.blob-a):not(.blob-d):not(.band-a) {
  display: none;
}

.ambient-blob {
  position: absolute;
  border-radius: 999px;
  filter: blur(96px);
  opacity: 0.1;
  animation: ambientDrift 10s var(--motion-ease) infinite alternate;
}

.blob-a {
  width: min(1080px, 82vw);
  height: min(820px, 64vw);
  left: -26%;
  top: -12%;
  background: radial-gradient(ellipse at 34% 36%, rgba(98, 142, 235, 0.11), rgba(98, 142, 235, 0) 78%);
  animation: heroBackGlowDrift 8s var(--motion-ease) infinite alternate;
}

.blob-b {
  width: min(360px, 28vw);
  height: min(280px, 22vw);
  right: -10%;
  bottom: calc(16% + var(--scroll-shift) * 0.2);
  background: radial-gradient(ellipse at 65% 55%, rgba(87, 96, 196, 0.08), rgba(87, 96, 196, 0) 78%);
  animation-duration: 16s;
}

.blob-c {
  width: min(320px, 28vw);
  height: min(220px, 20vw);
  left: 40%;
  top: calc(10% + var(--scroll-shift) * -0.08);
  background: radial-gradient(ellipse at 50% 50%, rgba(96, 132, 218, 0.06), rgba(96, 132, 218, 0) 78%);
  animation-duration: 12s;
}

.blob-d {
  width: min(320px, 26vw);
  height: min(240px, 20vw);
  right: 8%;
  top: calc(70% + var(--scroll-shift) * 0.08);
  background: radial-gradient(ellipse at 42% 54%, rgba(120, 104, 192, 0.06), rgba(120, 104, 192, 0) 82%);
  animation: ambientDrift 14s var(--motion-ease) infinite alternate-reverse;
}

.blob-e {
  width: min(340px, 30vw);
  height: min(260px, 24vw);
  left: 22%;
  bottom: calc(-6% + var(--scroll-shift) * 0.16);
  background: radial-gradient(ellipse at 40% 50%, rgba(55, 106, 218, 0.06), rgba(55, 106, 218, 0) 78%);
  animation-duration: 13s;
}

.ambient-band {
  position: absolute;
  pointer-events: none;
  border-radius: 999px;
  filter: blur(40px);
  opacity: 0.04;
}

.band-a {
  width: min(980px, 76vw);
  height: 190px;
  left: -22%;
  top: -2%;
  background: linear-gradient(110deg, rgba(64, 122, 245, 0.038), rgba(218, 230, 255, 0.048), rgba(64, 122, 245, 0.012));
  animation: bandSweep 11s var(--motion-ease) infinite alternate;
}

.band-b {
  width: min(560px, 44vw);
  height: 110px;
  right: -10%;
  top: 42%;
  background: linear-gradient(120deg, rgba(98, 94, 196, 0.06), rgba(206, 219, 255, 0.1), rgba(76, 122, 228, 0.05));
  animation: bandSweepReverse 14s var(--motion-ease) infinite alternate;
}

.ambient-orb {
  position: absolute;
  right: 16%;
  top: 14%;
  width: min(140px, 12vw);
  height: min(140px, 12vw);
  border-radius: 50%;
  pointer-events: none;
  background: radial-gradient(circle, rgba(213, 227, 255, 0.22), rgba(113, 152, 236, 0.08) 42%, rgba(113, 152, 236, 0) 72%);
  filter: blur(18px);
  opacity: 0.34;
  animation: orbPulse 8s var(--motion-ease) infinite;
}

.ambient-streak {
  position: absolute;
  left: -20%;
  top: 62%;
  width: min(540px, 46vw);
  height: 92px;
  pointer-events: none;
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(227, 238, 255, 0), rgba(227, 238, 255, 0.12), rgba(227, 238, 255, 0));
  filter: blur(24px);
  opacity: 0.14;
  animation: streakMove 7s var(--motion-ease) infinite;
}

.ambient-grain {
  position: absolute;
  inset: 0;
  opacity: 0.015;
  background-image: radial-gradient(rgba(227, 236, 255, 0.3) 0.5px, transparent 0.5px);
  background-size: 4px 4px;
  mix-blend-mode: normal;
}

.reveal-item {
  opacity: 0;
  transform: translateY(30px) scale(0.96);
  transition:
    opacity 760ms cubic-bezier(0.16, 1, 0.3, 1),
    transform 760ms cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: var(--reveal-delay, 0ms);
}

.reveal-item.is-revealed {
  opacity: 1;
  transform: translateY(0) scale(1) rotate(0deg);
}

.hero-section,
.hero-section.page-section {
  --parallax-x: 0px;
  --parallax-y: 0px;
  display: grid;
  grid-template-columns: minmax(0, 48.5fr) minmax(0, 51.5fr);
  align-items: center;
  gap: clamp(1.45rem, 2.4vw, 2.15rem);
  padding: clamp(1.05rem, 1.8vw, 1.55rem);
  background: transparent !important;
  border: 0 !important;
  box-shadow: none !important;
  position: relative;
  isolation: isolate;
  overflow: visible;
}

.hero-section::before {
  content: '';
  position: absolute;
  inset: -26% -12% -30% -20%;
  pointer-events: none;
  z-index: 0;
  border-radius: 999px;
  background: radial-gradient(ellipse at 34% 36%, rgba(102, 148, 241, 0.16), rgba(102, 148, 241, 0) 74%);
  filter: blur(70px);
  animation: heroBackGlowDrift 12s var(--motion-ease) infinite alternate;
}

.hero-section::after {
  display: none;
}

.landing-page > *:not(.ambient-layer),
.hero-copy,
.hero-media,
.section-heading-wrap,
.stats-section,
.projects-section,
.gallery-section,
.values-section {
  position: relative;
  z-index: 2;
}

.hero-copy {
  z-index: 10;
}

.hero-kicker {
  margin: 0;
  color: var(--accent-strong);
  font-size: 0.78rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  font-weight: 650;
}

.hero-copy h1,
.hero-copy p {
  opacity: 0;
  transform: translateY(32px);
  filter: blur(6px);
  transition:
    opacity 960ms cubic-bezier(0.16, 1, 0.3, 1),
    transform 960ms cubic-bezier(0.16, 1, 0.3, 1),
    filter 960ms cubic-bezier(0.16, 1, 0.3, 1);
}

.landing-page.is-entered .hero-copy h1,
.landing-page.is-entered .hero-copy p {
  opacity: 1;
  transform: translateY(0);
  filter: blur(0);
}

.hero-copy p {
  margin: 0.9rem 0 0;
  color: rgba(238, 246, 255, 0.8);
  font-size: clamp(0.98rem, 1.14vw, 1.04rem);
  line-height: 1.68;
  max-width: 48ch;
  text-shadow: 0 1px 8px rgba(7, 13, 24, 0.35);
  transition-delay: 200ms;
}

.hero-copy h1 {
  color: #ffffff;
  margin: 0.58rem 0 0;
  font-size: clamp(2rem, 3.8vw, 3.45rem);
  line-height: 1.07;
  letter-spacing: -0.02em;
  max-width: 16ch;
  text-shadow: 0 2px 12px rgba(7, 13, 24, 0.45);
}

.hero-copy h1 span {
  display: block;
  opacity: 0;
  transform: translateY(18px);
  transition:
    opacity 760ms cubic-bezier(0.16, 1, 0.3, 1),
    transform 760ms cubic-bezier(0.16, 1, 0.3, 1);
}

.landing-page.is-entered .hero-copy h1 span {
  opacity: 1;
  transform: translateY(0);
}

.hero-copy h1 span:nth-child(1) { transition-delay: 70ms; }
.hero-copy h1 span:nth-child(2) { transition-delay: 170ms; }

.hero-actions {
  margin-top: 1.32rem;
  display: flex;
  gap: 0.62rem;
  flex-wrap: wrap;
}

.hero-actions .btn {
  opacity: 0;
  transform: translateY(18px) scale(0.96);
  transition:
    opacity 560ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 560ms cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 280ms cubic-bezier(0.22, 1, 0.36, 1),
    background-color 220ms ease,
    color 220ms ease,
    border-color 220ms ease;
}

.landing-page.is-entered .hero-actions .btn {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.hero-actions .btn:nth-child(1) { transition-delay: 340ms; }
.hero-actions .btn:nth-child(2) { transition-delay: 560ms; }

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 47px;
  padding: 0 1.3rem;
  border-radius: 12px;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 620;
  letter-spacing: 0.004em;
  border: 1px solid transparent;
  position: relative;
  overflow: hidden;
}

.btn::after {
  content: '';
  position: absolute;
  inset: -40% auto -40% -130%;
  width: 42%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.38), transparent);
  transform: skewX(-18deg);
  opacity: 0;
  transition: transform 320ms cubic-bezier(0.22, 1, 0.36, 1), opacity 320ms ease;
}

.btn:hover::after,
.btn:focus-visible::after {
  opacity: 1;
  transform: translateX(260%) skewX(-18deg);
}

.btn-primary { background: #dce6fa; color: #0d1b33; }
.btn-primary {
  background: linear-gradient(132deg, #f7faff 0%, #dfe9ff 48%, #c1d4fb 100%);
  color: #0b1830;
  border-color: rgba(229, 238, 255, 0.62);
  box-shadow: 0 10px 24px rgba(119, 157, 235, 0.28);
}

.btn-secondary {
  border-color: rgba(177, 197, 233, 0.4);
  color: #e8f1ff;
  background: rgba(173, 193, 226, 0.08);
}

.btn:hover,
.btn:focus-visible {
  transform: translateY(-2px) scale(1.02);
  box-shadow:
    0 16px 32px rgba(82, 124, 214, 0.42),
    0 0 20px rgba(99, 143, 238, 0.26);
}

.btn-primary:hover,
.btn-primary:focus-visible {
  box-shadow:
    0 18px 34px rgba(82, 124, 214, 0.46),
    0 0 24px rgba(99, 143, 238, 0.3);
}

.btn-secondary:hover,
.btn-secondary:focus-visible {
  box-shadow:
    0 14px 28px rgba(56, 90, 162, 0.3),
    0 0 16px rgba(87, 127, 217, 0.2);
}

.btn:active {
  transform: translateY(0) scale(0.985);
  animation: buttonGlowPulse 220ms cubic-bezier(0.22, 1, 0.36, 1);
}

.btn:focus-visible { outline: 2px solid rgba(227, 236, 255, 0.55); outline-offset: 2px; }

.hero-media {
  position: relative;
  width: 100%;
  max-width: none;
  justify-self: stretch;
  margin: 0;
  border: 1px solid rgba(175, 193, 222, 0.28);
  border-radius: 18px;
  overflow: hidden;
  background: #0c182d;
  box-shadow:
    0 18px 36px rgba(4, 10, 22, 0.28),
    0 0 0 1px rgba(172, 200, 255, 0.24),
    0 0 30px rgba(74, 118, 224, 0.18);
  opacity: 0;
  transform: translateX(18px) translateY(8px) scale(0.92);
  filter: blur(6px);
  transition:
    opacity 900ms cubic-bezier(0.16, 1, 0.3, 1) 320ms,
    transform 900ms cubic-bezier(0.16, 1, 0.3, 1) 320ms,
    filter 900ms cubic-bezier(0.16, 1, 0.3, 1) 320ms,
    box-shadow 280ms cubic-bezier(0.22, 1, 0.36, 1);
  z-index: 6;
}

.landing-page.is-entered .hero-media {
  opacity: 1;
  transform: translateX(calc(var(--parallax-x) * 0.45)) translateY(calc(var(--parallax-y) * 0.35)) scale(1);
  filter: blur(0);
}

.hero-media::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 38%;
  pointer-events: none;
  background: linear-gradient(135deg, rgba(220, 234, 255, 0.18), rgba(220, 234, 255, 0));
  z-index: 1;
}

.hero-media::after {
  content: '';
  position: absolute;
  top: -20%;
  bottom: -14%;
  right: -18%;
  width: 42%;
  pointer-events: none;
  background: radial-gradient(ellipse at left center, rgba(122, 162, 245, 0.26), rgba(122, 162, 245, 0) 72%);
  filter: blur(26px);
  z-index: 0;
  animation: imageAuraBreathe 8s var(--motion-ease) infinite;
}

.hero-media img {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 10;
  min-height: clamp(390px, 37vw, 490px);
  object-fit: cover;
  object-position: center 36%;
  transition: transform 300ms cubic-bezier(0.22, 1, 0.36, 1);
}

.hero-media:hover {
  box-shadow:
    0 20px 38px rgba(4, 10, 22, 0.3),
    0 0 0 1px rgba(188, 214, 255, 0.34),
    0 0 44px rgba(88, 132, 232, 0.34);
}

.hero-media:hover img { transform: scale(1.035); }

.hero-media-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.42), transparent 58%);
  z-index: 1;
}

.hero-media figcaption {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 0.85rem 1.05rem;
  color: rgba(237, 245, 255, 0.95);
  font-size: 0.8rem;
  letter-spacing: 0.015em;
  line-height: 1.5;
  background: linear-gradient(180deg, rgba(7, 14, 26, 0.02), rgba(7, 14, 26, 0.65));
  z-index: 2;
}

.stats-section { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: clamp(0.8rem, 1.55vw, 1.02rem); }
.stats-section::before {
  content: '';
  position: absolute;
  left: 8%;
  right: 8%;
  top: -22%;
  height: 180px;
  pointer-events: none;
  background: radial-gradient(ellipse at center, rgba(74, 118, 224, 0.14), rgba(74, 118, 224, 0) 72%);
  filter: blur(36px);
  z-index: 0;
}

.stat-card {
  padding: 1.35rem 1.2rem 1.2rem;
  background: rgba(18, 30, 50, 0.86);
  border-radius: 18px;
  box-shadow: inset 0 1px 0 rgba(198, 214, 248, 0.06);
  transition:
    transform 0.28s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.28s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.28s cubic-bezier(0.22, 1, 0.36, 1);
  position: relative;
  z-index: 1;
}

.stat-card:hover {
  transform: translateY(-7px) scale(1.02);
  border-color: rgba(194, 214, 252, 0.52);
  box-shadow:
    0 20px 34px rgba(4, 10, 22, 0.3),
    0 0 28px rgba(72, 114, 214, 0.26);
}

.stat-value { margin: 0; font-size: clamp(2.34rem, 3.7vw, 3rem); font-weight: 760; letter-spacing: -0.03em; line-height: 1.04; }
.stat-label { margin: 0.42rem 0 0; color: #e8f1ff; font-size: 0.94rem; font-weight: 580; line-height: 1.45; }
.stat-detail { margin: 0.54rem 0 0; color: rgba(166, 183, 214, 0.86); font-size: 0.77rem; line-height: 1.58; max-width: 30ch; }

.projects-section { display: grid; gap: 1.08rem; position: relative; overflow: visible; }

.projects-section::after {
  content: '';
  position: absolute;
  left: 12%;
  right: 12%;
  top: 28%;
  height: 260px;
  border-radius: 999px;
  background: radial-gradient(ellipse at center, rgba(84, 120, 207, 0.17), rgba(84, 120, 207, 0) 74%);
  filter: blur(42px);
  pointer-events: none;
  z-index: 0;
  animation: sectionDrift 12s var(--motion-ease) infinite alternate;
}

.projects-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: clamp(0.88rem, 1.55vw, 1.12rem); }

.gallery-section { display: grid; gap: 1.14rem; margin-top: 0.3rem; position: relative; overflow: visible; }

.gallery-section::after {
  content: '';
  position: absolute;
  left: 14%;
  right: 14%;
  top: -8%;
  height: 180px;
  border-radius: 999px;
  background: radial-gradient(ellipse at center, rgba(114, 107, 194, 0.16), rgba(114, 107, 194, 0) 76%);
  filter: blur(40px);
  pointer-events: none;
  z-index: 0;
  animation: sectionDriftReverse 13s var(--motion-ease) infinite alternate;
}

.gallery-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1.08rem; }

.gallery-item {
  position: relative;
  aspect-ratio: 4 / 3;
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid var(--border-soft);
  background: rgba(16, 27, 46, 0.92);
  z-index: 1;
  transition:
    transform 300ms cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 300ms cubic-bezier(0.22, 1, 0.36, 1),
    border-color 300ms cubic-bezier(0.22, 1, 0.36, 1);
}
.gallery-item.is-featured {
  border-color: rgba(200, 215, 239, 0.42);
  box-shadow:
    0 12px 22px rgba(3, 9, 21, 0.22),
    0 0 16px rgba(74, 118, 224, 0.16);
}

.gallery-item img { width: 100%; height: 100%; display: block; object-fit: cover; transition: transform 340ms cubic-bezier(0.22, 1, 0.36, 1); }
.gallery-item:hover img { transform: scale(1.05); }

.gallery-overlay {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 1rem 1rem 0.92rem;
  background: linear-gradient(180deg, rgba(8, 14, 25, 0.02), rgba(8, 14, 25, 0.86));
  display: grid;
  gap: 0.28rem;
  transition: background 280ms cubic-bezier(0.22, 1, 0.36, 1);
}

.gallery-item:hover .gallery-overlay {
  background: linear-gradient(180deg, rgba(8, 14, 25, 0.08), rgba(8, 14, 25, 0.92));
}

.gallery-item:hover {
  transform: translateY(-7px) scale(1.015);
  border-color: rgba(193, 214, 252, 0.55);
  box-shadow:
    0 20px 32px rgba(3, 9, 21, 0.3),
    0 0 26px rgba(74, 118, 224, 0.26);
}

.gallery-overlay p {
  margin: 0;
  font-size: 0.92rem;
  font-weight: 650;
  line-height: 1.34;
  letter-spacing: 0.005em;
  transition: transform 280ms cubic-bezier(0.22, 1, 0.36, 1), color 280ms cubic-bezier(0.22, 1, 0.36, 1);
}

.gallery-item.is-featured .gallery-overlay p { font-size: 1rem; }

.gallery-overlay span {
  margin: 0;
  color: rgba(225, 236, 255, 0.72);
  font-size: 0.76rem;
  line-height: 1.48;
  transition: transform 280ms cubic-bezier(0.22, 1, 0.36, 1), color 280ms cubic-bezier(0.22, 1, 0.36, 1);
}

.gallery-item:hover .gallery-overlay p,
.gallery-item:hover .gallery-overlay span {
  transform: translateY(-6px);
  color: #f4f8ff;
}

.values-section { display: grid; gap: 1.08rem; position: relative; overflow: visible; }
.values-section::before {
  content: '';
  position: absolute;
  right: -6%;
  bottom: -14%;
  width: min(380px, 36vw);
  height: min(260px, 24vw);
  border-radius: 50%;
  pointer-events: none;
  background: radial-gradient(circle, rgba(60, 83, 158, 0.22), rgba(60, 83, 158, 0));
  filter: blur(34px);
}

.values-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.9rem; }
.value-card {
  border: 1px solid var(--border-soft);
  border-radius: 18px;
  background: rgba(18, 30, 50, 0.86);
  padding: 1.12rem;
  box-shadow: inset 0 1px 0 rgba(198, 214, 248, 0.06);
}
.value-card h3 { margin: 0; font-size: 1.02rem; }
.value-card p { margin: 0.55rem 0 0; color: rgba(223, 233, 252, 0.62); line-height: 1.68; }

.section-heading-wrap {
  position: relative;
  z-index: 2;
}

.section-heading-wrap::after {
  content: '';
  position: absolute;
  left: -2%;
  top: -8%;
  width: min(280px, 34vw);
  height: 120px;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(110, 148, 235, 0.1), rgba(110, 148, 235, 0));
  filter: blur(28px);
  pointer-events: none;
  z-index: -1;
  animation: headingHaloBreathe 8s var(--motion-ease) infinite;
}

@keyframes ambientDrift {
  0% { transform: translate3d(0, 0, 0) scale(1); opacity: 0.06; }
  50% { transform: translate3d(12px, -8px, 0) scale(1.04); opacity: 0.09; }
  100% { transform: translate3d(-6px, 10px, 0) scale(1.08); opacity: 0.065; }
}

@keyframes heroBackGlowDrift {
  0% { transform: translate3d(-10px, -6px, 0) scale(0.98); opacity: 0.055; }
  50% { transform: translate3d(18px, 10px, 0) scale(1.06); opacity: 0.09; }
  100% { transform: translate3d(-4px, 20px, 0) scale(1.02); opacity: 0.06; }
}

@keyframes heroAuraBreathe {
  0%, 100% { opacity: 0.55; transform: translate3d(calc(var(--parallax-x, 0px) * 0.22), calc(var(--parallax-y, 0px) * 0.18), 0) scale(1); }
  50% { opacity: 0.9; transform: translate3d(calc(var(--parallax-x, 0px) * 0.22), calc(var(--parallax-y, 0px) * 0.18), 0) scale(1.04); }
}

@keyframes heroSweep {
  0% { transform: translate3d(-14px, 8px, 0) scale(1); opacity: 0.42; }
  100% { transform: translate3d(18px, -10px, 0) scale(1.06); opacity: 0.74; }
}

@keyframes imageAuraBreathe {
  0%, 100% { opacity: 0.55; transform: scale(1); }
  50% { opacity: 0.88; transform: scale(1.04); }
}

@keyframes sectionDrift {
  0% { transform: translate3d(-8px, 0, 0) scale(1); opacity: 0.62; }
  100% { transform: translate3d(12px, -6px, 0) scale(1.05); opacity: 0.9; }
}

@keyframes sectionDriftReverse {
  0% { transform: translate3d(8px, 0, 0) scale(1.02); opacity: 0.64; }
  100% { transform: translate3d(-10px, -8px, 0) scale(1.07); opacity: 0.92; }
}

@keyframes bandSweep {
  0% { transform: translate3d(-24px, 12px, 0) rotate(-8deg); opacity: 0.03; }
  100% { transform: translate3d(28px, -12px, 0) rotate(-8deg); opacity: 0.06; }
}

@keyframes bandSweepReverse {
  0% { transform: translate3d(18px, -10px, 0) rotate(-12deg); opacity: 0.025; }
  100% { transform: translate3d(-20px, 10px, 0) rotate(-12deg); opacity: 0.05; }
}

@keyframes orbPulse {
  0%, 100% { opacity: 0.24; transform: translate3d(0, 0, 0) scale(1); }
  50% { opacity: 0.4; transform: translate3d(2px, -3px, 0) scale(1.08); }
}

@keyframes streakMove {
  0% { transform: translate3d(0, 0, 0) scaleX(1); opacity: 0.08; }
  50% { transform: translate3d(42px, -6px, 0) scaleX(1.06); opacity: 0.2; }
  100% { transform: translate3d(88px, 4px, 0) scaleX(1); opacity: 0.08; }
}
.hero-shimmer {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 0.16;
  background:
    linear-gradient(100deg, transparent 15%, rgba(255, 255, 255, 0.2) 35%, transparent 52%),
    linear-gradient(96deg, transparent 44%, rgba(99, 102, 241, 0.18) 54%, transparent 64%);
  background-size: 200% 200%, 170% 170%;
  background-position: -120% 0%, 120% 0%;
  animation: heroShimmer 5.4s cubic-bezier(0.22, 1, 0.36, 1) infinite;
}

@keyframes heroShimmer {
  0% { background-position: -120% 0%, 120% 0%; opacity: 0.1; }
  50% { background-position: 26% 0%, 44% 0%; opacity: 0.18; }
  100% { background-position: 120% 0%, -30% 0%; opacity: 0.1; }
}

@keyframes headingHaloBreathe {
  0%, 100% { opacity: 0.62; transform: translateY(0); }
  50% { opacity: 0.9; transform: translateY(-2px); }
}

@keyframes buttonGlowPulse {
  0% { box-shadow: 0 0 0 rgba(99, 143, 238, 0); }
  50% { box-shadow: 0 0 18px rgba(99, 143, 238, 0.36); }
  100% { box-shadow: 0 0 0 rgba(99, 143, 238, 0); }
}

@media (max-width: 980px) {
  .hero-section { grid-template-columns: 1fr; }
  .hero-copy h1, .hero-copy p { max-width: none; }
  .hero-media img { aspect-ratio: auto; min-height: clamp(360px, 56vw, 460px); }
  .stats-section { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .projects-grid, .values-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .gallery-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (max-width: 760px) {
  .landing-page { gap: 1.15rem; }
  .hero-section, .stats-section, .projects-grid, .gallery-grid, .values-grid { grid-template-columns: 1fr; }
  .hero-copy h1 { font-size: clamp(1.85rem, 8.2vw, 2.45rem); }
  .hero-actions { flex-direction: column; }
  .btn { width: 100%; }
  .hero-media img { min-height: 280px; }
}

@media (prefers-reduced-motion: reduce) {
  .hero-copy h1,
  .hero-copy p,
  .hero-actions .btn,
  .hero-media,
  .hero-shimmer,
  .reveal-item,
  .btn,
  .hero-media img,
  .stat-card,
  .gallery-item img,
  .gallery-overlay p,
  .gallery-overlay span,
  .ambient-layer,
  .ambient-blob,
  .ambient-band,
  .ambient-orb,
  .ambient-streak,
  .ambient-grain,
  .section-heading-wrap::after,
  .hero-section::after,
  .hero-section::before,
  .projects-section::after,
  .gallery-section::after,
  .stats-section::before,
  .values-section::before {
    transition: none !important;
    animation: none !important;
    transform: none !important;
    opacity: 1 !important;
    filter: none !important;
  }
}
</style>
