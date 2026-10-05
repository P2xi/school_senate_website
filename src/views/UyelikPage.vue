<template>
  <section class="auth-page">
    <div class="auth-intro">
      <span class="eyebrow">Senato üyeliği</span>
      <h1>Topluluğun bir parçası ol.</h1>
      <p>
        Senato hesabınla duyuruları ve ileride açılacak üyelere özel içerikleri tek bir yerden takip et.
      </p>

      <ul class="benefit-list" aria-label="Üyelik avantajları">
        <li><span>01</span> Güvenli ve kalıcı oturum</li>
        <li><span>02</span> Doğrulanmış e-posta hesabı</li>
        <li><span>03</span> Üyelere özel içeriklere hazır altyapı</li>
      </ul>
    </div>

    <div class="auth-card">
      <div v-if="isLoading" class="status-panel" aria-live="polite">
        <span class="spinner" aria-hidden="true" />
        <p>Oturum bilgileri yükleniyor…</p>
      </div>

      <div v-else-if="!isConfigured" class="status-panel status-panel-warning">
        <span class="status-icon" aria-hidden="true">!</span>
        <div>
          <h2>Supabase bağlantısı bekleniyor</h2>
          <p>Üyelik sistemini açmak için proje URL'sini ve publishable key'i ortam değişkenlerine ekleyin.</p>
        </div>
      </div>

      <div v-else-if="user && mode !== 'reset'" class="account-panel">
        <span class="account-avatar" aria-hidden="true">{{ initials }}</span>
        <span class="eyebrow">Oturum açık</span>
        <h2>{{ displayName }}</h2>
        <p>{{ user.email }}</p>
        <p v-if="user.email_confirmed_at" class="verified-badge">E-posta doğrulandı</p>
        <p v-if="message" class="form-message" :class="`is-${message.type}`" role="status">{{ message.text }}</p>

        <button class="primary-button danger-button" type="button" :disabled="isSubmitting" @click="handleSignOut">
          {{ isSubmitting ? 'Çıkış yapılıyor…' : 'Çıkış yap' }}
        </button>
      </div>

      <form v-else class="auth-form" @submit.prevent="handleSubmit">
        <div class="form-heading">
          <span class="eyebrow">{{ modeLabel.eyebrow }}</span>
          <h2>{{ modeLabel.title }}</h2>
          <p>{{ modeLabel.description }}</p>
        </div>

        <div v-if="mode === 'login' || mode === 'register'" class="mode-tabs" role="tablist" aria-label="Üyelik işlemi">
          <button type="button" :class="{ active: mode === 'login' }" @click="setMode('login')">Giriş yap</button>
          <button type="button" :class="{ active: mode === 'register' }" @click="setMode('register')">Kayıt ol</button>
        </div>

        <label v-if="mode === 'register'" class="field">
          <span>Ad soyad</span>
          <input v-model.trim="fullName" name="name" type="text" autocomplete="name" minlength="2" required placeholder="Adınız Soyadınız" />
        </label>

        <label v-if="mode !== 'reset'" class="field">
          <span>E-posta</span>
          <input v-model.trim="email" name="email" type="email" autocomplete="email" required placeholder="ornek@eposta.com" />
        </label>

        <label v-if="mode !== 'forgot'" class="field">
          <span>{{ mode === 'reset' ? 'Yeni şifre' : 'Şifre' }}</span>
          <input
            v-model="password"
            name="password"
            type="password"
            :autocomplete="mode === 'login' ? 'current-password' : 'new-password'"
            minlength="6"
            required
            placeholder="En az 6 karakter"
          />
        </label>

        <label v-if="mode === 'register' || mode === 'reset'" class="field">
          <span>Şifre tekrarı</span>
          <input v-model="passwordAgain" name="password-confirmation" type="password" autocomplete="new-password" minlength="6" required placeholder="Şifrenizi tekrar yazın" />
        </label>

        <p v-if="message" class="form-message" :class="`is-${message.type}`" role="status">{{ message.text }}</p>

        <button class="primary-button" type="submit" :disabled="isSubmitting">
          {{ isSubmitting ? 'İşlem yapılıyor…' : submitLabel }}
        </button>

        <button v-if="mode === 'login'" class="text-button" type="button" @click="setMode('forgot')">Şifremi unuttum</button>
        <button v-else-if="mode === 'forgot' || mode === 'reset'" class="text-button" type="button" @click="setMode('login')">Giriş ekranına dön</button>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

type AuthMode = 'login' | 'register' | 'forgot' | 'reset'
type FormMessage = { type: 'success' | 'error'; text: string }

const route = useRoute()
const router = useRouter()
const {
  user,
  displayName,
  isLoading,
  isConfigured,
  recoveryRequested,
  initializeAuth,
  signUp,
  signIn,
  signOut,
  sendPasswordReset,
  updatePassword,
} = useAuth()

const initialMode = route.query.mode === 'reset' ? 'reset' : route.query.mode === 'register' ? 'register' : 'login'
const mode = ref<AuthMode>(initialMode)
const fullName = ref('')
const email = ref('')
const password = ref('')
const passwordAgain = ref('')
const isSubmitting = ref(false)
const message = ref<FormMessage | null>(null)

const modeLabel = computed(() => {
  if (mode.value === 'register') return { eyebrow: 'Yeni hesap', title: 'Senatoya katıl', description: 'Bilgilerini girerek üyeliğini birkaç saniyede oluştur.' }
  if (mode.value === 'forgot') return { eyebrow: 'Hesap kurtarma', title: 'Şifreni yenile', description: 'Sıfırlama bağlantısını gönderebilmemiz için e-posta adresini gir.' }
  if (mode.value === 'reset') return { eyebrow: 'Yeni şifre', title: 'Şifreni belirle', description: 'Hesabın için yeni ve güçlü bir şifre oluştur.' }
  return { eyebrow: 'Tekrar hoş geldin', title: 'Hesabına giriş yap', description: 'Senato hesabınla güvenli biçimde devam et.' }
})

const submitLabel = computed(() => {
  if (mode.value === 'register') return 'Hesap oluştur'
  if (mode.value === 'forgot') return 'Sıfırlama bağlantısı gönder'
  if (mode.value === 'reset') return 'Şifreyi güncelle'
  return 'Giriş yap'
})

const initials = computed(() => displayName.value.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toLocaleUpperCase('tr-TR'))

const setMode = (nextMode: AuthMode) => {
  mode.value = nextMode
  password.value = ''
  passwordAgain.value = ''
  message.value = null
  void router.replace({ query: nextMode === 'login' ? {} : { mode: nextMode } })
}

const friendlyError = (error: unknown) => {
  const rawMessage = error instanceof Error ? error.message : ''
  if (/invalid login credentials/i.test(rawMessage)) return 'E-posta veya şifre hatalı.'
  if (/email not confirmed/i.test(rawMessage)) return 'Giriş yapmadan önce e-posta adresini doğrulamalısın.'
  if (/user already registered/i.test(rawMessage)) return 'Bu e-posta adresiyle daha önce hesap oluşturulmuş.'
  if (/password should be at least/i.test(rawMessage)) return 'Şifre en az 6 karakter olmalı.'
  if (/rate limit/i.test(rawMessage)) return 'Çok fazla deneme yapıldı. Lütfen biraz sonra tekrar dene.'
  return rawMessage || 'İşlem tamamlanamadı. Lütfen tekrar dene.'
}

const handleSubmit = async () => {
  message.value = null

  if ((mode.value === 'register' || mode.value === 'reset') && password.value !== passwordAgain.value) {
    message.value = { type: 'error', text: 'Girdiğin şifreler birbiriyle eşleşmiyor.' }
    return
  }

  isSubmitting.value = true
  try {
    if (mode.value === 'register') {
      const data = await signUp(fullName.value, email.value, password.value)
      message.value = data.session
        ? { type: 'success', text: 'Hesabın oluşturuldu ve giriş yapıldı.' }
        : { type: 'success', text: 'Hesabın oluşturuldu. E-postana gelen bağlantıyla hesabını doğrula.' }
    } else if (mode.value === 'forgot') {
      await sendPasswordReset(email.value)
      message.value = { type: 'success', text: 'Şifre sıfırlama bağlantısı e-posta adresine gönderildi.' }
    } else if (mode.value === 'reset') {
      if (!user.value && !recoveryRequested.value) throw new Error('Şifre yenileme bağlantısı geçersiz veya süresi dolmuş.')
      await updatePassword(password.value)
      message.value = { type: 'success', text: 'Şifren güncellendi. Artık yeni şifrenle giriş yapabilirsin.' }
      setTimeout(() => setMode('login'), 1200)
    } else {
      await signIn(email.value, password.value)
      message.value = { type: 'success', text: 'Giriş başarılı.' }
    }
  } catch (error) {
    message.value = { type: 'error', text: friendlyError(error) }
  } finally {
    isSubmitting.value = false
  }
}

const handleSignOut = async () => {
  isSubmitting.value = true
  try {
    await signOut()
    setMode('login')
  } catch (error) {
    message.value = { type: 'error', text: friendlyError(error) }
  } finally {
    isSubmitting.value = false
  }
}

onMounted(async () => {
  await initializeAuth()
  if (recoveryRequested.value) mode.value = 'reset'
})
</script>

<style scoped>
.auth-page {
  min-height: min(720px, calc(100vh - 150px));
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(360px, 0.82fr);
  align-items: center;
  gap: clamp(2rem, 7vw, 7rem);
  padding: clamp(1.5rem, 4vw, 4rem) clamp(0rem, 2vw, 2rem);
}

.auth-intro { max-width: 620px; }
.eyebrow { color: #a9c4fa; font-size: 0.74rem; font-weight: 750; letter-spacing: 0.14em; text-transform: uppercase; }
.auth-intro h1 { margin: 0.75rem 0 0; font-size: clamp(2.4rem, 5.5vw, 5rem); line-height: 0.98; letter-spacing: -0.045em; max-width: 10ch; }
.auth-intro > p { margin: 1.35rem 0 0; color: #b6c3db; line-height: 1.8; max-width: 54ch; }
.benefit-list { list-style: none; padding: 0; margin: 2rem 0 0; display: grid; gap: 0.75rem; color: #dce7fb; }
.benefit-list li { display: flex; align-items: center; gap: 0.85rem; }
.benefit-list span { color: #7f9bd2; font-size: 0.68rem; letter-spacing: 0.1em; }

.auth-card {
  min-height: 520px;
  display: grid;
  align-items: center;
  padding: clamp(1.35rem, 3.2vw, 2.5rem);
  border: 1px solid rgba(175, 193, 222, 0.28);
  border-radius: 24px;
  background: radial-gradient(circle at 90% 0%, rgba(118, 157, 236, 0.18), transparent 42%), rgba(13, 26, 50, 0.92);
  box-shadow: 0 28px 70px rgba(2, 8, 20, 0.38), inset 0 1px 0 rgba(230, 240, 255, 0.08);
}
.form-heading h2, .account-panel h2, .status-panel h2 { margin: 0.5rem 0 0; font-size: clamp(1.65rem, 3vw, 2.2rem); }
.form-heading p, .status-panel p { margin: 0.7rem 0 0; color: #aebbd2; line-height: 1.65; }
.auth-form { display: grid; gap: 1rem; }
.mode-tabs { display: grid; grid-template-columns: 1fr 1fr; gap: 0.3rem; padding: 0.3rem; margin: 0.25rem 0 0.3rem; border-radius: 12px; background: rgba(4, 12, 27, 0.56); }
.mode-tabs button { min-height: 42px; border: 0; border-radius: 9px; color: #9eadc7; background: transparent; cursor: pointer; }
.mode-tabs button.active { color: #f3f7ff; background: rgba(147, 176, 231, 0.16); box-shadow: inset 0 0 0 1px rgba(182, 205, 245, 0.16); }
.field { display: grid; gap: 0.45rem; color: #dce6f8; font-size: 0.84rem; font-weight: 650; }
.field input { width: 100%; min-height: 48px; border: 1px solid rgba(166, 188, 228, 0.24); border-radius: 11px; padding: 0 0.9rem; color: #f3f7ff; background: rgba(5, 14, 29, 0.66); outline: none; transition: border-color 0.2s ease, box-shadow 0.2s ease; }
.field input::placeholder { color: #6f7e98; }
.field input:focus { border-color: rgba(157, 190, 249, 0.68); box-shadow: 0 0 0 3px rgba(105, 151, 235, 0.12); }
.primary-button { min-height: 49px; border: 1px solid rgba(226, 237, 255, 0.62); border-radius: 11px; color: #0b1830; background: linear-gradient(135deg, #f7faff, #c6d9fc); font-weight: 750; cursor: pointer; transition: transform 0.2s ease, box-shadow 0.2s ease; }
.primary-button:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 12px 25px rgba(83, 126, 215, 0.3); }
.primary-button:disabled { opacity: 0.65; cursor: wait; }
.danger-button { margin-top: 1.5rem; color: #ffe9ed; border-color: rgba(255, 155, 171, 0.35); background: rgba(172, 55, 75, 0.2); }
.text-button { justify-self: center; border: 0; padding: 0.2rem; color: #a9c4fa; background: transparent; cursor: pointer; }
.text-button:hover { color: #dce9ff; }
.form-message { margin: 0; border-radius: 10px; padding: 0.75rem 0.85rem; font-size: 0.84rem; line-height: 1.5; }
.form-message.is-error { color: #ffd7dd; background: rgba(173, 48, 70, 0.16); border: 1px solid rgba(255, 137, 157, 0.2); }
.form-message.is-success { color: #ccf8df; background: rgba(43, 154, 101, 0.14); border: 1px solid rgba(100, 220, 158, 0.18); }
.status-panel { display: flex; align-items: flex-start; gap: 1rem; }
.status-panel > p { margin: 0; }
.spinner { width: 24px; height: 24px; flex: 0 0 auto; border: 2px solid rgba(168, 195, 243, 0.22); border-top-color: #bad2ff; border-radius: 50%; animation: spin 0.8s linear infinite; }
.status-icon { display: grid; place-items: center; width: 34px; height: 34px; flex: 0 0 auto; border-radius: 50%; color: #ffe7a6; background: rgba(204, 149, 42, 0.18); font-weight: 800; }
.account-panel { text-align: center; }
.account-panel > p { color: #aebbd2; }
.account-avatar { width: 78px; height: 78px; display: grid; place-items: center; margin: 0 auto 1.5rem; border-radius: 50%; color: #e9f1ff; background: linear-gradient(145deg, #496aa8, #203967); border: 1px solid rgba(211, 227, 255, 0.3); font-size: 1.4rem; font-weight: 800; }
.verified-badge { display: inline-flex; border-radius: 999px; padding: 0.4rem 0.7rem; color: #c7f8da !important; background: rgba(50, 169, 106, 0.13); font-size: 0.76rem; }
@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 860px) {
  .auth-page { grid-template-columns: 1fr; gap: 2rem; padding-top: 1rem; }
  .auth-intro { text-align: center; margin-inline: auto; }
  .auth-intro h1 { max-width: none; }
  .benefit-list { display: none; }
  .auth-card { width: min(100%, 560px); margin-inline: auto; }
}

@media (max-width: 520px) {
  .auth-intro h1 { font-size: 2.25rem; }
  .auth-card { min-height: 0; border-radius: 18px; padding: 1.2rem; }
}

@media (prefers-reduced-motion: reduce) {
  .spinner { animation: none; }
  .primary-button { transition: none; }
}
</style>
