<template>
  <div v-if="siteKey" class="turnstile-wrap">
    <div ref="containerRef" />
    <p v-if="errorMessage" role="status">{{ errorMessage }}</p>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

type TurnstileApi = {
  render: (container: HTMLElement, options: Record<string, unknown>) => string
  reset: (widgetId: string) => void
  remove: (widgetId: string) => void
}

declare global {
  interface Window { turnstile?: TurnstileApi }
}

const emit = defineEmits<{ verified: [token: string]; expired: []; error: [] }>()
const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY?.trim() ?? ''
const containerRef = ref<HTMLElement | null>(null)
const errorMessage = ref('')
let widgetId: string | null = null

const renderWidget = () => {
  if (!siteKey || !containerRef.value || !window.turnstile || widgetId) return
  widgetId = window.turnstile.render(containerRef.value, {
    sitekey: siteKey,
    theme: 'dark',
    size: 'flexible',
    appearance: 'interaction-only',
    language: 'tr',
    callback: (token: string) => {
      errorMessage.value = ''
      emit('verified', token)
    },
    'expired-callback': () => {
      emit('expired')
    },
    'error-callback': () => {
      errorMessage.value = 'Güvenlik doğrulaması yüklenemedi. Lütfen sayfayı yenileyin.'
      emit('error')
    },
  })
}

const loadScript = () => {
  if (window.turnstile) {
    renderWidget()
    return
  }

  const existingScript = document.querySelector<HTMLScriptElement>('script[data-turnstile-script]')
  if (existingScript) {
    existingScript.addEventListener('load', renderWidget, { once: true })
    return
  }

  const script = document.createElement('script')
  script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
  script.async = true
  script.defer = true
  script.dataset.turnstileScript = 'true'
  script.addEventListener('load', renderWidget, { once: true })
  document.head.appendChild(script)
}

const reset = () => {
  if (widgetId && window.turnstile) window.turnstile.reset(widgetId)
}

defineExpose({ reset })

onMounted(loadScript)
onBeforeUnmount(() => {
  if (widgetId && window.turnstile) window.turnstile.remove(widgetId)
  widgetId = null
})
</script>

<style scoped>
.turnstile-wrap { display: grid; gap: 0.4rem; overflow: hidden; }
.turnstile-wrap p { margin: 0; color: #ffc7d0; font-size: 0.75rem; line-height: 1.45; }
</style>

