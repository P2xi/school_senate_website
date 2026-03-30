<template>
  <div ref="pageRef" class="about-page page-stack">
    <div class="ambient-layer" aria-hidden="true">
      <span class="ambient-blob blob-a" />
      <span class="ambient-blob blob-b" />
      <span class="ambient-blob blob-c" />
    </div>

    <section class="page-hero page-section" data-scene>
      <div class="hero-copy">
        <p class="hero-tag reveal-item" data-reveal>Eskişehir MBA Senatosu</p>
        <h1 class="hero-title reveal-item" data-reveal style="--reveal-delay: 80ms">Hakkımızda</h1>
        <p class="hero-subtitle reveal-item" data-reveal style="--reveal-delay: 160ms">
          Senatomuzun amacı; öğrenci sesini görünür kılmak ve kurumsal okul kültürünü güçlendirmektir.
        </p>
      </div>
      <figure class="hero-media reveal-item" data-reveal style="--reveal-delay: 220ms">
        <img :src="image1" alt="Eskişehir MBA Senatosu uluslararası simülasyon etkinliğinden kare" loading="eager" />
      </figure>
    </section>

    <section class="principles-section page-section" data-scene>
      <header class="section-head reveal-item" data-reveal>
        <h2 class="page-title">Temel İlkelerimiz</h2>
      </header>
      <div class="principles-grid">
        <article
          v-for="(item, index) in principles"
          :key="item.title"
          class="info-card reveal-item"
          data-reveal
          :style="{ '--reveal-delay': `${index * 90 + 80}ms` }"
        >
          <h3>{{ item.title }}</h3>
          <p>{{ item.text }}</p>
        </article>
      </div>
    </section>

    <section class="mini-gallery" aria-label="Senato etkinlik galerisi" data-scene>
      <article
        v-for="(item, index) in miniGallery"
        :key="item.alt"
        class="gallery-card reveal-item"
        data-reveal
        :style="{ '--reveal-delay': `${index * 80 + 70}ms` }"
      >
        <img :src="item.src" :alt="item.alt" loading="lazy" decoding="async" />
      </article>
    </section>

    <section class="mission-vision-grid" data-scene>
      <article class="page-section feature-card reveal-item" data-reveal>
        <h2 class="page-title">Misyon</h2>
        <p class="page-subtitle">
          Öğrencilerin görüşlerini etkili biçimde yönetime taşımak, katılımcı karar süreçlerini desteklemek
          ve okul yaşamını daha nitelikli hale getirmek için çalışıyoruz.
        </p>
      </article>

      <article class="page-section feature-card reveal-item" data-reveal style="--reveal-delay: 120ms">
        <h2 class="page-title">Vizyon</h2>
        <p class="page-subtitle">
          Eskişehir MBA Senatosu; akademik ve sosyal gelişimi birlikte güçlendiren, örnek gösterilen,
          çağdaş ve sürdürülebilir bir öğrenci temsil modeli olmayı hedefler.
        </p>
      </article>
    </section>

    <section class="actions-section page-section" data-scene>
      <header class="section-head reveal-item" data-reveal>
        <h2 class="page-title">Ne Yapıyoruz?</h2>
      </header>
      <div class="actions-grid">
        <article
          v-for="(item, index) in activities"
          :key="item.title"
          class="info-card action-card reveal-item"
          data-reveal
          :style="{ '--reveal-delay': `${index * 90 + 90}ms` }"
        >
          <div class="action-media">
            <img :src="item.image" :alt="item.alt" loading="lazy" decoding="async" />
          </div>
          <h3>{{ item.title }}</h3>
          <p>{{ item.text }}</p>
        </article>
      </div>
    </section>

    <section class="about-cta page-section reveal-item" data-reveal data-scene :style="{ '--cta-bg': `url(${image4})` }">
      <h2>Senatomuzu daha yakından tanımak ister misin?</h2>
      <p>Projelerimizi inceleyebilir, ekibimizi görebilir veya bizimle iletişime geçebilirsin.</p>
      <div class="cta-actions">
        <RouterLink class="cta-btn cta-primary" to="/projeler">Projeleri Gör</RouterLink>
        <RouterLink class="cta-btn cta-secondary" to="/iletisim">İletişime Geç</RouterLink>
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

const principles = [
  {
    title: 'Öğrenci Temsili',
    text: 'Açık, erişilebilir ve katılımcı temsil anlayışı',
  },
  {
    title: 'Ortak Akıl',
    text: 'Öğrenci, yönetim ve topluluklar arasında yapıcı koordinasyon',
  },
  {
    title: 'Sürdürülebilirlik',
    text: 'Geçici değil, kalıcı etki üreten proje ve süreç yaklaşımı',
  },
]

const activities = [
  {
    title: 'Proje Geliştirme',
    text: 'Okul yaşamına katkı sağlayan sosyal, akademik ve organizasyonel projeler geliştiriyoruz.',
    image: image5,
    alt: 'Proje geliştirme toplantısından görüntü',
  },
  {
    title: 'Temsil ve İletişim',
    text: 'Öğrenci taleplerini görünür kılan, düzenli ve yapıcı iletişim süreçleri yürütüyoruz.',
    image: image2,
    alt: 'Temsil ve iletişim sürecinden görüntü',
  },
  {
    title: 'Katılım Kültürü',
    text: 'Öğrencilerin karar süreçlerine daha aktif katılımını destekleyen zemin oluşturuyoruz.',
    image: image3,
    alt: 'Öğrenci katılımı etkinliğinden görüntü',
  },
]

const miniGallery = [
  { src: image6, alt: 'Genel kurul anından fotoğraf' },
  { src: image1, alt: 'Uluslararası simülasyon töreninden fotoğraf' },
  { src: image4, alt: 'Kurumsal etkinlik sahnesinden fotoğraf' },
  { src: image5, alt: 'Topluluk buluşmasından fotoğraf' },
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
.about-page {
  --motion-ease: cubic-bezier(0.22, 1, 0.36, 1);
  display: grid;
  gap: 1.28rem;
  position: relative;
  isolation: isolate;
}

.ambient-layer {
  position: absolute;
  inset: -8% -6% -8% -6%;
  pointer-events: none;
  z-index: 0;
}

.ambient-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(56px);
  opacity: 0.34;
  animation: ambientDrift 13s var(--motion-ease) infinite alternate;
}

.blob-a {
  width: min(380px, 34vw);
  height: min(300px, 28vw);
  left: -8%;
  top: 2%;
  background: radial-gradient(circle, rgba(76, 124, 228, 0.28), rgba(76, 124, 228, 0));
}

.blob-b {
  width: min(320px, 28vw);
  height: min(260px, 22vw);
  right: -6%;
  top: 36%;
  background: radial-gradient(circle, rgba(96, 106, 198, 0.24), rgba(96, 106, 198, 0));
  animation-duration: 15s;
}

.blob-c {
  width: min(360px, 30vw);
  height: min(280px, 24vw);
  left: 28%;
  bottom: 4%;
  background: radial-gradient(circle, rgba(62, 108, 208, 0.2), rgba(62, 108, 208, 0));
  animation-duration: 12s;
}

.about-page > *:not(.ambient-layer) {
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
  position: relative;
  overflow: hidden;
  padding: clamp(1.38rem, 2vw, 1.95rem);
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 0.95fr);
  gap: 1rem;
  align-items: center;
  animation: surfaceBreatheCalm 14s var(--motion-ease) infinite;
}

.page-hero::before {
  content: '';
  position: absolute;
  left: -5%;
  top: -20%;
  width: min(460px, 42vw);
  height: min(320px, 28vw);
  border-radius: 50%;
  background: radial-gradient(circle, rgba(116, 153, 248, 0.22), rgba(116, 153, 248, 0));
  filter: blur(34px);
  pointer-events: none;
  animation: haloBreathe 8.5s var(--motion-ease) infinite;
}

.page-hero::after {
  content: '';
  position: absolute;
  width: min(360px, 45vw);
  height: min(360px, 45vw);
  border-radius: 50%;
  right: -80px;
  top: -120px;
  background: radial-gradient(circle, rgba(116, 153, 248, 0.24), rgba(116, 153, 248, 0));
  pointer-events: none;
}

.hero-tag {
  margin: 0;
  color: var(--accent-strong);
  font-size: 0.78rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  font-weight: 650;
}

.hero-copy {
  display: grid;
  align-content: start;
}

.hero-title {
  margin: 0.9rem 0 0.62rem;
  font-size: clamp(2rem, 4.8vw, 3.25rem);
  line-height: 1.06;
  letter-spacing: -0.015em;
  color: #f5f8ff;
}

.hero-subtitle {
  margin: 0;
  max-width: 66ch;
  color: rgba(221, 233, 255, 0.9);
  line-height: 1.68;
}

.hero-media {
  margin: 0;
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid rgba(175, 193, 222, 0.28);
  background: #0c182d;
  box-shadow:
    0 18px 34px rgba(4, 10, 22, 0.28),
    0 0 0 1px rgba(172, 200, 255, 0.2),
    0 0 24px rgba(74, 118, 224, 0.16);
  transition:
    transform 320ms var(--motion-ease),
    box-shadow 320ms var(--motion-ease);
}

.hero-media:hover {
  transform: translateY(-4px);
  box-shadow:
    0 22px 38px rgba(4, 10, 22, 0.32),
    0 0 0 1px rgba(188, 214, 255, 0.28),
    0 0 30px rgba(88, 132, 232, 0.26);
}

.hero-media img {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 10;
  object-fit: cover;
  object-position: center 36%;
  transition: transform 340ms var(--motion-ease);
}

.hero-media:hover img {
  transform: scale(1.03);
}

.section-head {
  display: grid;
  gap: 0.4rem;
  margin-bottom: 0.84rem;
  position: relative;
}

.section-head::after {
  content: '';
  width: 132px;
  height: 2px;
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(157, 188, 245, 0.9), rgba(157, 188, 245, 0));
  box-shadow: 0 0 12px rgba(101, 140, 224, 0.32);
  animation: accentPulse 10s var(--motion-ease) infinite;
  opacity: 0;
  transform: scaleX(0.6);
  transform-origin: left center;
  transition: opacity 640ms ease, transform 640ms ease;
}

[data-scene].is-scene-revealed .section-head::after {
  opacity: 1;
  transform: scaleX(1);
}

.page-title {
  margin: 0;
  font-size: clamp(1.42rem, 2.9vw, 2rem);
  line-height: 1.16;
  letter-spacing: -0.01em;
  color: #f2f7ff;
}

.page-subtitle {
  margin: 0;
  color: rgba(201, 216, 241, 0.9);
  line-height: 1.7;
  font-size: 0.97rem;
}

.principles-grid,
.actions-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.92rem;
}

.mini-gallery {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.92rem;
}

.gallery-card {
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid var(--border-soft);
  background: rgba(16, 30, 54, 0.85);
  box-shadow: inset 0 1px 0 rgba(198, 214, 248, 0.05);
  transition:
    transform 0.28s var(--motion-ease),
    box-shadow 0.28s var(--motion-ease),
    border-color 0.28s var(--motion-ease);
}

.gallery-card img {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  transition: transform 0.3s var(--motion-ease);
}

.gallery-card:hover {
  transform: translateY(-4px);
  border-color: rgba(193, 214, 252, 0.5);
  box-shadow:
    0 16px 28px rgba(4, 10, 22, 0.24),
    0 0 18px rgba(74, 118, 224, 0.18);
}

.gallery-card:hover img {
  transform: scale(1.04);
}

.info-card {
  border: 1px solid var(--border-soft);
  border-radius: 18px;
  background: linear-gradient(180deg, rgba(21, 37, 62, 0.82), rgba(16, 30, 54, 0.82));
  padding: 1.08rem;
  box-shadow: inset 0 1px 0 rgba(198, 214, 248, 0.06);
  display: grid;
  gap: 0.52rem;
  transition:
    transform 260ms var(--motion-ease),
    border-color 260ms var(--motion-ease),
    box-shadow 260ms var(--motion-ease);
}

.info-card:hover {
  transform: translateY(-5px) scale(1.01);
  border-color: rgba(194, 214, 252, 0.46);
  box-shadow:
    0 14px 26px rgba(4, 10, 22, 0.24),
    0 0 16px rgba(72, 114, 214, 0.14);
}

.action-card {
  gap: 0.64rem;
}

.action-media {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(175, 193, 222, 0.24);
}

.action-media img {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  opacity: 0.9;
  transition: transform 300ms var(--motion-ease);
}

.action-card:hover .action-media img {
  transform: scale(1.03);
}

.info-card h3 {
  margin: 0;
  font-size: 1.02rem;
  line-height: 1.34;
  color: #edf4ff;
}

.info-card p {
  margin: 0;
  color: rgba(195, 210, 236, 0.88);
  font-size: 0.9rem;
  line-height: 1.62;
}

.mission-vision-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.feature-card {
  display: grid;
  gap: 0.66rem;
  padding: clamp(1.28rem, 1.8vw, 1.7rem);
  border-radius: 18px;
  transition:
    transform 260ms var(--motion-ease),
    border-color 260ms var(--motion-ease),
    box-shadow 260ms var(--motion-ease);
}

.mission-vision-grid .feature-card:nth-child(1) {
  animation: surfaceBreatheCalm 15s var(--motion-ease) infinite;
}

.feature-card:hover {
  transform: translateY(-4px);
  border-color: rgba(194, 214, 252, 0.44);
  box-shadow:
    0 14px 24px rgba(4, 10, 22, 0.22),
    0 0 14px rgba(74, 118, 224, 0.12);
}

.actions-section {
  display: grid;
  gap: 0.22rem;
}

.about-cta {
  display: grid;
  gap: 0.72rem;
  padding: clamp(1.25rem, 1.9vw, 1.8rem);
  position: relative;
  isolation: isolate;
  background:
    linear-gradient(
      to bottom,
      rgba(10, 20, 40, 0.85) 0%,
      rgba(10, 20, 40, 0.5) 40%,
      rgba(10, 20, 40, 0.9) 100%
    ),
    var(--cta-bg) center 42% / cover no-repeat;
  border-color: rgba(192, 212, 252, 0.3);
  animation: surfaceBreatheCalm 16s var(--motion-ease) infinite;
}

.about-cta::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(circle at 16% 20%, rgba(86, 126, 222, 0.2), rgba(86, 126, 222, 0) 46%);
  pointer-events: none;
  z-index: -1;
  animation: haloBreathe 9s var(--motion-ease) infinite;
}

.about-cta h2 {
  margin: 0;
  font-size: clamp(1.3rem, 2.4vw, 1.72rem);
  line-height: 1.2;
  letter-spacing: -0.01em;
  color: #f5f9ff;
}

.about-cta p {
  margin: 0;
  color: rgba(208, 221, 244, 0.9);
  line-height: 1.66;
}

.cta-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.62rem;
  margin-top: 0.2rem;
}

.cta-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0 1.1rem;
  border-radius: 12px;
  text-decoration: none;
  font-size: 0.88rem;
  font-weight: 620;
  letter-spacing: 0.008em;
  border: 1px solid transparent;
  transition:
    transform 0.24s var(--motion-ease),
    box-shadow 0.24s var(--motion-ease),
    background-color 0.2s ease;
}

.cta-primary {
  color: #0b1830;
  background: linear-gradient(132deg, #f7faff 0%, #dfe9ff 48%, #c1d4fb 100%);
  border-color: rgba(229, 238, 255, 0.62);
  box-shadow: 0 10px 24px rgba(119, 157, 235, 0.28);
}

.cta-secondary {
  border-color: rgba(177, 197, 233, 0.4);
  color: #e8f1ff;
  background: rgba(173, 193, 226, 0.08);
}

.cta-btn:hover,
.cta-btn:focus-visible {
  transform: translateY(-1px) scale(1.015);
}

.cta-primary:hover,
.cta-primary:focus-visible {
  box-shadow:
    0 16px 30px rgba(90, 130, 222, 0.36),
    0 0 20px rgba(99, 143, 238, 0.24);
}

.cta-secondary:hover,
.cta-secondary:focus-visible {
  box-shadow:
    0 12px 24px rgba(56, 90, 162, 0.28),
    0 0 14px rgba(87, 127, 217, 0.2);
}

.cta-btn:active {
  transform: scale(0.985);
  animation: buttonGlowPulse 220ms var(--motion-ease);
}

@keyframes ambientDrift {
  0% { transform: translate3d(0, 0, 0) scale(1); opacity: 0.28; }
  100% { transform: translate3d(10px, -8px, 0) scale(1.05); opacity: 0.4; }
}

@keyframes haloBreathe {
  0%, 100% { opacity: 0.58; transform: scale(1); }
  50% { opacity: 0.86; transform: scale(1.04); }
}

@keyframes accentPulse {
  0%, 100% { opacity: 0.78; transform: scaleX(1); }
  50% { opacity: 1; transform: scaleX(1.05); }
}

@keyframes buttonGlowPulse {
  0% { box-shadow: 0 0 0 rgba(99, 143, 238, 0); }
  50% { box-shadow: 0 0 16px rgba(99, 143, 238, 0.3); }
  100% { box-shadow: 0 0 0 rgba(99, 143, 238, 0); }
}

@keyframes surfaceBreatheCalm {
  0%, 100% {
    box-shadow:
      0 18px 34px rgba(4, 10, 22, 0.26),
      0 0 22px rgba(78, 121, 223, 0.1);
  }
  50% {
    box-shadow:
      0 20px 36px rgba(4, 10, 22, 0.28),
      0 0 28px rgba(92, 136, 233, 0.16);
  }
}

@media (max-width: 980px) {
  .page-hero {
    grid-template-columns: 1fr;
  }

  .hero-media img {
    min-height: 280px;
  }

  .mini-gallery {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .principles-grid,
  .actions-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 760px) {
  .about-page {
    gap: 1.04rem;
  }

  .mission-vision-grid,
  .mini-gallery,
  .principles-grid,
  .actions-grid {
    grid-template-columns: 1fr;
  }

  .cta-actions {
    flex-direction: column;
  }

  .cta-btn {
    width: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .page-hero,
  .about-cta,
  .ambient-layer,
  .ambient-blob,
  .page-hero::before,
  .page-hero::after,
  .about-cta::before,
  .section-head::after,
  .reveal-item,
  .info-card,
  .feature-card,
  .gallery-card,
  .cta-btn,
  .hero-media,
  .hero-media img,
  .action-media img {
    animation: none !important;
    transition: none !important;
    transform: none !important;
    opacity: 1 !important;
  }
}
</style>




