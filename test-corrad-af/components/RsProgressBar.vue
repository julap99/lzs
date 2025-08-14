<script setup>
const props = defineProps({
  label: {
    type: String,
    default: "",
  },
  value: {
    type: Number,
    default: 0,
  },
  max: {
    type: Number,
    default: 100,
  },
  variant: {
    type: String,
    default: "primary",
  },
  size: {
    type: String,
    default: "md",
  },
  showValue: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <div class="progress-wrapper">
    <div class="progress-label">{{ label }}</div>
    <div
      class="progress"
      :class="{
        'progress-sm': size === 'sm',
        'progress-md': size === 'md',
        'progress-lg': size === 'lg',
        'progress-primary': variant == 'primary',
        'progress-secondary': variant == 'secondary',
        'progress-success': variant == 'info',
        'progress-info': variant == 'success',
        'progress-warning': variant == 'warning',
        'progress-danger': variant == 'danger',
      }"
    >
      <div
        class="progress-bar"
        :class="{
          primary: variant == 'primary',
          secondary: variant == 'secondary',
          info: variant == 'info',
          success: variant == 'success',
          warning: variant == 'warning',
          danger: variant == 'danger',
        }"
        :style="{ width: (value / max) * 100 + '%' }"
      >
        <span class="text-xs" v-if="showValue">{{ value }}</span>
      </div>
    </div>
  </div>
</template>
