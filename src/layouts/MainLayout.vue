<template>
  <div class="app-shell">
    <span class="shell-grain" aria-hidden="true" />
    <header class="navbar-wrap" :class="{ 'is-scrolled': isScrolled }">
      <nav class="navbar" aria-label="Ana menü">
        <RouterLink class="brand" to="/" @click="closeMobileMenu">
          <img :src="SCHOOL_LOGO_URL" alt="Eskişehir MBA Senatosu logosu" class="brand-logo" />
          <div class="brand-copy">
            <span class="brand-top">Eskişehir MBA Senatosu</span>
            <strong>Kurumsal Öğrenci Temsil Platformu</strong>
          </div>
        </RouterLink>

        <button
          class="menu-toggle"
          type="button"
          :aria-expanded="isMobileMenuOpen"
          aria-controls="main-menu"
          aria-label="Menüyü aç"
          @click="isMobileMenuOpen = !isMobileMenuOpen"
        >
          <span />
          <span />
          <span />
        </button>

        <ul id="main-menu" class="menu-list" :class="{ 'is-open': isMobileMenuOpen }">
          <li v-for="item in menuItems" :key="item.to">
            <RouterLink class="menu-link" :to="item.to" exact-active-class="is-active" @click="closeMobileMenu">
              {{ item.label }}
            </RouterLink>
          </li>
          <li class="account-menu-item">
            <RouterLink class="account-link" to="/uyelik" active-class="is-active" @click="closeMobileMenu">
              <span class="account-dot" :class="{ online: Boolean(user) }" aria-hidden="true" />
              {{ user ? shortDisplayName : 'Üye Girişi' }}
            </RouterLink>
          </li>
        </ul>
      </nav>
    </header>

    <main class="main-content">
      <RouterView />
    </main>

    <footer class="footer">
      <div class="footer-grid">
        <div class="footer-brand">
          <p class="footer-title">Eskişehir MBA Senatosu</p>
          <p class="footer-text">
            Öğrenci liderliğini, kurumsal temsil ve proje disipliniyle güçlendiren resmi senato vitrini.
          </p>
        </div>

        <div>
          <p class="footer-heading">Hızlı Linkler</p>
          <ul class="footer-links">
            <li v-for="item in menuItems" :key="`footer-${item.to}`">
              <RouterLink :to="item.to">{{ item.label }}</RouterLink>
            </li>
          </ul>
        </div>

        <div>
          <p class="footer-heading">İletişim</p>
          <ul class="footer-contact">
            <li>Eskişehir</li>
            <li>iletisim@eskisehirmbasenatosu.org</li>
          </ul>
          <div class="footer-social">
            <a class="social-pill" href="https://www.tiktok.com/@esmbasenato" target="_blank" rel="noreferrer">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M19.59 6.69A4.83 4.83 0 0 1 16 5.14V14.3a5.72 5.72 0 1 1-4.95-5.67v2.88a2.84 2.84 0 1 0 2.07 2.73V2h2.88a4.8 4.8 0 0 0 3.59 4.69Z"
                />
              </svg>
              <span>TikTok</span>
            </a>
            <a class="social-pill" href="https://www.instagram.com/esmbaokullarisenato/" target="_blank" rel="noreferrer">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2m0 1.9A3.85 3.85 0 0 0 3.9 7.75v8.5a3.85 3.85 0 0 0 3.85 3.85h8.5a3.85 3.85 0 0 0 3.85-3.85v-8.5a3.85 3.85 0 0 0-3.85-3.85zm8.95 1.43a1.14 1.14 0 1 1 0 2.28a1.14 1.14 0 0 1 0-2.28M12 7a5 5 0 1 1 0 10a5 5 0 0 1 0-10m0 1.9a3.1 3.1 0 1 0 0 6.2a3.1 3.1 0 0 0 0-6.2"
                />
              </svg>
              <span>Instagram</span>
            </a>
            <a class="social-pill" href="https://x.com/Esmbasenato" target="_blank" rel="noreferrer">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="m18.9 2.25h3.45l-7.54 8.62L23.7 21.75h-6.96l-5.46-6.82-5.97 6.82H1.86l8.06-9.2L1.5 2.25h7.14l4.93 6.31zM17.7 19.7h1.91L7.6 4.2H5.56z"
                />
              </svg>
              <span>X</span>
            </a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">© 2026 Eskişehir MBA Senatosu. Tüm hakları saklıdır.</div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import { SCHOOL_LOGO_URL } from '@/lib/brand'
import { useAuth } from '@/composables/useAuth'

const menuItems = [
  { label: 'Ana Sayfa', to: '/' },
  { label: 'Hakkımızda', to: '/hakkimizda' },
  { label: 'Ekibimiz', to: '/ekibimiz' },
  { label: 'Projeler', to: '/projeler' },
  { label: 'Duyurular', to: '/duyurular' },
  { label: 'İletişim', to: '/iletisim' },
]

const route = useRoute()
const { user, displayName } = useAuth()
const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)
const shortDisplayName = computed(() => displayName.value.split(/\s+/)[0] || 'Hesabım')
let scrollFrame = 0

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const updateScrollState = () => {
  const nextValue = window.scrollY > 16
  if (isScrolled.value !== nextValue) isScrolled.value = nextValue
  scrollFrame = 0
}

const handleScroll = () => {
  if (scrollFrame) return
  scrollFrame = requestAnimationFrame(updateScrollState)
}

onMounted(() => {
  updateScrollState()
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
  cancelAnimationFrame(scrollFrame)
})

watch(
  () => route.fullPath,
  () => {
    closeMobileMenu()
  },
)
</script>

<style scoped>
.app-shell {
  --bg-primary: #070f1f;
  --bg-secondary: #0d192f;
  --surface: #111f39;
  --surface-elev: #162744;
  --text-primary: #edf2ff;
  --text-secondary: #b6c3db;
  --accent: #86a2d8;
  --accent-strong: #b5c8ea;
  --border-soft: rgba(175, 193, 222, 0.2);
  --shadow-soft: 0 18px 40px rgba(3, 9, 21, 0.3);
  --sys-ease: cubic-bezier(0.22, 1, 0.36, 1);
  --sys-card-radius: 18px;
  --sys-card-border: rgba(174, 196, 236, 0.3);
  --sys-card-border-strong: rgba(202, 220, 252, 0.58);
  --sys-card-bg:
    radial-gradient(circle at 14% 10%, rgba(142, 178, 252, 0.18), rgba(142, 178, 252, 0) 54%),
    linear-gradient(170deg, rgba(25, 43, 74, 0.86), rgba(13, 26, 50, 0.92));
  --sys-card-bg-hover:
    radial-gradient(circle at 14% 10%, rgba(164, 197, 255, 0.26), rgba(164, 197, 255, 0) 56%),
    linear-gradient(170deg, rgba(30, 51, 88, 0.9), rgba(15, 29, 56, 0.94));
  --sys-card-glow: 0 20px 36px rgba(3, 9, 21, 0.3), 0 0 24px rgba(84, 125, 224, 0.18);
  --sys-card-glow-hover: 0 24px 42px rgba(3, 9, 21, 0.36), 0 0 32px rgba(102, 145, 238, 0.26);

  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background:
    radial-gradient(circle at 7% -8%, rgba(112, 152, 238, 0.22), transparent 46%),
    radial-gradient(circle at 24% 18%, rgba(78, 118, 205, 0.11), transparent 52%),
    radial-gradient(circle at 82% 78%, rgba(58, 79, 142, 0.06), transparent 48%),
    linear-gradient(160deg, #081329 0%, #0a162b 38%, #0d1a31 68%, #0b172d 100%);
  color: var(--text-primary);
  position: relative;
  animation: none;
}

.shell-grain {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  opacity: 0.022;
  background-image: radial-gradient(rgba(226, 236, 255, 0.38) 0.5px, transparent 0.5px);
  background-size: 4px 4px;
}

.app-shell::before,
.app-shell::after {
  content: '';
  position: fixed;
  pointer-events: none;
  z-index: 0;
  border-radius: 50%;
  filter: blur(60px);
}

.app-shell::before {
  width: min(460px, 34vw);
  height: min(460px, 34vw);
  left: -14%;
  top: -6%;
  background: radial-gradient(circle, rgba(96, 137, 229, 0.22), rgba(96, 137, 229, 0));
  animation: none;
}

.app-shell::after {
  width: min(430px, 32vw);
  height: min(430px, 32vw);
  right: -9%;
  bottom: 4%;
  background: radial-gradient(circle, rgba(52, 71, 132, 0.1), rgba(52, 71, 132, 0));
  animation: none;
}

.navbar-wrap {
  position: sticky;
  top: 0;
  width: 100%;
  transition: background-color 0.25s ease, border-color 0.25s ease;
  z-index: 60;
}

.navbar-wrap.is-scrolled {
  background: rgba(8, 15, 29, 0.92);
  border-bottom: 1px solid var(--border-soft);
}

.navbar {
  width: min(1280px, calc(100% - 2.8rem));
  margin: 0 auto;
  min-height: 86px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.2rem;
}

.brand {
  color: var(--text-primary);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.9rem;
}

.brand-logo {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 1px solid var(--border-soft);
  object-fit: cover;
}

.brand-copy {
  display: grid;
  gap: 0.15rem;
  min-width: 0;
}

.brand-top {
  font-size: 1.02rem;
  font-weight: 700;
  letter-spacing: 0.01em;
}

.brand-copy strong {
  font-size: 0.75rem;
  line-height: 1.2;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.menu-toggle {
  display: none;
  border: 1px solid var(--border-soft);
  background:
    radial-gradient(circle at 78% -26%, rgba(176, 202, 247, 0.2), rgba(176, 202, 247, 0)),
    rgba(173, 193, 226, 0.08);
  border-radius: 10px;
  width: 44px;
  height: 40px;
  padding: 0.42rem;
  cursor: pointer;
  box-shadow: inset 0 1px 0 rgba(226, 237, 255, 0.09);
  transition:
    border-color 220ms var(--sys-ease),
    box-shadow 220ms var(--sys-ease),
    background-color 220ms var(--sys-ease),
    transform 220ms var(--sys-ease);
}

.menu-toggle span {
  display: block;
  width: 20px;
  height: 2.4px;
  margin-inline: auto;
  background: rgba(241, 247, 255, 0.96);
  border-radius: 2px;
  box-shadow: 0 0 8px rgba(164, 195, 248, 0.24);
}

.menu-toggle span + span {
  margin-top: 4px;
}

.menu-toggle:hover,
.menu-toggle:focus-visible {
  border-color: rgba(194, 214, 246, 0.48);
  box-shadow:
    inset 0 1px 0 rgba(236, 244, 255, 0.14),
    0 0 16px rgba(104, 142, 223, 0.2);
  background:
    radial-gradient(circle at 78% -26%, rgba(184, 208, 251, 0.22), rgba(184, 208, 251, 0)),
    rgba(173, 193, 226, 0.12);
  outline: none;
}

.menu-toggle:active {
  transform: scale(0.985);
}

.menu-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.account-link {
  min-height: 42px;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0 0.85rem;
  border: 1px solid rgba(177, 199, 238, 0.26);
  border-radius: 999px;
  color: #eaf1ff;
  background: rgba(158, 184, 230, 0.09);
  text-decoration: none;
  font-size: 0.84rem;
  font-weight: 650;
  white-space: nowrap;
  transition: background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

.account-link:hover,
.account-link:focus-visible,
.account-link.is-active {
  border-color: rgba(198, 217, 249, 0.48);
  background: rgba(174, 198, 239, 0.16);
  box-shadow: 0 0 16px rgba(96, 137, 224, 0.18);
  outline: none;
}

.account-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #91a4c8;
  box-shadow: 0 0 8px rgba(145, 164, 200, 0.35);
}

.account-dot.online {
  background: #75dfa5;
  box-shadow: 0 0 9px rgba(117, 223, 165, 0.55);
}

.menu-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 42px;
  padding: 0 1rem;
  border-radius: 10px;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.92rem;
  font-weight: 500;
  position: relative;
  transition:
    color 0.22s ease,
    background-color 0.22s ease,
    box-shadow 0.22s ease,
    transform 0.22s ease;
}

.menu-link::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: 6px;
  width: 64%;
  height: 2px;
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(118, 161, 247, 0), rgba(118, 161, 247, 0.9), rgba(118, 161, 247, 0));
  box-shadow: 0 0 10px rgba(103, 140, 220, 0.3);
  transform: translateX(-50%) scaleX(0);
  transform-origin: center;
  opacity: 0;
  transition: transform 260ms cubic-bezier(0.22, 1, 0.36, 1), opacity 260ms ease;
}

.menu-link:hover,
.menu-link:focus-visible,
.menu-link.is-active {
  color: var(--text-primary);
  background: rgba(175, 193, 222, 0.14);
  box-shadow: 0 0 14px rgba(103, 140, 220, 0.18);
  outline: none;
}

.menu-link:hover::after,
.menu-link:focus-visible::after,
.menu-link.is-active::after {
  transform: translateX(-50%) scaleX(1);
  opacity: 0.85;
}

.menu-link:active {
  transform: scale(0.985);
  box-shadow: 0 0 16px rgba(103, 140, 220, 0.24);
  animation: navTapGlow 220ms var(--sys-ease);
}

.main-content {
  width: min(1280px, calc(100% - 2.8rem));
  margin: 2.2rem auto 5.4rem;
  flex: 1;
  position: relative;
  z-index: 1;
}

.main-content :deep(section) {
  content-visibility: auto;
  contain-intrinsic-size: auto 420px;
}

.main-content::before,
.main-content::after {
  content: '';
  position: absolute;
  pointer-events: none;
  z-index: 0;
  border-radius: 50%;
  filter: blur(54px);
}

.main-content::before {
  width: min(440px, 32vw);
  height: min(440px, 32vw);
  left: -10%;
  top: -6%;
  background: radial-gradient(circle, rgba(98, 140, 232, 0.16), rgba(98, 140, 232, 0));
  animation: none;
}

.main-content::after {
  width: min(360px, 28vw);
  height: min(360px, 28vw);
  right: -8%;
  bottom: 0;
  background: radial-gradient(circle, rgba(60, 88, 164, 0.08), rgba(60, 88, 164, 0));
  animation: none;
}

.footer {
  width: min(1280px, calc(100% - 2.8rem));
  margin: 0 auto 1.6rem;
  border: 1px solid var(--border-soft);
  border-radius: 18px;
  background: rgba(13, 24, 45, 0.82);
  box-shadow: none;
  position: relative;
  z-index: 1;
}

.footer-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr;
  gap: 1.8rem;
  padding: 1.8rem;
}

.footer-title,
.footer-heading {
  margin: 0;
  font-size: 0.98rem;
  font-weight: 600;
  color: var(--text-primary);
}

.footer-text {
  margin: 0.6rem 0 0;
  color: var(--text-secondary);
  line-height: 1.72;
  max-width: 46ch;
}

.footer-links,
.footer-contact {
  list-style: none;
  margin: 0.7rem 0 0;
  padding: 0;
  display: grid;
  gap: 0.48rem;
}

.footer-links a,
.footer-contact li {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.92rem;
}

.footer-links a:hover,
.footer-links a:focus-visible {
  color: var(--text-primary);
}

.footer-social {
  margin-top: 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
}

.social-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.42rem;
  border: 1px solid rgba(165, 188, 229, 0.32);
  border-radius: 999px;
  padding: 0.44rem 0.72rem;
  color: var(--text-primary);
  text-decoration: none;
  background:
    radial-gradient(circle at 84% -30%, rgba(150, 181, 245, 0.2), rgba(150, 181, 245, 0)),
    rgba(134, 162, 216, 0.08);
  font-size: 0.82rem;
  font-weight: 600;
  transition:
    transform 210ms cubic-bezier(0.22, 1, 0.36, 1),
    background-color 210ms cubic-bezier(0.22, 1, 0.36, 1),
    border-color 210ms cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 210ms cubic-bezier(0.22, 1, 0.36, 1);
}

.social-pill svg {
  width: 0.95rem;
  height: 0.95rem;
}

.social-pill:hover,
.social-pill:focus-visible {
  transform: translateY(-1px) scale(1.02);
  background:
    radial-gradient(circle at 84% -30%, rgba(157, 188, 245, 0.24), rgba(157, 188, 245, 0)),
    rgba(134, 162, 216, 0.14);
  border-color: rgba(181, 200, 234, 0.5);
  box-shadow:
    0 10px 18px rgba(3, 9, 21, 0.22),
    0 0 14px rgba(100, 142, 231, 0.24);
  outline: none;
}

.footer-bottom {
  border-top: 1px solid var(--border-soft);
  color: var(--text-secondary);
  font-size: 0.82rem;
  padding: 1rem 1.8rem;
}

:deep(.page-stack),
:deep(.projects-page),
:deep(.about-page),
:deep(.landing-page),
:deep(.team-page),
:deep(.duyurular-page) {
  position: relative;
  isolation: isolate;
}

:deep(.ambient-layer) {
  position: absolute;
  inset: -10% -8% -10% -10%;
  pointer-events: none;
  z-index: 0;
}

:deep(.ambient-blob) {
  border-radius: 50%;
  filter: blur(70px) !important;
  opacity: 0.16 !important;
  animation: none !important;
}

:deep(.page-hero),
:deep(.page-hero)::before,
:deep(.hero-streak),
:deep(.team-grid)::before,
:deep(.projects-grid)::before {
  animation: none !important;
}

:deep(.blob-a) {
  left: -15% !important;
  top: -10% !important;
}

:deep(.blob-b) {
  right: -10% !important;
  top: 34% !important;
}

:deep(.blob-c) {
  left: 30% !important;
  bottom: 6% !important;
}

:deep(.page-hero)::before {
  left: -12% !important;
  right: auto !important;
  top: -26% !important;
  background: radial-gradient(circle, rgba(126, 161, 244, 0.24), rgba(126, 161, 244, 0)) !important;
}

:deep(.page-hero)::after {
  left: -14% !important;
  right: auto !important;
  top: -22% !important;
  background: radial-gradient(circle, rgba(116, 153, 248, 0.16), rgba(116, 153, 248, 0)) !important;
}

:deep(.landing-page)::after {
  left: -12% !important;
  right: auto !important;
  top: 2% !important;
  width: min(560px, 46vw) !important;
  height: min(320px, 24vw) !important;
  border-radius: 50% !important;
  background: radial-gradient(ellipse at 36% 34%, rgba(110, 148, 235, 0.12), rgba(110, 148, 235, 0)) !important;
  filter: blur(52px) !important;
}

:deep(.page-stack > section + section),
:deep(.projects-page > section + section),
:deep(.about-page > section + section),
:deep(.landing-page > section + section),
:deep(.team-page > section + section) {
  position: relative;
}

:deep(.page-stack > section + section)::before,
:deep(.projects-page > section + section)::before,
:deep(.about-page > section + section)::before,
:deep(.landing-page > section + section)::before,
:deep(.team-page > section + section)::before {
  content: '';
  position: absolute;
  left: 6%;
  right: 6%;
  top: -0.8rem;
  height: 26px;
  border-radius: 999px;
  background: radial-gradient(ellipse at center, rgba(96, 136, 226, 0.16), rgba(96, 136, 226, 0));
  filter: blur(12px);
  pointer-events: none;
  z-index: 0;
}

:deep(.page-section) {
  background:
    radial-gradient(circle at 14% 10%, rgba(140, 175, 248, 0.16), rgba(140, 175, 248, 0) 52%),
    linear-gradient(170deg, rgba(20, 35, 61, 0.9), rgba(16, 29, 52, 0.92));
  border: 1px solid var(--sys-card-border);
  border-radius: var(--sys-card-radius);
  box-shadow: var(--sys-card-glow);
  padding: clamp(1.3rem, 2vw, 1.9rem);
  transition:
    border-color 260ms var(--sys-ease),
    box-shadow 260ms var(--sys-ease),
    transform 260ms var(--sys-ease),
    background-position 260ms var(--sys-ease);
  position: relative;
  overflow: hidden;
}

:deep(.page-section)::after {
  content: '';
  position: absolute;
  inset: -42% auto -42% -120%;
  width: 34%;
  background: linear-gradient(90deg, transparent, rgba(224, 236, 255, 0.12), transparent);
  transform: skewX(-16deg);
  opacity: 0;
  transition: transform 360ms var(--sys-ease), opacity 300ms ease;
  pointer-events: none;
}

:deep(.page-section:hover)::after {
  opacity: 1;
  transform: translateX(300%) skewX(-16deg);
}

:deep(.info-card),
:deep(.project-card),
:deep(.stat-card),
:deep(.stat-item),
:deep(.value-card),
:deep(.gallery-card),
:deep(.gallery-item),
:deep(.action-card),
:deep(.team-card),
:deep(.feature-card) {
  border-radius: var(--sys-card-radius);
  border: 1px solid var(--sys-card-border);
  background: var(--sys-card-bg);
  box-shadow: var(--sys-card-glow), inset 0 1px 0 rgba(218, 232, 255, 0.06);
  transition:
    transform 260ms var(--sys-ease),
    border-color 260ms var(--sys-ease),
    box-shadow 260ms var(--sys-ease),
    filter 260ms var(--sys-ease),
    background 260ms var(--sys-ease);
}

:deep(.info-card:hover),
:deep(.project-card:hover),
:deep(.stat-card:hover),
:deep(.stat-item:hover),
:deep(.value-card:hover),
:deep(.gallery-card:hover),
:deep(.gallery-item:hover),
:deep(.action-card:hover),
:deep(.team-card:hover),
:deep(.feature-card:hover) {
  transform: translateY(-6px) scale(1.012);
  border-color: var(--sys-card-border-strong);
  background: var(--sys-card-bg-hover);
  box-shadow: var(--sys-card-glow-hover);
}

:deep(.projects-grid:has(.project-card:hover) .project-card:not(:hover)),
:deep(.page-grid:has(.info-card:hover) .info-card:not(:hover)),
:deep(.team-grid:has(.team-card:hover) .team-card:not(:hover)) {
  opacity: 0.72;
  filter: saturate(0.8) brightness(0.9);
}

:deep(.btn),
:deep(.cta-btn),
:deep(.cta-button),
:deep(.detail-button),
:deep(.quickview-nav button),
:deep(.contact-form button),
:deep(.social-pill) {
  border-radius: 12px;
  transition:
    transform 220ms var(--sys-ease),
    box-shadow 220ms var(--sys-ease),
    border-color 220ms var(--sys-ease),
    background-color 220ms var(--sys-ease);
}

:deep(.btn:hover),
:deep(.cta-btn:hover),
:deep(.cta-button:hover),
:deep(.detail-button:hover),
:deep(.quickview-nav button:hover),
:deep(.contact-form button:hover),
:deep(.social-pill:hover) {
  transform: translateY(-1px) scale(1.02);
  box-shadow:
    0 12px 24px rgba(3, 9, 21, 0.26),
    0 0 18px rgba(102, 145, 238, 0.24);
}

:deep(.btn:active),
:deep(.cta-btn:active),
:deep(.cta-button:active),
:deep(.detail-button:active),
:deep(.quickview-nav button:active),
:deep(.contact-form button:active),
:deep(.social-pill:active) {
  transform: scale(0.985);
}

:deep(.quickview-overlay) {
  background: rgba(3, 8, 18, 0.6) !important;
  backdrop-filter: blur(7px) !important;
}

:deep(.quickview-modal) {
  width: min(840px, calc(100vw - 2.4rem)) !important;
  border-radius: 26px !important;
  box-shadow:
    inset 0 1px 0 rgba(219, 231, 255, 0.09),
    0 34px 70px rgba(3, 8, 18, 0.54),
    0 0 38px rgba(88, 127, 221, 0.2) !important;
}

:deep(.page-grid) {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

:deep(.page-title) {
  margin: 0;
  font-size: clamp(1.6rem, 3vw, 2.1rem);
}

:deep(.page-subtitle) {
  margin: 0.7rem 0 0;
  color: var(--text-secondary);
  line-height: 1.72;
}

@keyframes globalAmbientShift {
  0% {
    background-position: 0% 0%, 0% 0%, 0% 0%, 0% 0%;
  }
  100% {
    background-position: 3% -2%, -2% 2%, 1% -1%, 0% 0%;
  }
}

@keyframes systemAmbientFloat {
  0% {
    transform: translate3d(0, 0, 0) scale(1);
    opacity: 0.12;
  }
  50% {
    transform: translate3d(10px, -8px, 0) scale(1.04);
    opacity: 0.18;
  }
  100% {
    transform: translate3d(-8px, 8px, 0) scale(1.06);
    opacity: 0.14;
  }
}

@keyframes globalLightDrift {
  0% {
    transform: translate3d(0, 0, 0) scale(1);
    opacity: 0.9;
  }
  100% {
    transform: translate3d(10px, -8px, 0) scale(1.05);
    opacity: 1;
  }
}

@keyframes navTapGlow {
  0% {
    box-shadow: 0 0 0 rgba(113, 148, 230, 0);
  }
  50% {
    box-shadow: 0 0 18px rgba(113, 148, 230, 0.34);
  }
  100% {
    box-shadow: 0 0 0 rgba(113, 148, 230, 0);
  }
}

@media (max-width: 1040px) {
  :deep(.page-grid) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .footer-grid {
    grid-template-columns: 1fr 1fr;
  }

  .footer-brand {
    grid-column: 1 / -1;
  }
}

@media (max-width: 1120px) {
  .navbar,
  .main-content,
  .footer {
    width: min(1280px, calc(100% - 2rem));
  }

  .navbar {
    min-height: 74px;
    gap: 0.72rem;
    align-items: center;
  }

  .menu-toggle {
    display: inline-grid;
    place-content: center;
    flex: 0 0 auto;
    width: 42px;
    height: 42px;
    padding: 0.4rem;
    border-radius: 11px;
  }

  .menu-list {
    position: absolute;
    left: 0.7rem;
    right: 0.7rem;
    top: calc(100% + 0.35rem);
    display: none;
    grid-template-columns: 1fr;
    gap: 0.25rem;
    padding: 0.7rem;
    border: 1px solid var(--border-soft);
    border-radius: 14px;
    background: rgba(10, 20, 38, 0.98);
    box-shadow: var(--shadow-soft);
  }

  .menu-list.is-open {
    display: grid;
  }

  .menu-link {
    justify-content: flex-start;
    padding-inline: 0.75rem;
    min-height: 40px;
    border-radius: 8px;
  }

  .account-link {
    width: 100%;
    min-height: 44px;
    justify-content: flex-start;
    border-radius: 9px;
    padding-inline: 0.75rem;
  }

  .brand-top {
    font-size: 0.95rem;
    line-height: 1.22;
  }
}

@media (max-width: 680px) {
  :deep(.page-grid),
  .footer-grid {
    grid-template-columns: 1fr;
  }

  .navbar {
    min-height: 68px;
    gap: 0.62rem;
  }

  .brand {
    gap: 0.62rem;
    min-width: 0;
    flex: 1;
  }

  .brand-logo {
    width: 42px;
    height: 42px;
  }

  .brand-copy {
    min-width: 0;
  }

  .brand-top {
    font-size: 0.88rem;
    line-height: 1.18;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .menu-toggle {
    width: 40px;
    height: 40px;
    border-radius: 10px;
  }

  .brand-copy strong {
    display: block;
    font-size: 0.62rem;
    letter-spacing: 0.08em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .footer-grid {
    padding: 1.2rem;
    gap: 1.2rem;
  }

  .footer-bottom {
    padding-inline: 1.2rem;
  }
}

@media (max-width: 520px) {
  .brand-copy strong {
    display: none;
  }
}
</style>
