<template>
  <div class="page-stack">
    <section class="page-hero page-section">
      <p class="hero-tag">Eskişehir MBA Senatosu</p>
      <h1 class="hero-title">İletişim</h1>
      <p class="hero-subtitle">
        Senato ile görüş, öneri ve geri bildirimlerinizi doğrudan paylaşın.
      </p>
    </section>

    <section class="page-section contact-layout">
      <article>
        <h2 class="page-title">İletişim Bilgileri</h2>
        <p class="page-subtitle">E-posta: senato@eskisehirmba.k12.tr</p>
        <div class="social-block">
          <p class="social-title">Sosyal Medya</p>
          <div class="social-links">
            <a
              class="social-pill"
              href="https://www.tiktok.com/@esmbasenato"
              target="_blank"
              rel="noreferrer"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M19.59 6.69A4.83 4.83 0 0 1 16 5.14V14.3a5.72 5.72 0 1 1-4.95-5.67v2.88a2.84 2.84 0 1 0 2.07 2.73V2h2.88a4.8 4.8 0 0 0 3.59 4.69Z"
                />
              </svg>
              <span>TikTok</span>
            </a>
            <a
              class="social-pill"
              href="https://x.com/Esmbasenato"
              target="_blank"
              rel="noreferrer"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="m18.9 2.25h3.45l-7.54 8.62L23.7 21.75h-6.96l-5.46-6.82-5.97 6.82H1.86l8.06-9.2L1.5 2.25h7.14l4.93 6.31zM17.7 19.7h1.91L7.6 4.2H5.56z"
                />
              </svg>
              <span>X</span>
            </a>
            <a
              class="social-pill"
              href="https://www.instagram.com/esmbaokullarisenato/"
              target="_blank"
              rel="noreferrer"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2m0 1.9A3.85 3.85 0 0 0 3.9 7.75v8.5a3.85 3.85 0 0 0 3.85 3.85h8.5a3.85 3.85 0 0 0 3.85-3.85v-8.5a3.85 3.85 0 0 0-3.85-3.85zm8.95 1.43a1.14 1.14 0 1 1 0 2.28a1.14 1.14 0 0 1 0-2.28M12 7a5 5 0 1 1 0 10a5 5 0 0 1 0-10m0 1.9a3.1 3.1 0 1 0 0 6.2a3.1 3.1 0 0 0 0-6.2"
                />
              </svg>
              <span>Instagram</span>
            </a>
          </div>
        </div>
      </article>
      <article>
        <h2 class="page-title">İletişim Formu</h2>
        <form class="contact-form" @submit.prevent="handleSubmit">
          <label
            >Ad Soyad<input v-model="form.adSoyad" type="text" required
          /></label>
          <label
            >E-posta<input v-model="form.eposta" type="email" required
          /></label>
          <label
            >Mesaj<textarea v-model="form.mesaj" rows="5" required />
          </label>
          <button type="submit">Gönder</button>
        </form>
        <p v-if="durumMesaji" class="feedback">{{ durumMesaji }}</p>
      </article>
    </section>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";

const form = reactive({ adSoyad: "", eposta: "", mesaj: "" });
const durumMesaji = ref("");

const handleSubmit = () => {
  durumMesaji.value =
    "Mesajınız alındı. En kısa sürede sizinle iletişime geçeceğiz.";
  form.adSoyad = "";
  form.eposta = "";
  form.mesaj = "";
};
</script>

<style scoped>
.page-stack {
  display: grid;
  gap: 1rem;
}

.page-hero {
  position: relative;
  overflow: hidden;
}

.page-hero::after {
  content: "";
  position: absolute;
  width: min(360px, 45vw);
  height: min(360px, 45vw);
  border-radius: 50%;
  left: -110px;
  top: -120px;
  background: radial-gradient(
    circle,
    rgba(116, 153, 248, 0.2),
    rgba(116, 153, 248, 0)
  );
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

.hero-title {
  margin: 1.1rem 0 0.8rem;
  font-size: clamp(2rem, 4.8vw, 3.4rem);
  line-height: 1.05;
}

.hero-subtitle {
  margin: 0;
  max-width: 70ch;
  color: #d9e6ff;
  line-height: 1.74;
}

.contact-layout {
  display: grid;
  grid-template-columns: 1fr 1.1fr;
  gap: 1rem;
}

.contact-form {
  display: grid;
  gap: 0.85rem;
}

.contact-form label {
  display: grid;
  gap: 0.45rem;
  color: var(--text-secondary);
  font-size: 0.92rem;
}

.contact-form input,
.contact-form textarea {
  width: 100%;
  border-radius: 12px;
  border: 1px solid rgba(161, 186, 236, 0.33);
  background: rgba(10, 20, 40, 0.7);
  color: var(--text-primary);
  padding: 0.72rem 0.78rem;
  font: inherit;
}

.contact-form button {
  border: 0;
  border-radius: 12px;
  padding: 0.75rem 1rem;
  font-weight: 600;
  color: #081327;
  background: linear-gradient(135deg, #98b8ff 0%, #6f96f1 100%);
  cursor: pointer;
}

.social-block {
  margin-top: 1.2rem;
}

.social-title {
  margin: 0 0 0.55rem;
  color: var(--text-secondary);
  font-size: 0.85rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.social-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
}

.social-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.42rem;
  border: 1px solid rgba(165, 188, 229, 0.28);
  border-radius: 999px;
  padding: 0.4rem 0.68rem;
  color: var(--text-primary);
  text-decoration: none;
  background: rgba(134, 162, 216, 0.1);
  font-size: 0.82rem;
  font-weight: 600;
  transition:
    transform 180ms ease,
    background-color 180ms ease,
    border-color 180ms ease;
}

.social-pill svg {
  width: 0.95rem;
  height: 0.95rem;
}

.social-pill:hover,
.social-pill:focus-visible {
  transform: translateY(-1px);
  background: rgba(134, 162, 216, 0.2);
  border-color: rgba(181, 200, 234, 0.5);
  outline: none;
}

.feedback {
  color: #b5cbff;
  margin: 0.7rem 0 0;
}

@media (max-width: 820px) {
  .contact-layout {
    grid-template-columns: 1fr;
  }
}
</style>
