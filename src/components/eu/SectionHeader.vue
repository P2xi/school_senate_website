<template>
  <header class="section-header" :class="{ centered }">
    <p v-if="kicker" class="kicker">{{ kicker }}</p>
    <h2 class="title">{{ title }}</h2>
    <p v-if="intro" class="intro">{{ intro }}</p>
  </header>
</template>

<script setup lang="ts">
defineProps<{
  kicker?: string
  title: string
  intro?: string
  centered?: boolean
}>()
</script>

<style scoped>
.section-header {
  display: grid;
  gap: 0.65rem;
  max-width: 760px;
}

.section-header.centered {
  margin-inline: auto;
  text-align: center;
}

.kicker {
  margin: 0;
  font-size: 0.74rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(176, 199, 241, 0.84);
  font-weight: 650;
}

.title {
  margin: 0;
  font-size: clamp(1.5rem, 2.8vw, 2.3rem);
  line-height: 1.08;
  color: #f4f8ff;
  letter-spacing: -0.01em;
}

.intro {
  margin: 0;
  max-width: 66ch;
  color: rgba(205, 219, 242, 0.86);
  line-height: 1.64;
  font-size: 0.96rem;
}

.section-header.centered .intro {
  margin-inline: auto;
}
</style>
