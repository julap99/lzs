<script setup>
const props = defineProps({
  variant: {
    type: String,
    default: "primary",
  },
  icon: {
    type: String,
    default: null,
  },
  dismissible: {
    type: Boolean,
    default: false,
  },
  show: {
    type: Boolean,
    default: true,
  },
  autoDismiss: {
    type: Boolean,
    default: false,
  },
  timer: {
    type: Number,
    default: 1000,
  },
});

const showComponent = ref(props.show);

const autoDismiss = () => {
  setTimeout(() => {
    showComponent.value = false;
  }, props.timer);
};

onMounted(() => {
  if (props.autoDismiss) {
    autoDismiss();
  }
});
</script>

<template>
  <Transition name="fade-up">
    <div
      v-if="showComponent"
      class="alert"
      :class="{
        'alert-primary': variant === 'primary',
        'alert-secondary': variant === 'secondary',
        'alert-info': variant === 'info',
        'alert-success': variant === 'success',
        'alert-warning': variant === 'warning',
        'alert-danger': variant === 'danger',
      }"
    >
      <div class="flex items-center gap-2">
        <Icon v-if="icon" :name="icon" />
        <slot />
      </div>
      <button @click="showComponent = false">
        <Icon name="ic:baseline-close" size="14"></Icon>
      </button>
    </div>
  </Transition>
</template>
