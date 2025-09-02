<script setup>
const props = defineProps({
  accordion: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: "default",
  },
});
</script>

<template>
  <div
    class="accordion"
    :class="{
      'accordion-border': type === 'border',
    }"
    v-uid
  >
    <slot />
  </div>
</template>
