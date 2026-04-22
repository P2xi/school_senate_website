<template>
  <div ref="pageRef" class="eu-page">
    <div class="ambient" aria-hidden="true">
      <span class="glow glow-a" />
      <span class="glow glow-b" />
      <span class="grid" />
    </div>

    <section ref="heroRef" class="hero" data-scene>
      <img
        class="hero-image"
        :src="heroImage"
        alt="Avrupa Birliği Simülasyonu hero görseli"
        loading="eager"
      />
      <span class="hero-overlay" aria-hidden="true" />
      <span class="hero-reflection" aria-hidden="true" />

      <div class="hero-content content-shell">
        <p class="hero-kicker reveal-item" data-reveal>
          Eskişehir MBA Senatosu / Proje Detayı
        </p>
        <h1
          class="hero-title reveal-item"
          data-reveal
          style="--reveal-delay: 60ms"
        >
          Avrupa Birliği Simülasyonu
        </h1>
        <p
          class="hero-subtitle reveal-item"
          data-reveal
          style="--reveal-delay: 120ms"
        >
          Müzakere, temsil ve karar üretim disiplinini tek bir kurumsal akışta
          deneyimleyin.
        </p>

        <div
          class="hero-actions reveal-item"
          data-reveal
          style="--reveal-delay: 180ms"
        >
          <RouterLink class="btn btn-primary" to="/iletisim"
            >Başvuru Yap</RouterLink
          >
          <RouterLink class="btn btn-secondary" to="/duyurular"
            >Takvimi Gör</RouterLink
          >
        </div>
        <p
          class="hero-proof reveal-item"
          data-reveal
          style="--reveal-delay: 220ms"
        >
          Sınırlı kontenjan • Seçmeli katılım • Sertifikalı program
        </p>
      </div>
    </section>

    <section class="metrics-section content-shell" data-scene>
      <SectionHeader
        class="reveal-item"
        data-reveal
        kicker="Program Özeti"
        title="Ölçülebilir ve Kurumsal Simülasyon Çerçevesi"
        intro="Simülasyon; hazırlık, komite müzakeresi ve karar oturumunu tek bir operasyonel modelde bir araya getirir."
      />

      <div class="metrics-grid">
        <MetricCard
          v-for="(metric, index) in metrics"
          :key="metric.label"
          class="reveal-item"
          data-reveal
          :style="{ '--reveal-delay': `${index * 70 + 70}ms` }"
          :icon="metric.icon"
          :value="metric.value"
          :label="metric.label"
          :description="metric.description"
        />
      </div>
    </section>

    <section id="akis" class="timeline-section content-shell" data-scene>
      <SectionHeader
        class="reveal-item"
        data-reveal
        kicker="Case Study Akışı"
        title="Adım Adım Proje Akışı"
        intro="Her faz, delegelerin hazırlık düzeyini ve karar kalitesini artıracak şekilde ardışık bir öğrenme mimarisine bağlanır."
      />

      <span class="timeline-track" aria-hidden="true" />

      <div class="timeline-list">
        <TimelineStep
          v-for="(step, index) in timelineSteps"
          :key="step.title"
          class="reveal-item"
          data-reveal
          :style="{ '--reveal-delay': `${index * 95 + 90}ms` }"
          :step="String(index + 1).padStart(2, '0')"
          :title="step.title"
          :text="step.text"
          :detail="step.detail"
          :image="step.image"
          :alt="step.alt"
          :image-position="step.imagePosition"
          :reverse="index % 2 === 1"
        />
      </div>
    </section>

    <section class="showcase-section content-shell" data-scene>
      <div class="showcase-split">
        <div class="showcase-copy reveal-item" data-reveal>
          <p class="showcase-kicker">Kritik Aşama</p>
          <h2>Final Oturumunda Karar Mimarisinin Netleştiği An</h2>
          <p>
            Komite önerileri tek kurul altında birleştirilir; uzlaşı maddeleri
            ve karar başlıkları kurumsal bir protokol akışıyla nihai hale
            getirilir.
          </p>
        </div>

        <figure
          class="showcase-frame reveal-item"
          data-reveal
          style="--reveal-delay: 70ms"
        >
          <img
            :src="highlightImage"
            alt="Avrupa Birliği Simülasyonu karar oturumu"
            loading="lazy"
            decoding="async"
          />
          <span class="showcase-overlay" aria-hidden="true" />
          <figcaption class="showcase-caption">
            <p class="caption-kicker">Final Oturumu</p>
            <h3>Komite Çıktılarının Birleştiği Karar Anı</h3>
            <p>
              Karar paketi, oylama ve son değerlendirme ile tek bir final
              çerçevesinde tamamlanır.
            </p>
          </figcaption>
        </figure>
      </div>
    </section>

    <section class="impact-section content-shell" data-scene>
      <SectionHeader
        class="reveal-item"
        data-reveal
        kicker="Projenin Etkisi"
        title="Delegelerde Kalıcı Yetkinlik Dönüşümü"
        intro="Program çıktısı yalnızca etkinlik deneyimi değil; akademik, diplomatik ve kurumsal temsil becerilerinde ölçülebilir ilerlemedir."
      />

      <div class="impact-grid">
        <HighlightCard
          v-for="(item, index) in impactCards"
          :key="item.title"
          class="reveal-item"
          data-reveal
          :style="{ '--reveal-delay': `${index * 80 + 80}ms` }"
          :icon="item.icon"
          :title="item.title"
          :text="item.text"
        />
      </div>
    </section>

    <section
      class="final-section content-shell reveal-item"
      data-reveal
      data-scene
    >
      <CTASection
        kicker="Son Adım"
        title="Bir Sonraki Oturumda Delegasyonun Parçası Ol"
        text="Başvurunu tamamla, komite tercihini belirle ve Avrupa Birliği Simülasyonu'nun profesyonel karar süreçlerinde aktif rol al."
        primary-label="Başvuru Yap"
        primary-to="/iletisim"
        secondary-label="Takvimi İncele"
        secondary-to="/duyurular"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import abHero from "@/assets/ab/1-CeGeYkHV.jpeg";
import ab2 from "@/assets/ab/ab (2).png";
import ab3 from "@/assets/ab/ab (3).png";
import ab4 from "@/assets/ab/ab (4).png";
import ab5 from "@/assets/ab/ab (5).png";
import CTASection from "@/components/eu/CTASection.vue";
import HighlightCard from "@/components/eu/HighlightCard.vue";
import MetricCard from "@/components/eu/MetricCard.vue";
import SectionHeader from "@/components/eu/SectionHeader.vue";
import TimelineStep from "@/components/eu/TimelineStep.vue";

type TimelineItem = {
  title: string;
  text: string;
  detail: string;
  image: string;
  alt: string;
  imagePosition: string;
};

const heroImage = abHero;
const highlightImage = ab5;

const metrics = [
  {
    icon: "◎",
    value: "120+",
    label: "Katılımcı",
    description: "Komite ve gözlemci dahil güçlü delegasyon",
  },
  {
    icon: "◌",
    value: "8",
    label: "Oturum",
    description: "Hazırlık, komite ve genel kurul akışı",
  },
  {
    icon: "◇",
    value: "3 Hafta",
    label: "Hazırlık Süreci",
    description: "Rol eşleştirme ve gündem hazırlık fazı",
  },
  {
    icon: "◈",
    value: "12",
    label: "Karar Başlığı",
    description: "Final oturumuna taşınan politika başlıkları",
  },
];

const timelineSteps: TimelineItem[] = [
  {
    title: "Hazırlık ve Delegasyon Kurulumu",
    text: "Delegeler komite rollerine yerleştirilir, konu setleri paylaşılır ve müzakere usulleri ortak bir çerçevede netleştirilir.",
    detail: "Faz 1 · Ön Hazırlık",
    image: ab2,
    alt: "Hazırlık oturumunda delegeler",
    imagePosition: "45% 20%",
  },
  {
    title: "Müzakere Maratonu",
    text: "Taslak metinler değerlendirilir, değişiklik önerileri tartışılır ve uzlaşı alanları veri destekli argümanlarla daraltılır.",
    detail: "Faz 2 · Süreç",
    image: ab3,
    alt: "Müzakereler sırasında delegeler",
    imagePosition: "52% 40%",
  },
  {
    title: "Genel Kurul ve Nihai Karar Oturumu",
    text: "Komitelerden gelen çıktılar genel kurulda savunulur; oylama ve karar protokolüyle proje kapanış metni oluşturulur.",
    detail: "Faz 3 · Final Oturumu",
    image: ab4,
    alt: "Genel kurul konuşma anı",
    imagePosition: "50% 20%",
  },
];

const impactCards = [
  {
    icon: "◍",
    title: "Eleştirel düşünme",
    text: "Delegeler, çok kaynaklı veriyi yorumlayıp savlarını kanıta dayalı şekilde inşa eder.",
  },
  {
    icon: "◔",
    title: "Diplomatik tartışma",
    text: "Farklı pozisyonlar arasında uzlaşı arayan yapılandırılmış müzakere refleksi güçlenir.",
  },
  {
    icon: "◒",
    title: "Kurumsal temsil",
    text: "Katılımcılar, resmî oturum dili ve temsil sorumluluğu ile profesyonel görünürlük kazanır.",
  },
];

const pageRef = ref<HTMLElement | null>(null);
const heroRef = ref<HTMLElement | null>(null);

let revealObserver: IntersectionObserver | null = null;
let scrollRaf = 0;

const handleScrollEffects = () => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const root = pageRef.value;
  const hero = heroRef.value;
  if (!root || !hero) return;

  const scrollY = window.scrollY;
  const heroShift = Math.min(22, scrollY * 0.024);
  const glowShift = Math.min(16, scrollY * 0.015);

  cancelAnimationFrame(scrollRaf);
  scrollRaf = requestAnimationFrame(() => {
    root.style.setProperty("--hero-shift", `${heroShift.toFixed(2)}px`);
    root.style.setProperty("--glow-shift", `${glowShift.toFixed(2)}px`);
  });
};

onMounted(async () => {
  const root = pageRef.value;
  if (!root) return;

  await nextTick();
  requestAnimationFrame(() => {
    root.classList.add("is-entered");
  });

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    root
      .querySelectorAll<HTMLElement>("[data-reveal]")
      .forEach((node) => node.classList.add("is-revealed"));
    root
      .querySelectorAll<HTMLElement>("[data-scene]")
      .forEach((node) => node.classList.add("is-scene-revealed"));
  } else {
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-revealed");
          if ((entry.target as HTMLElement).dataset.scene !== undefined) {
            entry.target.classList.add("is-scene-revealed");
          }
          revealObserver?.unobserve(entry.target);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );

    root
      .querySelectorAll<HTMLElement>("[data-reveal]")
      .forEach((node) => revealObserver?.observe(node));
    root
      .querySelectorAll<HTMLElement>("[data-scene]")
      .forEach((node) => revealObserver?.observe(node));
  }

  window.addEventListener("scroll", handleScrollEffects, { passive: true });
  handleScrollEffects();
});

onBeforeUnmount(() => {
  revealObserver?.disconnect();
  window.removeEventListener("scroll", handleScrollEffects);
  cancelAnimationFrame(scrollRaf);
});
</script>

<style scoped>
.eu-page {
  --font-display: "Sora", "Avenir Next", "Segoe UI", sans-serif;
  --font-body: "Manrope", "Avenir Next", "Segoe UI", sans-serif;
  --motion-ease: cubic-bezier(0.22, 1, 0.36, 1);
  --hero-shift: 0px;
  --glow-shift: 0px;
  --content-max: min(1280px, calc(100% - 2.8rem));
  --radius-lg: 24px;
  --radius-md: 18px;
  --border-soft: 1px solid rgba(180, 204, 248, 0.2);
  --text-primary: #f4f8ff;
  --text-secondary: rgba(203, 220, 245, 0.9);
  --section-gap: clamp(5rem, 8vw, 7rem);
  font-family: var(--font-body);
  display: grid;
  gap: var(--section-gap);
  position: relative;
  isolation: isolate;
  overflow-x: clip;
  padding-bottom: clamp(6rem, 9vw, 8rem);
}

.eu-page::before {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  background:
    radial-gradient(
      circle at 14% -8%,
      rgba(109, 145, 226, 0.24),
      rgba(109, 145, 226, 0) 38%
    ),
    radial-gradient(
      circle at 90% 74%,
      rgba(78, 110, 186, 0.14),
      rgba(78, 110, 186, 0) 46%
    ),
    linear-gradient(165deg, rgba(4, 10, 22, 0.8), rgba(7, 14, 29, 0.4));
  opacity: 0;
  transition: opacity 900ms var(--motion-ease);
}

.eu-page.is-entered::before {
  opacity: 1;
}

.eu-page > *:not(.ambient) {
  position: relative;
  z-index: 3;
}

.ambient {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  overflow: clip;
}

.glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(70px);
  opacity: 0.2;
  animation: floatGlow 16s var(--motion-ease) infinite alternate;
}

.glow-a {
  width: min(560px, 44vw);
  height: min(320px, 30vw);
  top: 2%;
  left: -12%;
  background: radial-gradient(
    circle,
    rgba(116, 154, 237, 0.36),
    rgba(116, 154, 237, 0)
  );
}

.glow-b {
  width: min(460px, 38vw);
  height: min(300px, 26vw);
  right: -8%;
  top: 42%;
  background: radial-gradient(
    circle,
    rgba(83, 116, 196, 0.3),
    rgba(83, 116, 196, 0)
  );
  animation-duration: 18s;
}

.grid {
  position: absolute;
  inset: 0;
  opacity: 0.02;
  background-image:
    linear-gradient(rgba(209, 223, 248, 0.6) 1px, transparent 1px),
    linear-gradient(90deg, rgba(209, 223, 248, 0.6) 1px, transparent 1px);
  background-size: 48px 48px;
}

.content-shell {
  width: var(--content-max);
  max-width: 100%;
  margin-inline: auto;
}

.reveal-item {
  opacity: 0;
  transform: translateY(18px);
  transition:
    opacity 520ms var(--motion-ease),
    transform 520ms var(--motion-ease);
  transition-delay: var(--reveal-delay, 0ms);
}

.reveal-item.is-revealed {
  opacity: 1;
  transform: translateY(0);
}

.hero {
  position: relative;
  width: var(--content-max);
  max-width: 100%;
  margin-inline: auto;
  border-radius: var(--radius-lg);
  min-height: clamp(400px, 68vh, 640px);
  overflow: hidden;
  border: 1px solid rgba(187, 209, 247, 0.24);
  box-shadow:
    0 26px 58px rgba(2, 8, 18, 0.5),
    inset 0 -80px 110px rgba(2, 8, 18, 0.34),
    0 0 32px rgba(87, 126, 216, 0.14);
}

.hero-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 58% center;
  animation: heroZoom 36s linear infinite alternate;
  z-index: 0;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      97deg,
      rgba(5, 12, 24, 0.84) 0%,
      rgba(5, 12, 24, 0.52) 24%,
      rgba(5, 12, 24, 0.18) 46%,
      rgba(5, 12, 24, 0.06) 66%
    ),
    linear-gradient(
      180deg,
      rgba(5, 12, 24, 0.18),
      rgba(5, 12, 24, 0.36) 56%,
      rgba(5, 12, 24, 0.46) 100%
    );
  z-index: 1;
}

.hero-reflection {
  position: absolute;
  left: -30%;
  top: -34%;
  width: 40%;
  height: 190%;
  background: linear-gradient(
    110deg,
    rgba(220, 235, 255, 0),
    rgba(220, 235, 255, 0.08),
    rgba(220, 235, 255, 0)
  );
  transform: skewX(-18deg) translateX(calc(var(--glow-shift) * 0.8));
  filter: blur(5px);
  z-index: 2;
}

.hero-content {
  position: absolute;
  left: calc(clamp(2.8rem, 8vw, 7rem) + 180px);
  right: auto;
  top: calc(46% - 10px);
  transform: translateY(-50%);
  z-index: 3;
  height: auto;
  width: min(720px, calc(100% - 2.8rem));
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 0.72rem;
  padding: 0;
  max-width: 100%;
}

.hero-kicker {
  margin: 0;
  font-size: 0.76rem;
  text-transform: uppercase;
  letter-spacing: 0.17em;
  color: rgba(183, 206, 249, 0.92);
  font-weight: 640;
}

.hero-title {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(2rem, 4.5vw, 3.9rem);
  line-height: 0.98;
  color: var(--text-primary);
  letter-spacing: -0.01em;
  max-width: 14ch;
  text-wrap: balance;
}

.hero-subtitle {
  margin: 0;
  max-width: 50ch;
  line-height: 1.66;
  color: rgba(226, 236, 252, 0.95);
  font-size: clamp(0.93rem, 1.45vw, 1rem);
  text-shadow: 0 1px 8px rgba(2, 8, 18, 0.36);
}

.hero-actions {
  margin-top: 0.56rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.84rem;
}

.btn {
  min-height: 46px;
  padding: 0 1.06rem;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  font-size: 0.88rem;
  font-weight: 620;
  border: 1px solid transparent;
  transition:
    transform 220ms var(--motion-ease),
    box-shadow 220ms var(--motion-ease),
    border-color 220ms var(--motion-ease);
}

.btn-primary {
  color: #0b1932;
  background: linear-gradient(130deg, #f9fcff 0%, #e3efff 52%, #c5d9ff 100%);
  border-color: rgba(223, 236, 255, 0.7);
  box-shadow:
    0 14px 32px rgba(109, 146, 228, 0.36),
    0 0 22px rgba(101, 143, 234, 0.26);
}

.btn-secondary {
  color: #ecf4ff;
  border-color: rgba(179, 204, 248, 0.34);
  background: rgba(150, 175, 221, 0.08);
  box-shadow: inset 0 1px 0 rgba(220, 234, 255, 0.08);
}

.btn:hover,
.btn:focus-visible {
  transform: translateY(-2px);
  box-shadow:
    0 16px 34px rgba(87, 127, 218, 0.38),
    0 0 24px rgba(101, 143, 234, 0.28);
}

.btn-secondary:hover,
.btn-secondary:focus-visible {
  border-color: rgba(194, 217, 255, 0.44);
  background: rgba(157, 183, 228, 0.14);
}

.hero-proof {
  margin: 0.12rem 0 0;
  color: rgba(205, 223, 251, 0.86);
  font-size: 0.79rem;
  letter-spacing: 0.01em;
  line-height: 1.5;
}

.metrics-section,
.timeline-section,
.showcase-section,
.impact-section,
.final-section {
  display: grid;
  gap: clamp(1.3rem, 2.2vw, 1.8rem);
}

.metrics-section {
  margin-top: clamp(0.7rem, 1.5vw, 1.2rem);
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  align-items: stretch;
  gap: 1rem;
}

.metrics-grid :deep(.metric-card) {
  height: 100%;
}

.timeline-section {
  position: relative;
  padding-top: 0.35rem;
  gap: clamp(1.3rem, 2.2vw, 1.8rem);
}

.timeline-track {
  position: absolute;
  left: calc(50% - 0.5px);
  top: 146px;
  bottom: 12px;
  width: 1px;
  transform: none;
  border-radius: 999px;
  background: linear-gradient(
    180deg,
    rgba(190, 215, 255, 0.62),
    rgba(99, 133, 209, 0.18)
  );
  box-shadow: 0 0 10px rgba(114, 154, 237, 0.24);
  pointer-events: none;
}

.timeline-list {
  display: grid;
  gap: clamp(1.6rem, 2.6vw, 2.2rem);
  margin-top: 0.35rem;
}

.showcase-section {
  padding-block: clamp(0.2rem, 0.8vw, 0.6rem);
}

.showcase-split {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-items: stretch;
  gap: clamp(1.6rem, 2.4vw, 2.1rem);
}

.showcase-copy {
  display: grid;
  height: 100%;
  align-content: center;
  gap: 0.68rem;
  border-radius: var(--radius-md);
  border: var(--border-soft);
  background:
    radial-gradient(
      circle at 12% 12%,
      rgba(124, 160, 239, 0.18),
      rgba(124, 160, 239, 0) 44%
    ),
    linear-gradient(162deg, rgba(16, 30, 55, 0.9), rgba(10, 22, 43, 0.92));
  box-shadow: 0 16px 32px rgba(4, 10, 22, 0.3);
  padding: clamp(1rem, 2.2vw, 1.5rem);
}

.showcase-kicker {
  margin: 0;
  font-size: 0.74rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(184, 208, 248, 0.86);
  font-weight: 640;
}

.showcase-copy h2 {
  margin: 0;
  font-size: clamp(1.24rem, 2.35vw, 1.9rem);
  line-height: 1.1;
  color: #f6faff;
  max-width: 20ch;
}

.showcase-copy p {
  margin: 0;
  color: rgba(205, 220, 244, 0.9);
  line-height: 1.66;
  max-width: 48ch;
}

.showcase-frame {
  margin: 0;
  position: relative;
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: var(--border-soft);
  width: 100%;
  max-width: 100%;
  aspect-ratio: 4 / 3;
  max-height: 550px;
  box-shadow:
    0 20px 44px rgba(4, 10, 22, 0.34),
    0 0 0 rgba(91, 130, 220, 0);
  transition:
    transform 360ms var(--motion-ease),
    box-shadow 360ms var(--motion-ease),
    border-color 360ms var(--motion-ease);
}

.showcase-frame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 380ms var(--motion-ease);
}

.showcase-overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      0deg,
      rgba(5, 11, 22, 0.9) 0%,
      rgba(5, 11, 22, 0.68) 34%,
      rgba(5, 11, 22, 0.18) 74%
    ),
    radial-gradient(
      circle at 84% 16%,
      rgba(210, 227, 255, 0.16),
      rgba(210, 227, 255, 0)
    );
}

.showcase-caption {
  position: absolute;
  left: clamp(1rem, 4vw, 2.6rem);
  right: clamp(1rem, 3vw, 1.8rem);
  bottom: clamp(1rem, 4vw, 2rem);
  display: grid;
  gap: 0.42rem;
  max-width: min(82%, 520px);
}

.caption-kicker {
  margin: 0;
  font-size: 0.73rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(191, 213, 251, 0.94);
}

.showcase-caption h3 {
  margin: 0;
  color: #f6faff;
  font-size: clamp(1.15rem, 2.1vw, 1.6rem);
  line-height: 1.12;
}

.showcase-caption p {
  margin: 0;
  color: rgba(211, 224, 244, 0.92);
  max-width: 54ch;
  line-height: 1.55;
  font-size: clamp(0.82rem, 1.15vw, 0.9rem);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.showcase-frame:hover img {
  transform: scale(1.04);
}

.showcase-frame:hover {
  transform: translateY(-3px);
  border-color: rgba(203, 222, 255, 0.56);
  box-shadow:
    0 26px 52px rgba(4, 10, 22, 0.42),
    0 0 26px rgba(95, 134, 223, 0.28);
}

.impact-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.final-section {
  margin-top: clamp(0.8rem, 1.8vw, 1.6rem);
  width: 100%;
  margin-inline: auto;
}

.final-section :deep(.cta-shell) {
  padding: clamp(1.8rem, 3vw, 2.7rem);
}

.final-section :deep(.actions) {
  margin-top: 0.42rem;
  gap: 0.82rem;
  align-items: center;
}

.final-section :deep(.desc) {
  max-width: 56ch;
}

@keyframes floatGlow {
  0% {
    transform: translate3d(0, 0, 0) scale(1);
  }
  100% {
    transform: translate3d(12px, -9px, 0) scale(1.05);
  }
}

@keyframes heroZoom {
  0% {
    transform: translateY(calc(var(--hero-shift) * -1)) scale(1.01);
  }
  100% {
    transform: translateY(calc(var(--hero-shift) * -1)) scale(1.035);
  }
}

@media (max-width: 1060px) {
  .metrics-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .showcase-split {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .showcase-frame {
    order: 1;
    max-height: 500px;
  }

  .showcase-copy {
    order: 2;
  }
}

@media (max-width: 980px) {
  .timeline-track {
    left: 14px;
    top: 138px;
    transform: none;
  }
}

@media (max-width: 760px) {
  .eu-page {
    --content-max: min(1280px, calc(100% - 2rem));
    --section-gap: clamp(3rem, 8vw, 4rem);
  }

  .hero {
    min-height: clamp(320px, 56vh, 460px);
  }

  .hero-content {
    position: relative;
    top: auto;
    left: auto;
    right: auto;
    transform: none;
    width: 100%;
    max-width: 100%;
    padding-top: clamp(1.4rem, 6vh, 2rem);
    padding-left: clamp(1.25rem, 4.2vw, 1.8rem);
  }

  .hero-title {
    max-width: 100%;
    font-size: clamp(1.8rem, 8.2vw, 2.8rem);
  }

  .hero-actions {
    flex-direction: column;
    gap: 0.68rem;
  }

  .btn {
    width: 100%;
  }

  .hero-proof {
    font-size: 0.76rem;
  }

  .metrics-grid,
  .impact-grid {
    grid-template-columns: 1fr;
  }

  .timeline-list {
    gap: 1rem;
    margin-top: 0.1rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .glow,
  .hero-image,
  .hero-reflection,
  .reveal-item,
  .showcase-frame img,
  .btn {
    animation: none !important;
    transition: none !important;
    transform: none !important;
    opacity: 1 !important;
  }
}
</style>
