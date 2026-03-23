<script setup lang="ts">
const members = [
  { title: 'Zeynep Kaya · Senato Başkanı', text: 'Senato gündemini yönetir, temsil süreçlerini koordine eder ve stratejik kararları takip eder.' },
  { title: 'Emir Demir · Başkan Yardımcısı', text: 'Komisyonlar arası koordinasyonu sağlar, proje ekiplerini destekler ve uygulama süreçlerini hızlandırır.' },
  { title: 'Elif Yılmaz · Genel Üye', text: 'Öğrenci geri bildirimlerini toplar, duyuru içeriklerini hazırlar ve etkinlik planlamasında görev alır.' },
]
</script>

<template>
  <div class="page-stack">
    <section class="page-hero page-section">
      <p class="hero-tag">Eskişehir MBA Senatosu</p>
      <h1 class="hero-title">Ekibimiz</h1>
      <p class="hero-subtitle">Disiplinli, temsil gücü yüksek ve çözüm odaklı senato ekibi.</p>
      <p class="hero-description">Farklı sınıf seviyelerinden gelen üyelerimiz; ortak akıl ve sorumluluk bilinciyle okul topluluğu için çalışır.</p>
    </section>

    <section class="page-section page-grid">
      <article v-for="member in members" :key="member.title" class="info-card">
        <h3>{{ member.title }}</h3>
        <p>{{ member.text }}</p>
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
.hero-subtitle,.hero-description { max-width: 70ch; color: var(--text-muted); line-height: 1.74; }
.hero-subtitle { margin: 0; color: #d9e6ff; }
.hero-description { margin: 0.8rem 0 0; }
.info-card { border: 1px solid var(--border-soft); border-radius: 18px; padding: 1.25rem; background: linear-gradient(175deg, rgba(26, 43, 74, 0.7), rgba(12, 24, 48, 0.86)), var(--surface-strong); box-shadow: var(--shadow); transition: transform 0.2s ease, border-color 0.2s ease; }
.info-card:hover { transform: translateY(-4px); border-color: rgba(173, 197, 248, 0.52); }
.info-card h3 { margin: 0 0 0.6rem; }
.info-card p { margin: 0; color: var(--text-muted); line-height: 1.7; }
</style>
