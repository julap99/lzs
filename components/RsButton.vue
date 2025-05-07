<script setup>
const props = defineProps({
  type: {
    type: String,
    default: "fill",
  },
  variant: {
    type: String,
    default: "primary",
  },
  size: {
    type: String,
    default: "md",
  },
  btnType: {
    type: String,
    default: "button",
  },
});
</script>

<template>
  <button
    class="button"
    :type="btnType"
    :class="{
      'button-sm': size === 'sm',
      'button-md': size === 'md',
      'button-lg': size === 'lg',

      // Filled Button
      'button-primary': variant === 'primary',
      'button-secondary': variant === 'secondary',
      'button-info': variant === 'info',
      'button-success': variant === 'success',
      'button-warning': variant === 'warning',
      'button-danger': variant === 'danger',

      // Outline Button
      'outline-primary': variant === 'primary-outline',
      'outline-secondary': variant === 'secondary-outline',
      'outline-info': variant === 'info-outline',
      'outline-success': variant === 'success-outline',
      'outline-warning': variant === 'warning-outline',
      'outline-danger': variant === 'danger-outline',

      //Text Button
      'texts-primary': variant === 'primary-text',
      'texts-secondary': variant === 'secondary-text',
      'texts-info': variant === 'info-text',
      'texts-success': variant === 'success-text',
      'texts-warning': variant === 'warning-text',
      'texts-danger': variant === 'danger-text',
    }"
  >
    <slot />
  </button>
</template>
