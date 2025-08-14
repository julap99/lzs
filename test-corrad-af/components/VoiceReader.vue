<template>
  <div class="voice-reader">
    <rs-button
      @click="toggleReading"
      :variant="isReading ? 'danger' : 'primary'"
      class="p-2 rounded-full"
    >
      <Icon
        :name="isReading ? 'ph:ear' : 'ph:ear-slash'"
        :class="['text-2xl', { 'animate-pulse text-white': isReading }]"
      />
    </rs-button>
    <span ref="announceElement" class="sr-only" aria-live="polite"></span>
  </div>
</template>

<script setup>
import { useVoiceReader } from "~/composables/useVoiceReader";

const { isReading, toggleReading, announceElement } = useVoiceReader();
</script>

<style scoped>
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
</style>
