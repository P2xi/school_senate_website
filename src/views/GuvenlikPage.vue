<template>
  <div class="security-page">
    <section class="security-hero page-section">
      <div>
        <p class="eyebrow">Yönetici alanı</p>
        <h1>Güvenlik Merkezi</h1>
        <p>Başarılı oturumlar, IP değişimleri ve cihaz bilgileri yalnızca yetkili yöneticiler tarafından görülebilir.</p>
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
      <section class="metric-grid" aria-label="Son 30 gün güvenlik özeti">
        <article class="page-section"><span>Başarılı oturum</span><strong>{{ summary.successful_sessions }}</strong></article>
        <article class="page-section"><span>Hesap</span><strong>{{ summary.unique_accounts }}</strong></article>
        <article class="page-section"><span>Benzersiz IP</span><strong>{{ summary.unique_ips }}</strong></article>
        <article class="page-section risk-metric"><span>İşaretli oturum</span><strong>{{ summary.flagged_sessions }}</strong></article>
      </section>

      <section class="page-section audit-panel">
        <header class="audit-heading">
          <div><p class="eyebrow">Son 250 kayıt</p><h2>Oturum denetim günlüğü</h2></div>
          <button type="button" :disabled="isRefreshing" @click="loadSecurityData">
            {{ isRefreshing ? 'Yenileniyor…' : 'Yenile' }}
          </button>
        </header>

        <p v-if="errorMessage" class="error-message" role="status">{{ errorMessage }}</p>

        <div class="table-wrap">
          <table>
            <thead><tr><th>Hesap</th><th>Son görülme</th><th>IP</th><th>Konum</th><th>Cihaz</th><th>Güvenlik</th></tr></thead>
            <tbody>
              <tr v-for="event in events" :key="event.id">
                <td><strong>{{ event.email }}</strong><small>{{ event.auth_provider ?? 'email' }} · {{ event.assurance_level ?? 'aal1' }}</small></td>
                <td>{{ formatDate(event.last_seen_at) }}</td>
                <td><code>{{ event.ip_address ?? 'Bilinmiyor' }}</code></td>
                <td>{{ event.country_code ?? '—' }}</td>
                <td :title="event.user_agent ?? ''"><strong>{{ event.device_type }}</strong><small>{{ event.browser_name }} · {{ event.operating_system }}</small></td>
                <td>
                  <span v-if="event.risk_flags.length" class="risk-badge">{{ riskLabel(event.risk_flags) }}</span>
                  <span v-else class="safe-badge">Normal</span>
                </td>
              </tr>
              <tr v-if="!events.length"><td colspan="6" class="empty-cell">Henüz başarılı oturum kaydı oluşmadı.</td></tr>
            </tbody>
          </table>
        </div>

        <p class="privacy-note">IP ve cihaz kayıtları güvenlik amacıyla en fazla 90 gün saklanmalıdır. Parola ve oturum tokenları kaydedilmez.</p>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { getMyProfile } from '@/lib/messages'
import { getLoginEvents, getSecuritySummary, type LoginEvent, type SecuritySummary } from '@/lib/security'

const events = ref<LoginEvent[]>([])
const summary = ref<SecuritySummary | null>(null)
const isLoading = ref(true)
const isRefreshing = ref(false)
const accessDenied = ref(false)
const errorMessage = ref('')

const formatDate = (value: string) => new Intl.DateTimeFormat('tr-TR', {
  dateStyle: 'medium', timeStyle: 'short',
}).format(new Date(value))

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
    const [summaryData, eventData] = await Promise.all([getSecuritySummary(30), getLoginEvents()])
    summary.value = summaryData
    events.value = eventData
  } catch {
    errorMessage.value = 'Güvenlik kayıtları alınamadı. Migration ve Edge Function kurulumunu kontrol edin.'
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
.security-hero p:last-child { margin: 0.7rem 0 0; color: #a9b8d0; max-width: 70ch; }
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
.table-wrap { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; min-width: 900px; }
th, td { padding: 0.85rem 1rem; text-align: left; border-bottom: 1px solid rgba(164, 189, 233, 0.11); font-size: 0.76rem; }
th { color: #8294b1; font-size: 0.66rem; text-transform: uppercase; letter-spacing: 0.08em; }
td { color: #c2cee2; }
td strong, td small { display: block; }
td small { margin-top: 0.2rem; color: #7385a1; }
td code { color: #c9daf8; }
.risk-badge, .safe-badge { display: inline-flex; border-radius: 999px; padding: 0.3rem 0.55rem; font-size: 0.65rem; font-weight: 700; }
.risk-badge { color: #ffd8a1; background: rgba(191, 126, 31, 0.16); }
.safe-badge { color: #bcebcf; background: rgba(43, 153, 96, 0.14); }
.privacy-note { margin: 0; padding: 1rem 1.25rem; color: #7587a4; font-size: 0.72rem; }
.error-message { margin: 1rem; padding: 0.75rem; border-radius: 9px; color: #ffd0d8; background: rgba(173, 48, 70, 0.13); }
.state-panel, .denied-panel { min-height: 260px; display: flex; align-items: center; justify-content: center; gap: 1rem; }
.denied-panel > span { width: 42px; height: 42px; display: grid; place-items: center; border-radius: 50%; background: rgba(173, 48, 70, 0.15); }
.denied-panel h2, .denied-panel p { margin: 0; }
.denied-panel p { margin-top: 0.4rem; color: #9dacC4; }
.spinner { width: 28px; height: 28px; border: 2px solid rgba(168, 195, 243, 0.22); border-top-color: #bad2ff; border-radius: 50%; animation: spin 0.8s linear infinite; }
.empty-cell { padding: 2rem; text-align: center; color: #7f90aa; }
@keyframes spin { to { transform: rotate(360deg); } }
@media (max-width: 850px) { .metric-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 560px) { .security-hero { align-items: flex-start; flex-direction: column; } .metric-grid { grid-template-columns: 1fr; } }
</style>

