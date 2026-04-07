<template>
  <article class="timeline-step" :class="{ reverse }">
    <div class="copy-wrap">
      <p class="step-badge">{{ step }}</p>
      <div class="copy-main">
        <h3>{{ title }}</h3>
        <p class="text">{{ text }}</p>
      </div>
      <span v-if="detail" class="detail">{{ detail }}</span>
    </div>

    <figure class="media-wrap">
      <img :src="image" :alt="alt" :style="{ objectPosition: imagePosition }" loading="lazy" decoding="async" />
      <span class="media-glow" aria-hidden="true" />
    </figure>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  step: string
  title: string
  text: string
  detail?: string
  image: string
  alt: string
  imagePosition?: string
  reverse?: boolean
}>()
</script>

<style scoped>
.timeline-step {
  --step-card-min: clamp(270px, 30vw, 338px);
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: clamp(1.6rem, 2.4vw, 2.1rem);
  align-items: start;
  position: relative;
  min-height: var(--step-card-min);
}

.timeline-step > * {
  min-width: 0;
}

.timeline-step.reverse .copy-wrap {
  order: 2;
}

.timeline-step.reverse .media-wrap {
  order: 1;
}

.copy-wrap {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.82rem;
  min-height: var(--step-card-min);
  height: 100%;
  border-radius: 20px;
  border: 1px solid rgba(179, 204, 248, 0.24);
  background:
    radial-gradient(circle at 10% 10%, rgba(126, 162, 240, 0.16), rgba(126, 162, 240, 0) 44%),
    linear-gradient(166deg, rgba(18, 33, 59, 0.9), rgba(12, 23, 44, 0.92));
  backdrop-filter: blur(10px);
  padding: clamp(1.2rem, 2.3vw, 1.6rem);
  box-shadow:
    0 18px 34px rgba(4, 10, 22, 0.3),
    inset 0 1px 0 rgba(212, 226, 254, 0.06);
  transition:
    border-color 320ms cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 320ms cubic-bezier(0.22, 1, 0.36, 1);
}

.copy-main {
  display: grid;
  gap: 0.66rem;
}

.step-badge {
  width: fit-content;
  margin: 0;
  min-height: 28px;
  border-radius: 999px;
  padding: 0 0.78rem;
  display: inline-flex;
  align-items: center;
  border: 1px solid rgba(181, 207, 249, 0.34);
  background: rgba(145, 172, 220, 0.14);
  font-size: 0.7rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(186, 210, 250, 0.92);
  font-weight: 670;
}

h3 {
  margin: 0;
  color: #f4f8ff;
  line-height: 1.12;
  font-size: clamp(1.34rem, 2vw, 1.88rem);
  letter-spacing: -0.01em;
  max-width: 20ch;
}

.text {
  margin: 0;
  color: rgba(202, 217, 242, 0.94);
  line-height: 1.7;
  font-size: 0.94rem;
  max-width: 54ch;
}

.detail {
  width: fit-content;
  display: inline-flex;
  align-items: center;
  min-height: 30px;
  border-radius: 999px;
  padding: 0 0.8rem;
  border: 1px solid rgba(179, 204, 249, 0.34);
  background: rgba(143, 168, 217, 0.14);
  color: #dce9ff;
  font-size: 0.74rem;
  letter-spacing: 0.01em;
}

.media-wrap {
  margin: 0;
  position: relative;
  min-height: var(--step-card-min);
  height: 100%;
  border-radius: 20px;
  overflow: hidden;
  aspect-ratio: 4 / 3;
  border: 1px solid rgba(179, 204, 248, 0.24);
  box-shadow:
    0 20px 36px rgba(4, 10, 22, 0.32),
    0 0 0 rgba(85, 125, 218, 0);
  transition:
    transform 320ms cubic-bezier(0.22, 1, 0.36, 1),
    border-color 320ms cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 320ms cubic-bezier(0.22, 1, 0.36, 1);
}

.media-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
  transition: transform 360ms cubic-bezier(0.22, 1, 0.36, 1);
}

.media-glow {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(7, 14, 28, 0.08), rgba(7, 14, 28, 0.44)),
    radial-gradient(circle at 80% 16%, rgba(202, 224, 255, 0.16), rgba(202, 224, 255, 0));
  pointer-events: none;
}

.timeline-step:hover .media-wrap {
  transform: translateY(-3px);
  border-color: rgba(204, 223, 255, 0.56);
  box-shadow:
    0 24px 44px rgba(4, 10, 22, 0.4),
    0 0 22px rgba(89, 128, 220, 0.24);
}

.timeline-step:hover .media-wrap img {
  transform: scale(1.04);
}

.timeline-step:hover .copy-wrap {
  border-color: rgba(195, 217, 255, 0.38);
  box-shadow:
    0 20px 36px rgba(4, 10, 22, 0.34),
    0 0 18px rgba(82, 123, 216, 0.16);
}

@media (max-width: 980px) {
  .timeline-step,
  .timeline-step.reverse {
    grid-template-columns: 1fr;
    gap: 0.9rem;
  }

  .timeline-step.reverse .copy-wrap,
  .timeline-step.reverse .media-wrap {
    order: initial;
  }
}
</style>
