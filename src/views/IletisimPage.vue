<script setup lang="ts">
import { reactive, ref } from 'vue'

const form = reactive({ adSoyad: '', eposta: '', mesaj: '' })
const durumMesaji = ref('')

const handleSubmit = () => {
  durumMesaji.value = 'Mesajınız alındı. En kısa sürede sizinle iletişime geçeceğiz.'
  form.adSoyad = ''
  form.eposta = ''
  form.mesaj = ''
}
</script>

<template>
  <div class="page-stack">
    <section class="page-hero page-section">
      <p class="hero-tag">Eskişehir MBA Senatosu</p>
      <h1 class="hero-title">İletişim</h1>
      <p class="hero-subtitle">Senato ile görüş, öneri ve geri bildirimlerinizi doğrudan paylaşın.</p>
    </section>

    <section class="page-section contact-layout">
      <article>
        <h2 class="page-title">İletişim Bilgileri</h2>
        <p class="page-subtitle">E-posta: senato@eskisehirmba.k12.tr</p>
        <p class="page-subtitle">Ofis: Öğrenci Etkinlik Merkezi, 2. Kat</p>
      </article>
      <article>
        <h2 class="page-title">İletişim Formu</h2>
        <form class="contact-form" @submit.prevent="handleSubmit">
          <label>Ad Soyad<input v-model="form.adSoyad" type="text" required /></label>
          <label>E-posta<input v-model="form.eposta" type="email" required /></label>
          <label>Mesaj<textarea v-model="form.mesaj" rows="5" required /></label>
          <button type="submit">Gönder</button>
        </form>
        <p v-if="durumMesaji" class="feedback">{{ durumMesaji }}</p>
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
.contact-layout { display: grid; grid-template-columns: 1fr 1.1fr; gap: 1rem; }
.contact-form { display: grid; gap: 0.85rem; }
.contact-form label { display: grid; gap: 0.45rem; color: var(--text-muted); font-size: 0.92rem; }
.contact-form input,.contact-form textarea { width: 100%; border-radius: 12px; border: 1px solid rgba(161, 186, 236, 0.33); background: rgba(10, 20, 40, 0.7); color: var(--text-primary); padding: 0.72rem 0.78rem; font: inherit; }
.contact-form button { border: 0; border-radius: 12px; padding: 0.75rem 1rem; font-weight: 600; color: #081327; background: linear-gradient(135deg, #98b8ff 0%, #6f96f1 100%); cursor: pointer; }
.feedback { color: #b5cbff; margin: 0.7rem 0 0; }
@media (max-width: 820px) { .contact-layout { grid-template-columns: 1fr; } }
</style>
