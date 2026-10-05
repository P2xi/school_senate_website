<template>
  <div ref="pageRef" class="team-page" :class="{ 'modal-open': modalOpen }">
    <div class="ambient-layer" aria-hidden="true">
      <span class="ambient-blob blob-a" />
      <span class="ambient-blob blob-b" />
      <span class="ambient-blob blob-c" />
    </div>

    <section class="page-hero page-section" data-scene>
      <p class="hero-tag reveal-item" data-reveal>Eskişehir MBA Senatosu</p>
      <h1 class="hero-title reveal-item" data-reveal style="--reveal-delay: 70ms">Ekibimiz</h1>
      <span class="hero-streak reveal-item" data-reveal style="--reveal-delay: 130ms" aria-hidden="true" />
      <p class="hero-subtitle reveal-item" data-reveal style="--reveal-delay: 180ms">
        Disiplinli, temsil gücü yüksek ve çözüm odaklı senato ekibi.
      </p>
      <p class="hero-description reveal-item" data-reveal style="--reveal-delay: 240ms">
        Kurumsal yapımızı taşıyan ekip üyelerimizi modern, canlı ve etkileşimli bir vitrin halinde sunuyoruz.
      </p>
    </section>

    <section class="team-grid" aria-label="Ekip kartları" data-scene>
      <article
        v-for="(member, index) in members"
        :key="member.name"
        class="team-card reveal-item"
        data-reveal
        :style="{ '--reveal-delay': `${index * 70 + 90}ms` }"
        @pointermove="handleCardPointerMove"
        @pointerleave="handleCardPointerLeave"
      >
        <span class="cursor-glow" aria-hidden="true" />
        <span class="card-sheen" aria-hidden="true" />
        <header class="card-header">
          <span class="card-accent" aria-hidden="true" />
          <span class="member-photo-wrap">
            <span class="member-photo-fallback" aria-hidden="true">{{ getInitials(member.name) }}</span>
            <img
              v-if="member.photo"
              class="member-photo"
              :src="member.photo"
              :alt="`${member.name} profil fotoğrafı`"
              width="96"
              height="96"
              loading="lazy"
              decoding="async"
              fetchpriority="low"
              @error="hideBrokenImage"
            />
          </span>
          <div class="card-meta">
            <h2>{{ member.name }}</h2>
            <span class="role-badge">{{ member.role }}</span>
          </div>
        </header>

        <button class="card-hint action-detail" type="button" @click="openProfileQuickView(member, index)">
          <span>Profil detayı</span>
          <span class="action-arrow" aria-hidden="true">→</span>
        </button>
      </article>
    </section>

    <Teleport to="body">
      <Transition name="quickview">
        <div
          v-if="modalOpen"
          class="quickview-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Profil detayı"
          @click.self="closeProfileQuickView"
        >
          <article class="quickview-modal page-section">
            <button class="quickview-close" type="button" aria-label="Kapat" @click="closeProfileQuickView">×</button>
            <template v-if="selectedMember">
              <header class="quickview-head">
                <span class="quickview-photo-wrap">
                  <span class="member-photo-fallback" aria-hidden="true">{{ getInitials(selectedMember.name) }}</span>
                  <img
                    v-if="selectedMember.photo"
                    class="quickview-photo"
                    :src="selectedMember.photo"
                    :alt="`${selectedMember.name} profil fotoğrafı`"
                    width="128"
                    height="128"
                    decoding="async"
                    @error="hideBrokenImage"
                  />
                </span>
                <p class="quickview-kicker">Ekip Profili</p>
                <h2>{{ selectedMember.name }}</h2>
                <span class="quickview-role">{{ selectedMember.role }}</span>
                <p class="quickview-bio">{{ selectedMember.bio }}</p>
              </header>

              <div class="quickview-body">
                <section class="quickview-block">
                  <h3>Sorumluluklar</h3>
                  <ul>
                    <li v-for="item in selectedMember.responsibilities" :key="item">{{ item }}</li>
                  </ul>
                </section>

                <nav class="quickview-nav" aria-label="Profil gezinme">
                  <button type="button" @click="showPreviousMember">← Önceki</button>
                  <button type="button" @click="showNextMember">Sonraki →</button>
                </nav>
              </div>
            </template>
            <p v-else class="quickview-fallback">Veri yüklenemedi</p>
          </article>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { getTeamPhotoUrl } from '@/lib/storagePaths'

type Member = {
  name: string
  role: string
  photo: string
  bio: string
  responsibilities: string[]
}

const members: Member[] = [
  {
    name: 'Ozan Biçici',
    role: 'Senato Başkanı',
    photo: getTeamPhotoUrl('Senato Baskani.jpeg'),
    bio: 'Senato çalışmalarının genel koordinasyonunu yürütür. Ekipler arasındaki iş birliğini ve temsil süreçlerini yönetir.',
    responsibilities: ['Senato gündemi ve karar süreçleri', 'Başkanlıklar arası stratejik koordinasyon'],
  },
  {
    name: 'Derin Delikkulak',
    role: 'Senato Başkan Yardımcısı',
    photo: getTeamPhotoUrl('Senato Baskan Yardimcisi.jpeg'),
    bio: 'Senato başkanına yönetim ve koordinasyon süreçlerinde destek olur. Alınan kararların ekipler arasında uygulanmasını takip eder.',
    responsibilities: ['Kararların uygulama takibi', 'Ekipler arası görev ve iletişim akışı'],
  },
  {
    name: 'Arda Eşdoğan',
    role: 'Teknoloji Başkanı',
    photo: getTeamPhotoUrl('Teknoloji Baskani.jpeg'),
    bio: 'Dijital altyapı ve ürünleşen öğrenci çözümleri üzerinde çalışır. Süreçlerin ölçülebilir ve izlenebilir olmasını sağlar.',
    responsibilities: ['Teknoloji planı ve araç seçimi', 'Dijital süreç otomasyonu'],
  },
  {
    name: 'Hasan Suat Tezcan',
    role: 'Medya İletişim Başkanı',
    photo: getTeamPhotoUrl('Medya Iletisim Baskani.jpeg'),
    bio: 'Senato çalışmalarının doğru, tutarlı ve etkili biçimde duyurulmasını sağlar. Kurumsal iletişim dilini ve yayın süreçlerini yönetir.',
    responsibilities: ['İçerik stratejisi ve yayın planı', 'Kurumsal iletişim koordinasyonu'],
  },
  {
    name: 'Mustafa Yağız Görgün',
    role: 'Proje Strateji Başkanı',
    photo: getTeamPhotoUrl('Proje Strateji Baskani.jpeg'),
    bio: 'Senato projelerinin hedef, kapsam ve uygulama stratejilerini oluşturur. Ekiplerin ortak hedefler doğrultusunda ilerlemesini destekler.',
    responsibilities: ['Proje stratejisi ve yol haritası', 'Hedef ve çıktı takibi'],
  },
  {
    name: 'Ela Tunga',
    role: 'Kültür ve Sanat Başkanı',
    photo: getTeamPhotoUrl('Kultur ve Sanat Baskani.jpeg'),
    bio: 'Kültür ve sanat alanındaki etkinlikleri planlar. Öğrencilerin yaratıcı üretimlerini görünür kılan çalışmalar geliştirir.',
    responsibilities: ['Kültür ve sanat etkinlikleri', 'Yaratıcı proje koordinasyonu'],
  },
  {
    name: 'Tuana Yıldırım',
    role: 'Mali İşler Başkanı',
    photo: getTeamPhotoUrl('Mali Isler Baskani.jpeg'),
    bio: 'Bütçe planlaması ve kaynak kullanımında şeffaflık odaklı çalışır. Proje maliyetlerini sürdürülebilir bir yapıda yönetir.',
    responsibilities: ['Bütçe planı ve raporlama', 'Kaynak verimliliği takibi'],
  },
  {
    name: 'Elif Sultan Gül',
    role: 'Sosyal Girişim Başkanı',
    photo: getTeamPhotoUrl('Sosyal Girisim Baskani.jpeg'),
    bio: 'Toplumsal fayda üreten girişimleri planlar ve koordine eder. Öğrencilerin sosyal etki odaklı projelere katılımını güçlendirir.',
    responsibilities: ['Sosyal girişim projeleri', 'Toplumsal etki ve iş birliği'],
  },
  {
    name: 'Ada Rastgeldi',
    role: 'Teknoloji Başkan Yardımcısı',
    photo: getTeamPhotoUrl('Teknoloji Baskan Yardimcisi.jpeg'),
    bio: 'Teknoloji çalışmalarının uygulama ve takip süreçlerine destek verir. Dijital projelerin düzenli ilerlemesine katkı sağlar.',
    responsibilities: ['Teknik uygulama desteği', 'Dijital proje takibi'],
  },
  {
    name: 'Nehir Aydoğan',
    role: 'Medya İletişim Başkan Yardımcısı',
    photo: getTeamPhotoUrl('Medya Iletisim Baskan Yardimcisi.jpeg'),
    bio: 'İletişim içeriklerinin hazırlanması ve yayınlanması süreçlerine destek olur. Senato çalışmalarının görünürlüğünü güçlendirir.',
    responsibilities: ['İçerik üretim desteği', 'Yayın ve iletişim takibi'],
  },
  {
    name: 'Yağmur Çelik',
    role: 'Medya İletişim Başkan Yardımcısı',
    photo: getTeamPhotoUrl('Medya Iletisim Baskan Yardimcisi 2.jpeg'),
    bio: 'Medya ve iletişim çalışmalarının üretim sürecine katkı sağlar. Mesaj bütünlüğünün ve yayın düzeninin korunmasını destekler.',
    responsibilities: ['Medya içerik koordinasyonu', 'Yayın düzeni ve mesaj kontrolü'],
  },
  {
    name: 'Ebru Hazal Gül',
    role: 'Kültür ve Sanat Başkan Yardımcısı',
    photo: getTeamPhotoUrl('Kultur ve Sanat Baskan Yardimcisi.jpeg'),
    bio: 'Kültür ve sanat projelerinin hazırlık ve uygulama aşamalarına destek verir. Etkinliklerin düzenli ilerlemesine katkı sağlar.',
    responsibilities: ['Etkinlik hazırlık süreçleri', 'Kültür ve sanat proje desteği'],
  },
  {
    name: 'Öykü Taş',
    role: 'Mali İşler Başkan Yardımcısı',
    photo: getTeamPhotoUrl('Mali Isler Baskan Yardimcisi.jpeg'),
    bio: 'Mali süreçlerin kayıt, takip ve raporlama çalışmalarına destek olur. Kaynakların planlı kullanımına katkı sağlar.',
    responsibilities: ['Mali kayıt ve takip', 'Bütçe raporlama desteği'],
  },
  {
    name: 'Ecrin Ural',
    role: 'Sosyal Girişim Başkan Yardımcısı',
    photo: getTeamPhotoUrl('Sosyal Girisim Baskan Yardimcisi.jpeg'),
    bio: 'Sosyal girişim projelerinin planlama ve uygulama süreçlerine destek verir. Toplumsal fayda odaklı çalışmalara katkı sağlar.',
    responsibilities: ['Sosyal proje uygulama desteği', 'Etki ve katılım takibi'],
  },
]

const pageRef = ref<HTMLElement | null>(null)
const modalOpen = ref(false)
const selectedMember = ref<Member | null>(null)
const selectedIndex = ref<number>(-1)
let revealObserver: IntersectionObserver | null = null

const getInitials = (name: string) => name
  .split(/\s+/)
  .slice(0, 2)
  .map((part) => part[0])
  .join('')
  .toLocaleUpperCase('tr-TR')

const hideBrokenImage = (event: Event) => {
  const image = event.currentTarget as HTMLImageElement | null
  if (image) image.hidden = true
}

const handleCardPointerMove = (event: PointerEvent) => {
  const card = event.currentTarget as HTMLElement | null
  if (!card) return

  const rect = card.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top

  card.style.setProperty('--mx', `${x}px`)
  card.style.setProperty('--my', `${y}px`)
  card.style.setProperty('--glow-opacity', '1')
}

const handleCardPointerLeave = (event: PointerEvent) => {
  const card = event.currentTarget as HTMLElement | null
  if (!card) return
  card.style.setProperty('--glow-opacity', '0')
}

const openProfileQuickView = (member: Member, index: number) => {
  selectedMember.value = member
  selectedIndex.value = index
  modalOpen.value = true
}

const closeProfileQuickView = () => {
  modalOpen.value = false
  selectedMember.value = null
  selectedIndex.value = -1
}

const showPreviousMember = () => {
  if (selectedIndex.value < 0) return
  selectedIndex.value = (selectedIndex.value - 1 + members.length) % members.length
  selectedMember.value = members[selectedIndex.value] ?? null
  if (!selectedMember.value) modalOpen.value = false
}

const showNextMember = () => {
  if (selectedIndex.value < 0) return
  selectedIndex.value = (selectedIndex.value + 1) % members.length
  selectedMember.value = members[selectedIndex.value] ?? null
  if (!selectedMember.value) modalOpen.value = false
}

const handleEscapeKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape') closeProfileQuickView()
}

watch(modalOpen, (isOpen) => {
  document.body.style.overflow = isOpen ? 'hidden' : ''
})

onMounted(async () => {
  const root = pageRef.value
  if (!root) return
  window.addEventListener('keydown', handleEscapeKey)

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
  window.removeEventListener('keydown', handleEscapeKey)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.team-page {
  --motion-ease: cubic-bezier(0.22, 1, 0.36, 1);
  display: grid;
  gap: 1.72rem;
  position: relative;
  isolation: isolate;
}

.team-page::before,
.team-page::after {
  content: '';
  position: absolute;
  pointer-events: none;
  z-index: 1;
  border-radius: 50%;
}

.team-page::before {
  width: min(620px, 52vw);
  height: min(460px, 38vw);
  left: -20%;
  top: -20%;
  background:
    radial-gradient(circle at 62% 52%, rgba(124, 164, 245, 0.1), rgba(124, 164, 245, 0) 66%),
    radial-gradient(circle at 42% 36%, rgba(86, 126, 214, 0.08), rgba(86, 126, 214, 0) 72%);
  filter: blur(24px);
  animation: ambientTopDrift 26s var(--motion-ease) infinite alternate;
}

.team-page::after {
  width: min(480px, 40vw);
  height: min(360px, 30vw);
  right: -14%;
  top: -12%;
  background:
    radial-gradient(circle at 48% 56%, rgba(112, 151, 233, 0.08), rgba(112, 151, 233, 0) 68%),
    radial-gradient(circle at 58% 34%, rgba(72, 112, 198, 0.06), rgba(72, 112, 198, 0) 72%);
  filter: blur(22px);
  animation: ambientTopDrift 30s var(--motion-ease) infinite alternate-reverse;
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
  opacity: 0.38;
  animation: ambientDrift 14s var(--motion-ease) infinite alternate;
}

.blob-a {
  width: min(420px, 36vw);
  height: min(320px, 28vw);
  left: -14%;
  top: -4%;
  background: radial-gradient(circle, rgba(78, 124, 228, 0.2), rgba(78, 124, 228, 0));
}

.blob-b {
  width: min(320px, 28vw);
  height: min(250px, 22vw);
  right: -8%;
  top: 34%;
  background: radial-gradient(circle, rgba(98, 116, 224, 0.24), rgba(98, 116, 224, 0));
  animation-duration: 16s;
}

.blob-c {
  width: min(360px, 30vw);
  height: min(280px, 24vw);
  left: 26%;
  bottom: 6%;
  background: radial-gradient(circle, rgba(63, 114, 220, 0.2), rgba(63, 114, 220, 0));
  animation-duration: 11s;
}

.team-page > *:not(.ambient-layer) {
  position: relative;
  z-index: 2;
}

.team-page.modal-open .page-hero,
.team-page.modal-open .team-grid {
  filter: brightness(0.72) saturate(0.92) blur(1.6px);
  transition: filter 220ms var(--motion-ease);
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
  display: grid;
  gap: 0.9rem;
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
  left: -16%;
  top: -32%;
  width: min(500px, 44vw);
  height: min(300px, 26vw);
  border-radius: 50%;
  background: radial-gradient(circle, rgba(126, 161, 244, 0.2), rgba(126, 161, 244, 0));
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

.hero-streak {
  width: min(220px, 48vw);
  height: 2px;
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(157, 188, 245, 0.96), rgba(157, 188, 245, 0));
  box-shadow: 0 0 14px rgba(101, 140, 224, 0.5);
  animation: accentPulse 7.5s var(--motion-ease) infinite;
}

.hero-subtitle,
.hero-description {
  margin: 0;
  max-width: 70ch;
  line-height: 1.72;
}

.hero-subtitle {
  color: rgba(224, 236, 255, 0.95);
}

.hero-description {
  color: rgba(193, 209, 236, 0.92);
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 0.98rem;
  position: relative;
  padding: 1.1rem;
  border-radius: 22px;
  border: 1px solid rgba(132, 160, 211, 0.14);
  background:
    radial-gradient(circle at 84% -12%, rgba(96, 131, 211, 0.14), transparent 58%),
    linear-gradient(176deg, rgba(9, 18, 34, 0.78), rgba(7, 14, 28, 0.9));
  box-shadow:
    inset 0 1px 0 rgba(197, 216, 251, 0.05),
    0 18px 34px rgba(2, 7, 16, 0.28);
}

.team-grid::before {
  content: '';
  position: absolute;
  left: 0;
  top: -16px;
  width: 154px;
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

[data-scene].is-scene-revealed.team-grid::before {
  opacity: 1;
  transform: scaleX(1);
}

.team-grid:has(.team-card:hover)::before {
  box-shadow: 0 0 18px rgba(122, 164, 252, 0.54);
}

.team-card {
  grid-column: span 3;
  border: 1px solid rgba(174, 196, 236, 0.28);
  border-radius: 18px;
  padding: 1.16rem;
  background:
    radial-gradient(circle at 88% -22%, rgba(126, 161, 244, 0.22), transparent 54%),
    linear-gradient(174deg, rgba(28, 47, 80, 0.78), rgba(12, 23, 47, 0.9));
  display: grid;
  gap: 1rem;
  min-height: 240px;
  position: relative;
  overflow: hidden;
  transition:
    transform 0.26s var(--motion-ease),
    border-color 0.26s var(--motion-ease),
    box-shadow 0.26s var(--motion-ease),
    background-color 0.26s var(--motion-ease),
    opacity 0.26s var(--motion-ease),
    filter 0.26s var(--motion-ease);
  /* Çok sayıdaki kartta sürekli gölge animasyonu yerine GPU-dostu hover geçişi kullanılır. */
  animation: none;
}

/* On dört kişilik kadronun son iki kartını masaüstünde dengeli ortalar. */
.team-card:nth-child(13) {
  grid-column: 4 / span 3;
}

.team-card:nth-child(14) {
  grid-column: 7 / span 3;
}

.team-card::before {
  content: '';
  position: absolute;
  width: 200px;
  height: 200px;
  right: -72px;
  top: -84px;
  border-radius: 50%;
  pointer-events: none;
  background: radial-gradient(circle, rgba(120, 156, 235, 0.22), rgba(120, 156, 235, 0));
  filter: blur(24px);
  opacity: 0.56;
  transition: opacity 0.28s var(--motion-ease), transform 0.28s var(--motion-ease);
}

.cursor-glow {
  position: absolute;
  inset: -42%;
  border-radius: inherit;
  background: radial-gradient(
    240px circle at var(--mx, 50%) var(--my, 50%),
    rgba(165, 196, 255, 0.32),
    rgba(165, 196, 255, 0.12) 34%,
    rgba(165, 196, 255, 0) 66%
  );
  opacity: var(--glow-opacity, 0);
  transition: opacity 0.24s var(--motion-ease);
  pointer-events: none;
  z-index: 0;
}

.card-sheen {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(118deg, rgba(225, 237, 255, 0.08), transparent 36%);
  opacity: 0.4;
  transition: opacity 0.26s var(--motion-ease);
  pointer-events: none;
  z-index: 0;
}

.team-card .card-sheen::after {
  content: '';
  position: absolute;
  inset: -35% auto -35% -70%;
  width: 34%;
  background: linear-gradient(90deg, transparent, rgba(228, 238, 255, 0.14), transparent);
  transform: skewX(-18deg);
  opacity: 0.52;
  display: none;
}

.team-card:hover {
  transform: translateY(-8px) scale(1.015);
  border-color: rgba(206, 221, 252, 0.66);
  background:
    radial-gradient(circle at 88% -20%, rgba(146, 182, 255, 0.26), transparent 56%),
    linear-gradient(175deg, rgba(35, 56, 94, 0.8), rgba(16, 32, 64, 0.9));
  box-shadow:
    0 24px 40px rgba(4, 10, 22, 0.34),
    0 0 30px rgba(73, 116, 216, 0.3);
}

.team-card:hover::before {
  opacity: 0.92;
  transform: translate3d(-10px, 8px, 0) scale(1.08);
}

.team-card:hover .card-sheen {
  opacity: 0.8;
}

.team-grid .team-card:nth-child(-n + 4) {
  border-color: rgba(194, 214, 252, 0.52);
  background:
    radial-gradient(circle at 88% -22%, rgba(143, 178, 252, 0.28), transparent 54%),
    linear-gradient(174deg, rgba(34, 55, 92, 0.82), rgba(16, 30, 59, 0.92));
  box-shadow:
    0 18px 30px rgba(4, 10, 22, 0.3),
    0 0 22px rgba(84, 125, 224, 0.22);
}

.team-grid .team-card:nth-child(n + 5) {
  border-color: rgba(160, 183, 221, 0.24);
  filter: saturate(0.92);
}

.team-grid .team-card:nth-child(4n + 2),
.team-grid .team-card:nth-child(4n + 3) {
  box-shadow:
    0 14px 24px rgba(4, 10, 22, 0.24),
    0 0 16px rgba(84, 125, 224, 0.14);
}

.team-grid:has(.team-card:hover) .team-card:not(:hover) {
  opacity: 0.64;
  filter: saturate(0.76) brightness(0.88) contrast(0.94);
}

.card-header {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  justify-items: center;
  align-items: flex-start;
  gap: 0.8rem;
  position: relative;
  z-index: 1;
}

.card-accent {
  justify-self: center;
  width: 72px;
  height: 3px;
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(179, 206, 255, 0.96), rgba(179, 206, 255, 0.2), rgba(179, 206, 255, 0));
  box-shadow: 0 0 14px rgba(108, 146, 226, 0.44);
  transition: width 0.24s var(--motion-ease), box-shadow 0.24s var(--motion-ease);
  position: relative;
  overflow: hidden;
}

.member-photo-wrap,
.quickview-photo-wrap {
  position: relative;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  overflow: hidden;
  border: 1px solid rgba(198, 217, 251, 0.4);
  border-radius: 50%;
  background: linear-gradient(145deg, rgba(78, 108, 166, 0.9), rgba(25, 46, 82, 0.96));
  box-shadow: 0 8px 20px rgba(3, 9, 21, 0.3), 0 0 18px rgba(96, 137, 224, 0.18);
}

.member-photo-wrap {
  width: 96px;
  height: 96px;
}

.member-photo-fallback {
  color: #e9f2ff;
  font-size: 1rem;
  font-weight: 760;
  letter-spacing: 0.04em;
}

.member-photo,
.quickview-photo {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  object-position: center;
}

.card-accent::after {
  content: '';
  position: absolute;
  inset: 0 auto 0 -35%;
  width: 28%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.78), transparent);
  transform: skewX(-16deg);
  opacity: 0.6;
  display: none;
}

.team-card:hover .card-accent {
  width: 96px;
  box-shadow: 0 0 18px rgba(122, 164, 252, 0.56);
}

.card-meta {
  min-width: 0;
  display: grid;
  justify-items: center;
  gap: 0.68rem;
  text-align: center;
}

.card-meta h2 {
  margin: 0;
  font-size: clamp(1.08rem, 2vw, 1.24rem);
  line-height: 1.34;
  letter-spacing: -0.01em;
  text-shadow:
    0 1px 8px rgba(7, 14, 28, 0.34),
    0 0 10px rgba(127, 162, 239, 0.2);
  background: linear-gradient(130deg, #f7fbff 0%, #d9e8ff 55%, #bfd5ff 100%);
  background-clip: text;
  color: transparent;
}

.role-badge {
  width: fit-content;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 24px;
  padding: 0 0.6rem;
  border-radius: 999px;
  border: 1px solid rgba(170, 193, 236, 0.5);
  color: #d8e6ff;
  background: linear-gradient(140deg, rgba(154, 176, 214, 0.2), rgba(128, 154, 196, 0.12));
  font-size: 0.72rem;
  line-height: 1;
  font-weight: 590;
  max-width: 100%;
  padding-block: 0.36rem;
  line-height: 1.25;
  white-space: normal;
  overflow-wrap: anywhere;
  transition:
    transform 0.24s var(--motion-ease),
    box-shadow 0.24s var(--motion-ease),
    border-color 0.24s var(--motion-ease);
  position: relative;
  z-index: 1;
}

.team-card:hover .role-badge {
  transform: translateY(-1px);
  border-color: rgba(195, 214, 251, 0.66);
  box-shadow:
    inset 0 0 10px rgba(210, 224, 255, 0.22),
    0 0 14px rgba(113, 148, 230, 0.2);
}

.card-hint {
  margin-top: auto;
  justify-self: center;
  width: fit-content;
  color: rgba(188, 204, 230, 0.66);
  font-size: 0.8rem;
  letter-spacing: 0.01em;
  opacity: 0.74;
  transition: opacity 0.24s var(--motion-ease), transform 0.24s var(--motion-ease), color 0.24s var(--motion-ease);
  position: relative;
  z-index: 1;
}

.action-detail {
  border: 0;
  background: transparent;
  padding: 0;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  cursor: pointer;
  color: inherit;
  text-decoration: none;
}

.action-arrow {
  display: inline-block;
  opacity: 0.72;
  transition: transform 0.2s var(--motion-ease), opacity 0.2s var(--motion-ease);
}

.action-detail:hover,
.action-detail:focus-visible {
  text-decoration: underline;
  text-underline-offset: 0.2em;
  text-decoration-color: rgba(191, 213, 252, 0.66);
}

.team-card:hover .card-hint,
.action-detail:focus-visible {
  opacity: 1;
  transform: translateX(3px);
  color: #ecf4ff;
  text-shadow: 0 0 8px rgba(113, 148, 230, 0.2);
}

.team-card:hover .action-arrow,
.action-detail:focus-visible .action-arrow {
  opacity: 1;
  transform: translateX(2px);
}

.quickview-overlay {
  position: fixed;
  inset: 0;
  z-index: 120;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.1rem;
  background: rgba(3, 8, 18, 0.56);
  backdrop-filter: blur(4px);
}

.quickview-modal {
  width: min(780px, calc(100vw - 2.2rem));
  max-height: min(88vh, 860px);
  overflow: auto;
  position: relative;
  z-index: 121;
  border: 1px solid rgba(193, 213, 249, 0.28);
  border-radius: 24px;
  background:
    radial-gradient(circle at 84% -10%, rgba(131, 166, 243, 0.2), transparent 52%),
    radial-gradient(circle at 12% 120%, rgba(88, 123, 206, 0.16), transparent 58%),
    linear-gradient(176deg, rgba(23, 39, 68, 0.94), rgba(12, 23, 44, 0.96));
  box-shadow:
    inset 0 1px 0 rgba(219, 231, 255, 0.08),
    0 30px 62px rgba(3, 8, 18, 0.5),
    0 0 36px rgba(88, 127, 221, 0.18);
  padding: 1.55rem 1.5rem 1.4rem;
}

.quickview-fallback {
  margin: 0.5rem 0 0;
  color: rgba(218, 231, 255, 0.92);
}

.quickview-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 2.15rem;
  height: 2.15rem;
  border-radius: 12px;
  border: 1px solid rgba(181, 201, 238, 0.3);
  background: rgba(173, 197, 248, 0.08);
  color: #eef4ff;
  cursor: pointer;
  font-size: 1.12rem;
  line-height: 1;
  transition:
    border-color 0.2s var(--motion-ease),
    background-color 0.2s var(--motion-ease),
    transform 0.2s var(--motion-ease);
}

.quickview-close:hover,
.quickview-close:focus-visible {
  border-color: rgba(201, 219, 252, 0.56);
  background: rgba(173, 197, 248, 0.18);
  transform: translateY(-1px);
}

.quickview-head {
  display: grid;
  justify-items: center;
  text-align: center;
  gap: 0.72rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(176, 197, 236, 0.22);
}

.quickview-photo-wrap {
  width: 128px;
  height: 128px;
  margin-bottom: 0.2rem;
}

.quickview-photo-wrap .member-photo-fallback {
  font-size: 1.4rem;
}

.quickview-kicker {
  margin: 0;
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent-strong);
}

.quickview-modal h2 {
  margin: 0;
  font-size: clamp(1.72rem, 3.6vw, 2.24rem);
  line-height: 1.12;
  color: #f5faff;
  letter-spacing: -0.01em;
  text-shadow:
    0 2px 10px rgba(5, 12, 24, 0.3),
    0 0 14px rgba(115, 151, 228, 0.18);
}

.quickview-role {
  width: fit-content;
  display: inline-flex;
  align-items: center;
  min-height: 26px;
  padding: 0 0.72rem;
  border-radius: 999px;
  border: 1px solid rgba(170, 193, 236, 0.56);
  color: #dce9ff;
  background: linear-gradient(138deg, rgba(159, 181, 219, 0.22), rgba(126, 152, 196, 0.14));
  font-size: 0.76rem;
  font-weight: 600;
  box-shadow: 0 0 14px rgba(113, 148, 230, 0.18);
}

.quickview-bio {
  margin: 0.08rem 0 0;
  max-width: 62ch;
  color: rgba(211, 224, 247, 0.94);
  line-height: 1.78;
}

.quickview-body {
  padding-top: 1rem;
}

.quickview-block {
  margin-top: 1.15rem;
  margin-bottom: 0.25rem;
}

.quickview-block h3 {
  margin: 0 0 0.62rem;
  font-size: 0.98rem;
  letter-spacing: 0.01em;
  color: #ebf4ff;
}

.quickview-block ul {
  margin: 0;
  padding-left: 1.2rem;
  color: rgba(189, 205, 232, 0.92);
  line-height: 1.68;
  display: grid;
  gap: 0.44rem;
}

.quickview-block li::marker {
  color: rgba(169, 194, 240, 0.92);
}

.quickview-nav {
  margin-top: 1.5rem;
  display: flex;
  gap: 0.65rem;
  padding-top: 0.95rem;
  border-top: 1px solid rgba(176, 197, 236, 0.22);
}

.quickview-nav button {
  min-height: 2.25rem;
  border: 1px solid rgba(181, 201, 238, 0.32);
  background: linear-gradient(145deg, rgba(173, 197, 248, 0.14), rgba(120, 149, 208, 0.08));
  color: #eef4ff;
  border-radius: 12px;
  padding: 0.5rem 0.78rem;
  cursor: pointer;
  font-weight: 560;
  transition:
    border-color 0.2s var(--motion-ease),
    background-color 0.2s var(--motion-ease),
    box-shadow 0.2s var(--motion-ease),
    transform 0.2s var(--motion-ease);
}

.quickview-nav button:hover,
.quickview-nav button:focus-visible {
  border-color: rgba(204, 221, 252, 0.58);
  background: linear-gradient(145deg, rgba(180, 203, 250, 0.22), rgba(130, 158, 216, 0.12));
  box-shadow: 0 0 14px rgba(109, 145, 225, 0.22);
  transform: translateY(-1px);
}

.quickview-enter-active,
.quickview-leave-active {
  transition:
    opacity 260ms var(--motion-ease),
    backdrop-filter 260ms var(--motion-ease),
    background-color 260ms var(--motion-ease);
}

.quickview-enter-active .quickview-modal,
.quickview-leave-active .quickview-modal {
  transition:
    transform 280ms cubic-bezier(0.22, 1, 0.36, 1),
    opacity 240ms var(--motion-ease),
    box-shadow 280ms cubic-bezier(0.22, 1, 0.36, 1);
}

.quickview-enter-from,
.quickview-leave-to {
  opacity: 0;
  backdrop-filter: blur(0px);
  background: rgba(3, 8, 18, 0);
}

.quickview-enter-from .quickview-modal,
.quickview-leave-to .quickview-modal {
  transform: translateY(12px) scale(0.94);
  opacity: 0;
  box-shadow:
    inset 0 1px 0 rgba(219, 231, 255, 0.04),
    0 14px 28px rgba(3, 8, 18, 0.24),
    0 0 18px rgba(88, 127, 221, 0.1);
}

.quickview-leave-to .quickview-modal {
  transform: translateY(8px) scale(0.96);
}

@keyframes ambientDrift {
  0% { transform: translate3d(0, 0, 0) scale(1); opacity: 0.28; }
  100% { transform: translate3d(12px, -8px, 0) scale(1.06); opacity: 0.4; }
}

@keyframes ambientTopDrift {
  0% { transform: translate3d(0, 0, 0) scale(1); opacity: 0.88; }
  100% { transform: translate3d(10px, -6px, 0) scale(1.04); opacity: 1; }
}

@keyframes haloBreathe {
  0%, 100% { opacity: 0.58; transform: scale(1); }
  50% { opacity: 0.88; transform: scale(1.04); }
}

@keyframes accentPulse {
  0%, 100% { opacity: 0.76; transform: scaleX(1); }
  50% { opacity: 1; transform: scaleX(1.06); }
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

@keyframes cardSweep {
  0% {
    transform: translateX(0) skewX(-18deg);
    opacity: 0;
  }
  12% {
    opacity: 0.55;
  }
  44% {
    opacity: 0.36;
  }
  100% {
    transform: translateX(460%) skewX(-18deg);
    opacity: 0;
  }
}

@keyframes accentShimmer {
  0% {
    transform: translateX(0) skewX(-16deg);
    opacity: 0;
  }
  14% {
    opacity: 0.68;
  }
  100% {
    transform: translateX(420%) skewX(-16deg);
    opacity: 0;
  }
}

@keyframes cardBreathe {
  0%, 100% {
    box-shadow:
      0 12px 22px rgba(3, 8, 18, 0.2),
      0 0 14px rgba(81, 121, 214, 0.1);
  }
  50% {
    box-shadow:
      0 15px 26px rgba(3, 8, 18, 0.26),
      0 0 18px rgba(95, 137, 231, 0.16);
  }
}

@media (max-width: 1080px) {
  .team-grid {
    grid-template-columns: repeat(12, minmax(0, 1fr));
  }

  .team-card {
    grid-column: span 4;
  }

  .team-card:nth-child(13) {
    grid-column: 3 / span 4;
  }

  .team-card:nth-child(14) {
    grid-column: 7 / span 4;
  }

  .team-grid .team-card:nth-child(-n + 4) {
    border-color: rgba(170, 196, 241, 0.36);
    background:
      radial-gradient(circle at 88% -22%, rgba(138, 172, 247, 0.22), transparent 54%),
      linear-gradient(174deg, rgba(30, 50, 84, 0.8), rgba(13, 26, 52, 0.9));
    box-shadow: 0 14px 24px rgba(4, 10, 22, 0.24);
  }

  .team-grid .team-card:nth-child(-n + 3) {
    border-color: rgba(194, 214, 252, 0.52);
    background:
      radial-gradient(circle at 88% -22%, rgba(143, 178, 252, 0.28), transparent 54%),
      linear-gradient(174deg, rgba(34, 55, 92, 0.82), rgba(16, 30, 59, 0.92));
    box-shadow:
      0 18px 30px rgba(4, 10, 22, 0.3),
      0 0 22px rgba(84, 125, 224, 0.22);
  }

  .team-grid .team-card:nth-child(n + 4) {
    border-color: rgba(160, 183, 221, 0.24);
    filter: saturate(0.92);
  }

  .team-grid .team-card:nth-child(3n + 2) {
    box-shadow:
      0 14px 24px rgba(4, 10, 22, 0.24),
      0 0 16px rgba(84, 125, 224, 0.14);
  }
}

@media (max-width: 760px) {
  .team-grid {
    grid-template-columns: repeat(12, minmax(0, 1fr));
  }

  .team-card,
  .team-card:nth-child(13),
  .team-card:nth-child(14) {
    grid-column: span 6;
  }

  .team-grid .team-card:nth-child(-n + 3) {
    border-color: rgba(170, 196, 241, 0.36);
    background:
      radial-gradient(circle at 88% -22%, rgba(138, 172, 247, 0.22), transparent 54%),
      linear-gradient(174deg, rgba(30, 50, 84, 0.8), rgba(13, 26, 52, 0.9));
    box-shadow: 0 14px 24px rgba(4, 10, 22, 0.24);
  }

  .team-grid .team-card:nth-child(-n + 2) {
    border-color: rgba(194, 214, 252, 0.52);
    background:
      radial-gradient(circle at 88% -22%, rgba(143, 178, 252, 0.28), transparent 54%),
      linear-gradient(174deg, rgba(34, 55, 92, 0.82), rgba(16, 30, 59, 0.92));
    box-shadow:
      0 18px 30px rgba(4, 10, 22, 0.3),
      0 0 22px rgba(84, 125, 224, 0.22);
  }

  .team-grid .team-card:nth-child(n + 3) {
    border-color: rgba(160, 183, 221, 0.24);
    filter: saturate(0.92);
  }

  .team-grid .team-card:nth-child(2n) {
    box-shadow:
      0 14px 24px rgba(4, 10, 22, 0.24),
      0 0 16px rgba(84, 125, 224, 0.14);
  }
}

@media (max-width: 560px) {
  .team-grid {
    grid-template-columns: 1fr;
  }

  .team-card {
    grid-column: 1 / -1 !important;
    min-height: 154px;
    border-color: rgba(170, 196, 241, 0.36) !important;
    background:
      radial-gradient(circle at 88% -22%, rgba(138, 172, 247, 0.22), transparent 54%),
      linear-gradient(174deg, rgba(30, 50, 84, 0.8), rgba(13, 26, 52, 0.9)) !important;
    filter: none !important;
  }

  .quickview-overlay {
    padding: 0.9rem;
    align-items: flex-start;
  }

  .quickview-modal {
    width: min(780px, calc(100vw - 1.8rem));
    margin-top: 0.7rem;
    max-height: calc(100vh - 1.8rem);
    padding: 1.2rem 1.05rem 1rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .team-page::before,
  .team-page::after,
  .page-hero,
  .ambient-layer,
  .ambient-blob,
  .page-hero::before,
  .hero-streak,
  .team-grid::before,
  .team-card,
  .team-card::before,
  .cursor-glow,
  .card-sheen,
  .team-card .card-sheen::after,
  .card-accent::after,
  .role-badge,
  .card-hint,
  .quickview-enter-active,
  .quickview-leave-active,
  .quickview-enter-active .quickview-modal,
  .quickview-leave-active .quickview-modal,
  .reveal-item {
    animation: none !important;
    transition: none !important;
    transform: none !important;
    opacity: 1 !important;
  }
}
</style>
