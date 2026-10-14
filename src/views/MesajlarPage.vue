<template>
  <div class="messages-page">
    <section class="messages-hero page-section">
      <div>
        <p class="eyebrow">Güvenli iletişim alanı</p>
        <h1>Mesaj Merkezi</h1>
        <p v-if="profile">
          {{ canManageInbox ? `${inboxTitle} gelen kutusu` : 'Senato başkanlıklarıyla yaptığınız görüşmeler' }}
        </p>
      </div>
      <div class="hero-actions">
        <span v-if="profile" class="role-badge">{{ roleLabel }}</span>
        <RouterLink v-if="profile?.role === 'admin'" class="security-button" to="/guvenlik">Güvenlik</RouterLink>
        <button class="refresh-button" type="button" :disabled="isRefreshing" aria-label="Mesajları yenile" @click="refreshMessages()">
          {{ isRefreshing ? 'Yenileniyor…' : 'Yenile' }}
        </button>
        <button class="new-message-button" type="button" @click="composerOpen = true">+ Yeni mesaj</button>
      </div>
    </section>

    <section v-if="isLoading" class="page-section loading-state" aria-live="polite">
      <span class="spinner" aria-hidden="true" />
      <p>Mesajlar yükleniyor…</p>
    </section>

    <section v-else-if="errorMessage" class="page-section error-state">
      <span aria-hidden="true">!</span>
      <div>
        <h2>Mesajlar görüntülenemedi</h2>
        <p>{{ errorMessage }}</p>
        <button type="button" @click="loadDashboard">Tekrar dene</button>
      </div>
    </section>

    <section v-else class="message-workspace">
      <aside class="message-sidebar page-section">
        <div v-if="canManageInbox" class="box-tabs" role="tablist" aria-label="Mesaj kutusu">
          <button type="button" :class="{ active: activeBox === 'inbox' }" @click="setActiveBox('inbox')">
            Gelen kutusu <span>{{ inboxMessages.length }}</span>
          </button>
          <button type="button" :class="{ active: activeBox === 'sent' }" @click="setActiveBox('sent')">
            Gönderdiklerim <span>{{ sentMessages.length }}</span>
          </button>
        </div>

        <div class="list-heading">
          <h2>{{ activeBox === 'inbox' ? 'Gelen mesajlar' : 'Mesajlarım' }}</h2>
          <span>{{ visibleMessages.length }} konuşma</span>
        </div>

        <div v-if="visibleMessages.length" class="message-list">
          <button
            v-for="message in visibleMessages"
            :key="message.id"
            type="button"
            class="message-list-item"
            :class="{ active: selectedMessage?.id === message.id, unread: message.status === 'new' && activeBox === 'inbox' }"
            @click="selectMessage(message)"
          >
            <span class="list-item-top">
              <strong>{{ activeBox === 'inbox' ? message.sender_name : recipientLabel(message.recipient_key) }}</strong>
              <time :datetime="message.created_at">{{ shortDate(message.created_at) }}</time>
            </span>
            <span class="list-subject">{{ message.subject }}</span>
            <span class="list-preview">{{ message.body }}</span>
            <span class="status-pill" :class="`status-${message.status}`">{{ statusLabel(message.status) }}</span>
          </button>
        </div>

        <div v-else class="empty-list">
          <span aria-hidden="true">◇</span>
          <p>{{ activeBox === 'inbox' ? 'Bu başkanlığa henüz mesaj gelmedi.' : 'Henüz bir mesaj göndermediniz.' }}</p>
          <RouterLink v-if="activeBox === 'sent'" to="/iletisim">İlk mesajı gönder</RouterLink>
        </div>
      </aside>

      <article class="thread-panel page-section">
        <template v-if="selectedMessage">
          <header class="thread-header">
            <div>
              <p class="thread-route">
                {{ selectedMessage.sender_name }}
                <span aria-hidden="true">→</span>
                {{ recipientLabel(selectedMessage.recipient_key) }}
              </p>
              <h2>{{ selectedMessage.subject }}</h2>
              <p class="thread-meta">
                {{ longDate(selectedMessage.created_at) }}
                <template v-if="canManageSelected"> · {{ selectedMessage.sender_email }}</template>
              </p>
            </div>

            <label v-if="canManageSelected" class="status-control">
              <span>Durum</span>
              <select :value="selectedMessage.status" :disabled="isUpdatingStatus" @change="handleStatusChange">
                <option value="new">Yeni</option>
                <option value="in_progress">İnceleniyor</option>
                <option value="answered">Cevaplandı</option>
                <option value="closed">Kapatıldı</option>
              </select>
            </label>
            <span v-else class="status-pill thread-status" :class="`status-${selectedMessage.status}`">
              {{ statusLabel(selectedMessage.status) }}
            </span>
          </header>

          <div class="thread-content">
            <section class="message-bubble original-message">
              <div class="bubble-author">
                <span>{{ initials(selectedMessage.sender_name) }}</span>
                <div><strong>{{ selectedMessage.sender_name }}</strong><small>İlk mesaj</small></div>
              </div>
              <p>{{ selectedMessage.body }}</p>
            </section>

            <div v-if="isLoadingReplies" class="reply-loading">Yanıtlar yükleniyor…</div>
            <section
              v-for="reply in replies"
              v-else
              :key="reply.id"
              class="message-bubble"
              :class="{ 'senate-reply': reply.author_role !== 'member' }"
            >
              <div class="bubble-author">
                <span>{{ initials(reply.author_name) }}</span>
                <div>
                  <strong>{{ reply.author_name }}</strong>
                  <small>{{ reply.author_role === 'member' ? 'Üye' : 'Senato' }} · {{ longDate(reply.created_at) }}</small>
                </div>
              </div>
              <p>{{ reply.body }}</p>
            </section>
          </div>

          <form v-if="selectedMessage.status !== 'closed'" class="reply-form" @submit.prevent="handleReply">
            <label for="reply-body">Yanıtınız</label>
            <textarea id="reply-body" v-model.trim="replyBody" rows="4" maxlength="4000" required placeholder="Yanıtınızı yazın…" />
            <div>
              <p v-if="threadFeedback" :class="`is-${threadFeedback.type}`" role="status">{{ threadFeedback.text }}</p>
              <button type="submit" :disabled="isSendingReply || !replyBody">
                {{ isSendingReply ? 'Gönderiliyor…' : 'Yanıtla' }}
              </button>
            </div>
          </form>
          <p v-else class="closed-notice">Bu konuşma kapatıldı. Yeniden iletişim kurmak için yeni bir mesaj gönderebilirsiniz.</p>
        </template>

        <div v-else class="empty-thread">
          <span aria-hidden="true">✦</span>
          <h2>Bir konuşma seçin</h2>
          <p>Mesajın içeriği ve yanıt geçmişi burada görüntülenecek.</p>
        </div>
      </article>
    </section>

    <MessageComposer :open="composerOpen" @close="composerOpen = false" @sent="handleMessageSent" />
  </div>
</template>

<script setup lang="ts">
import type { RealtimeChannel } from '@supabase/supabase-js'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import MessageComposer from '@/components/MessageComposer.vue'
import { useAuth } from '@/composables/useAuth'
import { getRecipient } from '@/data/senateRecipients'
import {
  createReply,
  getAccessibleMessages,
  getMessageReplies,
  getMyProfile,
  isMessagingSchemaError,
  setMessageStatus,
  subscribeToMessaging,
  unsubscribeFromMessaging,
  type MemberProfile,
  type MessageReply,
  type MessageStatus,
  type SenateMessage,
} from '@/lib/messages'

type MessageBox = 'inbox' | 'sent'
type ThreadFeedback = { type: 'success' | 'error'; text: string }

const { user, initializeAuth } = useAuth()
const route = useRoute()
const router = useRouter()
const profile = ref<MemberProfile | null>(null)
const messages = ref<SenateMessage[]>([])
const replies = ref<MessageReply[]>([])
const selectedMessage = ref<SenateMessage | null>(null)
const activeBox = ref<MessageBox>('sent')
const replyBody = ref('')
const isLoading = ref(true)
const isRefreshing = ref(false)
const isLoadingReplies = ref(false)
const isSendingReply = ref(false)
const isUpdatingStatus = ref(false)
const errorMessage = ref('')
const threadFeedback = ref<ThreadFeedback | null>(null)
const composerOpen = ref(false)
let realtimeChannel: RealtimeChannel | null = null
let realtimeTimer = 0
let openRequestId = 0

const canManageInbox = computed(() => profile.value?.role === 'senator' || profile.value?.role === 'admin')
const sentMessages = computed(() => messages.value.filter((message) => message.sender_id === user.value?.id))
const inboxMessages = computed(() => messages.value.filter((message) => message.sender_id !== user.value?.id))
const visibleMessages = computed(() => activeBox.value === 'inbox' ? inboxMessages.value : sentMessages.value)
const canManageSelected = computed(() => {
  const message = selectedMessage.value
  if (!message || !profile.value) return false
  return profile.value.role === 'admin'
    || (profile.value.role === 'senator' && profile.value.inbox_key === message.recipient_key)
})
const roleLabel = computed(() => {
  if (profile.value?.role === 'admin') return 'Yönetici'
  if (profile.value?.role === 'senator') return 'Senato üyesi'
  return 'Üye'
})
const inboxTitle = computed(() => {
  if (profile.value?.role === 'admin') return 'Tüm başkanlıklar'
  return getRecipient(profile.value?.inbox_key ?? '')?.role ?? 'Başkanlık'
})

const recipientLabel = (key: string) => getRecipient(key)?.role ?? 'Senato Başkanlığı'
const statusLabel = (status: MessageStatus) => ({
  new: 'Yeni',
  in_progress: 'İnceleniyor',
  answered: 'Cevaplandı',
  closed: 'Kapatıldı',
})[status]
const shortDate = (date: string) => new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: 'short' }).format(new Date(date))
const longDate = (date: string) => new Intl.DateTimeFormat('tr-TR', {
  day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
}).format(new Date(date))
const initials = (name: string) => name.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toLocaleUpperCase('tr-TR')

const describeError = (error: unknown) => {
  if (isMessagingSchemaError(error)) {
    return 'Mesaj servisi güncellemesi henüz kurulmamış. Yönetici yeni Supabase migration dosyasını çalıştırmalıdır.'
  }
  const candidate = error as { code?: string; message?: string } | null
  if (candidate?.code === '42501') return 'Bu işlem için yetkiniz bulunmuyor.'
  if (/jwt|session|not authenticated|oturum/i.test(candidate?.message ?? '')) return 'Oturumunuz sona ermiş. Lütfen yeniden giriş yapın.'
  return 'Sunucuyla bağlantı kurulamadı. Lütfen biraz sonra tekrar deneyin.'
}

const openMessage = async (message: SenateMessage) => {
  const requestId = ++openRequestId
  selectedMessage.value = message
  replies.value = []
  replyBody.value = ''
  threadFeedback.value = null
  isLoadingReplies.value = true
  try {
    const messageReplies = await getMessageReplies(message.id)
    if (requestId === openRequestId) replies.value = messageReplies
  } catch (error) {
    if (requestId === openRequestId) threadFeedback.value = { type: 'error', text: describeError(error) }
  } finally {
    if (requestId === openRequestId) isLoadingReplies.value = false
  }
}

const selectMessage = async (message: SenateMessage) => {
  await router.replace({ query: { ...route.query, message: message.id } })
  await openMessage(message)
}

const setActiveBox = (box: MessageBox) => {
  activeBox.value = box
  const firstMessage = box === 'inbox' ? inboxMessages.value[0] : sentMessages.value[0]
  if (firstMessage) void selectMessage(firstMessage)
  else {
    selectedMessage.value = null
    const query = { ...route.query }
    delete query.message
    void router.replace({ query })
  }
}

const loadDashboard = async () => {
  isLoading.value = true
  errorMessage.value = ''
  try {
    await initializeAuth()
    const [profileData, messageData] = await Promise.all([getMyProfile(), getAccessibleMessages()])
    profile.value = profileData
    messages.value = messageData
    const requestedId = typeof route.query.message === 'string' ? route.query.message : ''
    const requestedMessage = messageData.find((message) => message.id === requestedId)
    activeBox.value = requestedMessage
      ? requestedMessage.sender_id === user.value?.id ? 'sent' : 'inbox'
      : profileData.role === 'member' ? 'sent' : 'inbox'
    const firstMessage = requestedMessage
      ?? (activeBox.value === 'inbox' ? inboxMessages.value[0] : sentMessages.value[0])
    if (firstMessage) await openMessage(firstMessage)
  } catch (error) {
    errorMessage.value = describeError(error)
  } finally {
    isLoading.value = false
  }
}

const refreshMessages = async (preferredMessageId?: string) => {
  if (isRefreshing.value) return
  isRefreshing.value = true
  try {
    const previousId = preferredMessageId ?? selectedMessage.value?.id
    messages.value = await getAccessibleMessages()
    const nextMessage = messages.value.find((message) => message.id === previousId)
      ?? visibleMessages.value[0]
      ?? null
    if (nextMessage) await openMessage(nextMessage)
    else selectedMessage.value = null
  } catch (error) {
    if (selectedMessage.value) threadFeedback.value = { type: 'error', text: describeError(error) }
    else errorMessage.value = describeError(error)
  } finally {
    isRefreshing.value = false
  }
}

const handleMessageSent = async (messageId: string) => {
  composerOpen.value = false
  activeBox.value = 'sent'
  await router.replace({ query: { ...route.query, message: messageId } })
  await refreshMessages(messageId)
  threadFeedback.value = { type: 'success', text: 'Mesajınız gönderildi.' }
}

const scheduleRealtimeRefresh = () => {
  window.clearTimeout(realtimeTimer)
  realtimeTimer = window.setTimeout(() => void refreshMessages(), 350)
}

const handleReply = async () => {
  if (!selectedMessage.value || !replyBody.value) return
  isSendingReply.value = true
  threadFeedback.value = null
  try {
    const currentMessage = selectedMessage.value
    await createReply(currentMessage.id, replyBody.value)
    if (canManageSelected.value) currentMessage.status = 'answered'
    replyBody.value = ''
    replies.value = await getMessageReplies(currentMessage.id)
    threadFeedback.value = { type: 'success', text: 'Yanıt gönderildi.' }
  } catch (error) {
    threadFeedback.value = { type: 'error', text: describeError(error) }
  } finally {
    isSendingReply.value = false
  }
}

const handleStatusChange = async (event: Event) => {
  if (!selectedMessage.value) return
  const status = (event.target as HTMLSelectElement).value as MessageStatus
  const previousStatus = selectedMessage.value.status
  isUpdatingStatus.value = true
  threadFeedback.value = null
  try {
    await setMessageStatus(selectedMessage.value.id, status)
    selectedMessage.value.status = status
  } catch (error) {
    selectedMessage.value.status = previousStatus
    threadFeedback.value = { type: 'error', text: describeError(error) }
  } finally {
    isUpdatingStatus.value = false
  }
}

onMounted(async () => {
  await loadDashboard()
  if (!errorMessage.value) realtimeChannel = subscribeToMessaging(scheduleRealtimeRefresh)
})

onBeforeUnmount(() => {
  window.clearTimeout(realtimeTimer)
  void unsubscribeFromMessaging(realtimeChannel)
})
</script>

<style scoped>
.messages-page { display: grid; gap: 1rem; }
.messages-hero { display: flex; align-items: end; justify-content: space-between; gap: 1.5rem; }
.eyebrow { margin: 0; color: var(--accent-strong); font-size: 0.73rem; font-weight: 750; letter-spacing: 0.14em; text-transform: uppercase; }
.messages-hero h1 { margin: 0.6rem 0 0; font-size: clamp(2.1rem, 5vw, 3.6rem); line-height: 1; }
.messages-hero p:last-child { margin: 0.75rem 0 0; color: #aebdd5; }
.hero-actions { display: flex; align-items: center; gap: 0.65rem; }
.role-badge, .status-pill { display: inline-flex; align-items: center; width: fit-content; border-radius: 999px; padding: 0.36rem 0.65rem; font-size: 0.7rem; font-weight: 700; }
.role-badge { color: #d7e5ff; border: 1px solid rgba(178, 201, 241, 0.26); background: rgba(122, 155, 218, 0.12); }
.new-message-button { min-height: 42px; display: inline-flex; align-items: center; border: 0; border-radius: 11px; padding: 0 0.9rem; color: #0b1830; background: linear-gradient(135deg, #f2f7ff, #b5cdf8); font-size: 0.82rem; font-weight: 760; cursor: pointer; }
.refresh-button { min-height: 42px; border: 1px solid rgba(181, 203, 242, 0.24); border-radius: 11px; padding: 0 0.75rem; color: #b9c9e2; background: rgba(126, 158, 220, 0.07); cursor: pointer; }
.refresh-button:disabled { opacity: 0.55; cursor: wait; }
.security-button { min-height: 42px; display: inline-flex; align-items: center; border: 1px solid rgba(181, 203, 242, 0.28); border-radius: 11px; padding: 0 0.8rem; color: #dce9ff; background: rgba(126, 158, 220, 0.1); text-decoration: none; font-size: 0.8rem; }
.message-workspace { min-height: 650px; display: grid; grid-template-columns: minmax(280px, 0.72fr) minmax(0, 1.5fr); gap: 1rem; }
.message-sidebar, .thread-panel { padding: 0; overflow: hidden; }
.box-tabs { display: grid; grid-template-columns: 1fr 1fr; gap: 0.3rem; margin: 1rem; padding: 0.3rem; border-radius: 11px; background: rgba(3, 11, 24, 0.45); }
.box-tabs button { min-height: 39px; border: 0; border-radius: 8px; color: #91a2bd; background: transparent; cursor: pointer; font-size: 0.78rem; }
.box-tabs button.active { color: #eef4ff; background: rgba(137, 168, 228, 0.16); }
.box-tabs span { margin-left: 0.2rem; opacity: 0.7; }
.list-heading { display: flex; justify-content: space-between; align-items: baseline; padding: 1.1rem 1rem 0.8rem; border-bottom: 1px solid rgba(165, 189, 231, 0.14); }
.box-tabs + .list-heading { padding-top: 0.3rem; }
.list-heading h2 { margin: 0; font-size: 1rem; }
.list-heading span { color: #7486a3; font-size: 0.7rem; }
.message-list { max-height: 580px; overflow-y: auto; padding: 0.55rem; }
.message-list-item { width: 100%; display: grid; gap: 0.38rem; position: relative; border: 1px solid transparent; border-radius: 12px; padding: 0.85rem; color: inherit; background: transparent; text-align: left; cursor: pointer; }
.message-list-item + .message-list-item { margin-top: 0.25rem; }
.message-list-item:hover { background: rgba(121, 153, 216, 0.08); }
.message-list-item.active { border-color: rgba(164, 192, 243, 0.26); background: rgba(121, 153, 216, 0.13); }
.message-list-item.unread::before { content: ''; position: absolute; left: 0.35rem; top: 1rem; width: 5px; height: 5px; border-radius: 50%; background: #9fc0ff; box-shadow: 0 0 8px #7ba5f4; }
.list-item-top { display: flex; justify-content: space-between; gap: 0.75rem; color: #dfeaff; font-size: 0.8rem; }
.list-item-top time { color: #7385a2; font-size: 0.66rem; white-space: nowrap; }
.list-subject { color: #bdcce4; font-size: 0.78rem; font-weight: 650; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.list-preview { color: #7f90aa; font-size: 0.72rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.status-pill { padding: 0.28rem 0.5rem; font-size: 0.61rem; }
.status-new { color: #d9e8ff; background: rgba(95, 139, 222, 0.18); }
.status-in_progress { color: #ffe4aa; background: rgba(195, 138, 43, 0.16); }
.status-answered { color: #c9f6db; background: rgba(50, 164, 103, 0.15); }
.status-closed { color: #a9b5c9; background: rgba(124, 137, 159, 0.14); }
.message-list-item .status-pill { margin-top: 0.2rem; }
.empty-list, .empty-thread, .loading-state { min-height: 310px; display: grid; place-content: center; justify-items: center; gap: 0.65rem; text-align: center; color: #8fa0ba; }
.empty-list span, .empty-thread > span { font-size: 1.6rem; color: #9bb9ef; }
.empty-list p, .empty-thread p { margin: 0; max-width: 34ch; line-height: 1.6; }
.empty-list a { color: #bdd2fa; }
.thread-panel { display: flex; flex-direction: column; min-width: 0; }
.thread-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 1.2rem; padding: 1.3rem 1.4rem; border-bottom: 1px solid rgba(165, 189, 231, 0.15); }
.thread-route { margin: 0; display: flex; gap: 0.45rem; color: #94a9ca; font-size: 0.72rem; }
.thread-header h2 { margin: 0.55rem 0 0; font-size: clamp(1.25rem, 2.5vw, 1.75rem); }
.thread-meta { margin: 0.55rem 0 0; color: #71839f; font-size: 0.7rem; }
.thread-status { flex: 0 0 auto; }
.status-control { display: grid; gap: 0.35rem; flex: 0 0 auto; color: #8293ad; font-size: 0.68rem; }
.status-control select { min-height: 36px; border: 1px solid rgba(166, 190, 232, 0.25); border-radius: 9px; padding: 0 0.6rem; color: #e5eeff; background: #101f39; }
.thread-content { flex: 1; display: grid; align-content: start; gap: 0.9rem; padding: 1.3rem 1.4rem; max-height: 480px; overflow-y: auto; }
.message-bubble { width: min(88%, 680px); padding: 1rem; border: 1px solid rgba(162, 187, 231, 0.18); border-radius: 5px 16px 16px 16px; background: rgba(8, 18, 36, 0.5); }
.message-bubble.senate-reply { justify-self: end; border-radius: 16px 5px 16px 16px; border-color: rgba(151, 184, 242, 0.28); background: rgba(72, 108, 177, 0.15); }
.bubble-author { display: flex; align-items: center; gap: 0.65rem; }
.bubble-author > span { width: 32px; height: 32px; display: grid; place-items: center; border-radius: 50%; color: #e7f0ff; background: #294670; font-size: 0.68rem; font-weight: 800; }
.bubble-author div { display: grid; gap: 0.1rem; }
.bubble-author strong { color: #e5edfb; font-size: 0.78rem; }
.bubble-author small { color: #788ba8; font-size: 0.64rem; }
.message-bubble > p { margin: 0.85rem 0 0; color: #c4d1e5; line-height: 1.7; white-space: pre-wrap; overflow-wrap: anywhere; }
.reply-loading { color: #8294af; text-align: center; font-size: 0.78rem; }
.reply-form { display: grid; gap: 0.55rem; padding: 1rem 1.4rem 1.25rem; border-top: 1px solid rgba(165, 189, 231, 0.15); }
.reply-form label { color: #cbd8ec; font-size: 0.76rem; font-weight: 650; }
.reply-form textarea { width: 100%; min-height: 88px; resize: vertical; border: 1px solid rgba(163, 188, 233, 0.24); border-radius: 11px; padding: 0.75rem; color: #eff5ff; background: rgba(4, 13, 28, 0.62); font: inherit; outline: none; }
.reply-form textarea:focus { border-color: rgba(157, 190, 249, 0.65); box-shadow: 0 0 0 3px rgba(105, 151, 235, 0.1); }
.reply-form > div { display: flex; justify-content: flex-end; align-items: center; gap: 1rem; }
.reply-form p { margin: 0 auto 0 0; font-size: 0.72rem; }
.reply-form p.is-success { color: #aeecc7; }
.reply-form p.is-error { color: #ffc4ce; }
.reply-form button, .error-state button { min-height: 40px; border: 0; border-radius: 10px; padding: 0 0.9rem; color: #0a1730; background: linear-gradient(135deg, #e8f0ff, #a6c1f4); font-weight: 750; cursor: pointer; }
.reply-form button:disabled { opacity: 0.55; cursor: wait; }
.closed-notice { margin: 0; padding: 1rem 1.4rem; color: #899ab4; border-top: 1px solid rgba(165, 189, 231, 0.15); font-size: 0.8rem; }
.empty-thread { flex: 1; }
.empty-thread h2 { margin: 0; color: #dbe6f8; }
.error-state { min-height: 240px; display: flex; align-items: center; justify-content: center; gap: 1rem; }
.error-state > span { width: 42px; height: 42px; display: grid; place-items: center; border-radius: 50%; color: #ffd2d9; background: rgba(175, 54, 75, 0.16); }
.error-state h2 { margin: 0; }
.error-state p { color: #a8b7ce; }
.spinner { width: 28px; height: 28px; border: 2px solid rgba(168, 195, 243, 0.22); border-top-color: #bad2ff; border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 900px) {
  .message-workspace { grid-template-columns: 1fr; }
  .message-list { max-height: 340px; }
  .thread-panel { min-height: 560px; }
}

@media (max-width: 600px) {
  .messages-hero { align-items: flex-start; flex-direction: column; }
  .hero-actions { width: 100%; justify-content: space-between; }
  .thread-header { flex-direction: column; }
  .message-bubble { width: 96%; }
  .thread-content, .thread-header, .reply-form { padding-inline: 1rem; }
  .reply-form > div { align-items: stretch; flex-direction: column; }
  .reply-form button { width: 100%; }
}

@media (prefers-reduced-motion: reduce) { .spinner { animation: none; } }
</style>
