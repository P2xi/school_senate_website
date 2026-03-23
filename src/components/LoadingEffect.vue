<script setup lang="ts">
import { SCHOOL_LOGO_URL } from '@/lib/brand'
</script>

<template>
  <div class="loading-overlay" role="status" aria-live="polite" aria-label="Yükleniyor">
    <div class="loader-wrap">
      <span class="loader" aria-hidden="true"></span>
      <img class="loader-logo" :src="SCHOOL_LOGO_URL" alt="Eskişehir MBA Senatosu logosu" />
    </div>
  </div>
</template>

<style scoped>
.loading-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: grid;
  place-items: center;
  background:
    radial-gradient(circle at 20% 15%, rgba(102, 141, 239, 0.16), transparent 38%),
    radial-gradient(circle at 82% 10%, rgba(84, 124, 226, 0.12), transparent 34%),
    rgba(6, 12, 27, 0.96);
}

.loader-wrap {
  position: relative;
  width: 6rem;
  height: 6rem;
  display: grid;
  place-items: center;
}

.loader {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 6rem;
}

.loader:before,
.loader:after {
  content: '';
  position: absolute;
  border-radius: 50%;
  animation: pulsOut 1.8s ease-in-out infinite;
  filter: drop-shadow(0 0 1rem rgba(255, 255, 255, 0.75));
}

.loader:before {
  width: 100%;
  padding-bottom: 100%;
  box-shadow: inset 0 0 0 1rem #fff;
  animation-name: pulsIn;
}

.loader:after {
  width: calc(100% - 2rem);
  padding-bottom: calc(100% - 2rem);
  box-shadow: 0 0 0 0 #fff;
}

.loader-logo {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid rgba(255, 255, 255, 0.72);
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.42);
  z-index: 2;
}

@keyframes pulsIn {
  0% {
    box-shadow: inset 0 0 0 1rem #fff;
    opacity: 1;
  }

  50%,
  100% {
    box-shadow: inset 0 0 0 0 #fff;
    opacity: 0;
  }
}

@keyframes pulsOut {
  0%,
  50% {
    box-shadow: 0 0 0 0 #fff;
    opacity: 0;
  }

  100% {
    box-shadow: 0 0 0 1rem #fff;
    opacity: 1;
  }
}
</style>
