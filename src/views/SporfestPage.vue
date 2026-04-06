<template>
  <div ref="pageRef" class="experience-page sportfest-page">
    <div class="experience-ambient" aria-hidden="true">
      <span class="ambient-blob blob-a" />
      <span class="ambient-blob blob-b" />
      <span class="ambient-blob blob-c" />
      <span class="ambient-beam beam-a" />
      <span class="ambient-beam beam-b" />
      <span class="ambient-grain" />
    </div>

    <section class="cinema-hero" data-scene>
      <figure
        ref="heroStageRef"
        class="hero-stage page-section reveal-item"
        data-reveal
        @pointermove="handleHeroPointerMove"
        @pointerleave="handleHeroPointerLeave"
      >
        <img class="hero-image" :src="heroImage" alt="Sportfest sahasında takım seremonisi" loading="eager" />
        <span class="hero-vignette" aria-hidden="true" />

        <figcaption class="hero-content">
          <p class="hero-kicker">Eskişehir MBA Senatosu</p>
          <h1>Sportfest</h1>
          <p>
            Kurumsal düzeni bozmadan daha canlı bir deneyim alanı: çok branşlı turnuva akışını tek bir hikaye
            hattında yaşatan, katılımcı odaklı ve yüksek tempolu organizasyon modu.
          </p>

          <div class="hero-meta">
            <span class="status-badge soon">Yakında</span>
            <span class="meta-pill">4 Ana Branş</span>
            <span class="meta-pill">Okullar Arası Turnuva</span>
          </div>

          <div class="hero-actions">
            <RouterLink class="cta-btn cta-primary" to="/iletisim">Katılım Başvurusu</RouterLink>
            <RouterLink class="cta-btn cta-secondary" to="/projeler">Projelere Dön</RouterLink>
          </div>
        </figcaption>
      </figure>
    </section>

    <section class="story-rail" data-scene>
      <article
        v-for="(item, index) in storyBlocks"
        :key="item.title"
        class="story-block page-section reveal-item"
        :class="{ reverse: index % 2 === 1 }"
        data-reveal
        :style="{ '--reveal-delay': `${index * 120 + 70}ms` }"
      >
        <figure class="story-media">
          <img :src="item.image" :alt="item.alt" loading="lazy" decoding="async" />
        </figure>

        <div class="story-copy">
          <p class="story-label">{{ item.label }}</p>
          <h2>{{ item.title }}</h2>
          <p>{{ item.text }}</p>
        </div>
      </article>
    </section>

    <section class="journey-section page-section" data-scene>
      <header class="section-head reveal-item" data-reveal>
        <p class="section-kicker">Akış Haritası</p>
        <h2>Turnuva Yolculuğu</h2>
        <p>Sportfest, hazırlıktan kapanış törenine kadar tek bir akış çizgisinde ilerler.</p>
      </header>

      <ol class="journey-list">
        <li
          v-for="(step, index) in journeySteps"
          :key="step.title"
          class="journey-step reveal-item"
          data-reveal
          :style="{ '--reveal-delay': `${index * 100 + 80}ms` }"
        >
          <span class="step-node">{{ String(index + 1).padStart(2, '0') }}</span>
          <div class="step-copy">
            <h3>{{ step.title }}</h3>
            <p>{{ step.text }}</p>
          </div>
        </li>
      </ol>
    </section>

    <section class="gallery-section page-section" data-scene>
      <header class="section-head reveal-item" data-reveal>
        <p class="section-kicker">Galeri</p>
        <h2>Sahadan Kareler</h2>
        <p>Asimetrik yerleşimle; mücadele, tempo ve takım ruhunu yansıtan görsel seçki.</p>
      </header>

      <div class="gallery-grid">
        <button
          v-for="(item, index) in galleryItems"
          :key="item.alt"
          type="button"
          class="gallery-tile reveal-item"
          :class="`layout-${item.layout}`"
          data-reveal
          :style="{ '--reveal-delay': `${index * 75 + 80}ms` }"
          :aria-label="`${item.caption} görselini büyüt`"
          @click="openLightbox(index)"
        >
          <img :src="item.src" :alt="item.alt" loading="lazy" decoding="async" />
          <span class="tile-overlay">
            <strong>{{ item.caption }}</strong>
            <small>{{ item.note }}</small>
          </span>
        </button>
      </div>
    </section>

    <transition name="lightbox-fade">
      <div v-if="activeGalleryItem" class="lightbox" role="dialog" aria-modal="true" @click.self="closeLightbox">
        <button class="lightbox-close" type="button" aria-label="Kapat" @click="closeLightbox">Kapat</button>
        <figure class="lightbox-figure">
          <img :src="activeGalleryItem.src" :alt="activeGalleryItem.alt" />
          <figcaption>
            <strong>{{ activeGalleryItem.caption }}</strong>
            <span>{{ activeGalleryItem.note }}</span>
          </figcaption>
        </figure>
      </div>
    </transition>

    <section class="final-cta page-section reveal-item" data-reveal data-scene>
      <p class="section-kicker">Son Adım</p>
      <h2>Bu deneyimin parçası olmak ister misin?</h2>
      <p>
        Takım, gönüllü koordinasyon veya saha destek rolüyle Sportfest organizasyonunda yerini al.
      </p>
      <RouterLink class="cta-btn cta-primary" to="/iletisim">Katılım Formuna Git</RouterLink>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import heroImage from '@/assets/5.jpeg'
import image1 from '@/assets/1.jpeg'
import image2 from '@/assets/2.jpeg'
import image3 from '@/assets/3.jpeg'
import image4 from '@/assets/4.jpeg'
import image6 from '@/assets/6.jpg'

type StoryBlock = {
  label: string
  title: string
  text: string
  image: string
  alt: string
}

type JourneyStep = {
  title: string
  text: string
}

type GalleryLayout = 'wide' | 'tall' | 'square' | 'panorama'

type GalleryItem = {
  src: string
  alt: string
  caption: string
  note: string
  layout: GalleryLayout
}

const storyBlocks: StoryBlock[] = [
  {
    label: '01 · Hazırlık',
    title: 'Hazırlık Süreci',
    text: 'Branş kayıtları tamamlanır, takım dağılımları netleşir ve fikstür planı saha kapasitesine göre dengelenir.',
    image: image6,
    alt: 'Sportfest hazırlık toplantısı',
  },
  {
    label: '02 · Turnuva',
    title: 'Simülasyon Günleri',
    text: 'Maçlar etaplı olarak ilerler. Her branşın skor tablosu güncellenir ve temsil ekipleri saha akışını gerçek zamanlı yönetir.',
    image: image4,
    alt: 'Saha kenarı organizasyon anı',
  },
  {
    label: '03 · Final',
    title: 'Kapanış ve Sonuçlar',
    text: 'Final maçları ve ödül seremonisiyle süreç kapanır; katılım, performans ve organizasyon çıktıları dönem raporuna işlenir.',
    image: image1,
    alt: 'Final seremonisi sahnesi',
  },
]

const journeySteps: JourneyStep[] = [
  {
    title: 'Hazırlık Süreci',
    text: 'Başvurular alınır, takım kadroları netleşir ve branş bazlı eşleşme planı oluşturulur.',
  },
  {
    title: 'Turnuva Günleri',
    text: 'Grup maçları planlı akışta oynanır; saha, hakem ve masa koordinasyonu eş zamanlı yürütülür.',
  },
  {
    title: 'Final Etabı',
    text: 'Eleme turları sonrası final karşılaşmalarıyla branş şampiyonları belirlenir.',
  },
  {
    title: 'Sonuçlar',
    text: 'Ödül töreni, kapanış duyurusu ve dönemsel katılım analiz raporu tamamlanır.',
  },
]

const galleryItems: GalleryItem[] = [
  {
    src: image6,
    alt: 'Açılış seremonisinde takım korteji',
    caption: 'Açılış Seremonisi',
    note: 'Takım tanıtımı ve başlangıç anı',
    layout: 'panorama',
  },
  {
    src: image3,
    alt: 'Sahada mücadele anı',
    caption: 'Maç Temposu',
    note: 'Yüksek ritim ve rekabet',
    layout: 'tall',
  },
  {
    src: image2,
    alt: 'Skor masasında koordinasyon',
    caption: 'Skor Yönetimi',
    note: 'Anlık sonuç takibi',
    layout: 'square',
  },
  {
    src: heroImage,
    alt: 'Tribün ve saha birlikteliği',
    caption: 'Takım Ruhu',
    note: 'Katılım ve destek kültürü',
    layout: 'wide',
  },
  {
    src: image4,
    alt: 'Kapanış ve ödül anı',
    caption: 'Ödül Seremonisi',
    note: 'Final ve kutlama',
    layout: 'square',
  },
]

const pageRef = ref<HTMLElement | null>(null)
const heroStageRef = ref<HTMLElement | null>(null)
const activeGalleryIndex = ref<number | null>(null)

const activeGalleryItem = computed<GalleryItem | null>(() => {
  if (activeGalleryIndex.value === null) return null
  return galleryItems[activeGalleryIndex.value] ?? null
})

let revealObserver: IntersectionObserver | null = null
let scrollRaf = 0
let pointerRaf = 0
let pointerX = 0
let pointerY = 0

const updateHeroPointer = () => {
  const hero = heroStageRef.value
  if (!hero) return
  hero.style.setProperty('--pointer-x', `${pointerX}px`)
  hero.style.setProperty('--pointer-y', `${pointerY}px`)
}

const handleHeroPointerMove = (event: PointerEvent) => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const hero = heroStageRef.value
  if (!hero) return

  const rect = hero.getBoundingClientRect()
  const nx = (event.clientX - rect.left) / rect.width - 0.5
  const ny = (event.clientY - rect.top) / rect.height - 0.5

  pointerX = nx * 10
  pointerY = ny * 8
  cancelAnimationFrame(pointerRaf)
  pointerRaf = requestAnimationFrame(updateHeroPointer)
}

const handleHeroPointerLeave = () => {
  pointerX = 0
  pointerY = 0
  cancelAnimationFrame(pointerRaf)
  pointerRaf = requestAnimationFrame(updateHeroPointer)
}

const handleScrollParallax = () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const root = pageRef.value
  if (!root) return

  const shift = Math.min(18, window.scrollY * 0.03)
  cancelAnimationFrame(scrollRaf)
  scrollRaf = requestAnimationFrame(() => {
    root.style.setProperty('--hero-shift', `${shift.toFixed(2)}`)
  })
}

const openLightbox = (index: number) => {
  activeGalleryIndex.value = index
}

const closeLightbox = () => {
  activeGalleryIndex.value = null
}

const handleKeydown = (event: KeyboardEvent) => {
  if (activeGalleryIndex.value === null) return

  if (event.key === 'Escape') {
    closeLightbox()
    return
  }

  if (event.key === 'ArrowRight') {
    activeGalleryIndex.value = (activeGalleryIndex.value + 1) % galleryItems.length
    return
  }

  if (event.key === 'ArrowLeft') {
    activeGalleryIndex.value = (activeGalleryIndex.value - 1 + galleryItems.length) % galleryItems.length
  }
}

watch(activeGalleryIndex, (value) => {
  document.body.style.overflow = value === null ? '' : 'hidden'
})

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
  } else {
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
      { threshold: 0.14, rootMargin: '0px 0px -7% 0px' },
    )

    root.querySelectorAll<HTMLElement>('[data-reveal]').forEach((node) => revealObserver?.observe(node))
    root.querySelectorAll<HTMLElement>('[data-scene]').forEach((node) => revealObserver?.observe(node))
  }

  window.addEventListener('scroll', handleScrollParallax, { passive: true })
  window.addEventListener('keydown', handleKeydown)
  handleScrollParallax()
})

onBeforeUnmount(() => {
  revealObserver?.disconnect()
  window.removeEventListener('scroll', handleScrollParallax)
  window.removeEventListener('keydown', handleKeydown)
  cancelAnimationFrame(scrollRaf)
  cancelAnimationFrame(pointerRaf)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.experience-page {
  --motion-ease: cubic-bezier(0.22, 1, 0.36, 1);
  --hero-shift: 0;
  display: grid;
  gap: clamp(1.28rem, 2.1vw, 1.8rem);
  position: relative;
  isolation: isolate;
  padding-bottom: 0.4rem;
}

.experience-page::before {
  content: '';
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background:
    radial-gradient(circle at 12% -8%, rgba(98, 142, 236, 0.18), rgba(98, 142, 236, 0) 44%),
    radial-gradient(circle at 82% 74%, rgba(82, 112, 190, 0.12), rgba(82, 112, 190, 0) 46%),
    linear-gradient(160deg, rgba(5, 11, 24, 0.68), rgba(6, 14, 30, 0.22));
  opacity: 0;
  transition: opacity 900ms var(--motion-ease);
}

.experience-page.is-entered::before {
  opacity: 1;
}

.experience-ambient {
  position: absolute;
  inset: -12% -8% -10% -8%;
  pointer-events: none;
  z-index: 1;
}

.ambient-blob,
.ambient-beam {
  position: absolute;
  pointer-events: none;
}

.ambient-blob {
  border-radius: 50%;
  filter: blur(68px);
  opacity: 0.2;
  animation: ambientFloat 14s var(--motion-ease) infinite alternate;
}

.blob-a {
  width: min(520px, 42vw);
  height: min(340px, 30vw);
  left: -10%;
  top: -4%;
  background: radial-gradient(circle, rgba(96, 136, 224, 0.28), rgba(96, 136, 224, 0));
}

.blob-b {
  width: min(380px, 30vw);
  height: min(300px, 24vw);
  right: -9%;
  top: 26%;
  background: radial-gradient(circle, rgba(70, 98, 172, 0.24), rgba(70, 98, 172, 0));
  animation-duration: 17s;
}

.blob-c {
  width: min(420px, 34vw);
  height: min(280px, 23vw);
  left: 24%;
  bottom: 1%;
  background: radial-gradient(circle, rgba(94, 126, 210, 0.24), rgba(94, 126, 210, 0));
  animation-duration: 12s;
}

.ambient-beam {
  border-radius: 999px;
  filter: blur(34px);
  opacity: 0.12;
}

.beam-a {
  width: min(720px, 56vw);
  height: 140px;
  left: -20%;
  top: 7%;
  background: linear-gradient(105deg, rgba(140, 177, 248, 0.22), rgba(140, 177, 248, 0));
  animation: beamSweep 12s var(--motion-ease) infinite alternate;
}

.beam-b {
  width: min(560px, 45vw);
  height: 120px;
  right: -16%;
  top: 48%;
  background: linear-gradient(90deg, rgba(114, 149, 230, 0.2), rgba(114, 149, 230, 0));
  animation: beamSweep 15s var(--motion-ease) infinite alternate-reverse;
}

.ambient-grain {
  position: absolute;
  inset: 0;
  opacity: 0.018;
  background-image: radial-gradient(rgba(227, 236, 255, 0.28) 0.5px, transparent 0.5px);
  background-size: 4px 4px;
}

.experience-page > *:not(.experience-ambient) {
  position: relative;
  z-index: 3;
}

.reveal-item {
  opacity: 0;
  transform: translateY(28px) scale(0.986);
  transition:
    opacity 760ms cubic-bezier(0.16, 1, 0.3, 1),
    transform 760ms cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: var(--reveal-delay, 0ms);
}

.reveal-item.is-revealed {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.cinema-hero {
  padding-top: 0.1rem;
}

.hero-stage {
  margin: 0;
  min-height: clamp(430px, 66vh, 620px);
  border-color: rgba(196, 216, 252, 0.42);
  box-shadow:
    0 26px 46px rgba(3, 9, 21, 0.4),
    0 0 34px rgba(94, 138, 230, 0.26);
  padding: 0;
  overflow: hidden;
  position: relative;
  --pointer-x: 0px;
  --pointer-y: 0px;
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transform: translate3d(calc(var(--pointer-x) * 0.3), calc(var(--pointer-y) * 0.3 + (var(--hero-shift) * -1px)), 0)
    scale(1.1);
  transition: transform 360ms var(--motion-ease);
  animation: heroDrift 20s var(--motion-ease) infinite alternate;
}

.hero-vignette {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(5, 10, 20, 0.2) 0%, rgba(5, 10, 20, 0.72) 72%, rgba(5, 10, 20, 0.92) 100%),
    linear-gradient(110deg, rgba(7, 15, 31, 0.78) 0%, rgba(7, 15, 31, 0.24) 58%, rgba(7, 15, 31, 0.7) 100%);
}

.hero-content {
  position: absolute;
  left: clamp(1rem, 2vw, 1.8rem);
  right: clamp(1rem, 2vw, 1.8rem);
  bottom: clamp(1.1rem, 2.4vw, 1.8rem);
  display: grid;
  gap: 0.82rem;
  max-width: min(760px, 96%);
}

.hero-kicker,
.section-kicker {
  margin: 0;
  color: var(--accent-strong);
  font-size: 0.75rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  font-weight: 650;
}

.hero-content h1 {
  margin: 0;
  font-size: clamp(2.2rem, 5.2vw, 4rem);
  line-height: 1.03;
  letter-spacing: 0.012em;
  color: #f8fbff;
  text-shadow: 0 8px 24px rgba(3, 9, 21, 0.54);
}

.hero-content p {
  margin: 0;
  color: rgba(224, 236, 255, 0.93);
  line-height: 1.68;
  font-size: 0.98rem;
  max-width: 64ch;
}

.hero-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.status-badge,
.meta-pill {
  min-height: 28px;
  padding: 0 0.7rem;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  font-size: 0.72rem;
  font-weight: 620;
  line-height: 1;
}

.status-badge.soon {
  background: rgba(180, 163, 122, 0.18);
  color: #f1e0b9;
  border: 1px solid rgba(210, 190, 140, 0.45);
}

.meta-pill {
  border: 1px solid rgba(173, 197, 248, 0.34);
  color: #d7e4ff;
  background: rgba(145, 165, 201, 0.2);
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.cta-btn {
  width: fit-content;
  min-height: 44px;
  padding: 0 1.1rem;
  border-radius: 12px;
  border: 1px solid transparent;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.88rem;
  font-weight: 620;
  letter-spacing: 0.01em;
  transition:
    transform 0.24s var(--motion-ease),
    box-shadow 0.24s var(--motion-ease),
    background-color 0.24s var(--motion-ease),
    border-color 0.24s var(--motion-ease);
}

.cta-primary {
  color: #0b1830;
  background: linear-gradient(132deg, #f7faff 0%, #dfe9ff 48%, #c1d4fb 100%);
  border-color: rgba(229, 238, 255, 0.62);
  box-shadow:
    0 12px 28px rgba(119, 157, 235, 0.34),
    0 0 14px rgba(99, 143, 238, 0.2);
}

.cta-secondary {
  border-color: rgba(177, 197, 233, 0.4);
  color: #e8f1ff;
  background: rgba(173, 193, 226, 0.1);
}

.cta-btn:hover,
.cta-btn:focus-visible {
  transform: translateY(-2px) scale(1.015);
  box-shadow:
    0 16px 34px rgba(90, 130, 222, 0.42),
    0 0 22px rgba(99, 143, 238, 0.3);
}

.story-rail {
  display: grid;
  gap: 0.96rem;
}

.story-block {
  padding: clamp(1rem, 1.8vw, 1.25rem);
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
  gap: 1rem;
  align-items: stretch;
}

.story-block.reverse {
  grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
}

.story-block.reverse .story-media {
  order: 2;
}

.story-block.reverse .story-copy {
  order: 1;
}

.story-media {
  margin: 0;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(176, 198, 238, 0.34);
  min-height: 280px;
}

.story-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 420ms var(--motion-ease);
}

.story-block:hover .story-media img {
  transform: scale(1.05);
}

.story-copy {
  display: grid;
  align-content: center;
  gap: 0.58rem;
}

.story-label {
  margin: 0;
  font-size: 0.76rem;
  letter-spacing: 0.13em;
  text-transform: uppercase;
  color: rgba(178, 202, 245, 0.9);
  font-weight: 650;
}

.story-copy h2 {
  margin: 0;
  font-size: clamp(1.35rem, 2.4vw, 1.85rem);
  line-height: 1.2;
  color: #f3f8ff;
}

.story-copy p {
  margin: 0;
  color: rgba(201, 216, 241, 0.92);
  line-height: 1.7;
  font-size: 0.94rem;
}

.journey-section {
  display: grid;
  gap: 1rem;
  padding: clamp(1.18rem, 2vw, 1.5rem);
}

.section-head {
  display: grid;
  gap: 0.42rem;
}

.section-head h2 {
  margin: 0;
  font-size: clamp(1.45rem, 2.7vw, 2.02rem);
  line-height: 1.12;
  color: #f2f7ff;
}

.section-head p {
  margin: 0;
  color: rgba(201, 216, 241, 0.9);
  line-height: 1.66;
  font-size: 0.95rem;
}

.journey-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.82rem;
  position: relative;
}

.journey-list::before {
  content: '';
  position: absolute;
  left: 18px;
  top: 14px;
  bottom: 14px;
  width: 2px;
  border-radius: 999px;
  background: linear-gradient(180deg, rgba(157, 188, 245, 0.9), rgba(90, 126, 216, 0.18));
  box-shadow: 0 0 12px rgba(101, 140, 224, 0.34);
}

.journey-step {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 0.75rem;
  align-items: start;
}

.step-node {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.72rem;
  font-weight: 700;
  color: #ecf4ff;
  border: 1px solid rgba(176, 198, 238, 0.5);
  background: linear-gradient(165deg, rgba(96, 132, 210, 0.9), rgba(68, 102, 176, 0.7));
  box-shadow:
    0 8px 18px rgba(6, 14, 30, 0.34),
    0 0 16px rgba(102, 145, 238, 0.3);
  position: relative;
  z-index: 2;
}

.step-copy {
  border: 1px solid rgba(176, 198, 238, 0.28);
  border-radius: 14px;
  padding: 0.8rem 0.9rem;
  background: linear-gradient(178deg, rgba(21, 37, 62, 0.78), rgba(15, 30, 56, 0.84));
  transition:
    transform 260ms var(--motion-ease),
    border-color 260ms var(--motion-ease),
    box-shadow 260ms var(--motion-ease);
}

.step-copy:hover {
  transform: translateY(-3px);
  border-color: rgba(202, 220, 252, 0.6);
  box-shadow:
    0 16px 30px rgba(4, 10, 22, 0.28),
    0 0 20px rgba(73, 116, 216, 0.24);
}

.step-copy h3 {
  margin: 0;
  font-size: 1.01rem;
  color: #eef5ff;
}

.step-copy p {
  margin: 0.44rem 0 0;
  color: rgba(195, 210, 236, 0.9);
  line-height: 1.62;
  font-size: 0.88rem;
}

.gallery-section {
  display: grid;
  gap: 0.95rem;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 0.74rem;
}

.gallery-tile {
  position: relative;
  margin: 0;
  padding: 0;
  border: 1px solid rgba(176, 198, 238, 0.3);
  border-radius: 14px;
  overflow: hidden;
  cursor: pointer;
  background: rgba(16, 30, 54, 0.8);
  text-align: left;
  transition:
    transform 280ms var(--motion-ease),
    border-color 280ms var(--motion-ease),
    box-shadow 280ms var(--motion-ease);
}

.gallery-tile img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 360ms var(--motion-ease);
}

.gallery-tile:hover {
  transform: translateY(-5px) scale(1.01);
  border-color: rgba(204, 221, 252, 0.68);
  box-shadow:
    0 20px 34px rgba(4, 10, 22, 0.34),
    0 0 24px rgba(73, 116, 216, 0.28);
}

.gallery-tile:hover img {
  transform: scale(1.06);
}

.tile-overlay {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 0.72rem 0.8rem;
  display: grid;
  gap: 0.2rem;
  background: linear-gradient(180deg, rgba(8, 14, 25, 0.02), rgba(8, 14, 25, 0.86));
}

.tile-overlay strong {
  font-size: 0.84rem;
  color: #f2f8ff;
}

.tile-overlay small {
  font-size: 0.72rem;
  color: rgba(204, 219, 244, 0.86);
}

.layout-panorama {
  grid-column: span 8;
  aspect-ratio: 16 / 7;
}

.layout-tall {
  grid-column: span 4;
  grid-row: span 2;
  min-height: 300px;
}

.layout-square {
  grid-column: span 4;
  aspect-ratio: 1 / 1;
}

.layout-wide {
  grid-column: span 8;
  aspect-ratio: 16 / 8;
}

.lightbox {
  position: fixed;
  inset: 0;
  background: rgba(4, 9, 18, 0.86);
  backdrop-filter: blur(6px);
  z-index: 120;
  display: grid;
  place-items: center;
  padding: 1rem;
}

.lightbox-figure {
  margin: 0;
  width: min(980px, calc(100vw - 2rem));
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid rgba(182, 204, 244, 0.4);
  background: rgba(10, 19, 37, 0.94);
  box-shadow:
    0 28px 54px rgba(3, 8, 18, 0.64),
    0 0 28px rgba(88, 127, 221, 0.24);
}

.lightbox-figure img {
  display: block;
  width: 100%;
  max-height: 72vh;
  object-fit: cover;
}

.lightbox-figure figcaption {
  padding: 0.9rem 1rem;
  display: grid;
  gap: 0.24rem;
}

.lightbox-figure strong {
  color: #f3f8ff;
  font-size: 0.96rem;
}

.lightbox-figure span {
  color: rgba(205, 220, 244, 0.9);
  font-size: 0.82rem;
}

.lightbox-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  min-height: 36px;
  padding: 0 0.8rem;
  border-radius: 10px;
  border: 1px solid rgba(180, 199, 236, 0.44);
  background: rgba(15, 30, 56, 0.84);
  color: #eaf2ff;
  cursor: pointer;
}

.lightbox-fade-enter-active,
.lightbox-fade-leave-active {
  transition: opacity 260ms ease;
}

.lightbox-fade-enter-from,
.lightbox-fade-leave-to {
  opacity: 0;
}

.final-cta {
  display: grid;
  gap: 0.72rem;
  padding: clamp(1.3rem, 2vw, 1.9rem);
  background:
    radial-gradient(circle at 18% 16%, rgba(102, 143, 236, 0.3), transparent 44%),
    radial-gradient(circle at 84% 80%, rgba(90, 123, 220, 0.2), transparent 48%),
    linear-gradient(170deg, rgba(24, 44, 80, 0.94), rgba(16, 30, 58, 0.94));
  border-color: rgba(192, 212, 252, 0.34);
  box-shadow:
    0 24px 42px rgba(4, 10, 22, 0.32),
    0 0 30px rgba(82, 126, 224, 0.28);
}

.final-cta h2 {
  margin: 0;
  font-size: clamp(1.4rem, 2.8vw, 2rem);
  line-height: 1.12;
  color: #f8fbff;
}

.final-cta p {
  margin: 0;
  color: rgba(208, 221, 244, 0.92);
  line-height: 1.66;
  max-width: 60ch;
}

@keyframes ambientFloat {
  0% {
    transform: translate3d(0, 0, 0) scale(1);
  }
  100% {
    transform: translate3d(12px, -9px, 0) scale(1.05);
  }
}

@keyframes beamSweep {
  0% {
    transform: translate3d(-12px, 6px, 0);
  }
  100% {
    transform: translate3d(18px, -8px, 0);
  }
}

@keyframes heroDrift {
  0% {
    transform: translate3d(calc(var(--pointer-x) * 0.3), calc(var(--pointer-y) * 0.3 + (var(--hero-shift) * -1px)), 0)
      scale(1.08);
  }
  100% {
    transform: translate3d(calc(var(--pointer-x) * 0.3), calc(var(--pointer-y) * 0.3 + (var(--hero-shift) * -1px)), 0)
      scale(1.13);
  }
}

@media (max-width: 1040px) {
  .story-block,
  .story-block.reverse {
    grid-template-columns: 1fr;
  }

  .story-block.reverse .story-media,
  .story-block.reverse .story-copy {
    order: initial;
  }

  .gallery-grid {
    grid-template-columns: repeat(8, minmax(0, 1fr));
  }

  .layout-panorama,
  .layout-wide {
    grid-column: span 8;
  }

  .layout-tall,
  .layout-square {
    grid-column: span 4;
  }
}

@media (max-width: 760px) {
  .experience-page {
    gap: 1rem;
  }

  .hero-stage {
    min-height: 440px;
  }

  .hero-content h1 {
    font-size: clamp(1.82rem, 8vw, 2.5rem);
  }

  .hero-actions {
    flex-direction: column;
  }

  .cta-btn {
    width: 100%;
  }

  .gallery-grid {
    grid-template-columns: 1fr;
  }

  .layout-panorama,
  .layout-wide,
  .layout-tall,
  .layout-square {
    grid-column: span 1;
    aspect-ratio: 4 / 3;
    min-height: 0;
  }

  .journey-list::before {
    left: 16px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .experience-page::before,
  .experience-ambient,
  .ambient-blob,
  .ambient-beam,
  .hero-image,
  .reveal-item,
  .gallery-tile,
  .story-media img,
  .cta-btn,
  .step-copy {
    animation: none !important;
    transition: none !important;
    transform: none !important;
    opacity: 1 !important;
  }
}
</style>

