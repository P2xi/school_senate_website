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
            <li>+90 (222) 000 00 00</li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">© 2026 Eskişehir MBA Senatosu. Tüm hakları saklıdır.</div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import { SCHOOL_LOGO_URL } from '@/lib/brand'

const menuItems = [
  { label: 'Ana Sayfa', to: '/' },
  { label: 'Hakkımızda', to: '/hakkimizda' },
  { label: 'Ekibimiz', to: '/ekibimiz' },
  { label: 'Projeler', to: '/projeler' },
  { label: 'Duyurular', to: '/duyurular' },
  { label: 'İletişim', to: '/iletisim' },
]

const route = useRoute()
const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 16
}

onMounted(() => {
  handleScroll()
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
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
  --text-primary: #edf2ff;
  --text-secondary: #b6c3db;
  --accent: #86a2d8;
  --accent-strong: #b5c8ea;
  --border-soft: rgba(175, 193, 222, 0.2);
  --shadow-soft: 0 18px 40px rgba(3, 9, 21, 0.3);

  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background:
    radial-gradient(circle at 12% 6%, rgba(88, 126, 206, 0.18), transparent 40%),
    radial-gradient(circle at 84% 78%, rgba(58, 79, 142, 0.14), transparent 44%),
    linear-gradient(160deg, #081329 0%, #0a162b 38%, #0d1a31 68%, #0b172d 100%);
  color: var(--text-primary);
  position: relative;
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
  filter: blur(56px);
}

.app-shell::before {
  width: min(500px, 38vw);
  height: min(500px, 38vw);
  left: -10%;
  top: 2%;
  background: radial-gradient(circle, rgba(72, 110, 205, 0.26), rgba(72, 110, 205, 0));
}

.app-shell::after {
  width: min(430px, 32vw);
  height: min(430px, 32vw);
  right: -9%;
  bottom: 4%;
  background: radial-gradient(circle, rgba(52, 71, 132, 0.2), rgba(52, 71, 132, 0));
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
  width: min(1320px, calc(100% - 2.8rem));
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
  background: rgba(173, 193, 226, 0.04);
  border-radius: 10px;
  width: 44px;
  height: 40px;
  padding: 0.45rem;
  cursor: pointer;
}

.menu-toggle span {
  display: block;
  height: 2px;
  background: var(--text-primary);
  border-radius: 2px;
}

.menu-toggle span + span {
  margin-top: 5px;
}

.menu-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  gap: 0.35rem;
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
}

.main-content {
  width: min(1320px, calc(100% - 2.8rem));
  margin: 2.2rem auto 3.6rem;
  flex: 1;
  position: relative;
  z-index: 1;
}

.footer {
  width: min(1320px, calc(100% - 2.8rem));
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

.footer-bottom {
  border-top: 1px solid var(--border-soft);
  color: var(--text-secondary);
  font-size: 0.82rem;
  padding: 1rem 1.8rem;
}

:deep(.page-section) {
  background: linear-gradient(180deg, rgba(20, 35, 61, 0.9), rgba(16, 29, 52, 0.9));
  border: 1px solid var(--border-soft);
  border-radius: 18px;
  box-shadow: var(--shadow-soft);
  padding: clamp(1.3rem, 2vw, 1.9rem);
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

@media (max-width: 860px) {
  .navbar,
  .main-content,
  .footer {
    width: min(1320px, calc(100% - 1.4rem));
  }

  .navbar {
    min-height: 78px;
  }

  .menu-toggle {
    display: inline-block;
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

  .brand-top {
    font-size: 0.95rem;
  }
}

@media (max-width: 680px) {
  :deep(.page-grid),
  .footer-grid {
    grid-template-columns: 1fr;
  }

  .brand-copy strong {
    display: none;
  }

  .footer-grid {
    padding: 1.2rem;
    gap: 1.2rem;
  }

  .footer-bottom {
    padding-inline: 1.2rem;
  }
}
</style>
