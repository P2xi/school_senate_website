<script setup lang="ts">
const announcements = [
  { title: 'Mart 2026 Genel Toplantısı', text: 'Senato genel toplantısı 20 Mart 2026 tarihinde konferans salonunda gerçekleştirilecektir.' },
  { title: 'Proje Başvuru Çağrısı', text: 'Öğrenci odaklı sosyal ve akademik proje önerileri için başvurular 31 Mart 2026 tarihine kadar açıktır.' },
  { title: 'Karar Özeti Yayınlandı', text: 'Son oturumda alınan kararların özet metni duyurular panelinde erişime açılmıştır.' },
]
</script>

<template>
  <div class="page-stack">
    <section class="page-hero page-section">
      <p class="hero-tag">Eskişehir MBA Senatosu</p>
      <h1 class="hero-title">Duyurular</h1>
      <p class="hero-subtitle">Senato gündemi, resmi bilgilendirmeler ve karar metinleri.</p>
    </section>

    <section class="page-section page-grid">
      <article v-for="announcement in announcements" :key="announcement.title" class="info-card">
        <h3>{{ announcement.title }}</h3>
        <p>{{ announcement.text }}</p>
      </article>
    </section>
  </div>
</template>

<style scoped>
.page-stack { display: grid; gap: 1rem; }
.page-hero { position: relative; overflow: hidden; }
.page-hero::after { content: ''; position: absolute; width: min(360px, 45vw); height: min(360px, 45vw); border-radius: 50%; right: -80px; top: -120px; background: radial-gradient(circle, rgba(116, 153, 248, 0.28), rgba(116, 153, 248, 0)); pointer-events: none; }
.hero-tag { display: inline-block; margin: 0; padding: 0.42rem 0.88rem; border-radius: 999px; border: 1px solid rgba(163, 188, 238, 0.32); background: rgba(100, 140, 237, 0.12); color: #d6e5ff; font-size: 0.82rem; font-weight: 600; }
.hero-title { margin: 1.1rem 0 0.8rem; font-size: clamp(2rem, 4.8vw, 3.4rem); line-height: 1.05; }
.hero-subtitle { margin: 0; max-width: 70ch; color: #d9e6ff; line-height: 1.74; }
.info-card { border: 1px solid var(--border-soft); border-radius: 18px; padding: 1.25rem; background: linear-gradient(175deg, rgba(26, 43, 74, 0.7), rgba(12, 24, 48, 0.86)), var(--surface-strong); box-shadow: var(--shadow); transition: transform 0.2s ease, border-color 0.2s ease; }
.info-card:hover { transform: translateY(-4px); border-color: rgba(173, 197, 248, 0.52); }
.info-card h3 { margin: 0 0 0.6rem; }
.info-card p { margin: 0; color: var(--text-muted); line-height: 1.7; }
</style>
