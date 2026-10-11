<template>
  <div class="page-stack">
    <section class="page-hero page-section">
      <p class="hero-tag">Eskişehir MBA Senatosu</p>
      <h1 class="hero-title">Senatoya ulaşın</h1>
      <p class="hero-subtitle">
        Görüş, öneri ve taleplerinizi ilgili senato başkanlığına güvenli biçimde iletin; yanıtları hesabınızdan takip edin.
      </p>
    </section>

    <section class="page-section contact-layout">
      <article class="contact-info">
        <p class="section-kicker">Doğrudan iletişim</p>
        <h2 class="page-title">Mesajınız doğru kişiye ulaşsın</h2>
        <p class="page-subtitle">
          Başkanlığı seçin, konuyu özetleyin ve mesajınızı gönderin. Mesajınız yalnızca siz ve seçtiğiniz başkanlığın yetkili hesabı tarafından görüntülenebilir.
        </p>

        <ol class="process-list">
          <li><span>01</span><div><strong>Başkanlığı seçin</strong><p>Talebinizin ilgili olduğu birimi belirleyin.</p></div></li>
          <li><span>02</span><div><strong>Mesajınızı gönderin</strong><p>Hesabınızla güvenli şekilde kayıt altına alınır.</p></div></li>
          <li><span>03</span><div><strong>Yanıtı takip edin</strong><p>Mesaj Merkezi üzerinden durum ve cevapları görün.</p></div></li>
        </ol>

        <div class="alternate-contact">
          <span>E-posta</span>
          <a href="mailto:senato@eskisehirmba.k12.tr">senato@eskisehirmba.k12.tr</a>
        </div>
      </article>

      <article class="message-card">
        <div v-if="isLoading" class="state-panel" aria-live="polite">
          <span class="spinner" aria-hidden="true" />
          <p>Oturum bilgileri yükleniyor…</p>
        </div>

        <div v-else-if="!user" class="state-panel state-panel-login">
          <span class="state-icon" aria-hidden="true">✦</span>
          <p class="section-kicker">Güvenli mesajlaşma</p>
          <h2>Mesaj göndermek için giriş yapın</h2>
          <p>Hesabınız, mesajınızı ve gelecek yanıtları yalnızca sizin görebilmenizi sağlar.</p>
          <RouterLink class="primary-action" :to="{ path: '/uyelik', query: { redirect: '/iletisim' } }">
            Giriş yap veya hesap oluştur
          </RouterLink>
        </div>

        <form v-else class="contact-form" @submit.prevent="handleSubmit">
          <div class="form-heading">
            <div>
              <p class="section-kicker">Yeni mesaj</p>
              <h2>Başkanlığa yazın</h2>
            </div>
            <RouterLink class="message-center-link" to="/mesajlar">Mesajlarım →</RouterLink>
          </div>

          <p class="sender-line">
            <span aria-hidden="true">●</span>
            {{ displayName }} hesabıyla gönderilecek
          </p>

          <label>
            <span>Alıcı başkanlık</span>
            <select v-model="form.recipientKey" required>
              <option v-for="recipient in SENATE_RECIPIENTS" :key="recipient.key" :value="recipient.key">
                {{ recipient.role }} — {{ recipient.name }}
              </option>
            </select>
          </label>

          <label>
            <span>Konu</span>
            <input v-model.trim="form.subject" type="text" minlength="3" maxlength="120" required placeholder="Mesajınızın kısa konusu" />
          </label>

          <label>
            <span>Mesaj</span>
            <textarea v-model.trim="form.body" rows="7" minlength="10" maxlength="4000" required placeholder="Görüşünüzü veya talebinizi açıkça paylaşın…" />
            <small>{{ form.body.length }} / 4000</small>
          </label>

          <p v-if="feedback" class="feedback" :class="`is-${feedback.type}`" role="status">{{ feedback.text }}</p>

          <button type="submit" :disabled="isSubmitting">
            {{ isSubmitting ? 'Gönderiliyor…' : 'Mesajı gönder' }}
          </button>
        </form>
      </article>
    </section>

    <section class="social-section page-section">
      <div>
        <p class="section-kicker">Sosyal medya</p>
        <h2 class="page-title">Bizi takip edin</h2>
      </div>
      <div class="social-links">
        <a href="https://www.instagram.com/esmbaokullarisenato/" target="_blank" rel="noreferrer">Instagram</a>
        <a href="https://www.tiktok.com/@esmbasenato" target="_blank" rel="noreferrer">TikTok</a>
        <a href="https://x.com/Esmbasenato" target="_blank" rel="noreferrer">X</a>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { SENATE_RECIPIENTS, type SenateRecipientKey } from '@/data/senateRecipients'
import { createMessage, isMessagingSchemaError } from '@/lib/messages'

type Feedback = { type: 'success' | 'error'; text: string }

const { user, displayName, isLoading, initializeAuth } = useAuth()
const form = reactive<{ recipientKey: SenateRecipientKey; subject: string; body: string }>({
  recipientKey: 'senato-baskani',
  subject: '',
  body: '',
})
const feedback = ref<Feedback | null>(null)
const isSubmitting = ref(false)

const handleSubmit = async () => {
  feedback.value = null
  isSubmitting.value = true

  try {
    await createMessage({
      recipientKey: form.recipientKey,
      subject: form.subject,
      body: form.body,
    })
    form.subject = ''
    form.body = ''
    feedback.value = {
      type: 'success',
      text: 'Mesajınız güvenli şekilde iletildi. Yanıtı Mesaj Merkezi’nden takip edebilirsiniz.',
    }
  } catch (error) {
    feedback.value = {
      type: 'error',
      text: isMessagingSchemaError(error)
        ? 'Mesaj sistemi henüz veritabanında etkinleştirilmemiş. Lütfen yöneticiye bildirin.'
        : 'Mesaj gönderilemedi. Lütfen bağlantınızı kontrol edip tekrar deneyin.',
    }
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => initializeAuth())
</script>

<style scoped>
.page-stack { display: grid; gap: 1rem; }
.page-hero { position: relative; overflow: hidden; }
.page-hero::after { content: ''; position: absolute; width: min(430px, 48vw); height: min(430px, 48vw); border-radius: 50%; right: -120px; top: -170px; background: radial-gradient(circle, rgba(116, 153, 248, 0.2), transparent 68%); pointer-events: none; }
.hero-tag, .section-kicker { margin: 0; color: var(--accent-strong); font-size: 0.74rem; letter-spacing: 0.14em; text-transform: uppercase; font-weight: 700; }
.hero-title { margin: 1rem 0 0.8rem; font-size: clamp(2.2rem, 5vw, 3.7rem); line-height: 1.03; }
.hero-subtitle { margin: 0; max-width: 72ch; color: #d9e6ff; line-height: 1.74; }
.contact-layout { display: grid; grid-template-columns: minmax(0, 0.88fr) minmax(420px, 1.12fr); gap: clamp(1.2rem, 4vw, 3rem); }
.contact-info { padding: 0.4rem 0.3rem; }
.page-title { margin: 0.65rem 0 0; font-size: clamp(1.55rem, 3vw, 2.25rem); line-height: 1.14; }
.page-subtitle { color: var(--text-secondary); line-height: 1.75; }
.process-list { list-style: none; margin: 2rem 0; padding: 0; display: grid; gap: 1rem; }
.process-list li { display: grid; grid-template-columns: 42px 1fr; gap: 0.85rem; align-items: start; }
.process-list li > span { display: grid; place-items: center; width: 38px; height: 38px; border-radius: 11px; color: #cfe0ff; background: rgba(125, 158, 224, 0.13); border: 1px solid rgba(166, 192, 240, 0.2); font-size: 0.68rem; font-weight: 800; }
.process-list strong { color: #edf4ff; }
.process-list p { margin: 0.25rem 0 0; color: #98a9c5; font-size: 0.88rem; line-height: 1.55; }
.alternate-contact { display: grid; gap: 0.25rem; padding-top: 1.2rem; border-top: 1px solid rgba(167, 190, 232, 0.16); }
.alternate-contact span { color: #7f91ae; font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.1em; }
.alternate-contact a { width: fit-content; color: #cfe0ff; text-decoration: none; }
.message-card { min-height: 520px; display: grid; align-items: center; padding: clamp(1.25rem, 3vw, 2rem); border: 1px solid rgba(175, 197, 235, 0.27); border-radius: 22px; background: radial-gradient(circle at 94% 0%, rgba(124, 161, 234, 0.2), transparent 40%), rgba(9, 20, 40, 0.78); box-shadow: 0 22px 52px rgba(2, 8, 20, 0.28); }
.contact-form { display: grid; gap: 1rem; }
.form-heading { display: flex; justify-content: space-between; align-items: end; gap: 1rem; margin-bottom: 0.15rem; }
.form-heading h2, .state-panel h2 { margin: 0.4rem 0 0; font-size: clamp(1.5rem, 3vw, 2.1rem); }
.message-center-link { color: #b9d0fa; text-decoration: none; font-size: 0.83rem; white-space: nowrap; }
.sender-line { margin: 0; display: flex; align-items: center; gap: 0.45rem; color: #aabbd5; font-size: 0.8rem; }
.sender-line span { color: #72d49f; font-size: 0.62rem; }
.contact-form label { display: grid; gap: 0.45rem; color: #dce7f9; font-size: 0.84rem; font-weight: 650; }
.contact-form input, .contact-form textarea, .contact-form select { width: 100%; border-radius: 11px; border: 1px solid rgba(161, 186, 236, 0.3); background: rgba(5, 14, 29, 0.7); color: var(--text-primary); padding: 0.75rem 0.8rem; font: inherit; outline: none; }
.contact-form select { min-height: 48px; }
.contact-form textarea { resize: vertical; min-height: 145px; }
.contact-form input:focus, .contact-form textarea:focus, .contact-form select:focus { border-color: rgba(157, 190, 249, 0.7); box-shadow: 0 0 0 3px rgba(105, 151, 235, 0.12); }
.contact-form small { justify-self: end; color: #70819d; font-weight: 500; }
.contact-form button, .primary-action { min-height: 48px; display: inline-grid; place-items: center; border: 0; border-radius: 11px; padding: 0.75rem 1rem; color: #081327; background: linear-gradient(135deg, #dbe8ff, #8eaff1); font-weight: 750; cursor: pointer; text-decoration: none; }
.contact-form button:disabled { opacity: 0.62; cursor: wait; }
.feedback { margin: 0; border-radius: 10px; padding: 0.75rem 0.85rem; font-size: 0.84rem; line-height: 1.5; }
.feedback.is-success { color: #ccf8df; background: rgba(43, 154, 101, 0.14); border: 1px solid rgba(100, 220, 158, 0.18); }
.feedback.is-error { color: #ffd7dd; background: rgba(173, 48, 70, 0.16); border: 1px solid rgba(255, 137, 157, 0.2); }
.state-panel { text-align: center; display: grid; justify-items: center; gap: 0.85rem; }
.state-panel > p { margin: 0; color: #aebdd5; line-height: 1.65; max-width: 44ch; }
.state-icon { display: grid; place-items: center; width: 62px; height: 62px; margin-bottom: 0.5rem; border-radius: 18px; color: #dce9ff; background: rgba(130, 163, 228, 0.15); border: 1px solid rgba(185, 207, 248, 0.22); font-size: 1.4rem; }
.primary-action { margin-top: 0.65rem; }
.spinner { width: 26px; height: 26px; border: 2px solid rgba(168, 195, 243, 0.22); border-top-color: #bad2ff; border-radius: 50%; animation: spin 0.8s linear infinite; }
.social-section { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
.social-links { display: flex; flex-wrap: wrap; gap: 0.55rem; }
.social-links a { border: 1px solid rgba(165, 188, 229, 0.28); border-radius: 999px; padding: 0.55rem 0.85rem; color: var(--text-primary); text-decoration: none; background: rgba(134, 162, 216, 0.1); font-size: 0.82rem; font-weight: 650; }
@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 900px) {
  .contact-layout { grid-template-columns: 1fr; }
  .contact-info { padding: 0; }
  .message-card { min-height: 0; }
}

@media (max-width: 560px) {
  .form-heading, .social-section { align-items: flex-start; flex-direction: column; }
  .contact-layout { padding-inline: 1rem; }
  .message-card { padding: 1.15rem; }
}

@media (prefers-reduced-motion: reduce) { .spinner { animation: none; } }
</style>
