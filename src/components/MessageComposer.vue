<template>
  <Teleport to="body">
    <div v-if="open" class="composer-backdrop" role="presentation" @mousedown.self="close">
      <section
        ref="panelRef"
        class="composer-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="composer-title"
        @keydown.esc="close"
      >
        <header>
          <div>
            <p>Yeni görüşme</p>
            <h2 id="composer-title">Senatoya mesaj gönder</h2>
          </div>
          <button type="button" class="close-button" aria-label="Pencereyi kapat" :disabled="isSubmitting" @click="close">×</button>
        </header>

        <form @submit.prevent="submit">
          <label>
            <span>Alıcı başkanlık</span>
            <select v-model="recipientKey" required autofocus>
              <option v-for="recipient in SENATE_RECIPIENTS" :key="recipient.key" :value="recipient.key">
                {{ recipient.role }} — {{ recipient.name }}
              </option>
            </select>
          </label>

          <label>
            <span>Konu</span>
            <input v-model.trim="subject" type="text" minlength="3" maxlength="120" required placeholder="Konuyu kısa ve anlaşılır yazın" />
            <small>{{ subject.length }} / 120</small>
          </label>

          <label>
            <span>Mesaj</span>
            <textarea v-model.trim="body" rows="7" minlength="10" maxlength="4000" required placeholder="Görüşünüzü veya talebinizi açıklayın…" />
            <small>{{ body.length }} / 4000</small>
          </label>

          <p v-if="errorMessage" class="composer-error" role="alert">{{ errorMessage }}</p>

          <footer>
            <button type="button" class="secondary-button" :disabled="isSubmitting" @click="close">Vazgeç</button>
            <button type="submit" class="primary-button" :disabled="isSubmitting || !isValid">
              {{ isSubmitting ? 'Gönderiliyor…' : 'Mesajı gönder' }}
            </button>
          </footer>
        </form>
      </section>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { SENATE_RECIPIENTS, type SenateRecipientKey } from '@/data/senateRecipients'
import { createMessage, isMessagingSchemaError } from '@/lib/messages'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{
  close: []
  sent: [messageId: string]
}>()

const panelRef = ref<HTMLElement | null>(null)
const recipientKey = ref<SenateRecipientKey>('senato-baskani')
const subject = ref('')
const body = ref('')
const errorMessage = ref('')
const isSubmitting = ref(false)
const isValid = computed(() => subject.value.length >= 3 && body.value.length >= 10)

const reset = () => {
  recipientKey.value = 'senato-baskani'
  subject.value = ''
  body.value = ''
  errorMessage.value = ''
}

const close = () => {
  if (!isSubmitting.value) emit('close')
}

const submit = async () => {
  if (!isValid.value || isSubmitting.value) return
  isSubmitting.value = true
  errorMessage.value = ''
  try {
    const message = await createMessage({
      recipientKey: recipientKey.value,
      subject: subject.value,
      body: body.value,
    })
    emit('sent', message.id)
    reset()
  } catch (error) {
    const candidate = error as { code?: string; message?: string } | null
    errorMessage.value = isMessagingSchemaError(error)
      ? 'Mesaj servisi güncellemesi henüz kurulmamış. Lütfen yöneticiye bildirin.'
      : candidate?.code === '42501' || /jwt|session|oturum/i.test(candidate?.message ?? '')
        ? 'Oturumunuz sona ermiş. Lütfen yeniden giriş yapın.'
        : 'Mesaj gönderilemedi. Bağlantınızı kontrol edip tekrar deneyin.'
  } finally {
    isSubmitting.value = false
  }
}

watch(() => props.open, async (isOpen) => {
  document.body.style.overflow = isOpen ? 'hidden' : ''
  if (isOpen) {
    errorMessage.value = ''
    await nextTick()
    panelRef.value?.querySelector<HTMLElement>('select')?.focus()
  }
})

onBeforeUnmount(() => {
  document.body.style.overflow = ''
})
</script>

<style scoped>
.composer-backdrop { position: fixed; inset: 0; z-index: 200; display: grid; place-items: center; padding: 1rem; background: rgba(2, 7, 17, 0.76); backdrop-filter: blur(10px); }
.composer-panel { width: min(620px, 100%); max-height: calc(100vh - 2rem); overflow-y: auto; border: 1px solid rgba(184, 205, 241, 0.34); border-radius: 22px; color: #eef4ff; background: radial-gradient(circle at 94% 0%, rgba(112, 153, 235, 0.2), transparent 38%), #101e36; box-shadow: 0 34px 90px rgba(0, 5, 15, 0.65); }
header { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; padding: 1.35rem 1.4rem 1rem; border-bottom: 1px solid rgba(169, 192, 232, 0.16); }
header p { margin: 0; color: #9ebaf0; font-size: 0.7rem; font-weight: 750; letter-spacing: 0.13em; text-transform: uppercase; }
header h2 { margin: 0.45rem 0 0; font-size: 1.45rem; }
.close-button { width: 38px; height: 38px; border: 1px solid rgba(176, 198, 237, 0.2); border-radius: 10px; color: #c8d6eb; background: rgba(148, 175, 224, 0.08); cursor: pointer; font-size: 1.4rem; }
form { display: grid; gap: 1rem; padding: 1.3rem 1.4rem 1.4rem; }
label { display: grid; gap: 0.45rem; color: #dce7f8; font-size: 0.82rem; font-weight: 680; }
input, textarea, select { width: 100%; border: 1px solid rgba(164, 188, 232, 0.28); border-radius: 11px; padding: 0.78rem 0.85rem; color: #f1f6ff; background: rgba(4, 12, 26, 0.68); font: inherit; outline: none; }
select { min-height: 48px; }
textarea { min-height: 150px; resize: vertical; }
input:focus, textarea:focus, select:focus { border-color: rgba(157, 190, 249, 0.72); box-shadow: 0 0 0 3px rgba(105, 151, 235, 0.12); }
small { justify-self: end; color: #7789a6; font-weight: 500; }
.composer-error { margin: 0; border: 1px solid rgba(255, 137, 157, 0.22); border-radius: 10px; padding: 0.75rem; color: #ffd4db; background: rgba(173, 48, 70, 0.15); font-size: 0.8rem; }
footer { display: flex; justify-content: flex-end; gap: 0.65rem; padding-top: 0.3rem; }
footer button { min-height: 44px; border-radius: 10px; padding: 0 1rem; font-weight: 740; cursor: pointer; }
.secondary-button { border: 1px solid rgba(177, 199, 238, 0.25); color: #c8d6eb; background: rgba(143, 169, 219, 0.08); }
.primary-button { border: 0; color: #08152b; background: linear-gradient(135deg, #eef4ff, #aac5f7); }
footer button:disabled { opacity: 0.55; cursor: wait; }
@media (max-width: 520px) { .composer-backdrop { align-items: end; padding: 0; } .composer-panel { max-height: 94vh; border-radius: 20px 20px 0 0; } header, form { padding-inline: 1rem; } footer { display: grid; grid-template-columns: 1fr 1fr; } }
</style>
