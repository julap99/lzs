<script setup>
const emits = defineEmits(["click"]);

const props = defineProps({
  divider: {
    type: Boolean,
    default: false,
  },
});

const clickEvent = () => {
  emits("click");
};
</script>

<template>
  <hr v-if="divider" />
  <div @click="clickEvent" class="dropdown-item">
    <slot></slot>
  </div>
</template>
