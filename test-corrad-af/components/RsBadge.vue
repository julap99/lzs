<script setup>
const props = defineProps({
  variant: {
    type: String,
    default: "primary",
  },
  icon: {
    type: String,
    default: "",
  },
  iconSize: {
    type: String,
    default: "18",
  },
});
</script>

<template>
  <div
    class="badge"
    :class="{
      'badge-primary': variant === 'primary',
      'badge-secondary': variant === 'secondary',
      'badge-info': variant === 'info',
      'badge-success': variant === 'success',
      'badge-warning': variant === 'warning',
      'badge-danger': variant === 'danger',
      'badge-disabled': variant === 'disabled',
    }"
  >
    <Icon v-if="icon" :name="icon" :size="iconSize"></Icon>
    <slot />
  </div>
</template>
