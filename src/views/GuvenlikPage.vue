<template>
  <div class="security-page">
    <section class="security-hero page-section">
      <div>
        <p class="eyebrow">Yönetici alanı</p>
        <h1>Güvenlik Merkezi</h1>
        <p>Kullanıcıların doğrulama durumu, son giriş zamanı ve güvenlik kayıtları yalnızca yetkili yöneticiler tarafından görülebilir.</p>
      </div>
      <RouterLink class="back-link" to="/mesajlar">← Mesaj Merkezi</RouterLink>
    </section>

    <section v-if="isLoading" class="page-section state-panel">
      <span class="spinner" aria-hidden="true" />
      <p>Güvenlik kayıtları yükleniyor…</p>
    </section>

    <section v-else-if="accessDenied" class="page-section denied-panel">
      <span aria-hidden="true">!</span>
      <div><h2>Erişim reddedildi</h2><p>Bu alan yalnızca yönetici rolündeki hesaplara açıktır.</p></div>
    </section>

    <template v-else-if="summary">
      <section class="metric-grid" aria-label="Güvenlik özeti">
        <article class="page-section"><span>Toplam kullanıcı</span><strong>{{ users.length }}</strong></article>
        <article class="page-section"><span>Giriş yapmış hesap</span><strong>{{ signedInUserCount }}</strong></article>
        <article class="page-section"><span>Benzersiz IP · 30 gün</span><strong>{{ summary.unique_ips }}</strong></article>
        <article class="page-section risk-metric"><span>İşaretli oturum</span><strong>{{ summary.flagged_sessions }}</strong></article>
      </section>

      <section class="page-section audit-panel">
        <header class="audit-heading">
          <div>
            <p class="eyebrow">Yönetici denetimi</p>
            <h2>{{ activeTab === 'users' ? 'Kullanıcılar' : 'Oturum kayıtları' }}</h2>
          </div>
          <button type="button" :disabled="isRefreshing" @click="loadSecurityData">
            {{ isRefreshing ? 'Yenileniyor…' : 'Yenile' }}
          </button>
        </header>

        <div class="tabs" role="tablist" aria-label="Güvenlik görünümü">
          <button
            type="button"
            role="tab"
            :aria-selected="activeTab === 'users'"
            :class="{ active: activeTab === 'users' }"
            @click="activeTab = 'users'"
          >Kullanıcılar <span>{{ users.length }}</span></button>
          <button
            type="button"
            role="tab"
            :aria-selected="activeTab === 'sessions'"
            :class="{ active: activeTab === 'sessions' }"
            @click="activeTab = 'sessions'"
          >Oturum kayıtları <span>{{ events.length }}</span></button>
        </div>

        <p v-if="errorMessage" class="error-message" role="status">{{ errorMessage }}</p>

        <div v-if="activeTab === 'users'" class="table-wrap">
          <table class="users-table">
            <thead><tr><th>Kullanıcı</th><th>Yetki</th><th>Doğrulama</th><th>Son giriş</th><th>Son IP</th><th>Cihaz</th></tr></thead>
            <tbody>
              <tr v-for="user in users" :key="user.user_id">
                <td><strong>{{ user.full_name || 'İsimsiz kullanıcı' }}</strong><small>{{ user.email }}</small></td>
                <td><span class="role-badge">{{ roleLabel(user.role) }}</span><small v-if="user.inbox_key">{{ user.inbox_key }}</small></td>
                <td>
                  <span :class="user.email_confirmed_at ? 'safe-badge' : 'pending-badge'">
                    {{ user.email_confirmed_at ? 'Onaylı' : 'Onay bekliyor' }}
                  </span>
                </td>
                <td><strong>{{ formatDate(user.last_sign_in_at, 'Henüz giriş yapmadı') }}</strong><small>Kayıt: {{ formatDate(user.created_at) }}</small></td>
                <td><code>{{ user.last_login_ip ?? 'Audit kaydı yok' }}</code><small>{{ user.last_login_country ?? '—' }}</small></td>
                <td><strong>{{ user.last_device_type ?? 'Bilinmiyor' }}</strong><small>{{ deviceLabel(user.last_browser_name, user.last_operating_system) }}</small></td>
              </tr>
              <tr v-if="!users.length"><td colspan="6" class="empty-cell">Kullanıcı bulunamadı.</td></tr>
            </tbody>
          </table>
        </div>

        <div v-else class="table-wrap">
          <table>
            <thead><tr><th>Hesap</th><th>Son görülme</th><th>IP</th><th>Konum</th><th>Cihaz</th><th>Güvenlik</th></tr></thead>
            <tbody>
              <tr v-for="event in events" :key="event.id">
                <td><strong>{{ event.email }}</strong><small>{{ event.auth_provider ?? 'email' }} · {{ event.assurance_level ?? 'aal1' }}</small></td>
                <td>{{ formatDate(event.last_seen_at) }}</td>
                <td><code>{{ event.ip_address ?? 'Bilinmiyor' }}</code></td>
                <td>{{ event.country_code ?? '—' }}</td>
                <td :title="event.user_agent ?? ''"><strong>{{ event.device_type }}</strong><small>{{ deviceLabel(event.browser_name, event.operating_system) }}</small></td>
                <td>
                  <span v-if="event.risk_flags.length" class="risk-badge">{{ riskLabel(event.risk_flags) }}</span>
                  <span v-else class="safe-badge">Normal</span>
                </td>
              </tr>
              <tr v-if="!events.length"><td colspan="6" class="empty-cell">Henüz başarılı oturum audit kaydı oluşmadı.</td></tr>
            </tbody>
          </table>
        </div>

        <p class="privacy-note">
          “Son giriş” Supabase Auth kaydından gelir. IP ve cihaz bilgileri yalnızca record-login Edge Function çalışıyorsa görünür. Parola ve oturum tokenları kaydedilmez.
        </p>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { getMyProfile } from '@/lib/messages'
import {
  getAdminUserActivity,
  getLoginEvents,
  getSecuritySummary,
  type AdminUserActivity,
  type LoginEvent,
  type SecuritySummary,
} from '@/lib/security'

const events = ref<LoginEvent[]>([])
const users = ref<AdminUserActivity[]>([])
const summary = ref<SecuritySummary | null>(null)
const activeTab = ref<'users' | 'sessions'>('users')
const isLoading = ref(true)
const isRefreshing = ref(false)
const accessDenied = ref(false)
const errorMessage = ref('')

const signedInUserCount = computed(() => users.value.filter((user) => user.last_sign_in_at).length)

const formatDate = (value: string | null, emptyLabel = '—') => value
  ? new Intl.DateTimeFormat('tr-TR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))
  : emptyLabel

const deviceLabel = (browser: string | null, operatingSystem: string | null) =>
  [browser, operatingSystem].filter(Boolean).join(' · ') || 'Audit kaydı yok'

const roleLabel = (role: AdminUserActivity['role']) => ({
  admin: 'Yönetici',
  senator: 'Senato',
  member: 'Üye',
})[role] ?? role

const riskLabel = (flags: string[]) => flags.map((flag) => ({
  new_ip: 'Yeni IP',
  country_changed: 'Ülke değişti',
})[flag] ?? flag).join(', ')

const loadSecurityData = async () => {
  isRefreshing.value = true
  errorMessage.value = ''
  try {
    const profile = await getMyProfile()
    if (profile.role !== 'admin') {
      accessDenied.value = true
      return
    }
    const [summaryData, eventData, userData] = await Promise.all([
      getSecuritySummary(30),
      getLoginEvents(),
      getAdminUserActivity(),
    ])
    summary.value = summaryData
    events.value = eventData
    users.value = userData
  } catch (error) {
    console.error('Security dashboard could not be loaded:', error)
    errorMessage.value = 'Kullanıcı etkinliği alınamadı. 202610140002_admin_user_activity.sql migration dosyasını Supabase SQL Editor’da çalıştırın.'
  } finally {
    isLoading.value = false
    isRefreshing.value = false
  }
}

onMounted(loadSecurityData)
</script>

<style scoped>
.security-page { display: grid; gap: 1rem; }
.security-hero { display: flex; justify-content: space-between; align-items: end; gap: 1rem; }
.eyebrow { margin: 0; color: var(--accent-strong); font-size: 0.72rem; font-weight: 750; letter-spacing: 0.14em; text-transform: uppercase; }
.security-hero h1 { margin: 0.55rem 0 0; font-size: clamp(2.1rem, 5vw, 3.6rem); }
.security-hero p:last-child { margin: 0.7rem 0 0; color: #a9b8d0; max-width: 76ch; }
.back-link { color: #c2d6fa; text-decoration: none; white-space: nowrap; }
.metric-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
.metric-grid article { display: grid; gap: 0.65rem; }
.metric-grid span { color: #8fa0ba; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.08em; }
.metric-grid strong { font-size: clamp(1.8rem, 4vw, 2.7rem); }
.risk-metric strong { color: #ffd28b; }
.audit-panel { padding: 0; overflow: hidden; }
.audit-heading { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 1.25rem; border-bottom: 1px solid rgba(171, 195, 236, 0.15); }
.audit-heading h2 { margin: 0.45rem 0 0; }
.audit-heading button { min-height: 38px; border: 1px solid rgba(177, 201, 241, 0.28); border-radius: 9px; padding: 0 0.8rem; color: #e7efff; background: rgba(131, 163, 225, 0.12); cursor: pointer; }
.audit-heading button:disabled { cursor: wait; opacity: 0.65; }
.tabs { display: flex; gap: 0.4rem; padding: 0.8rem 1.25rem 0; border-bottom: 1px solid rgba(171, 195, 236, 0.15); }
.tabs button { border: 0; border-bottom: 2px solid transparent; padding: 0.7rem 0.85rem; color: #8496b2; background: transparent; cursor: pointer; }
.tabs button.active { border-bottom-color: #8cb3ff; color: #e5eeff; }
.tabs span { margin-left: 0.35rem; border-radius: 999px; padding: 0.15rem 0.4rem; background: rgba(141, 175, 238, 0.12); font-size: 0.65rem; }
.table-wrap { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; min-width: 900px; }
.users-table { min-width: 1040px; }
th, td { padding: 0.85rem 1rem; text-align: left; border-bottom: 1px solid rgba(164, 189, 233, 0.11); font-size: 0.76rem; }
th { color: #8294b1; font-size: 0.66rem; text-transform: uppercase; letter-spacing: 0.08em; }
td { color: #c2cee2; }
td strong, td small { display: block; }
td small { margin-top: 0.2rem; color: #7385a1; }
td code { color: #c9daf8; }
.risk-badge, .safe-badge, .pending-badge, .role-badge { display: inline-flex; border-radius: 999px; padding: 0.3rem 0.55rem; font-size: 0.65rem; font-weight: 700; }
.risk-badge { color: #ffd8a1; background: rgba(191, 126, 31, 0.16); }
.safe-badge { color: #bcebcf; background: rgba(43, 153, 96, 0.14); }
.pending-badge { color: #ffe0a5; background: rgba(203, 143, 46, 0.14); }
.role-badge { color: #cfe0ff; background: rgba(91, 132, 212, 0.16); }
.privacy-note { margin: 0; padding: 1rem 1.25rem; color: #7587a4; font-size: 0.72rem; }
.error-message { margin: 1rem; padding: 0.75rem; border-radius: 9px; color: #ffd0d8; background: rgba(173, 48, 70, 0.13); }
.state-panel, .denied-panel { min-height: 260px; display: flex; align-items: center; justify-content: center; gap: 1rem; }
.denied-panel > span { width: 42px; height: 42px; display: grid; place-items: center; border-radius: 50%; background: rgba(173, 48, 70, 0.15); }
.denied-panel h2, .denied-panel p { margin: 0; }
.denied-panel p { margin-top: 0.4rem; color: #9dacc4; }
.spinner { width: 28px; height: 28px; border: 2px solid rgba(168, 195, 243, 0.22); border-top-color: #bad2ff; border-radius: 50%; animation: spin 0.8s linear infinite; }
.empty-cell { padding: 2rem; text-align: center; color: #7f90aa; }
@keyframes spin { to { transform: rotate(360deg); } }
@media (max-width: 850px) { .metric-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 560px) { .security-hero { align-items: flex-start; flex-direction: column; } .metric-grid { grid-template-columns: 1fr; } .tabs { padding-inline: 0.6rem; } }
</style>
